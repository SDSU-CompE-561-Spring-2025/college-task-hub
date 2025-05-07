# Use an official Node.js image
FROM node:20

# Set working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json (or yarn.lock) first to install dependencies
COPY frontend/package*.json ./

# Install dependencies for the Next.js app
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ .

# Expose port for Next.js app (default 3000)
EXPOSE 3000

# Run Next.js in development mode
CMD ["npm", "run", "dev"]
