# Stage 1: Build the app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Serve the app
FROM nginx:alpine

# Copy custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
