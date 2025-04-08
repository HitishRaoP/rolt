#!/bin/sh

echo "Building your Lambda function..."

FOLDER_NAME="$1"

if [ -z "$FOLDER_NAME" ]; then
    echo "Please provide the folder name"
    exit 1
fi

#Make the function name available for other scripts
export FOLDER_NAME

sh scripts/prebuild.sh
sh scripts/build.sh
sh scripts/postbuild.sh

echo "All done for function: $FOLDER_NAME"
