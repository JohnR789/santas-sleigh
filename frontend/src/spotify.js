import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export const getSpotifyToken = () => {
  // Logic to get the Spotify token using OAuth
};

export const playMusic = (playlistId) => {
  spotifyApi.setAccessToken(getSpotifyToken());
  spotifyApi.play({ context_uri: `spotify:playlist:${playlistId}` });
};
