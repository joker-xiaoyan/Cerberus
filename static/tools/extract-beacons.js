const fs = require('fs');
const path = require('path');

// 读取原始 index.html
const indexPath = path.join(__dirname, '..', '1index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const lines = html.split('\n');

// beacons 页面范围: 第 366-1898 行 (0-indexed: 365-1897)
const beaconsStart = 365;
const beaconsEnd = 1897;

// 提取 beacons 页面内容
const beaconsContent = lines.slice(beaconsStart, beaconsEnd + 1).join('\n');

// 去除前导缩进（通常是8个空格）
const cleanedContent = beaconsContent.split('\n').map(line => {
    // 移除最多8个前导空格
    return line.replace(/^        /, '');
}).join('\n');

// 添加注释头
const finalContent = `<!-- Beacon 管理页面 - 从 1index.html 自动提取 -->
${cleanedContent}`;

// 写入 beacons.html
const outputPath = path.join(__dirname, '..', 'components', 'pages', 'beacons.html');
fs.writeFileSync(outputPath, finalContent);

console.log(`Extracted beacons page: ${beaconsEnd - beaconsStart + 1} lines`);
console.log(`Output: ${outputPath}`);
