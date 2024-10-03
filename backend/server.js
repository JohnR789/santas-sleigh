const express = require('express');
const dotenv = require('dotenv');
const spotifyRoutes = require('./routes/spotifyRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app = express();

// Use Spotify API routes
app.use('/api/spotify', spotifyRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to Spotify Integration');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
