FROM node:11

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_API=REACT_APP_API_PLACEHOLDER

RUN yarn install && yarn build

FROM nginx:alpine

COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

CMD uri=\$uri envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
