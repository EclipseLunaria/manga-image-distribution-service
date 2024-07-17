FROM node:22-alpine

WORKDIR "/app"

COPY package*.json ./
RUN npm install
RUN npx @puppeteer/browsers install chrome@stable --path /app/src/driver/chrome
COPY . .
RUN npx tsc
EXPOSE 6967
CMD ["node", "dist/index.js"]