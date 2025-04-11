#!/bin/sh

cd /usr/src/app

PORT=3000  # force everything to run on port 3000

# Extract OWNER and REPO from URL if it's set
if [ -n "$URL" ]; then
  OWNER_REPO=$(echo "$URL" | sed -E 's|https://github.com/([^/]+)/([^/.]+).*|\1 \2|')
  OWNER=$(echo "$OWNER_REPO" | cut -d' ' -f1)
  REPO=$(echo "$OWNER_REPO" | cut -d' ' -f2)
fi

if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
  echo "ERROR: OWNER and REPO must be set."
  exit 1
fi

if [ -z "$(ls -A)" ]; then
  echo "Cloning https://github.com/${OWNER}/${REPO}.git at ${REF}..."
  git clone --progress -b ${REF} https://github.com/${OWNER}/${REPO}.git .
fi

if [ -f "package.json" ]; then
  if [ -f "pnpm-lock.yaml" ]; then
    PACKAGE_MANAGER="pnpm"
  elif [ -f "yarn.lock" ]; then
    PACKAGE_MANAGER="yarn"
  else
    PACKAGE_MANAGER="npm"
  fi

  $PACKAGE_MANAGER install --prod=false
  $PACKAGE_MANAGER run build

  echo "Forcing app to run on port 3000..."

  if grep -q "\"start\":" package.json; then
    echo "Running 'start' script..."
    exec $PACKAGE_MANAGER start --port 3000 --host 0.0.0.0
  elif grep -q "\"preview\":" package.json; then
    echo "Running 'preview' script..."
    exec $PACKAGE_MANAGER run preview --port 3000 --host 0.0.0.0
  else
    echo "ERROR: No 'start' or 'preview' script found in package.json"
    exit 1
  fi

else
  echo "ERROR: No package.json found."
  exit 1
fi
