const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const TMDB_KEY = process.env.TMDB_KEY;

if (!TMDB_KEY || TMDB_KEY === 'your-tmdb-key') {
  console.error('TMDB_KEY missing! Add it to .env');
}

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  if (!TMDB_KEY) {
    return res.status(500).json({ error: 'TMDB API key not configured' });
  }

  try {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    const data = await response.json();
    res.json(data.results || []);
  } catch (err) {
    console.error('TMDB fetch error:', err.message);
    res.status(500).json({ error: 'Failed to search TMDB' });
  }
});

module.exports = router;