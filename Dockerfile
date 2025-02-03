FROM node:alpine
#FROM --platform=linux/amd64 alpine AS build_amd64
ENV PORT=8080

WORKDIR /actionhero

# needed for tests
RUN apk add chromium

COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

CMD ["node", "./dist/server.js"]
EXPOSE $PORT
