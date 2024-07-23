# Use the official Node.js image.
FROM node:20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies.
COPY package*.json ./
RUN npm install

# Copy app source code.
COPY . .

# Expose the port the app runs on
EXPOSE 000

# Run the application.
CMD ["npm", "run", "start:prod"]
