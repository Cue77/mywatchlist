const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const watchlistRoutes = require('./routes/watchlist');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'register.html')));
app.get('/watchlist', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'watchlist.html')));

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Open your browser and go to: http://localhost:${PORT}`);
});