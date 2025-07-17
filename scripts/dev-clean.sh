#!/bin/bash

echo "🧹 Cleaning Next.js cache..."
rm -rf .next

echo "🗑️  Cleaning node_modules..."
rm -rf node_modules

echo "📦 Reinstalling dependencies..."
npm install

echo "🚀 Starting development server..."
npm run dev 