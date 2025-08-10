# API Client Management System

This project implements a centralized API client management system for handling external API communications with Spotify.

## Architecture

### 1. Base API Client (`utils/api-client.js`)
A generic HTTP client that provides:
- **Centralized configuration** (timeout, retries, base headers)
- **Request/Response logging** with sanitized headers
- **Automatic retry logic** with exponential backoff
- **Consistent error handling** and formatting
- **Request/Response interceptors** for monitoring

### 2. Spotify API Client (`utils/spotify-api-client.js`)
A specialized client that extends the base client:
- Extends the base API client with Spotify-specific functionality
- Built-in authentication token management
- Spotify-specific error handling (Premium required, rate limits, etc.)
- Pre-configured endpoints for common operations

## Usage Examples

### Basic Spotify API Usage
```javascript
import SpotifyApiClient from 'utils/spotify-api-client.js';

// Create and configure Spotify client
const spotifyClient = new SpotifyApiClient();
spotifyClient.setAccessToken(accessToken);

// Fetch user's top tracks
const topTracks = await spotifyClient.getTopTracks(10, 'short_term');

// Play a track
await spotifyClient.playTrack('spotify:track:4iV5W9uYEdYUVa79Axb7Rh');
```

### Adding Additional API Services (If Needed)

If you need to add other API services in the future, you can create additional specialized clients:

1. **Create a new specialized client** (e.g., `utils/youtube-api-client.js`):
```javascript
import ApiClient from 'utils/api-client.js';

class YouTubeApiClient extends ApiClient {
  constructor(config = {}) {
    super({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      ...config
    });
  }

  setApiKey(apiKey) {
    this.client.defaults.params = { key: apiKey };
  }

  async searchVideos(query, maxResults = 10) {
    return this.get('/search', {
      params: { q: query, maxResults, part: 'snippet', type: 'video' }
    });
  }
}

export default YouTubeApiClient;
```

2. **Use it directly in your service**:
```javascript
import YouTubeApiClient from 'utils/youtube-api-client.js';

const youtubeClient = new YouTubeApiClient();
youtubeClient.setApiKey(apiKey);
const videos = await youtubeClient.searchVideos('search term');
```

## Features

### Error Handling
- **Consistent error format** across all API clients
- **Service-specific error handling** (e.g., Spotify Premium requirements)
- **Automatic retry** for transient failures
- **Detailed logging** for debugging

### Performance
- **Simple instantiation** with direct client creation
- **Connection pooling** through axios defaults
- **Request timeout** configuration
- **Retry with backoff** for failed requests

### Security
- **Automatic header sanitization** in logs
- **Token management** without exposure in logs
- **Configurable request/response interceptors**

### Monitoring
- **Request/response logging** with pino integration
- **Error tracking** with detailed context
- **Performance metrics** (response times, retry counts)

## Configuration

### Base Configuration
```javascript
const apiClient = new ApiClient({
  timeout: 10000,        // Request timeout in ms
  retries: 3,           // Number of retry attempts
  retryDelay: 1000,     // Base delay between retries in ms
  baseURL: 'https://api.example.com'
});
```

### Spotify-Specific Configuration
```javascript
const spotifyClient = new SpotifyApiClient({
  timeout: 15000,       // Longer timeout for Spotify
  retries: 2,          // Conservative retry count
});
```

## Available Endpoints

### Spotify API
- `getFollowedArtists(limit, after)` - Get user's followed artists
- `getTopTracks(limit, timeRange)` - Get user's top tracks
- `playTrack(trackUri, deviceId)` - Play a specific track
- `pausePlayback(deviceId)` - Pause current playback
- `getCurrentPlayback()` - Get current playback state
- `getCurrentlyPlaying()` - Get currently playing track
- `getAvailableDevices()` - Get user's available devices
- `getUserProfile()` - Get user profile information

## Migration Guide

The migration from direct axios usage to the API client system provides:

1. **Better error handling** - Consistent error formats and retry logic
2. **Improved logging** - Centralized request/response logging
3. **Enhanced maintainability** - Centralized API logic
4. **Better testing** - Mockable client classes
5. **Performance improvements** - Connection pooling and proper configuration

### Before (Direct Axios)
```javascript
const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### After (API Client)
```javascript
const client = new SpotifyApiClient();
client.setAccessToken(token);
const tracks = await client.getTopTracks();
```

## Testing

The API client system is designed to be easily testable:

```javascript
// Mock the SpotifyApiClient for tests
jest.mock('utils/spotify-api-client.js', () => {
  return jest.fn().mockImplementation(() => ({
    setAccessToken: jest.fn(),
    getTopTracks: jest.fn().mockResolvedValue(mockTracks)
  }));
});
```
