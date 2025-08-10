import ApiClient from '../../../utils/api-client.js';
import SpotifyApiClient from '../../../utils/spotify-api-client.js';

describe('API Client System', () => {
  describe('ApiClient', () => {
    it('should create an instance with default configuration', () => {
      const client = new ApiClient();

      expect(client).toBeInstanceOf(ApiClient);
      expect(client.config.timeout).toBe(10000);
      expect(client.config.retries).toBe(3);
      expect(client.config.retryDelay).toBe(1000);
    });

    it('should accept custom configuration', () => {
      const customConfig = {
        timeout: 5000,
        retries: 2,
        retryDelay: 500
      };

      const client = new ApiClient(customConfig);

      expect(client.config.timeout).toBe(5000);
      expect(client.config.retries).toBe(2);
      expect(client.config.retryDelay).toBe(500);
    });

    it('should sanitize authorization headers', () => {
      const client = new ApiClient();
      const headers = {
        'Authorization': 'Bearer secret-token-123',
        'Content-Type': 'application/json'
      };

      const sanitized = client.sanitizeHeaders(headers);

      expect(sanitized.Authorization).toBe('Bearer [REDACTED]');
      expect(sanitized['Content-Type']).toBe('application/json');
    });
  });

  describe('SpotifyApiClient', () => {
    it('should extend ApiClient with Spotify-specific config', () => {
      const client = new SpotifyApiClient();

      expect(client).toBeInstanceOf(ApiClient);
      expect(client.client.defaults.baseURL).toBe('https://api.spotify.com/v1');
      expect(client.config.timeout).toBe(15000);
    });

    it('should set and clear access tokens', () => {
      const client = new SpotifyApiClient();
      const token = 'test-access-token';

      client.setAccessToken(token);
      expect(client.client.defaults.headers.Authorization).toBe(`Bearer ${token}`);

      client.clearAccessToken();
      expect(client.client.defaults.headers.Authorization).toBeUndefined();
    });

    it('should throw error when setting empty access token', () => {
      const client = new SpotifyApiClient();

      expect(() => client.setAccessToken('')).toThrow('Access token is required');
      expect(() => client.setAccessToken(null)).toThrow('Access token is required');
    });
  });
});