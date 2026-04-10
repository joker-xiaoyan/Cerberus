/**
 * Cerberus 页面注册表
 * 定义所有页面组件及其加载配置
 */

const PageRegistry = {
    // 页面定义
    pages: {
        dashboard: {
            id: 'dashboardPage',
            template: 'pages/dashboard.html',
            title: 'Dashboard',
            init: null
        },
        beacons: {
            id: 'beaconsPage',
            template: 'pages/beacons.html',
            title: 'Beacon管理',
            subpages: [
                'beacon-list',
                'beacon-advanced',
                'beacon-bof',
                'beacon-so',
                'beacon-cascade',
                'beacon-topology',
                'beacon-proxy',
                'beacon-screenshots',
                'server-downloads',
                'beacon-injection',
                'beacon-rootkit'
            ],
            init: null
        },
        tasks: {
            id: 'tasksPage',
            template: 'pages/tasks.html',
            title: '任务管理',
            init: null
        },
        ai: {
            id: 'aiPage',
            template: 'pages/ai.html',
            title: 'AI助手',
            subpages: ['ai-chat', 'ai-config', 'ai-operations'],
            init: null
        },
        listeners: {
            id: 'listenersPage',
            template: 'pages/listeners.html',
            title: '监听器管理',
            init: null
        },
        automation: {
            id: 'automationPage',
            template: 'pages/automation.html',
            title: '自动编排',
            subpages: ['automation-strategies', 'automation-executions'],
            init: null
        },
        client: {
            id: 'clientPage',
            template: 'pages/client.html',
            title: '客户端生成',
            init: null
        },
        delivery: {
            id: 'deliveryPage',
            template: 'pages/delivery.html',
            title: '初始投递物',
            init: null
        },
        cluster: {
            id: 'clusterPage',
            template: 'pages/cluster.html',
            title: '集群管理',
            init: null
        },
        system: {
            id: 'systemPage',
            template: 'pages/system.html',
            title: '系统管理',
            subpages: ['user-management', 'system-logs', 'settings', 'http-template-settings', 'notification-settings', 'c2-comm-settings'],
            init: null
        }
    },

    // 模态框定义
    modals: [
        { id: 'consoleModal', template: 'modals/console.html' },
        { id: 'fileManagerModal', template: 'modals/file-manager.html' },
        { id: 'processManagerModal', template: 'modals/process-manager.html' },
        { id: 'fileUploadModal', template: 'modals/file-upload.html' },
        { id: 'fileDownloadModal', template: 'modals/file-download.html' },
        { id: 'screenshotModal', template: 'modals/screenshot.html' },

        { id: 'bofModal', template: 'modals/bof.html' },
        { id: 'rdiModal', template: 'modals/rdi.html' },
        { id: 'privilegeModal', template: 'modals/privilege-escalation.html' },
        { id: 'inlineExecuteModal', template: 'modals/inline-execute.html' },
        { id: 'dllLoaderModal', template: 'modals/dll-loader.html' },
        { id: 'socksProxyModal', template: 'modals/socks-proxy.html' },
        { id: 'listenerModal', template: 'modals/listener.html' },
        { id: 'strategyModal', template: 'modals/automation-strategy.html' },

    ],

    // 获取页面配置
    getPage(pageName) {
        return this.pages[pageName] || null;
    },

    // 获取所有页面名称
    getPageNames() {
        return Object.keys(this.pages);
    },

    // 获取模态框列表
    getModals() {
        return this.modals;
    }
};

// 导出
window.PageRegistry = PageRegistry;
export default PageRegistry;
