import { getDatabase, runQuery, getQuery, allQuery } from './database.js';

export const getUsers = async () => {
  const db = getDatabase();
  const sql = 'SELECT id, email, name, created_at, is_active, email_verified, last_login FROM users WHERE is_active = 1';
  return await allQuery(db, sql);
};

export const addUser = async (user) => {
  const db = getDatabase();
  
  try {
    // Note: User existence check is already done in the registration endpoint
    // to avoid race conditions, we'll proceed with insertion
    
    // Insert into users table
    const insertUserSql = `
      INSERT INTO users (id, email, name, password, assessment_answers, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const assessmentAnswers = user.assessmentAnswers ? JSON.stringify(user.assessmentAnswers) : null;
    const now = new Date().toISOString();
    
    await runQuery(db, insertUserSql, [
      user.id,
      user.email,
      user.name,
      user.password,
      assessmentAnswers,
      now,
      now
    ]);
    
    // Also add to email list for marketing purposes
    const insertEmailListSql = `
      INSERT INTO email_list (email, name, source, subscribed, subscribed_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await runQuery(db, insertEmailListSql, [
      user.email,
      user.name,
      'registration',
      1,
      now,
      now,
      now
    ]);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: now
    };
  } catch (error) {
    console.error('Error adding user:', error);
    // Check if it's a unique constraint violation
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return null; // User already exists
    }
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  const db = getDatabase();
  const sql = 'SELECT * FROM users WHERE email = ? AND is_active = 1';
  return await getQuery(db, sql, [email]);
};

export const findUserById = async (id) => {
  const db = getDatabase();
  const sql = 'SELECT * FROM users WHERE id = ? AND is_active = 1';
  return await getQuery(db, sql, [id]);
};

export const updateUser = async (id, updates) => {
  const db = getDatabase();
  
  try {
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (fields.length === 0) return null;
    
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const result = await runQuery(db, sql, values);
    
    if (result.changes > 0) {
      return await findUserById(id);
    }
    return null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  const db = getDatabase();
  
  try {
    // Soft delete - mark as inactive
    const sql = 'UPDATE users SET is_active = 0, updated_at = ? WHERE id = ?';
    const result = await runQuery(db, sql, [new Date().toISOString(), id]);
    
    if (result.changes > 0) {
      // Also unsubscribe from email list
      const user = await findUserById(id);
      if (user) {
        const emailSql = 'UPDATE email_list SET subscribed = 0, unsubscribed_at = ?, updated_at = ? WHERE email = ?';
        await runQuery(db, emailSql, [new Date().toISOString(), new Date().toISOString(), user.email]);
      }
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateLastLogin = async (id) => {
  const db = getDatabase();
  const sql = 'UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?';
  await runQuery(db, sql, [new Date().toISOString(), new Date().toISOString(), id]);
};

export const verifyEmail = async (id) => {
  const db = getDatabase();
  const sql = 'UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?';
  const result = await runQuery(db, sql, [new Date().toISOString(), id]);
  return result.changes > 0;
};
