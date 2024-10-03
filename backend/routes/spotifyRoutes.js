const express = require('express');
const router = express.Router();
const { spotifyApi, getAccessToken, playPlaylist } = require('../services/spotifyService');  // Import spotifyApi

// Login route to initiate Spotify login and redirect to Spotify's login page
router.get('/login', (req, res) => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-modify-playback-state',  // Control playback
    'user-read-playback-state',    // Read playback state
    'user-read-currently-playing', // Read currently playing track
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private'
  ];
  const authUrl = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authUrl);
});



// Callback route after Spotify redirects with the authorization code
router.get('/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send('Authorization code missing.');

    const { access_token, refresh_token } = await getAccessToken(code);

    // Log granted scopes
    const grantedScopes = spotifyApi.getCredentials().scope;
    console.log('Granted scopes:', grantedScopes);

    res.send('Login successful. You can now play music.');
  } catch (error) {
    console.error('Error handling callback:', error);
    res.status(500).send('Error during authentication.');
  }
});




// Route to play a playlist (requires a valid access token)
router.get('/play', async (req, res) => {
  try {
    const playlistId = req.query.playlistId;
    if (!playlistId) return res.status(400).send('Playlist ID is required.');

    await playPlaylist(playlistId);
    res.send(`Now playing playlist with ID: ${playlistId}`);
  } catch (error) {
    console.error('Error playing playlist:', error);
    res.status(500).send('Error playing playlist');
  }
});

module.exports = router;




