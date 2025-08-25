import { getDatabase, runQuery, getQuery, allQuery } from './database.js';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email list operations
export const addToEmailList = async (emailData) => {
  const db = getDatabase();
  
  try {
    // Check if email already exists
    const existing = await findEmailInList(emailData.email);
    if (existing) {
      // Update existing entry
      const sql = `
        UPDATE email_list 
        SET name = ?, source = ?, subscribed = 1, subscribed_at = ?, updated_at = ?, tags = ?, notes = ?
        WHERE email = ?
      `;
      
      const now = new Date().toISOString();
      await runQuery(db, sql, [
        emailData.name || existing.name,
        emailData.source || existing.source,
        now,
        now,
        emailData.tags || existing.tags,
        emailData.notes || existing.notes,
        emailData.email
      ]);
      
      return await findEmailInList(emailData.email);
    }
    
    // Insert new entry
    const sql = `
      INSERT INTO email_list (email, name, source, subscribed, subscribed_at, created_at, updated_at, tags, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const now = new Date().toISOString();
    await runQuery(db, sql, [
      emailData.email,
      emailData.name || null,
      emailData.source || 'manual',
      1,
      now,
      now,
      now,
      emailData.tags || null,
      emailData.notes || null
    ]);
    
    return await findEmailInList(emailData.email);
  } catch (error) {
    console.error('Error adding to email list:', error);
    throw error;
  }
};

export const removeFromEmailList = async (email) => {
  const db = getDatabase();
  const sql = `
    UPDATE email_list 
    SET subscribed = 0, unsubscribed_at = ?, updated_at = ? 
    WHERE email = ?
  `;
  
  const result = await runQuery(db, sql, [new Date().toISOString(), new Date().toISOString(), email]);
  return result.changes > 0;
};

export const findEmailInList = async (email) => {
  const db = getDatabase();
  const sql = 'SELECT * FROM email_list WHERE email = ?';
  return await getQuery(db, sql, [email]);
};

export const getEmailList = async (filters = {}) => {
  const db = getDatabase();
  
  let sql = 'SELECT * FROM email_list WHERE 1=1';
  const params = [];
  
  if (filters.subscribed !== undefined) {
    sql += ' AND subscribed = ?';
    params.push(filters.subscribed ? 1 : 0);
  }
  
  if (filters.source) {
    sql += ' AND source = ?';
    params.push(filters.source);
  }
  
  if (filters.tags) {
    sql += ' AND tags LIKE ?';
    params.push(`%${filters.tags}%`);
  }
  
  sql += ' ORDER BY created_at DESC';
  
  return await allQuery(db, sql, params);
};

export const getEmailListStats = async () => {
  const db = getDatabase();
  
  const stats = {};
  
  try {
    // Total subscribers
    const totalResult = await getQuery(db, 'SELECT COUNT(*) as count FROM email_list WHERE subscribed = 1');
    stats.totalSubscribed = totalResult.count;
    
    // Total unsubscribed
    const unsubResult = await getQuery(db, 'SELECT COUNT(*) as count FROM email_list WHERE subscribed = 0');
    stats.totalUnsubscribed = unsubResult.count;
    
    // Total emails
    const allResult = await getQuery(db, 'SELECT COUNT(*) as count FROM email_list');
    stats.totalEmails = allResult.count;
    
    // By source
    const sourceResult = await allQuery(db, 'SELECT source, COUNT(*) as count FROM email_list WHERE subscribed = 1 GROUP BY source');
    stats.bySource = sourceResult;
    
    // Recent additions (last 30 days)
    const recentResult = await getQuery(db, `
      SELECT COUNT(*) as count 
      FROM email_list 
      WHERE subscribed = 1 AND created_at >= datetime('now', '-30 days')
    `);
    stats.recentAdditions = recentResult.count;
    
    return stats;
  } catch (error) {
    console.error('Error getting email list stats:', error);
    throw error;
  }
};

export const exportEmailList = async (format = 'csv', filters = {}) => {
  const emails = await getEmailList(filters);
  
  if (format === 'csv') {
    return exportToCSV(emails);
  } else if (format === 'json') {
    return exportToJSON(emails);
  } else if (format === 'txt') {
    return exportToTXT(emails);
  }
  
  throw new Error(`Unsupported export format: ${format}`);
};

const exportToCSV = (emails) => {
  const csvWriter = createObjectCsvWriter({
    path: path.join(__dirname, '../../data/email-list-export.csv'),
    header: [
      { id: 'email', title: 'Email' },
      { id: 'name', title: 'Name' },
      { id: 'source', title: 'Source' },
      { id: 'subscribed', title: 'Subscribed' },
      { id: 'subscribed_at', title: 'Subscribed Date' },
      { id: 'created_at', title: 'Created Date' },
      { id: 'tags', title: 'Tags' },
      { id: 'notes', title: 'Notes' }
    ]
  });
  
  const records = emails.map(email => ({
    ...email,
    subscribed: email.subscribed ? 'Yes' : 'No'
  }));
  
  csvWriter.writeRecords(records);
  
  return {
    filename: 'email-list-export.csv',
    path: path.join(__dirname, '../../data/email-list-export.csv'),
    count: emails.length
  };
};

const exportToJSON = (emails) => {
  const filePath = path.join(__dirname, '../../data/email-list-export.json');
  fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
  
  return {
    filename: 'email-list-export.json',
    path: filePath,
    count: emails.length
  };
};

const exportToTXT = (emails) => {
  const filePath = path.join(__dirname, '../../data/email-list-export.txt');
  const content = emails.map(email => `${email.email}\t${email.name || ''}\t${email.source || ''}`).join('\n');
  fs.writeFileSync(filePath, content);
  
  return {
    filename: 'email-list-export.txt',
    path: filePath,
    count: emails.length
  };
};

export const bulkAddToEmailList = async (emailList) => {
  const results = [];
  
  for (const emailData of emailList) {
    try {
      const result = await addToEmailList(emailData);
      results.push({ success: true, email: emailData.email, result });
    } catch (error) {
      results.push({ success: false, email: emailData.email, error: error.message });
    }
  }
  
  return results;
};

export const updateEmailListEntry = async (email, updates) => {
  const db = getDatabase();
  
  try {
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (key !== 'email' && key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (fields.length === 0) return null;
    
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(email);
    
    const sql = `UPDATE email_list SET ${fields.join(', ')} WHERE email = ?`;
    const result = await runQuery(db, sql, values);
    
    if (result.changes > 0) {
      return await findEmailInList(email);
    }
    return null;
  } catch (error) {
    console.error('Error updating email list entry:', error);
    throw error;
  }
};
