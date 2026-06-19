FROM node:18-alpine

WORKDIR /app/front

COPY front/package*.json ./
RUN npm install

COPY front ./

CMD ["npm", "run", "dev"]