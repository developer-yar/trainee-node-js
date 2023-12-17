FROM node

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE $APPLICATION_PORT

CMD ["npm", "run", "start:prod"]