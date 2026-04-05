const fs = require('fs');
const path = require('path');

// 定义需要替换的路径规则
const replacements = [
  { from: /href="page-transition\.css"/g, to: 'href="css/page-transition.css"' },
  { from: /href="dynamic-island\.css"/g, to: 'href="css/dynamic-island.css"' },
  { from: /href="theme-toggle\.css"/g, to: 'href="css/theme-toggle.css"' },
  { from: /href="confirm-selector\.css"/g, to: 'href="css/confirm-selector.css"' },
  { from: /src="auth\.js"/g, to: 'src="js/auth.js"' },
  { from: /src="db\.js"/g, to: 'src="js/db.js"' },
  { from: /src="dynamic-island\.js"/g, to: 'src="js/dynamic-island.js"' },
  { from: /src="page-transition\.js"/g, to: 'src="js/page-transition.js"' },
  { from: /src="theme-toggle\.js"/g, to: 'src="js/theme-toggle.js"' },
  { from: /src="confirm-selector\.js"/g, to: 'src="js/confirm-selector.js"' },
  { from: /src="fix-ui-issues\.js"/g, to: '' },
  { from: /src="dist\/.*\.js"/g, to: '' },
];

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

console.log('开始修复文件路径...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已修复: ${file}`);
  } else {
    console.log(`📋 无需修改: ${file}`);
  }
});

console.log('\n✅ 所有文件路径修复完成！');
