# MyWatchlist

A personal movie and TV show watchlist application. Track what you want to watch and get personalized recommendations based on your list.

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Search**: Find movies and TV shows using the TMDB API.
- **Watchlist**: Add and remove items from your personal list.
- **Recommendations**: Get suggestions based on your watchlist content.
- **Responsive Design**: Works on desktop and mobile.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [NPM](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/cue77/mywatchlist.git
    cd mywatchlist
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your TMDB API key:
    ```env
    TMDB_KEY=your_tmdb_api_key_here
    PORT=3000
    JWT_SECRET=your_super_secret_jwt_key
    ```
    > **Note:** You can get a free API key from [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api).

## Usage

1.  **Start the server:**
    ```bash
    npm start
    ```

2.  **Open the application:**
    Visit `http://localhost:3000` in your browser.

3.  **Register/Login:**
    Create a new account to start building your watchlist.

## Testing

Run the automated tests with:
```bash
npm test
```

## Technologies

- **Backend**: Node.js, Express, SQLite (better-sqlite3)
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **API**: The Movie Database (TMDB)
