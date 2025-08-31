#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting build process...');

(async () => {
  try {
    // Install dependencies
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Generate Prisma client with explicit output path
    console.log('Generating Prisma client...');
    execSync('npx prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });

    // Verify the generated client in the correct location
    const prismaClientPath = path.join(process.cwd(), 'node_modules/.prisma/client');
    if (!fs.existsSync(prismaClientPath)) {
      throw new Error('Prisma client was not generated properly');
    }

    console.log('Build completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
})();
