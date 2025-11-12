// Global
let token = localStorage.getItem('token');

// === LOGIN ===
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        window.location.href = '/watchlist';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Network error');
    }
  });
}

// === REGISTER ===
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        alert('Registered! Please login.');
        window.location.href = '/login';
      } else {
        alert(data.error || 'Register failed');
      }
    } catch (err) {
      alert('Network error');
    }
  });
}

// === WATCHLIST PAGE ===
if (window.location.pathname === '/watchlist') {
  // Load watchlist on start
  loadWatchlist();

  // Search
  document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) searchMedia(query);
  });

  // Allow Enter key
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('searchBtn').click();
  });
}

// Search TMDB
async function searchMedia(query) {
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const results = await res.json();
    displayResults(results);
  } catch (err) {
    alert('Search failed');
  }
}

function displayResults(results) {
  const container = document.getElementById('searchResults');
  container.innerHTML = '';
  if (!results || results.length === 0) {
    container.innerHTML = '<p>No results found.</p>';
    return;
  }

  results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${item.poster_path || ''}" onerror="this.style.display='none'">
      <h3>${item.title || item.name}</h3>
      <p>${item.media_type} • ${item.release_date || item.first_air_date || 'N/A'}</p>
      <button onclick="addToWatchlist(${item.id}, '${item.media_type}', '${(item.title || item.name).replace(/'/g, "\\'")}', '${item.poster_path || ''}')">
        Add to Watchlist
      </button>
    `;
    container.appendChild(card);
  });
}

// Add to Watchlist
async function addToWatchlist(tmdb_id, media_type, title, poster_path) {
  if (!token) {
    alert('Please login first!');
    return;
  }

  try {
    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ tmdb_id, media_type, title, poster_path })
    });

    if (res.ok) {
      alert('Added!');
      loadWatchlist();
    } else {
      alert('Failed to add');
    }
  } catch (err) {
    alert('Network error');
  }
}

// Load Watchlist
async function loadWatchlist() {
  if (!token) return;

  try {
    const res = await fetch('/api/watchlist', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const items = await res.json();
    const list = document.getElementById('watchlist');
    list.innerHTML = '';

    if (items.length === 0) {
      list.innerHTML = '<li style="text-align:center; color:#aaa;">Your watchlist is empty.</li>';
      return;
    }

    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${item.title}</strong> (${item.media_type})</span>
        <button onclick="deleteItem(${item.id})" style="background: #e74c3c;">Delete</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

// Delete Item
async function deleteItem(id) {
  if (!token) return;

  try {
    await fetch(`/api/watchlist/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadWatchlist();
  } catch (err) {
    alert('Delete failed');
  }
}