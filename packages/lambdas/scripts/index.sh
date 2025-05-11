#!/bin/sh

echo "Building all Lambda functions in src/..."

for dir in src/*/; do
    FOLDER_NAME=$(basename "$dir")

    echo "----------------------------------------"
    echo "Building function: $FOLDER_NAME"
    echo "----------------------------------------"

    export FOLDER_NAME

    sh scripts/prebuild.sh
    sh scripts/build.sh
    sh scripts/postbuild.sh

    echo "✅ Done for function: $FOLDER_NAME"
done

echo "🎉 All functions built successfully."
