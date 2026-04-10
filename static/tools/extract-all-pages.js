const fs = require('fs');
const path = require('path');

// 读取原始 index.html
const indexPath = path.join(__dirname, '..', '1index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const lines = html.split('\n');

// 页面定义 (起始行号, 结束行号 - 使用 1-based 行号)
const pages = [
    { name: 'beacons', start: 366, end: 1898 },
    { name: 'listeners', start: 1901, end: 1914 },
    { name: 'tasks', start: 1917, end: 1926 },
    { name: 'client', start: 1929, end: 2315 },
    { name: 'system', start: 2318, end: 2407 },
    { name: 'ai', start: 2410, end: 3935 },
    { name: 'automation', start: 3938, end: 5061 }
];

function extractPage(pageDef) {
    // 转换为 0-based 索引
    const startIdx = pageDef.start - 1;
    const endIdx = pageDef.end - 1;
    
    // 提取内容
    let content = lines.slice(startIdx, endIdx + 1).join('\n');
    
    // 去除前导缩进（通常是8个空格）
    content = content.split('\n').map(line => {
        return line.replace(/^        /, '');
    }).join('\n');
    
    // 添加注释头
    const finalContent = `<!-- ${pageDef.name} 页面 - 从 1index.html 自动提取 -->\n${content}`;
    
    // 写入文件
    const outputPath = path.join(__dirname, '..', 'components', 'pages', `${pageDef.name}.html`);
    fs.writeFileSync(outputPath, finalContent);
    
    console.log(`Extracted ${pageDef.name}: ${endIdx - startIdx + 1} lines -> ${outputPath}`);
}

// 提取所有页面
pages.forEach(extractPage);

console.log('\nAll pages extracted!');
