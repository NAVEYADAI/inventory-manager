FROM node:18-alpine

WORKDIR /app/shared

COPY shared/package*.json ./
RUN npm install

COPY shared .

CMD ["npm", "run", "dev"]