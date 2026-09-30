#!/usr/bin/env bash
set -e

echo "🚀 Starting Instrctr Deployment..."

# 1. Pull latest code if using git
if [ -d ".git" ]; then
  echo "📥 Pulling latest code from Git repository..."
  git pull origin main || git pull
fi

# 2. Ensure data and upload directories exist
echo "📁 Setting up persistent storage directories..."
mkdir -p data public/uploads

# 3. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 4. Generate Prisma & sync SQLite database schema
echo "🗄️ Setting up SQLite database..."
npx prisma generate
npx prisma db push

# 5. Build Next.js application with memory & worker optimization
echo "⚡ Building Next.js production bundle..."
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=1024"
npm run build

# 6. Restart/Start with PM2 if PM2 is available
if command -v pm2 &> /dev/null; then
  echo "🔄 Reloading PM2 process..."
  pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs
  pm2 save
  echo "✅ Application running under PM2!"
else
  echo "ℹ️ PM2 not found. You can run 'npm start'."
fi

echo "🎉 Deployment successfully completed!"
