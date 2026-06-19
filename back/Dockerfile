FROM node:18-alpine

WORKDIR /app/back

COPY back/package*.json ./
RUN npm install

COPY back ./

CMD ["npm", "run", "start:dev"]