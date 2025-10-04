const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../out');
const nojekyllPath = path.join(outDir, '.nojekyll');

// Check if out directory exists
if (!fs.existsSync(outDir)) {
  console.error('Error: out directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Create .nojekyll file
fs.writeFileSync(nojekyllPath, '', 'utf8');
console.log('✓ Created .nojekyll file in out directory');
console.log('✓ GitHub Pages will now serve files from _next folder correctly');
