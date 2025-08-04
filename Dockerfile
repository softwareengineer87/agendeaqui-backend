FROM --platform=linux/amd64 node:22.17-alpine3.21

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD ["node", "dist/server.js"]
