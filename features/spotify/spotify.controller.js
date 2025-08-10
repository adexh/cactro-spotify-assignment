
import service from 'features/spotify/spotify.service.js';

const controller = {
  getArtistsFollowed: async (req, res) => {
    try {
      const accessToken = req.user?.accessToken;
      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated with Spotify' });
      }
      const data = await service.getArtistsFollowed(accessToken);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  playSong: async (req, res) => {
    try {
      const accessToken = req.user?.accessToken;
      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated with Spotify' });
      }

      const { trackUri, deviceId } = req.body;
      if (!trackUri) {
        return res.status(400).json({ error: 'Track URI is required' });
      }

      const result = await service.playSong(accessToken, trackUri, deviceId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getTopTracks: async (req, res) => {
    try {
      const accessToken = req.user?.accessToken;
      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated with Spotify' });
      }

      const { limit = 10, timeRange = 'medium_term' } = req.query;
      const tracks = await service.getTopTracks(accessToken, parseInt(limit), timeRange);
      res.json({ tracks, total: tracks.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  playTopSong: async (req, res) => {
    try {
      const accessToken = req.user?.accessToken;
      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated with Spotify' });
      }

      const { songIndex, deviceId } = req.body;
      if (!songIndex) {
        return res.status(400).json({ error: 'Song index is required (1-10)' });
      }

      const result = await service.playTopSong(accessToken, parseInt(songIndex), deviceId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  pausePlayback: async (req, res) => {
    try {
      const accessToken = req.user?.accessToken;
      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated with Spotify' });
      }

      const { deviceId } = req.body;
      const result = await service.pausePlayback(accessToken, deviceId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCurrentPlayback: async (req, res) => {
    try {
      const accessToken = req.user?.accessToken;
      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated with Spotify' });
      }

      const result = await service.getCurrentPlayback(accessToken);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCurrentlyPlaying: async (req, res) => {
    try {
      const accessToken = req.user?.accessToken;
      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated with Spotify' });
      }

      const result = await service.getCurrentlyPlaying(accessToken);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default controller;

