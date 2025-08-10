# Utils Directory

This directory contains utility classes for API communications.

## Files

### `api-client.js`
Base HTTP client class that provides:
- Centralized configuration (timeout, retries, logging)
- Request/response interceptors
- Automatic retry logic with exponential backoff
- Consistent error handling and formatting
- Header sanitization for security

### `spotify-api-client.js`
Specialized Spotify API client that extends the base `ApiClient`:
- Pre-configured for Spotify Web API
- Built-in authentication token management
- Spotify-specific error handling
- Pre-built methods for common Spotify operations

## Usage

```javascript
import SpotifyApiClient from 'utils/spotify-api-client.js';

// Create and configure client
const spotifyClient = new SpotifyApiClient();
spotifyClient.setAccessToken(accessToken);

// Use the client
const topTracks = await spotifyClient.getTopTracks(10);
```

## Design Principles

- **Simple**: Direct instantiation without complex factory patterns
- **Focused**: Designed specifically for Spotify API needs
- **Extensible**: Easy to add new API clients by extending the base class
- **Maintainable**: Clear separation of concerns and consistent patterns
