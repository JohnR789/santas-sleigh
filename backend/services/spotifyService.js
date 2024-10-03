const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// Initialize the Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Function to handle getting access tokens from the authorization code
const getAccessToken = async (code) => {
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    // Set the access and refresh tokens in spotifyApi
    spotifyApi.setAccessToken(access_token);

    if (refresh_token) {
      spotifyApi.setRefreshToken(refresh_token);
      console.log('Refresh token set successfully:', refresh_token);
    } else {
      console.error('No refresh token received from Spotify.');
    }

    return { access_token, refresh_token };
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Error getting access token');
  }
};


// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = spotifyApi.getRefreshToken();
    if (!refreshToken) {
      console.error('Refresh token missing. Unable to refresh access token.');
      throw new Error('Refresh token missing');
    }

    const data = await spotifyApi.refreshAccessToken();
    const { access_token } = data.body;
    spotifyApi.setAccessToken(access_token);

    console.log('Access token refreshed successfully:', access_token);
    return access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Error refreshing access token');
  }
};



// Function to play a playlist on Spotify
const playPlaylist = async (playlistId) => {
  try {
    if (!spotifyApi.getAccessToken()) {
      await refreshAccessToken();
    }

    // Log available devices
    const devicesData = await spotifyApi.getMyDevices();
    const devices = devicesData.body.devices;
    console.log('Available devices:', devices);

    if (devices.length === 0) {
      throw new Error('No active Spotify devices found. Please open Spotify on one of your devices.');
    }

    const deviceId = devices[0].id;

    // Play the playlist and log the response
    const response = await spotifyApi.play({
      device_id: deviceId,
      context_uri: `spotify:playlist:${playlistId}`,
    });

    console.log(`Now playing playlist with ID: ${playlistId} on device: ${deviceId}`);
    console.log('Playback started successfully:', response);
  } catch (error) {
    console.error('Error playing playlist:', error);
    throw new Error('Error playing playlist: ' + error.message);
  }
};



module.exports = {
  spotifyApi,
  getAccessToken,
  refreshAccessToken,  // Export refreshAccessToken
  playPlaylist,
};


