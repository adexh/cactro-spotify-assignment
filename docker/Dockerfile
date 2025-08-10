FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

USER node

ENV ENV_NAME=production

EXPOSE 3000

CMD ["node", "index.js"]
