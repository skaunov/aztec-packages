#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")

CREDENTIALS_FILE="$HOME/.aws/credentials"
AWS_ACCESS_KEY_ID=$(grep -oP '(?<=aws_access_key_id=).*' "$CREDENTIALS_FILE")
AWS_SECRET_ACCESS_KEY=$(grep -oP '(?<=aws_secret_access_key=).*' "$CREDENTIALS_FILE")

TARGET=$SCRIPT_DIR/../yarn-project+export-aztec

echo "Building image for $TARGET"

earthly \
--secret AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
--secret AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
$TARGET
