# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/package.json /app
COPY --from=builder /app/package-lock.json /app
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public

# Install only production dependencies
RUN npm install --only=production

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
