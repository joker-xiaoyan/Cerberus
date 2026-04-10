/**
 * Cerberus HTML 自动迁移脚本
 * 用于从旧版 index.html 中提取页面和模态框内容到组件文件
 * 
 * 使用方法: node migrate-html.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const config = {
    sourceFile: path.join(__dirname, '../index.html'),
    componentsDir: path.join(__dirname, '../components'),
    backup: true
};

// 页面提取配置
const pageConfigs = [
    {
        id: 'dashboardPage',
        output: 'pages/dashboard.html',
        description: 'Dashboard 仪表盘页面'
    },
    {
        id: 'beaconsPage',
        output: 'pages/beacons.html',
        description: 'Beacon 管理页面'
    },
    {
        id: 'listenersPage',
        output: 'pages/listeners.html',
        description: '监听器管理页面'
    },
    {
        id: 'tasksPage',
        output: 'pages/tasks.html',
        description: '任务队列页面'
    },
    {
        id: 'clientPage',
        output: 'pages/client.html',
        description: '客户端生成页面'
    },
    {
        id: 'systemPage',
        output: 'pages/system.html',
        description: '系统管理页面'
    },
    {
        id: 'aiPage',
        output: 'pages/ai.html',
        description: 'AI 助手页面'
    },
    {
        id: 'automationPage',
        output: 'pages/automation.html',
        description: '自动编排页面'
    }
];

// 模态框提取配置
const modalConfigs = [
    { id: 'consoleModal', output: 'modals/console.html' },
    { id: 'fileManagerModal', output: 'modals/file-manager.html' },
    { id: 'processManagerModal', output: 'modals/process-manager.html' },
    { id: 'fileUploadModal', output: 'modals/file-upload.html' },
    { id: 'fileDownloadModal', output: 'modals/file-download.html' },
    { id: 'screenshotModal', output: 'modals/screenshot.html' },
    { id: 'keylogModal', output: 'modals/keylog.html' },
    { id: 'audioModal', output: 'modals/audio.html' },
    { id: 'bofModal', output: 'modals/bof.html' },
    { id: 'rdiModal', output: 'modals/rdi.html' },
    { id: 'privilegeEscalationModal', output: 'modals/privilege-escalation.html' },
    { id: 'inlineExecuteModal', output: 'modals/inline-execute.html' },
    { id: 'dllLoaderModal', output: 'modals/dll-loader.html' },
    { id: 'socksProxyModal', output: 'modals/socks-proxy.html' },
    { id: 'listenerModal', output: 'modals/listener.html' },
    { id: 'strategyModal', output: 'modals/automation-strategy.html' },
    { id: 'hvncFullscreenModal', output: 'modals/hvnc-fullscreen.html' }
];

/**
 * 提取指定ID的div元素内容
 */
function extractDivById(html, id) {
    // 构建正则匹配带指定id的div开始标签
    const startPattern = new RegExp(`<div[^>]*id=["']${id}["'][^>]*>`, 'i');
    const match = html.match(startPattern);
    
    if (!match) {
        console.warn(`  ⚠ 未找到元素: #${id}`);
        return null;
    }
    
    const startIndex = match.index;
    const startTag = match[0];
    
    // 查找匹配的闭合标签
    let depth = 1;
    let pos = startIndex + startTag.length;
    
    while (pos < html.length && depth > 0) {
        const nextOpen = html.indexOf('<div', pos);
        const nextClose = html.indexOf('</div>', pos);
        
        if (nextClose === -1) {
            console.warn(`  ⚠ 未找到闭合标签: #${id}`);
            return null;
        }
        
        if (nextOpen !== -1 && nextOpen < nextClose) {
            depth++;
            pos = nextOpen + 4;
        } else {
            depth--;
            pos = nextClose + 6;
        }
    }
    
    return html.substring(startIndex, pos);
}

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`  📁 创建目录: ${dirPath}`);
    }
}

/**
 * 保存组件文件
 */
function saveComponent(content, outputPath, description = '') {
    const fullPath = path.join(config.componentsDir, outputPath);
    const dir = path.dirname(fullPath);
    
    ensureDir(dir);
    
    // 如果文件已存在且config.backup为true，创建备份
    if (fs.existsSync(fullPath) && config.backup) {
        const backupPath = fullPath + '.backup';
        fs.copyFileSync(fullPath, backupPath);
        console.log(`  💾 备份: ${backupPath}`);
    }
    
    // 添加组件头部注释
    const header = description ? `<!-- ${description} -->\n` : '';
    fs.writeFileSync(fullPath, header + content, 'utf-8');
    
    console.log(`  ✅ 保存: ${outputPath}`);
    return true;
}

/**
 * 主函数
 */
function main() {
    console.log('🚀 Cerberus HTML 迁移工具\n');
    
    // 检查源文件
    if (!fs.existsSync(config.sourceFile)) {
        console.error(`❌ 源文件不存在: ${config.sourceFile}`);
        process.exit(1);
    }
    
    // 读取源文件
    console.log(`📖 读取源文件: ${config.sourceFile}`);
    const html = fs.readFileSync(config.sourceFile, 'utf-8');
    console.log(`   文件大小: ${(html.length / 1024).toFixed(2)} KB\n`);
    
    // 提取页面组件
    console.log('📄 提取页面组件:');
    let pagesExtracted = 0;
    for (const page of pageConfigs) {
        const content = extractDivById(html, page.id);
        if (content) {
            if (saveComponent(content, page.output, page.description)) {
                pagesExtracted++;
            }
        }
    }
    console.log(`   共提取 ${pagesExtracted}/${pageConfigs.length} 个页面\n`);
    
    // 提取模态框组件
    console.log('🔲 提取模态框组件:');
    let modalsExtracted = 0;
    for (const modal of modalConfigs) {
        const content = extractDivById(html, modal.id);
        if (content) {
            if (saveComponent(content, modal.output)) {
                modalsExtracted++;
            }
        }
    }
    console.log(`   共提取 ${modalsExtracted}/${modalConfigs.length} 个模态框\n`);
    
    // 总结
    console.log('━'.repeat(50));
    console.log(`✨ 迁移完成!`);
    console.log(`   页面: ${pagesExtracted} 个`);
    console.log(`   模态框: ${modalsExtracted} 个`);
    console.log(`   输出目录: ${config.componentsDir}`);
    console.log('\n💡 提示: 使用 index-modular.html 启用模块化版本');
}

// 执行
main();
