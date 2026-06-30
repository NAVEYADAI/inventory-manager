#!/bin/bash
# Exit immediately if any command fails
set -e

echo "🧪 Running backend tests..."
npm run test --prefix back

echo "🧪 Running frontend tests..."
npm run test --prefix front

echo "🚀 Starting deployment of all services to Fly.io..."

echo "================================"
echo "📦 1/2: Deploying BACKEND..."
echo "================================"
cd back
fly deploy
cd ..

echo "================================"
echo "📦 2/2: Deploying FRONTEND..."
echo "================================"
cd front
fly deploy
cd ..

echo "🎉 Deployment completed successfully!"
