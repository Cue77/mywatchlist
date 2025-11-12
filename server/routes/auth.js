const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/database');
const { signToken } = require('../utils/jwt');
const router = express.Router();

// Register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  const hash = bcrypt.hashSync(password, 10);
  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hash);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Username taken' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ id: user.id, username: user.username });
  res.json({ token, username: user.username });
});

module.exports = router;  // ← THIS IS REQUIRED