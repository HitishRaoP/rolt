#!/bin/sh
export NODE_ENV=production

cd /usr/src/app

if [ -z "$(ls -A)" ]; then
  echo "Cloning repo https://github.com/${OWNER}/${REPO}.git at branch ${REF}..."

  git clone --progress -b ${REF} https://github.com/${OWNER}/${REPO}.git .

  if [ $? -ne 0 ]; then
    echo "Git clone failed, trying alternate approach..."
    git clone --progress -b ${REF} https://github.com/${OWNER}/${REPO}.git .
  fi
else
  echo "Directory not empty, skipping git clone."
fi

if [ -f "package.json" ]; then
  echo "Detecting package manager..."

  # Auto-detect package manager based on lock files
  if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm detected"
    PACKAGE_MANAGER="pnpm"
  elif [ -f "yarn.lock" ]; then
    echo "yarn detected"
    PACKAGE_MANAGER="yarn"
  elif [ -f "package-lock.json" ]; then
    echo "npm detected"
    PACKAGE_MANAGER="npm"
  else
    echo "No lock file found, defaulting to npm"
    PACKAGE_MANAGER="npm"
  fi

  echo "Installing dependencies using ${PACKAGE_MANAGER}..."
  if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm install
  elif [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn install
  else
    npm ci
  fi

  echo "Building the app using ${PACKAGE_MANAGER}..."
  $PACKAGE_MANAGER run build

  echo "Checking for start/preview script..."
  if grep -q "\"start\":" package.json; then
    echo "Running 'start' script..."
    exec $PACKAGE_MANAGER start
  elif grep -q "\"preview\":" package.json; then
    echo "Running 'preview' script..."
    exec $PACKAGE_MANAGER run preview
  else
    echo "ERROR: No 'start' or 'preview' script found in package.json"
    exit 1
  fi
else
  echo "ERROR: No package.json found. Repository may not have been cloned correctly."
  exit 1
fi
