FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
