console.log('Running Vercel build script...');
const { execSync } = require('child_process');

// Run Prisma generate
console.log('Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });

// Run database migrations
console.log('Running database migrations...');
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
} catch (error) {
  console.warn('Warning: Database migrations failed. This might be expected if this is the first deployment.');
  console.warn('Error details:', error.message);
}

console.log('Vercel build completed!');
