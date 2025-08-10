import passport from 'passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import { enviroment } from 'constants/index.js';

const { ID, SECRET, CALLBACK_URL } = enviroment.SPOTIFY.CLIENT;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SpotifyStrategy(
  {
    clientID: ID,
    clientSecret: SECRET,
    callbackURL: CALLBACK_URL
  },
  (accessToken, refreshToken, expires_in, profile, done) => {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    return done(null, profile);
  }
));

export default passport;
