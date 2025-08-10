import ApiClient from 'utils/api-client.js';

/**
 * Specialized API client for Spotify Web API
 */
class SpotifyApiClient extends ApiClient {
  constructor(config = {}) {
    super({
      baseURL: 'https://api.spotify.com/v1',
      timeout: 15000,
      retries: 2,
      ...config
    });

    this.client.defaults.baseURL = 'https://api.spotify.com/v1';
  }

  /**
   * Set the authorization token for requests
   */
  setAccessToken(accessToken) {
    if (!accessToken) {
      throw new Error('Access token is required');
    }
    this.client.defaults.headers.Authorization = `Bearer ${accessToken}`;
  }

  /**
   * Clear the authorization token
   */
  clearAccessToken() {
    delete this.client.defaults.headers.Authorization;
  }

  /**
   * Get user's followed artists
   */
  async getFollowedArtists(limit = 20, after = null) {
    const params = new URLSearchParams({ type: 'artist', limit: limit.toString() });
    if (after) params.append('after', after);

    return this.get(`/me/following?${params}`);
  }

  /**
   * Get user's top tracks
   */
  async getTopTracks(limit = 10, timeRange = 'medium_term') {
    const params = new URLSearchParams({
      limit: limit.toString(),
      time_range: timeRange
    });

    const response = await this.get(`/me/top/tracks?${params}`);

    // Transform the response to include only necessary data
    return response.items.map((track, index) => ({
      index: index + 1,
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      uri: track.uri,
      preview_url: track.preview_url,
      external_urls: track.external_urls
    }));
  }

  /**
   * Start/resume playback
   */
  async startPlayback(trackUris = [], deviceId = null) {
    const url = deviceId ? `/me/player/play?device_id=${deviceId}` : '/me/player/play';
    const data = trackUris.length > 0 ? { uris: trackUris } : {};

    await this.put(url, data);
    return { success: true, message: 'Playback started' };
  }

  /**
   * Play a specific track
   */
  async playTrack(trackUri, deviceId = null) {
    if (!trackUri) {
      throw new Error('Track URI is required');
    }

    return this.startPlayback([trackUri], deviceId);
  }

  /**
   * Pause playback
   */
  async pausePlayback(deviceId = null) {
    const url = deviceId ? `/me/player/pause?device_id=${deviceId}` : '/me/player/pause';

    await this.put(url);
    return { success: true, message: 'Playback paused' };
  }

  /**
   * Get current playback state
   */
  async getCurrentPlayback() {
    return this.get('/me/player');
  }

  /**
   * Get currently playing track
   */
  async getCurrentlyPlaying() {
    return this.get('/me/player/currently-playing');
  }

  /**
   * Get user's available devices
   */
  async getAvailableDevices() {
    return this.get('/me/player/devices');
  }

  /**
   * Get user profile
   */
  async getUserProfile() {
    return this.get('/me');
  }

  /**
   * Override the formatError method to handle Spotify-specific errors
   */
  formatError(error) {
    const formattedError = super.formatError(error);

    if (error.response?.status === 401) {
      formattedError.message = 'Spotify authentication expired. Please re-authenticate.';
    } else if (error.response?.status === 403) {
      if (error.response.data?.error?.reason === 'PREMIUM_REQUIRED') {
        formattedError.message = 'Spotify Premium subscription required for this action.';
      } else {
        formattedError.message = 'Access forbidden. Check your Spotify permissions.';
      }
    } else if (error.response?.status === 404) {
      formattedError.message = 'Spotify resource not found. The requested item may not exist.';
    } else if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      formattedError.message = `Rate limit exceeded. Retry after ${retryAfter || 'a few'} seconds.`;
    }

    return formattedError;
  }
}

export default SpotifyApiClient;
