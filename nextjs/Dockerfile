FROM node:22.14.0

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --audit=false --fund=false

COPY . /app
