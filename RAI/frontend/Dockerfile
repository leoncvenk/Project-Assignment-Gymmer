FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Expose host so Vite is accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]