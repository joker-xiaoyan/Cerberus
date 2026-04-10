const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'components', 'pages', 'beacons.html');

// 读取文件
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// 删除第 1047-1505 行（0-indexed: 1046-1504）
// 保留 0-1045, 然后 1505-末尾
const before = lines.slice(0, 1046);
const after = lines.slice(1505);

const newContent = [...before, ...after].join('\n');

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('原始行数:', lines.length);
console.log('删除的行数:', lines.length - (before.length + after.length));
console.log('新的行数:', before.length + after.length);
