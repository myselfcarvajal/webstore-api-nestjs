# Specify the base image
FROM node:22-alpine

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# # Copy the rest of your application's code
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

CMD [ "npm", "run", "start:dev" ]