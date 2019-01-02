FROM node:11

WORKDIR /usr/src/app

COPY . .

RUN yarn install && yarn build

FROM nginx:alpine

COPY --from=0 /usr/src/app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
