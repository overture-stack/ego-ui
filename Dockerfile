FROM node:14.16.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN yarn install

ENV EGO_UI_USER=egoui
ENV EGO_UI_UID=9999
ENV EGO_UI_GID=9999

# Default nginx port
ENV PORT=8080

RUN addgroup -S -g $EGO_UI_GID $EGO_UI_USER \
    && adduser -S -u $EGO_UI_UID -G $EGO_UI_USER $EGO_UI_USER \
    && chown -R $EGO_UI_UID:$EGO_UI_GID /usr/src/app

# defaults
ENV REACT_APP_EGO_CLIENT_ID=ego
ENV REACT_APP_API=http://localhost:8081/
ENV PUBLIC_URL="/"

USER $EGO_UI_UID

CMD ["yarn", "run", "serve", "-l", "8080"]
