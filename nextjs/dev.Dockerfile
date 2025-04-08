# syntax=docker/dockerfile:1

FROM node:22.14.0-bookworm

WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . /app

EXPOSE 3000

CMD ["npm", "run", "dev"]
