# Use Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
