FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Set environment
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development

# Expose port
EXPOSE 3000

# Run in development mode (more tolerant of errors)
CMD ["npm", "run", "dev"]
