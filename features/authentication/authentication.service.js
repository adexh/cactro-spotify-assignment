import passport from "config/passport.config.js";

const service = {
  spotifyAuth: passport.authenticate('spotify', {
    scope: [
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'user-top-read',
      'user-follow-read'
    ],
    showDialog: true
  }),
  spotifyCallbackAuth: passport.authenticate('spotify', {
    successRedirect: '/api/v1/auth/success',
    failureRedirect: '/api/v1/auth/failure'
  })
};

export default service;
