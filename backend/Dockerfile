ARG NODE_VERSION=26.7.0-alpine3.24@sha256:aadf416b2cdce311a8811ba3f0608a61b77dbf997500e2eafe781b51f6a0b019

FROM node:${NODE_VERSION}

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code and chown to node user
COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]