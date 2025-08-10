
import service from 'features/spotify/spotify.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      const { trackUri, deviceId } = req.query;
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
      const { songIndex = 1, deviceId = null } = req.query;

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
      const { deviceId } = req.query;
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
  },

  getAvailableDevices: async (req, res) => {
    try {
      const accessToken = req.user?.accessToken;
      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated with Spotify' });
      }

      const result = await service.getAvailableDevices(accessToken);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getOpenApiSpec: async (req, res) => {
    try {
      const projectRoot = path.resolve(__dirname, '../../');
      const openApiFilePath = path.join(projectRoot, 'assets', 'openapi.json');

      const openApiContent = fs.readFileSync(openApiFilePath, 'utf8');
      const openApiSpec = JSON.parse(openApiContent);

      // Set appropriate headers
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.json(openApiSpec);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.status(404).json({ error: 'OpenAPI specification file not found' });
      } else {
        res.status(500).json({ error: 'Failed to load OpenAPI specification' });
      }
    }
  }
};

export default controller;

