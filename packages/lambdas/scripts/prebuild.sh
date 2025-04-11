#!/bin/sh

if [ -z "$FOLDER_NAME" ]; then
  echo "Folder name not provided"
  exit 1
fi

DIST_DIR="src/$FOLDER_NAME/dist"

if [ -d "$DIST_DIR" ]; then
  rm -rf "$DIST_DIR"
else
  echo "No dist folder to clean at $DIST_DIR"
fi
