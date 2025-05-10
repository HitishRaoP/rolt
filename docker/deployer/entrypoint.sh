#!/bin/sh

mkdir -p /usr/src/app/"$OWNER-$REPO"

# Change into the directory
cd /usr/src/app/"$OWNER-$REPO"

# Force application to run on port 3000
PORT=3000

echo "INSTALLATION_ID=$INSTALLATION_ID"
echo "CHECK_RUN_ID=$CHECK_RUN_ID"
echo "OWNER=$OWNER"
echo "REPO=$REPO"
echo "COMMIT_SHA=$COMMIT_SHA"
echo "REF=$REF"
echo "DEPLOYMENT_ID=$DEPLOYMENT_ID"
echo "HOST_IP"="$HOST_IP"

# API endpoints for check updates and deployment
CHECKS_ENDPOINT="http://$HOST_IP:8081/github/check"
DEPLOYMENT_ENDPOINT="http://$HOST_IP:8081/github/deployment"

# Function to update GitHub Check Run status
# Arguments:
#   1: status (queued, in_progress, completed)
#   2: conclusion (success, failure, cancelled) [optional]
#   3: title
#   4: summary
update_check() {
  # Handle optional conclusion (omit if empty)
  if [ -n "$2" ]; then
    CONCLUSION_LINE="\"conclusion\": \"$2\","
  else
    CONCLUSION_LINE=""
  fi

  curl -s -X POST "$CHECKS_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{
      "installationId": '"$INSTALLATION_ID"',
      "owner": "'"$OWNER"'",
      "repo": "'"$REPO"'",
      "commitSha": "'"$COMMIT_SHA"'",
      "status": "'"$1"'",
      '"$CONCLUSION_LINE"'
      "checkRunId": '"$CHECK_RUN_ID"',
      "title": "'"$3"'",
      "summary": "'"$4"'"
    }'
}

# Function to notify about a successful deployment
create_deployment() {
  curl -s -X POST "$DEPLOYMENT_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{
      "installationId": '"$INSTALLATION_ID"',
      "owner": "'"$OWNER"'",
      "repo": "'"$REPO"'",
      "ref": "'"$REF"'",
      "commitSha": "'"$COMMIT_SHA"'",
      "deploymentId": "'"$DEPLOYMENT_ID"'"
    }'
}

# Validate required environment variables
if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
  echo "ERROR: OWNER and REPO must be set."
  update_check "completed" "cancelled" "Missing Environment Variables" "OWNER or REPO is not set."
  exit 1
fi

# Clone the repository if it's not already present
if [ -z "$(ls -A)" ]; then
  echo "Cloning https://github.com/${OWNER}/${REPO}.git at ${REF}..."
  git clone --progress -b "${REF}" "https://github.com/${OWNER}/${REPO}.git" .
  if [ $? -ne 0 ]; then
    update_check "completed" "failure" "Clone Failed" "Failed to clone the repository."
    exit 1
  fi
fi

# Check for package.json to determine if it's a Node.js app
if [ -f "package.json" ]; then
  # Detect which package manager to use
  if [ -f "pnpm-lock.yaml" ]; then
    PACKAGE_MANAGER="pnpm"
  elif [ -f "yarn.lock" ]; then
    PACKAGE_MANAGER="yarn"
  else
    PACKAGE_MANAGER="npm"
  fi

  update_check "in_progress" "" "Installing Dependencies" "Using $PACKAGE_MANAGER..."

  # Install dependencies
  $PACKAGE_MANAGER install --prod=false
  if [ $? -ne 0 ]; then
    update_check "completed" "failure" "Install Failed" "Failed to install dependencies."
    exit 1
  fi

  update_check "in_progress" "" "Building App" "Running $PACKAGE_MANAGER build..."

  # Run the build step
  $PACKAGE_MANAGER run build
  if [ $? -ne 0 ]; then
    update_check "completed" "failure" "Build Failed" "Build step failed."
    exit 1
  fi

  echo "Forcing app to run on port 3000..."

  # Attempt to start the app using either 'start' or 'preview' script
  if grep -q "\"start\":" package.json; then
    echo "Running 'start' script..."
    update_check "completed" "success" "Build Success" "Build step Completed."
    create_deployment
    exec $PACKAGE_MANAGER start --port 3000 --host 0.0.0.0
  elif grep -q "\"preview\":" package.json; then
    echo "Running 'preview' script..."
    update_check "completed" "success" "Build Success" "Build step Completed"
    create_deployment
    exec $PACKAGE_MANAGER run preview --port 3000 --host 0.0.0.0
  else
    echo "ERROR: No 'start' or 'preview' script found in package.json"
    update_check "completed" "failure" "Start Script Missing" "No start or preview script in package.json"
    exit 1
  fi

else
  echo "ERROR: No package.json found."
  update_check "completed" "failure" "Missing package.json" "Cannot continue without package.json"
  exit 1
fi
