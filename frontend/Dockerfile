# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the static build
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /app/build ./build

EXPOSE 80

ENV NODE_ENV=production

CMD ["serve", "-s", "build", "-l", "80"]
