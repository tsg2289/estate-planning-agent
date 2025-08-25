import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_PATH = path.join(__dirname, '../../data/users.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database instance
let db = null;
let isInitialized = false;
let initPromise = null;

export const getDatabase = () => {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        isInitialized = false;
      } else {
        console.log('Connected to SQLite database');
        // Create tables if they don't exist
        initPromise = initializeTables(db);
      }
    });
  }
  return db;
};

const initializeTables = (db) => {
  return new Promise((resolve) => {
    let tablesCreated = 0;
    const totalTables = 2;
    
    const checkCompletion = () => {
      tablesCreated++;
      if (tablesCreated >= totalTables) {
        isInitialized = true;
        console.log('Database initialization completed');
        resolve();
      }
    };

    // Users table for authentication
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        email_verified INTEGER DEFAULT 0,
        last_login DATETIME,
        assessment_answers TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table ready');
      }
      checkCompletion();
    });

    // Email list table for marketing/communications
    db.run(`
      CREATE TABLE IF NOT EXISTS email_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        source TEXT DEFAULT 'registration',
        subscribed INTEGER DEFAULT 1,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        tags TEXT,
        notes TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating email_list table:', err);
      } else {
        console.log('Email list table ready');
      }
      checkCompletion();
    });
  });
};

export const closeDatabase = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
    db = null;
    isInitialized = false;
    initPromise = null;
  }
};

// Helper function to run queries with promises
export const runQuery = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!isInitialized) {
      reject(new Error('Database not yet initialized'));
      return;
    }
    
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

export const getQuery = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!isInitialized) {
      reject(new Error('Database not yet initialized'));
      return;
    }
    
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

export const allQuery = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!isInitialized) {
      reject(new Error('Database not yet initialized'));
      return;
    }
    
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const waitForInitialization = () => {
  return new Promise((resolve) => {
    if (isInitialized) {
      resolve();
      return;
    }
    
    if (initPromise) {
      initPromise.then(resolve);
      return;
    }
    
    const checkInit = () => {
      if (isInitialized) {
        resolve();
      } else {
        setTimeout(checkInit, 100);
      }
    };
    checkInit();
  });
};
