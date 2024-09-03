FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8009

CMD ["npm", "start"]