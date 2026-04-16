const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/components/RegistrationForm.tsx',
  'tailwind.config.ts',
  'src/app/admin/page.tsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Specific URLs to preserve
    const xUrlPlaceholder = '___X_URL___';
    const ytUrlPlaceholder = '___YT_URL___';
    
    content = content.replace('https://x.com/IMEESDN', xUrlPlaceholder);
    content = content.replace('https://youtube.com/@imeesdn?si=667TpeC-ESYUprs1', ytUrlPlaceholder);
    
    // Fix typography: IEESDM -> IMEESDM
    content = content.replace(/IEESDM/g, 'IMEESDM');
    content = content.replace(/ieesdm/g, 'imeesdm');
    
    // Restore URLs
    content = content.replace(xUrlPlaceholder, 'https://x.com/IMEESDN');
    content = content.replace(ytUrlPlaceholder, 'https://youtube.com/@imeesdn?si=667TpeC-ESYUprs1');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  }
});
