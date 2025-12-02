const express = require('express');
const fetch = require('node-fetch');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const TMDB_KEY = process.env.TMDB_KEY;

router.get('/', authMiddleware, async (req, res) => {
  if (!TMDB_KEY) {
    return res.status(500).json({ error: 'TMDB API key not configured' });
  }

  try {
    // 1. Get user's watchlist
    const watchlist = db.prepare('SELECT tmdb_id, media_type FROM watchlist WHERE user_id = ?').all(req.user.id);

    let url;
    if (watchlist.length > 0) {
      // 2. Pick random item
      const randomItem = watchlist[Math.floor(Math.random() * watchlist.length)];
      const type = randomItem.media_type === 'movie' ? 'movie' : 'tv';
      url = `https://api.themoviedb.org/3/${type}/${randomItem.tmdb_id}/recommendations?api_key=${TMDB_KEY}&language=en-US&page=1`;
    } else {
      // 3. Fallback to trending
      url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    const data = await response.json();
    
    // Return top 10
    res.json(data.results.slice(0, 10));

  } catch (err) {
    console.error('Recommendations error:', err.message);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;
