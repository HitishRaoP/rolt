ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

# Install git for cloning
RUN apk add --no-cache git curl

ENV OWNER=""
ENV REPO=""
ENV REF="main"
ENV INSTALLATION_ID=""
ENV COMMIT_SHA=""
ENV COMMIT_MESSAGE=""
ENV COMMIT_REF=""
ENV COMMIT_AUTHOR_NAME=""
ENV CHECK_RUN_ID=""
ENV DEPLOYMENT_ID=""
ENV HOST_IP=""

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY . .

RUN pnpm install

RUN pnpm build

RUN chmod +x entrypoint.sh

ENTRYPOINT ["node", "dist/index.js"]
