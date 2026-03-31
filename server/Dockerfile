FROM node:24-alpine AS builer

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate 

RUN npm run build

RUN npm prune --production

FROM node:24-alpine

WORKDIR /app

COPY --from=builer /app/package*.json ./
COPY --from=builer /app/dist ./dist
COPY --from=builer /app/node_modules ./node_modules
COPY --from=builer /app/prisma ./prisma

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]