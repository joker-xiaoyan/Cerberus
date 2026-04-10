const fs = require('fs');
const path = require('path');

// 读取原始 index.html
const indexPath = path.join(__dirname, '..', '1index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const lines = html.split('\n');

// Dashboard 页面
const dashboard = { name: 'dashboard', start: 268, end: 363 };

// 提取 dashboard
const startIdx = dashboard.start - 1;
const endIdx = dashboard.end - 1;
let content = lines.slice(startIdx, endIdx + 1).join('\n');

// 去除前导缩进
content = content.split('\n').map(line => {
    return line.replace(/^        /, '');
}).join('\n');

// 添加注释头
const finalContent = `<!-- Dashboard 仪表盘页面 - 从 1index.html 自动提取 -->\n${content}`;

// 写入文件
const outputPath = path.join(__dirname, '..', 'components', 'pages', 'dashboard.html');
fs.writeFileSync(outputPath, finalContent);

console.log(`Extracted dashboard: ${endIdx - startIdx + 1} lines -> ${outputPath}`);
