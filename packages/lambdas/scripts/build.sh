#!/bin/sh

if [-z "$FOLDER_NAME"]; then
    echo "Folder name not provided"
    exit 1
fi

INPUT_FILE="src/$FOLDER_NAME/index.ts"
OUTPUT_FILE="src/$FOLDER_NAME/dist/index.js"

esbuild "$INPUT_FILE" \
  --bundle \
  --minify \
  --sourcemap \
  --platform=node \
  --target=es2020 \
  --outfile="$OUTPUT_FILE"

echo "Build complete: $OUTPUT_FILE"