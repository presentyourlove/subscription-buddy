#!/bin/bash
# Generate BigQuery Views for Firestore Collections
# Requires: npx, fs-bq-schema-views

# 1. Users View
npx @firebaseextensions/fs-bq-schema-views \
  --non-interactive \
  --project=subscription-buddy-2353b \
  --dataset=firestore_export \
  --table-name-prefix=users \
  --schema-files=./schemas/users.json

# 2. Groups View
npx @firebaseextensions/fs-bq-schema-views \
  --non-interactive \
  --project=subscription-buddy-2353b \
  --dataset=firestore_export \
  --table-name-prefix=groups \
  --schema-files=./schemas/groups.json

echo "BigQuery Views Generated Successfully"
