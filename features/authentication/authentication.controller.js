
import service from 'features/authentication/authentication.service.js';

const controller = {
  spotifyAuth: service.spotifyAuth,
  spotifyCallbackAuth: service.spotifyCallbackAuth,
  loginSuccess: (req, res) => {
    if (req.user) {
      res.json({
        success: true,
        message: 'Authentication successful',
        user: {
          id: req.user.id,
          displayName: req.user.displayName,
          email: req.user.emails?.[0]?.value,
          accessToken: req.user.accessToken
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Authentication failed' });
    }
  },
  loginFailure: (req, res) => {
    res.status(401).send('Login failed');
  },
  logoutController: (req, res) => {
    if (typeof req.logout === 'function') {
      req.logout(() => res.send('Logged out'));
    } else if (req.session) {
      req.session.destroy(() => res.send('Logged out'));
    } else {
      res.send('Logged out');
    }
  }
};

export default controller;
