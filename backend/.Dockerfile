FROM ubuntu:20.04

WORKDIR /usr/src/app
# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to install dependencies
COPY package*.json ./
RUN yarn install

# Copy application code
COPY . .
RUN yarn build

ENV NODE_OPTIONS=""

CMD ["node", "dist/main.js"]
