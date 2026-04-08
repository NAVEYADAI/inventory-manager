FROM node:18-alpine

WORKDIR /app

COPY shared ./shared

COPY back/package*.json ./back/
RUN cd back && npm install

COPY back ./back

WORKDIR /app/back

CMD ["npm", "run", "start:dev"]