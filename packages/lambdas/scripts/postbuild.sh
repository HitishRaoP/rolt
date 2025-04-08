#!/bin/sh

if [ -z "$FOLDER_NAME" ]; then
  echo "Folder name is not set"
  exit 1
fi

DIST_PATH="src/$FOLDER_NAME/dist"

cd "$DIST_PATH"

7z a -tzip function.zip index.js*

echo "Zip created: $DIST_PATH/index.zip"