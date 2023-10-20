# Fazendo o build
FROM node:18.18.2-alpine as build
LABEL autor="Joel Marinho"

WORKDIR /app
COPY package*.json tsconfig.json /app/
RUN yarn install
COPY . /app
RUN yarn  build

# gerando para à produção
FROM node:18.18.2-alpine as producao
WORKDIR /app
COPY package*.json /app/
RUN yarn install production=true
COPY --from=build /app/dist /app/dist
CMD ["yarn", "start"]