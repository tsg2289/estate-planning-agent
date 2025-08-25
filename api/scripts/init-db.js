import { getDatabase, closeDatabase, allQuery, getQuery, waitForInitialization } from '../lib/database.js';

console.log('🚀 Initializing database...');

try {
  const db = getDatabase();
  
  // Wait for database initialization to complete
  await waitForInitialization();
  
  console.log('✅ Database initialized successfully');
  console.log('📊 Database file location:', db.filename);
  
  // Test the database by running a simple query
  const result = await allQuery(db, "SELECT name FROM sqlite_master WHERE type='table'");
  console.log('📋 Tables found:', result.map(r => r.name));
  
  // Show some stats
  const userCount = await getQuery(db, 'SELECT COUNT(*) as count FROM users');
  const emailCount = await getQuery(db, 'SELECT COUNT(*) as count FROM email_list');
  
  console.log('👥 Users in database:', userCount.count);
  console.log('📧 Emails in list:', emailCount.count);
  
  closeDatabase();
  console.log('✅ Database initialization completed successfully');
  
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}
