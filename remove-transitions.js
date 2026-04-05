const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

console.log('开始删除转场动画引用...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 删除转场动画 CSS 引用
  if (/<link[^>]*href=".*page-transition\.css"[^>]*>/i.test(content)) {
    content = content.replace(/<link[^>]*href=".*page-transition\.css"[^>]*>/gi, '');
    modified = true;
  }
  
  // 删除转场动画 JS 引用
  if (/<script[^>]*src=".*page-transition\.js"[^>]*><\/script>/i.test(content)) {
    content = content.replace(/<script[^>]*src=".*page-transition\.js"[^>]*><\/script>/gi, '');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已删除转场动画: ${file}`);
  } else {
    console.log(`📋 无转场动画: ${file}`);
  }
});

console.log('\n✅ 转场动画删除完成！');
