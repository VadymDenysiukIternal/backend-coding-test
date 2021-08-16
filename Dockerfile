FROM node:10.24.1


WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8010
CMD [ "npm", "start" ]
