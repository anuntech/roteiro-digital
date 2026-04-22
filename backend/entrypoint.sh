#!/bin/sh
set -e

echo "Resolving any failed migrations..."
npx prisma migrate resolve --rolled-back 20241126211541_rename_checklist_anuntech_table 2>/dev/null || true
npx prisma migrate resolve --rolled-back 20241126221715_seila 2>/dev/null || true
npx prisma migrate resolve --rolled-back 20241127131708_remove_technical 2>/dev/null || true

echo "Running database migrations..."
npx prisma migrate deploy
echo "Migrations complete."

exec node dist/server.js
