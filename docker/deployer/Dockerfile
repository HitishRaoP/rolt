ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

# Install git for cloning
RUN apk add --no-cache git

ENV URL=""
ENV OWNER=""
ENV REPO=""
ENV REF="main"

WORKDIR /usr/src/app

RUN npm i -g pnpm
# Put entrypoint outside app folder
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
