const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../out');
const nextFolder = path.join(outDir, '_next');
const staticFolder = path.join(outDir, 'static');

if (!fs.existsSync(outDir)) {
  console.error('Error: out directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

if (!fs.existsSync(nextFolder)) {
  console.error('Error: _next folder does not exist in out directory.');
  process.exit(1);
}

console.log('Starting GitHub Pages preparation...');

console.log('Step 1: Renaming _next folder to static...');
fs.renameSync(nextFolder, staticFolder);
console.log('✓ Renamed _next to static');

console.log('Step 2: Updating references in all files...');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (/\.(html|css|js)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const patterns = [
    { from: /_next\//g, to: 'static/' },
    { from: /"_next\//g, to: '"static/' },
    { from: /'_next\//g, to: "'static/" },
    { from: /\/_next\//g, to: '/static/' },
    { from: /"\/\_next\//g, to: '"/static/' },
    { from: /'\/\_next\//g, to: "'/static/" },
  ];

  patterns.forEach(pattern => {
    if (pattern.from.test(content)) {
      content = content.replace(pattern.from, pattern.to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

const allFiles = getAllFiles(outDir);
let updatedCount = 0;

allFiles.forEach(file => {
  if (replaceInFile(file)) {
    updatedCount++;
    const relativePath = path.relative(outDir, file);
    console.log(`  ✓ Updated: ${relativePath}`);
  }
});

console.log(`\n✓ Updated ${updatedCount} file(s)`);
console.log('✓ GitHub Pages preparation complete!');
console.log('\nThe _next folder has been renamed to static and all references updated.');
console.log('Your site is now ready to deploy to GitHub Pages.');
