const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

console.log('开始批量修改...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 1. 删除转场动画相关的 CSS 和 JS 引用
  // 保留引用，但在样式中禁用
  // 2. 修改标题，删除 V4.0
  if (/<title>.*v4\.0.*<\/title>/i.test(content) || /<title>.*V4\.0.*<\/title>/.test(content)) {
    content = content.replace(/(<title>.*)(\s*v?4\.0)(.*<\/title>)/gi, '$1$3');
    modified = true;
  }
  
  // 3. 删除页面中的"智能教室管理系统 V4.0"字样（除了登录页面的主标题）
  // 保留 login.html 中的主标题
  if (file !== 'login.html') {
    if (/智能教室管理系统\s*v?4\.0/gi.test(content)) {
      content = content.replace(/智能教室管理系统\s*v?4\.0/gi, '智能教室管理系统');
      modified = true;
    }
  }
  
  // 删除单独的 "v4.0" 或 "V4.0" 字样
  if (/\s*v4\.0/gi.test(content) || /\s*V4\.0/.test(content)) {
    content = content.replace(/\s*v?4\.0/gi, '');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已修改: ${file}`);
  } else {
    console.log(`📋 无需修改: ${file}`);
  }
});

console.log('\n✅ 批量修改完成！');
