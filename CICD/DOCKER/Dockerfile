# Use Node.js 18 base image for build stage
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Add build arguments for environment variables
ARG ENV_WEBSITES_PORT
ARG VITE_REACT_APP_TENANTS
ENV WEBSITES_PORT=$ENV_WEBSITES_PORT
ENV VITE_REACT_APP_TENANTS=$VITE_REACT_APP_TENANTS

# Copy package.json and package-lock.json
COPY package*.json ./


# Install dependencies
# RUN npm install
RUN npm install

# Copy the rest of the project
COPY . .

# Build the project
RUN npm run build

RUN npm install serve@14.2.1 --save

# Set permissions for the dist directory
RUN chmod -R 755 /app/dist

# Create the production image
FROM node:18-slim

# Set working directory for production image
WORKDIR /app

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules



# Expose port 3000
EXPOSE 3000

# Command to run the application using serve
CMD ["npx", "serve", "-s", "dist"]
