FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
RUN cd shared && npm install && npm run build

COPY front/package*.json ./front/
COPY shared/package*.json ./shared/

RUN cd front && npm install

COPY front ./front
COPY shared ./shared

WORKDIR /app/front

CMD ["npm", "run", "dev"]