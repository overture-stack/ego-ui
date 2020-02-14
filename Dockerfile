#######################
#     Builder
#######################
FROM node:11.15.0 as builder

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_API=REACT_APP_API_PLACEHOLDER
ENV REACT_APP_EGO_CLIENT_ID=REACT_APP_EGO_CLIENT_ID_PLACEHOLDER

RUN yarn install && yarn build

#######################
#     Server
#######################
FROM nginx:1.17.8-alpine

COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

ENV EGO_UI_USER=egoui
ENV EGO_UI_UID=9999
ENV EGO_UI_GID=9999

RUN addgroup -S -g $EGO_UI_GID $EGO_UI_USER \
    && adduser -S -u $EGO_UI_UID -G $EGO_UI_GID $EGO_UI_USER \
    && chown -R $EGO_UI_UID:$EGO_UI_GID /etc/nginx/conf.d \
    && chown -R $EGO_UI_UID:$EGO_UI_GID /var/cache \
    && chown -R $EGO_UI_UID:$EGO_UI_GID /run

# default client_id is set to ego
ENV REACT_APP_EGO_CLIENT_ID=ego

USER $EGO_UI_UID

CMD uri=\$uri envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
