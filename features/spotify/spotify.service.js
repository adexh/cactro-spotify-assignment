// services/spotify.service.js
import SpotifyApiClient from 'utils/spotify-api-client.js';

const service = {
  getArtistsFollowed: async (accessToken, limit = 20, after = null) => {
    try {
      const spotifyClient = new SpotifyApiClient();
      spotifyClient.setAccessToken(accessToken);
      return await spotifyClient.getFollowedArtists(limit, after);
    } catch (err) {
      throw new Error(
        err.message || 'Failed to fetch followed artists'
      );
    }
  },

  playSong: async (accessToken, trackUri, deviceId = null) => {
    try {
      const spotifyClient = new SpotifyApiClient();
      spotifyClient.setAccessToken(accessToken);
      return await spotifyClient.playTrack(trackUri, deviceId);
    } catch (err) {
      throw new Error(
        err.message || 'Failed to play song'
      );
    }
  },

  getTopTracks: async (accessToken, limit = 10, timeRange = 'medium_term') => {
    try {
      const spotifyClient = new SpotifyApiClient();
      spotifyClient.setAccessToken(accessToken);
      return await spotifyClient.getTopTracks(limit, timeRange);
    } catch (err) {
      throw new Error(
        err.message || 'Failed to fetch top tracks'
      );
    }
  },

  playTopSong: async (accessToken, songIndex, deviceId = null) => {
    try {
      if (songIndex < 1 || songIndex > 10) {
        throw new Error('Song index must be between 1 and 10');
      }

      const spotifyClient = new SpotifyApiClient();
      spotifyClient.setAccessToken(accessToken);

      // Get the top tracks first
      const topTracks = await spotifyClient.getTopTracks(10);

      if (songIndex > topTracks.length) {
        throw new Error(`Only ${topTracks.length} tracks available`);
      }

      const selectedTrack = topTracks[songIndex - 1];

      // Play the selected track
      await spotifyClient.playTrack(selectedTrack.uri, deviceId);

      return {
        success: true,
        message: `Now playing: ${selectedTrack.name} by ${selectedTrack.artist}`,
        track: selectedTrack
      };
    } catch (err) {
      throw new Error(
        err.message || 'Failed to play top song'
      );
    }
  },

  pausePlayback: async (accessToken, deviceId = null) => {
    try {
      const spotifyClient = new SpotifyApiClient();
      spotifyClient.setAccessToken(accessToken);
      return await spotifyClient.pausePlayback(deviceId);
    } catch (err) {
      throw new Error(
        err.message || 'Failed to pause playback'
      );
    }
  },

  getCurrentPlayback: async (accessToken) => {
    try {
      const spotifyClient = new SpotifyApiClient();
      spotifyClient.setAccessToken(accessToken);
      return await spotifyClient.getCurrentPlayback();
    } catch (err) {
      throw new Error(
        err.message || 'Failed to get current playback'
      );
    }
  },

  getCurrentlyPlaying: async (accessToken) => {
    try {
      const spotifyClient = new SpotifyApiClient();
      spotifyClient.setAccessToken(accessToken);
      return await spotifyClient.getCurrentlyPlaying();
    } catch (err) {
      throw new Error(
        err.message || 'Failed to get currently playing track'
      );
    }
  },

  getAvailableDevices: async (accessToken) => {
    try {
      const spotifyClient = new SpotifyApiClient();
      spotifyClient.setAccessToken(accessToken);
      const devicesResponse = await spotifyClient.getAvailableDevices();

      // Transform the response to include only essential device information
      const devices = devicesResponse.devices.map(device => ({
        id: device.id,
        name: device.name,
        type: device.type,
        is_active: device.is_active,
        is_private_session: device.is_private_session,
        is_restricted: device.is_restricted,
        volume_percent: device.volume_percent
      }));

      return {
        devices,
        total: devices.length,
        active_device: devices.find(device => device.is_active) || null
      };
    } catch (err) {
      throw new Error(
        err.message || 'Failed to get available devices'
      );
    }
  }
}

export default service;
