# Use the official Node.js image.
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN yarn install

# Copy local code to the container image.
COPY . .

# Build the app
RUN yarn build

# Run the web service on container startup.
CMD [ "node", "dist/main" ]
