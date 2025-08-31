#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Verify the generated client
  const prismaClientPath = path.join(__dirname, 'node_modules/.prisma/client');
  if (!fs.existsSync(prismaClientPath)) {
    throw new Error('Prisma client was not generated properly');
  }

  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
