/**
 * HTML组件拆分工具
 * 用于将大型index.html拆分为模块化组件
 * 
 * 使用方法：在浏览器控制台中运行，或通过Node.js执行
 */

const fs = require('fs');
const path = require('path');

// 配置
const config = {
    sourceFile: 'index.html',
    outputDir: 'components',
    encoding: 'utf-8'
};

// 页面标记定义
const pageMarkers = [
    { id: 'dashboardPage', start: '<div id="dashboardPage"', end: '</div><!-- end dashboardPage -->', output: 'pages/dashboard.html' },
    { id: 'beaconsPage', start: '<div id="beaconsPage"', endMarker: 'id="listenersPage"', output: 'pages/beacons.html' },
    { id: 'listenersPage', start: '<div id="listenersPage"', endMarker: 'id="tasksPage"', output: 'pages/listeners.html' },
    { id: 'tasksPage', start: '<div id="tasksPage"', endMarker: 'id="clientPage"', output: 'pages/tasks.html' },
    { id: 'clientPage', start: '<div id="clientPage"', endMarker: 'id="systemPage"', output: 'pages/client.html' },
    { id: 'systemPage', start: '<div id="systemPage"', endMarker: 'id="aiPage"', output: 'pages/system.html' },
    { id: 'aiPage', start: '<div id="aiPage"', endMarker: 'id="automationPage"', output: 'pages/ai.html' },
    { id: 'automationPage', start: '<div id="automationPage"', endMarker: '</main>', output: 'pages/automation.html' }
];

// 模态框标记定义
const modalMarkers = [
    { id: 'consoleModal', pattern: /<div id="consoleModal"[\s\S]*?<\/div>\s*<!-- end consoleModal -->/ },
    { id: 'fileManagerModal', pattern: /<div id="fileManagerModal"[\s\S]*?<\/div>\s*<!-- end fileManagerModal -->/ },
    // ... 更多模态框定义
];

/**
 * 提取HTML片段
 */
function extractFragment(html, startMarker, endMarker) {
    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) {
        console.warn(`未找到起始标记: ${startMarker}`);
        return null;
    }

    let endIndex;
    if (endMarker) {
        endIndex = html.indexOf(endMarker, startIndex);
        if (endIndex === -1) {
            console.warn(`未找到结束标记: ${endMarker}`);
            return null;
        }
    } else {
        // 找到匹配的闭合div
        endIndex = findMatchingClosingTag(html, startIndex);
    }

    return html.substring(startIndex, endIndex);
}

/**
 * 查找匹配的闭合标签
 */
function findMatchingClosingTag(html, startIndex) {
    let depth = 0;
    let i = startIndex;
    
    while (i < html.length) {
        if (html.substr(i, 4) === '<div') {
            depth++;
            i += 4;
        } else if (html.substr(i, 6) === '</div>') {
            depth--;
            if (depth === 0) {
                return i + 6;
            }
            i += 6;
        } else {
            i++;
        }
    }
    
    return html.length;
}

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * 保存组件到文件
 */
function saveComponent(content, outputPath) {
    const fullPath = path.join(config.outputDir, outputPath);
    const dir = path.dirname(fullPath);
    ensureDir(dir);
    fs.writeFileSync(fullPath, content, config.encoding);
    console.log(`已保存: ${fullPath}`);
}

/**
 * 主函数
 */
function main() {
    console.log('开始拆分HTML组件...');
    
    // 读取源文件
    const html = fs.readFileSync(config.sourceFile, config.encoding);
    console.log(`已读取源文件: ${config.sourceFile} (${html.length} 字符)`);

    // 提取并保存各页面
    for (const marker of pageMarkers) {
        console.log(`正在处理: ${marker.id}`);
        const fragment = extractFragment(html, marker.start, marker.endMarker);
        if (fragment) {
            saveComponent(fragment, marker.output);
        }
    }

    console.log('HTML组件拆分完成！');
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { extractFragment, findMatchingClosingTag, saveComponent };
