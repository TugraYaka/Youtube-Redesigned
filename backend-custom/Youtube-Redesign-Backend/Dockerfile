FROM node:20-slim

# Install system dependencies (e.g., ffmpeg is required by some packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies (including devDependencies for build step)
RUN npm install

# Copy rest of the application code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
