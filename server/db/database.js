const Database = require('better-sqlite3');
const path = require('path');

// Create DB
const db = new Database(path.join(__dirname, '..', 'watchlist.db'), { verbose: console.log });

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    tmdb_id INTEGER,
    media_type TEXT,
    title TEXT,
    poster_path TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create demo user
const bcrypt = require('bcrypt');
const demo = db.prepare('SELECT * FROM users WHERE username = ?').get('demo');
if (!demo) {
  const hash = bcrypt.hashSync('demo123', 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('demo', hash);
  console.log("Demo user created: demo / demo123");
}

module.exports = db;  // ← This is the key!