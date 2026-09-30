#!/usr/bin/env bash
set -e

HOSTINGER_PORT="65002"
HOSTINGER_USER="u579232760"
HOSTINGER_IP="46.202.161.37"
REMOTE_PATH="~/domains/instrctr.com/public_html"

echo "⚡ 1. Building production bundle locally on Mac..."
npm run build

echo "📤 2. Syncing files and pre-built bundle to Hostinger..."
rsync -avz -P -e "ssh -p ${HOSTINGER_PORT}" \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'data/*.db-journal' \
  ./ ${HOSTINGER_USER}@${HOSTINGER_IP}:${REMOTE_PATH}/

echo "🔄 3. Ensuring PM2 is running on Hostinger..."
ssh -p ${HOSTINGER_PORT} ${HOSTINGER_USER}@${HOSTINGER_IP} "bash -l -c 'cd ${REMOTE_PATH} && pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs'"

echo "🎉 Live deployment completed successfully!"
