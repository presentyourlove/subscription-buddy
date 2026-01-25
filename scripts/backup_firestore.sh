#!/bin/bash
# Disaster Recovery - Firestore Backup Script
# Usage: ./backup_firestore.sh <BUCKET_NAME>

BUCKET_NAME=${1:-gs://subscription-buddy-backups}
TIMESTAMP=$(date +"%Y-%m-%d-%H%M")
BACKUP_PATH="$BUCKET_NAME/$TIMESTAMP"

echo "Starting Firestore Export to $BACKUP_PATH..."

gcloud firestore export "$BACKUP_PATH" \
  --project=subscription-buddy-2353b \
  --async

if [ $? -eq 0 ]; then
  echo "Backup job initiated successfully."
else
  echo "Backup failed!"
  exit 1
fi
