# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variables for API keys
# NOTE: In production, use proper secret management
ENV OPENTRIPMAP_API_KEY=your-actual-key-here
ENV OPENWEATHER_API_KEY=ae31432365fbca1ff449793432d59d0a
ENV EXCHANGERATE_API_KEY=154dbe21eef3b7cdf382ed57

# Run the app when the container launches
CMD ["node", "server.js"]