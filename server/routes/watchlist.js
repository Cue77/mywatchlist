const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get watchlist
router.get('/', authMiddleware, (req, res) => {
  const items = db.prepare('SELECT * FROM watchlist WHERE user_id = ?').all(req.user.id);
  res.json(items);
});

// Add item
router.post('/', authMiddleware, (req, res) => {
  const { tmdb_id, media_type, title, poster_path } = req.body;
  try {
    db.prepare(`
      INSERT INTO watchlist (user_id, tmdb_id, media_type, title, poster_path)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.user.id, tmdb_id, media_type, title, poster_path);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Delete
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM watchlist WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

module.exports = router;  // ← REQUIRED