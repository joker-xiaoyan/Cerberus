const fs = require('fs');
const path = require('path');

// 读取原始 index.html
const indexPath = path.join(__dirname, '..', '1index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const lines = html.split('\n');

// 模态框定义 (起始行号, 结束行号 - 使用 1-based 行号)
// 需要根据实际文件内容确定每个模态框的边界
const modals = [
    { name: 'console', start: 5065, end: 5091 },
    { name: 'file-manager', start: 5094, end: 6213 },
    { name: 'process-manager', start: 6216, end: 6257 },
    { name: 'create-listener', start: 6260, end: 6313 },
    { name: 'add-command', start: 6316, end: 6398 },
    { name: 'strategy', start: 6401, end: 6546 },
    { name: 'file-upload', start: 6585, end: 6671 },
    { name: 'file-download', start: 6672, end: 6751 },
    { name: 'inline-execute-pe', start: 6752, end: 6880 },
    { name: 'vnc-preview', start: 6881, end: 6935 },
    { name: 'server-files', start: 6936, end: 6968 },
    { name: 'dll-loader', start: 6969, end: 7124 },
    { name: 'socks-proxy', start: 7125, end: 7179 }
];

function extractModal(modalDef) {
    // 转换为 0-based 索引
    const startIdx = modalDef.start - 1;
    const endIdx = modalDef.end - 1;
    
    // 提取内容
    let content = lines.slice(startIdx, endIdx + 1).join('\n');
    
    // 去除前导缩进（通常是4个空格）
    content = content.split('\n').map(line => {
        return line.replace(/^    /, '');
    }).join('\n');
    
    // 添加注释头
    const finalContent = `<!-- ${modalDef.name} 模态框 - 从 1index.html 自动提取 -->\n${content}`;
    
    // 写入文件
    const outputPath = path.join(__dirname, '..', 'components', 'modals', `${modalDef.name}.html`);
    fs.writeFileSync(outputPath, finalContent);
    
    console.log(`Extracted ${modalDef.name}: ${endIdx - startIdx + 1} lines -> ${outputPath}`);
}

// 提取所有模态框
modals.forEach(extractModal);

console.log('\nAll modals extracted!');
