#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")

CREDENTIALS_FILE="$HOME/.aws/credentials"
AWS_ACCESS_KEY_ID=$(grep -oP '(?<=aws_access_key_id=).*' "$CREDENTIALS_FILE")
AWS_SECRET_ACCESS_KEY=$(grep -oP '(?<=aws_secret_access_key=).*' "$CREDENTIALS_FILE")

TARGET=$SCRIPT_DIR/../yarn-project+export-aztec

# make temp file for build logs within the script dir
LOG_FILE=$SCRIPT_DIR/build.log
touch $LOG_FILE


echo "Building image for $TARGET"
echo "Logging to $LOG_FILE"

earthly \
--secret AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
--secret AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
$TARGET > $LOG_FILE 2>&1

if [ $? -ne 0 ]; then
    echo "Build failed. Check $LOG_FILE for more information"
    exit 1
fi

# grep logs for the image name
# the shape is
# Image (...)/yarn-project+export-aztec output as aztecprotocol/aztec:(...)

IMAGE_NAME=$(grep -oP 'Image .*\+export-aztec output as \K.*' $LOG_FILE)

echo "Built image $IMAGE_NAME"

kind load docker-image $IMAGE_NAME

echo "Loaded image into kind cluster"
