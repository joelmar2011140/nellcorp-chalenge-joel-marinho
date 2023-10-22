# Fazendo o build
FROM node:18.18.2-alpine as build
LABEL autor="Joel Marinho"

WORKDIR /app
COPY package*.json tsconfig.json /app/
RUN yarn install
COPY . /app
ENV PORT=6556
ENV DATABASE_URL="postgresql://root:root@localhost:5432/nellcorp-desafio-api-db?schema=public"
RUN npx prisma generate
RUN yarn  build

# gerando para à produção
FROM node:18.18.2-alpine as producao
WORKDIR /app
ENV PORT=6556
COPY package*.json /app/
RUN yarn install --production=true
COPY --from=build /app/dist /app/dist
CMD ["yarn", "start"]