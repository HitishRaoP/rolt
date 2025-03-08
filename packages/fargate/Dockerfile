ARG NODE_VERSION=20.17.0
ARG PNPM_VERSION=10.6.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

RUN pnpm add -g turbo
################################################################################
# Create a stage for installing production dependecies.

################################################################################
# Create a stage for building the application.
FROM base as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.

COPY --from=base /app/out/json/ .
RUN yarn install --frozen-lockfile

# Run the build script.
RUN pnpm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist


# Expose the port that the application listens on.
EXPOSE 8090

# Run the application.
CMD node dist/index.js
