import dotenv from 'dotenv';

const ENV_NAME = process.env.ENV_NAME || 'development';

dotenv.config({ path: `./.env.${ENV_NAME}`, quiet: true });

const enviroment = {
  ENV: {
    ISDEVELOPMENT: ENV_NAME === 'development',
  },
  SPOTIFY: {
    CLIENT: {
      ID: process.env.SPOTIFY_CLIENT_ID,
      SECRET: process.env.SPOTIFY_CLIENT_SECRET,
      CALLBACK_URL: process.env.SPOTIFY_CALLBACK_URL
    }
  },
  LOG: {
    DIRECTORY: process.env.LOG_DIRECTORY || './logs'
  },
  SERVER: {
    PORT: process.env.SERVER_PORT || 8080
  }
}

export default enviroment;