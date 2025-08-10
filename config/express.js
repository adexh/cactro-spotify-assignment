import compression from "compression";
import cors from 'cors';
import express from "express";
import helmet from "helmet";
import session from 'express-session';

import logger from "config/logger/pino-http.js";
import passport from "config/passport.config.js";

import errorMiddleware from "middlewares/error.middleware.js";

import authRouter from "features/authentication/authentication.routes.js";
import spotifyRouter from "features/spotify/spotify.routes.js";
import openApiRouter from "features/openAPI/openapi.routes.js";

const app = express();
const mainApi = express();

const corsOptions = {
  origin: '*', // Allow all origins, adjust as needed for security
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true, // Allow credentials if needed
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(logger);
app.use(express.json());

// Session middleware must come before passport initialization
app.use(session({
  secret: 'your-session-secret', // use a strong secret in production!
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));

// Passport middleware - must come after session
app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.use('/api/v1', mainApi);

mainApi.use('/auth', authRouter);

mainApi.use('/spotify', spotifyRouter);

mainApi.use('/openapi', openApiRouter);

app.use(errorMiddleware.handleError);
app.use(errorMiddleware.handleCriticalError);

export default app;
