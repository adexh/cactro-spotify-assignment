# Spotify API Assignment

## Requirements
Create an endpoint on top of Spotify API to show your top 10 tracks as well as show the now playing song. Add it to your portfolio website at a new route /spotify.

Show a list of the artists you follow.
Provide an option to stop the currently playing song.
Provide an option to start playing any of the top 10 songs.
You can just return a JSON that can be pretty-printed in the browser. UI is NOT needed.
Deploy the API in your portfolio website itself. Do NOT show the demo on localhost.

## Available APIs

### Base URL
- **Development**: `http://localhost:8080/api/v1`
- **Production**: `https://your-domain.com/api/v1`

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

#### `PUT /spotify/play`
Play a specific song
- **Authentication**: Required
- **Body**:
```json
{
  "trackUri": "spotify:track:...",
  "deviceId": "optional_device_id"
}
```
- **Response**: Confirmation of playback start

#### `PUT /spotify/play-top`
Play a song from your top tracks by index
- **Authentication**: Required
- **Body**:
```json
{
  "songIndex": 1,
  "deviceId": "optional_device_id"
}
```
- **Response**: Confirmation of playback start

#### `PUT /spotify/pause`
Pause current playback
- **Authentication**: Required
- **Body** (optional):
```json
{
  "deviceId": "optional_device_id"
}
```
- **Response**: Confirmation of playback pause

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
- **401 Unauthorized**: Not authenticated with Spotify
- **400 Bad Request**: Invalid request parameters
- **500 Internal Server Error**: Server error