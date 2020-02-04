FROM node:11

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_API=REACT_APP_API_PLACEHOLDER
ENV REACT_APP_EGO_CLIENT_ID=REACT_APP_EGO_CLIENT_ID_PLACEHOLDER

RUN yarn install && yarn build

FROM nginx:alpine

COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

ENV NGINX_USER=nginxuser
ENV NGINX_USER_ID=9999

RUN adduser -S -u $NGINX_USER_ID $NGINX_USER \ 
    && chown -R $NGINX_USER /etc/nginx/conf.d \ 
    && chown -R $NGINX_USER /var/cache \ 
    && chown -R $NGINX_USER /run  

# default client_id is set to ego
ENV REACT_APP_EGO_CLIENT_ID=ego

CMD uri=\$uri envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
