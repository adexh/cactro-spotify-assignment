# Spotify API Assignment

## Overview
This is a Spotify Web API integration that provides endpoints for music control and user data retrieval. The API allows users to authenticate with Spotify, view their top tracks, control playback, and manage their music experience.

## Quick Start

1. **Authentication**: Start by visiting `/api/v1/auth/login` to authenticate with Spotify
2. **Get Top Tracks**: Use `/api/v1/spotify/top-tracks` to see your most played songs
3. **Control Playback**: Use the play, pause, and resume endpoints to control your music
4. **View API Documentation**: Access `/api/v1/spotify/openapi.json` for the complete API specification

## Requirements
Create an endpoint on top of Spotify API to show your top 10 tracks as well as show the now playing song. Add it to your portfolio website at a new route /spotify.

Show a list of the artists you follow.
Provide an option to stop the currently playing song.
Provide an option to start playing any of the top 10 songs.
You can just return a JSON that can be pretty-printed in the browser. UI is NOT needed.
Deploy the API in your portfolio website itself. Do NOT show the demo on localhost.

## Features

✅ **Spotify OAuth Authentication** - Secure login with Spotify accounts  
✅ **Top Tracks Retrieval** - Get user's most played songs with customizable time ranges  
✅ **Followed Artists** - View list of artists the user follows  
✅ **Playback Control** - Play, pause, and resume music on any connected device  
✅ **Device Management** - List and control playback on different Spotify devices  
✅ **Currently Playing** - Real-time information about what's playing  
✅ **OpenAPI Documentation** - Complete API specification for easy integration  

## Technology Stack

- **Backend**: Node.js with Express.js
- **Authentication**: Passport.js with Spotify OAuth 2.0
- **API Client**: Custom Spotify Web API client with retry logic
- **Documentation**: OpenAPI 3.0 specification
- **Session Management**: Express sessions with cookies

## Available APIs

### Base URL
- **Development**: `http://localhost:8080/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Example Usage
Here are some example API calls:

```bash
# Get top tracks
GET /api/v1/spotify/top-tracks?limit=10&timeRange=medium_term

# Play a specific song
GET /api/v1/spotify/play?trackUri=spotify:track:4iV5W9uYEdYUVa79Axb7Rh&deviceId=abc123

# Play the 3rd song from your top tracks
GET /api/v1/spotify/play-top?songIndex=3&deviceId=abc123

# Pause current playback
GET /api/v1/spotify/pause?deviceId=abc123

# Resume current playback
GET /api/v1/spotify/resume?deviceId=abc123

# Get currently playing track
GET /api/v1/spotify/currently-playing

# Get available devices
GET /api/v1/spotify/devices

# Get OpenAPI specification
GET /api/v1/openapi.json
```

### Authentication Endpoints

#### `GET /auth/login`
Initiate Spotify OAuth login process
- **Response**: Redirects to Spotify authorization page

#### `GET /auth/login/callback`
Spotify OAuth callback endpoint
- **Parameters**:
  - `code` (query, optional): Authorization code from Spotify
  - `error` (query, optional): Error from Spotify OAuth
- **Response**: Redirects to success or failure page

#### `GET /auth/success`
Login success endpoint
- **Response**: JSON with user information and access token
```json
{
  "success": true,
  "message": "Authentication successful",
  "user": {
    "id": "string",
    "displayName": "string",
    "email": "string",
    "accessToken": "string"
  }
}
```

#### `GET /auth/failure`
Login failure endpoint
- **Response**: 401 - Login failed

#### `GET /auth/logout`
Logout user
- **Response**: 200 - Successfully logged out

### Spotify API Endpoints
*All Spotify endpoints require authentication*

#### `GET /spotify/artists-followed`
Get list of artists you follow
- **Authentication**: Required
- **Response**: List of followed artists
```json
{
  "artists": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "uri": "string"
    }
  ]
}
```

#### `GET /spotify/top-tracks`
Get your top tracks
- **Authentication**: Required
- **Parameters**:
  - `limit` (query, optional): Number of tracks to return (1-50, default: 10)
  - `timeRange` (query, optional): Time range (`short_term`, `medium_term`, `long_term`, default: `medium_term`)
- **Response**: Your top tracks
```json
{
  "tracks": [
    {
      "id": "string",
      "name": "string",
      "artists": [
        {
          "id": "string",
          "name": "string"
        }
      ],
      "uri": "string"
    }
  ],
  "total": 10
}
```

#### `GET /spotify/play`
Play a specific song
- **Authentication**: Required
- **Parameters**:
  - `trackUri` (query, required): Spotify track URI
  - `deviceId` (query, optional): Optional device ID
- **Response**: Confirmation of playback start
```json
{
  "success": true,
  "message": "Playback started"
}
```

#### `GET /spotify/play-top`
Play a song from your top tracks by index
- **Authentication**: Required
- **Parameters**:
  - `songIndex` (query, required): Index of song to play (1-10)
  - `deviceId` (query, optional): Optional device ID
- **Response**: Confirmation of playback start
```json
{
  "success": true,
  "message": "Now playing: [Song Name] by [Artist]",
  "track": {
    "index": 1,
    "id": "string",
    "name": "string",
    "artist": "string",
    "uri": "string"
  }
}
```

#### `GET /spotify/pause`
Pause current playback
- **Authentication**: Required
- **Parameters**:
  - `deviceId` (query, optional): Optional device ID
- **Response**: Confirmation of playback pause
```json
{
  "success": true,
  "message": "Playback paused"
}
```

#### `GET /spotify/resume`
Resume current playback
- **Authentication**: Required
- **Parameters**:
  - `deviceId` (query, optional): Device ID to resume playback on
- **Response**: Confirmation of playback resume
```json
{
  "success": true,
  "message": "Playback started"
}
```

#### `GET /spotify/current-playback`
Get current playback information
- **Authentication**: Required
- **Response**: Current playback state including device, track, and progress

#### `GET /spotify/currently-playing`
Get currently playing track
- **Authentication**: Required
- **Response**: Currently playing track information
```json
{
  "item": {
    "id": "string",
    "name": "string",
    "artists": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "uri": "string"
  },
  "is_playing": true,
  "progress_ms": 45000
}
```

#### `GET /spotify/devices`
Get available Spotify devices
- **Authentication**: Required
- **Response**: List of available devices with IDs
```json
{
  "devices": [
    {
      "id": "device_id_123",
      "name": "My iPhone",
      "type": "Smartphone",
      "is_active": true,
      "is_private_session": false,
      "is_restricted": false,
      "volume_percent": 80
    }
  ],
  "total": 1,
  "active_device": {
    "id": "device_id_123",
    "name": "My iPhone",
    "type": "Smartphone",
    "is_active": true,
    "is_private_session": false,
    "is_restricted": false,
    "volume_percent": 80
  }
}
```

### Documentation Endpoints

#### `GET /openapi.json`
Get the complete OpenAPI 3.0 specification
- **Authentication**: Not required
- **Response**: Complete OpenAPI specification document
- **Use case**: For API documentation tools, client generation, or API exploration

## Authentication
This API uses session-based authentication with Spotify OAuth 2.0. Users must authenticate through the Spotify login flow before accessing protected endpoints.

### Required Spotify Scopes
- `user-read-private`: Read access to user profile
- `user-read-email`: Read access to user email  
- `user-follow-read`: Read access to followed artists
- `user-top-read`: Read access to top tracks and artists
- `user-modify-playback-state`: Control playback
- `user-read-playback-state`: Read current playback state
- `user-read-currently-playing`: Read currently playing track

## Error Responses
All endpoints may return the following error responses:

### Common Error Codes
- **400 Bad Request**: Missing required parameters or invalid input
  ```json
  { "error": "Track URI is required" }
  ```
- **401 Unauthorized**: Not authenticated with Spotify or session expired
  ```json
  { "error": "Not authenticated with Spotify" }
  ```
- **404 Not Found**: Resource not found (e.g., OpenAPI file missing)
  ```json
  { "error": "OpenAPI specification file not found" }
  ```
- **500 Internal Server Error**: Server error or Spotify API issues
  ```json
  { "error": "Failed to fetch top tracks" }
  ```

### Spotify-Specific Errors
- **403 Premium Required**: Some playback features require Spotify Premium
- **429 Rate Limited**: Too many requests, retry after specified time
- **Device Not Found**: Specified device ID is not available

## Deployment

### Environment Variables
Make sure to set these environment variables:
```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-domain.com/api/v1/auth/login/callback
SESSION_SECRET=your_session_secret
```

### Production Checklist
- [ ] Update server URLs in OpenAPI specification
- [ ] Configure HTTPS for production
- [ ] Set secure session cookies
- [ ] Configure CORS for your domain
- [ ] Set up proper logging and monitoring

## API Documentation
Access the complete OpenAPI specification at `/api/v1/spotify/openapi.json` or use tools like Swagger UI for interactive documentation.