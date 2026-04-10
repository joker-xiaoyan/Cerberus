/**
 * Cerberus 组件加载器
 * 用于动态加载和管理HTML组件模块
 * 支持渐进式迁移：可以与现有的内联HTML共存
 */

class ComponentLoader {
    constructor() {
        this.loadedComponents = new Map();
        this.componentCache = new Map();
        this.loadingPromises = new Map();
        this.isInitialized = false;
    }

    /**
     * 初始化组件加载器
     * 检测是否使用模块化模式
     */
    init() {
        // 检测是否在模块化页面中
        const pagesContainer = document.getElementById('pages-container');
        const modalsContainer = document.getElementById('modals-container');
        
        this.isModularMode = !!(pagesContainer || modalsContainer);
        this.isInitialized = true;
        
        console.log(`[ComponentLoader] 初始化完成，模式: ${this.isModularMode ? '模块化' : '兼容'}`);
        return this;
    }

    /**
     * 加载单个组件
     * @param {string} componentPath - 组件路径（相对于 /static/components/）
     * @param {string} targetSelector - 目标容器选择器
     * @param {boolean} append - 是否追加而不是替换
     * @returns {Promise<boolean>} - 是否加载成功
     */
    async loadComponent(componentPath, targetSelector, append = false) {
        const fullPath = `/static/components/${componentPath}`;
        
        // 检查是否已有加载中的Promise
        if (this.loadingPromises.has(fullPath)) {
            return this.loadingPromises.get(fullPath);
        }

        const loadPromise = this._doLoadComponent(fullPath, targetSelector, append);
        this.loadingPromises.set(fullPath, loadPromise);
        
        try {
            return await loadPromise;
        } finally {
            this.loadingPromises.delete(fullPath);
        }
    }

    async _doLoadComponent(fullPath, targetSelector, append) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            console.warn(`[ComponentLoader] 目标容器未找到: ${targetSelector}，跳过组件加载`);
            return false;
        }

        try {
            let html;
            
            // 检查缓存
            if (this.componentCache.has(fullPath)) {
                html = this.componentCache.get(fullPath);
            } else {
                const response = await fetch(fullPath);
                if (!response.ok) {
                    // 组件文件不存在时静默失败（支持渐进式迁移）
                    if (response.status === 404) {
                        console.debug(`[ComponentLoader] 组件未找到(可选): ${fullPath}`);
                        return false;
                    }
                    throw new Error(`加载组件失败: ${fullPath} (${response.status})`);
                }
                html = await response.text();
                this.componentCache.set(fullPath, html);
            }

            if (append) {
                target.insertAdjacentHTML('beforeend', html);
            } else {
                target.innerHTML = html;
            }

            this.loadedComponents.set(fullPath, targetSelector);
            
            // 执行组件内的脚本
            this._executeScripts(target);
            
            console.log(`[ComponentLoader] 已加载: ${fullPath}`);
            return true;
        } catch (error) {
            console.error(`[ComponentLoader] 加载错误 ${fullPath}:`, error);
            return false;
        }
    }

    /**
     * 批量加载组件（并行）
     * @param {Array<{path: string, target: string, append?: boolean}>} components
     * @returns {Promise<number>} - 成功加载的组件数量
     */
    async loadComponents(components) {
        const results = await Promise.all(
            components.map(({ path, target, append }) => 
                this.loadComponent(path, target, append)
            )
        );
        return results.filter(Boolean).length;
    }

    /**
     * 加载布局组件
     * @returns {Promise<void>}
     */
    async loadLayout() {
        const layoutComponents = [
            { path: 'layout/header.html', target: '#header-container' },
            { path: 'layout/sidebar.html', target: '#sidebar-container' },
            { path: 'layout/footer.html', target: '#footer-container' }
        ];

        for (const comp of layoutComponents) {
            await this.loadComponent(comp.path, comp.target);
        }
    }

    /**
     * 加载所有模态框组件
     * @returns {Promise<number>} - 成功加载的模态框数量
     */
    async loadModals() {
        const container = document.getElementById('modals-container');
        if (!container) {
            console.debug('[ComponentLoader] 模态框容器未找到，跳过模态框加载');
            return 0;
        }

        const modals = [
            'modals/console.html',
            'modals/file-manager.html',
            'modals/process-manager.html',
            'modals/create-listener.html',
            'modals/add-command.html',
            'modals/automation-strategy.html',
            'modals/file-upload.html',
            'modals/file-download.html',
            'modals/inline-execute-pe.html',
            'modals/server-files.html',
            'modals/dll-loader.html',
            'modals/socks-proxy.html',
            'modals/arsenal-upload.html'
        ];

        let loaded = 0;
        for (const modal of modals) {
            const success = await this.loadComponent(modal, '#modals-container', true);
            if (success) loaded++;
        }
        
        console.log(`[ComponentLoader] 已加载 ${loaded}/${modals.length} 个模态框`);
        return loaded;
    }

    /**
     * 加载所有页面组件
     * @returns {Promise<number>} - 成功加载的页面数量
     */
    async loadPages() {
        const container = document.getElementById('pages-container');
        if (!container) {
            console.debug('[ComponentLoader] 页面容器未找到，跳过页面加载');
            return 0;
        }

        const pages = [
            { path: 'pages/dashboard.html', target: '#pages-container', append: true },
            { path: 'pages/beacons.html', target: '#pages-container', append: true },
            { path: 'pages/listeners.html', target: '#pages-container', append: true },
            { path: 'pages/tasks.html', target: '#pages-container', append: true },
            { path: 'pages/client.html', target: '#pages-container', append: true },
            { path: 'pages/delivery.html', target: '#pages-container', append: true },
            { path: 'pages/system.html', target: '#pages-container', append: true },
            { path: 'pages/ai.html', target: '#pages-container', append: true },
            { path: 'pages/automation.html', target: '#pages-container', append: true },
            { path: 'pages/loot.html', target: '#pages-container', append: true },
            { path: 'pages/cluster.html', target: '#pages-container', append: true }
        ];

        const loaded = await this.loadComponents(pages);
        console.log(`[ComponentLoader] 已加载 ${loaded}/${pages.length} 个页面`);
        return loaded;
    }

    /**
     * 执行加载的HTML中的脚本
     * @param {HTMLElement} container
     */
    _executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            
            // 复制属性
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // 复制内容
            newScript.textContent = oldScript.textContent;
            
            // 替换旧脚本
            if (oldScript.parentNode) {
                oldScript.parentNode.replaceChild(newScript, oldScript);
            }
        });
    }

    /**
     * 清除组件缓存
     */
    clearCache() {
        this.componentCache.clear();
        console.log('[ComponentLoader] 缓存已清除');
    }

    /**
     * 重新加载指定组件
     * @param {string} componentPath
     * @returns {Promise<boolean>}
     */
    async reloadComponent(componentPath) {
        const fullPath = `/static/components/${componentPath}`;
        this.componentCache.delete(fullPath);
        
        const targetSelector = this.loadedComponents.get(fullPath);
        if (targetSelector) {
            return await this.loadComponent(componentPath, targetSelector);
        }
        return false;
    }

    /**
     * 检查组件是否已加载
     * @param {string} componentPath
     * @returns {boolean}
     */
    isLoaded(componentPath) {
        const fullPath = `/static/components/${componentPath}`;
        return this.loadedComponents.has(fullPath);
    }

    /**
     * 获取已加载的组件列表
     * @returns {string[]}
     */
    getLoadedComponents() {
        return Array.from(this.loadedComponents.keys());
    }
}

// 创建全局实例
window.componentLoader = new ComponentLoader();

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.componentLoader.init());
} else {
    window.componentLoader.init();
}

// 导出供模块使用
export default window.componentLoader;
