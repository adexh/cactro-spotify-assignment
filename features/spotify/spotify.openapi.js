
/** @typedef {import('types/OpenApi.class').OpenApiPaths} OpenApiPaths */
/** @typedef {import('types/OpenApi.class').OpenApiComponents} OpenApiComponents */

class SpotifyOpenAPI {
  /** @type {OpenApiPaths} */paths;
  /** @type {OpenApiComponents} */components;
  /** @type {string[]} */tags;
  /** @type {Array} */servers;
  /** @type {Array} */security;

  constructor() {
    this.#initOpenAPISpec();
  }

  #initOpenAPISpec() {
    // Server configuration
    this.servers = [
      {
        url: 'http://localhost:8080/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://your-domain.com/api/v1',
        description: 'Production server'
      }
    ];

    // Global security configuration
    this.security = [
      {
        sessionAuth: []
      }
    ];

    this.paths = {
      // Authentication routes
      '/auth/login': {
        get: {
          summary: 'Initiate Spotify OAuth login',
          operationId: 'spotifyAuth',
          tags: ['Authentication'],
          responses: {
            '302': {
              description: 'Redirect to Spotify authorization page'
            }
          }
        }
      },
      '/auth/login/callback': {
        get: {
          summary: 'Spotify OAuth callback',
          operationId: 'spotifyCallbackAuth',
          tags: ['Authentication'],
          parameters: [
            {
              name: 'code',
              in: 'query',
              required: false,
              description: 'Authorization code from Spotify',
              schema: { type: 'string' }
            },
            {
              name: 'error',
              in: 'query',
              required: false,
              description: 'Error from Spotify OAuth',
              schema: { type: 'string' }
            }
          ],
          responses: {
            '302': {
              description: 'Redirect to success or failure page'
            }
          }
        }
      },
      '/auth/success': {
        get: {
          summary: 'Login success endpoint',
          operationId: 'loginSuccess',
          tags: ['Authentication'],
          responses: {
            '200': {
              description: 'Successful authentication',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          displayName: { type: 'string' },
                          email: { type: 'string' },
                          accessToken: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Authentication failed',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/auth/failure': {
        get: {
          summary: 'Login failure endpoint',
          operationId: 'loginFailure',
          tags: ['Authentication'],
          responses: {
            '401': {
              description: 'Login failed'
            }
          }
        }
      },
      '/auth/logout': {
        get: {
          summary: 'Logout user',
          operationId: 'logout',
          tags: ['Authentication'],
          responses: {
            '200': {
              description: 'Successfully logged out'
            }
          }
        }
      },
      // Spotify API routes
      '/spotify/artists-followed': {
        get: {
          summary: 'Get followed artists',
          operationId: 'getArtistsFollowed',
          tags: ['Spotify'],
          security: [
            {
              sessionAuth: []
            }
          ],
          responses: {
            '200': {
              description: 'List of followed artists',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      artists: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            type: { type: 'string' },
                            uri: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Not authenticated with Spotify',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/spotify/play': {
        get: {
          summary: 'Play a song',
          operationId: 'playSong',
          tags: ['Spotify'],
          security: [
            {
              sessionAuth: []
            }
          ],
          parameters: [
            {
              name: 'trackUri',
              in: 'query',
              required: true,
              description: 'Spotify track URI',
              schema: { type: 'string' }
            },
            {
              name: 'deviceId',
              in: 'query',
              required: false,
              description: 'Optional device ID',
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Song started playing',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Bad request - Track URI required',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Not authenticated with Spotify',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/spotify/top-tracks': {
        get: {
          summary: 'Get user\'s top tracks',
          operationId: 'getTopTracks',
          tags: ['Spotify'],
          security: [
            {
              sessionAuth: []
            }
          ],
          parameters: [
            {
              name: 'limit',
              in: 'query',
              required: false,
              description: 'Number of tracks to return (default: 10)',
              schema: { type: 'integer', default: 10, minimum: 1, maximum: 50 }
            },
            {
              name: 'timeRange',
              in: 'query',
              required: false,
              description: 'Time range for top tracks',
              schema: {
                type: 'string',
                enum: ['short_term', 'medium_term', 'long_term'],
                default: 'medium_term'
              }
            }
          ],
          responses: {
            '200': {
              description: 'User\'s top tracks',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      tracks: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            artists: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string' },
                                  name: { type: 'string' }
                                }
                              }
                            },
                            uri: { type: 'string' }
                          }
                        }
                      },
                      total: { type: 'integer' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Not authenticated with Spotify',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/spotify/play-top': {
        get: {
          summary: 'Play a top song by index',
          operationId: 'playTopSong',
          tags: ['Spotify'],
          security: [
            {
              sessionAuth: []
            }
          ],
          parameters: [
            {
              name: 'songIndex',
              in: 'query',
              required: true,
              description: 'Index of song to play (1-10)',
              schema: { type: 'integer', minimum: 1, maximum: 10 }
            },
            {
              name: 'deviceId',
              in: 'query',
              required: false,
              description: 'Optional device ID',
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Top song started playing',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Bad request - Song index required',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Not authenticated with Spotify',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/spotify/pause': {
        get: {
          summary: 'Pause playback',
          operationId: 'pausePlayback',
          tags: ['Spotify'],
          security: [
            {
              sessionAuth: []
            }
          ],
          parameters: [
            {
              name: 'deviceId',
              in: 'query',
              required: false,
              description: 'Optional device ID',
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Playback paused',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Not authenticated with Spotify',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/spotify/current-playback': {
        get: {
          summary: 'Get current playback information',
          operationId: 'getCurrentPlayback',
          tags: ['Spotify'],
          security: [
            {
              sessionAuth: []
            }
          ],
          responses: {
            '200': {
              description: 'Current playback information',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      device: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          type: { type: 'string' },
                          volume_percent: { type: 'integer' }
                        }
                      },
                      is_playing: { type: 'boolean' },
                      item: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          artists: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                              }
                            }
                          }
                        }
                      },
                      progress_ms: { type: 'integer' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Not authenticated with Spotify',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/spotify/currently-playing': {
        get: {
          summary: 'Get currently playing track',
          operationId: 'getCurrentlyPlaying',
          tags: ['Spotify'],
          security: [
            {
              sessionAuth: []
            }
          ],
          responses: {
            '200': {
              description: 'Currently playing track information',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      item: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          artists: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                              }
                            }
                          },
                          uri: { type: 'string' }
                        }
                      },
                      is_playing: { type: 'boolean' },
                      progress_ms: { type: 'integer' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Not authenticated with Spotify',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/spotify/devices': {
        get: {
          summary: 'Get available Spotify devices',
          operationId: 'getAvailableDevices',
          tags: ['Spotify'],
          security: [
            {
              sessionAuth: []
            }
          ],
          responses: {
            '200': {
              description: 'List of available Spotify devices',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      devices: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', description: 'Device ID' },
                            name: { type: 'string', description: 'Device name' },
                            type: { type: 'string', description: 'Device type (Computer, Smartphone, etc.)' },
                            is_active: { type: 'boolean', description: 'Whether the device is currently active' },
                            is_private_session: { type: 'boolean', description: 'Whether the device is in a private session' },
                            is_restricted: { type: 'boolean', description: 'Whether the device is restricted' },
                            volume_percent: { type: 'integer', description: 'Volume level (0-100)', minimum: 0, maximum: 100 }
                          }
                        }
                      },
                      total: { type: 'integer', description: 'Total number of devices' },
                      active_device: {
                        type: 'object',
                        nullable: true,
                        description: 'Currently active device, if any',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          type: { type: 'string' },
                          is_active: { type: 'boolean' },
                          is_private_session: { type: 'boolean' },
                          is_restricted: { type: 'boolean' },
                          volume_percent: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Not authenticated with Spotify',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/spotify/openapi.json': {
        get: {
          summary: 'Get OpenAPI specification',
          operationId: 'getOpenApiSpec',
          tags: ['Documentation'],
          responses: {
            '200': {
              description: 'OpenAPI 3.0 specification',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'Complete OpenAPI 3.0 specification document'
                  }
                }
              }
            },
            '404': {
              description: 'OpenAPI specification file not found',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Failed to load OpenAPI specification',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    this.tags = ['Authentication', 'Spotify', 'Documentation'];

    this.components = {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          },
          required: ['error']
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            displayName: { type: 'string' },
            email: { type: 'string' },
            accessToken: { type: 'string' }
          }
        },
        Artist: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string' },
            uri: { type: 'string' }
          }
        },
        Track: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            artists: {
              type: 'array',
              items: { $ref: '#/components/schemas/Artist' }
            },
            uri: { type: 'string' }
          }
        },
        Device: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Device ID' },
            name: { type: 'string', description: 'Device name' },
            type: { type: 'string', description: 'Device type (Computer, Smartphone, etc.)' },
            is_active: { type: 'boolean', description: 'Whether the device is currently active' },
            is_private_session: { type: 'boolean', description: 'Whether the device is in a private session' },
            is_restricted: { type: 'boolean', description: 'Whether the device is restricted' },
            volume_percent: { type: 'integer', description: 'Volume level (0-100)', minimum: 0, maximum: 100 }
          }
        }
      },
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Session-based authentication using cookies'
        },
        spotifyOAuth: {
          type: 'oauth2',
          description: 'Spotify OAuth 2.0',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://accounts.spotify.com/authorize',
              tokenUrl: 'https://accounts.spotify.com/api/token',
              scopes: {
                'user-read-private': 'Read access to user profile',
                'user-read-email': 'Read access to user email',
                'user-follow-read': 'Read access to followed artists',
                'user-top-read': 'Read access to top tracks and artists',
                'user-modify-playback-state': 'Control playback',
                'user-read-playback-state': 'Read current playback state',
                'user-read-currently-playing': 'Read currently playing track'
              }
            }
          }
        }
      }
    };
  }
}

export default SpotifyOpenAPI;
