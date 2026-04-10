# Cerberus 前端模块化架构指南

## 概述

本项目采用渐进式模块化方案，将原本7000+行的 `index.html` 拆分为可维护的组件模块。

## 目录结构

```
static/
├── index.html              # 原版（兼容模式）
├── index-modular.html      # 模块化版本
├── components/
│   ├── component-loader.js # 组件加载器
│   ├── page-registry.js    # 页面注册表
│   ├── layout/
│   │   ├── header.html     # 顶部导航栏
│   │   ├── sidebar.html    # 左侧导航栏
│   │   └── footer.html     # 页脚
│   ├── pages/
│   │   ├── dashboard.html  # 仪表盘页面
│   │   ├── beacons.html    # Beacon管理页面
│   │   ├── listeners.html  # 监听器页面
│   │   ├── tasks.html      # 任务页面
│   │   ├── ai.html         # AI助手页面
│   │   ├── automation.html # 自动编排页面
│   │   ├── client.html     # 客户端生成页面
│   │   └── system.html     # 系统管理页面
│   └── modals/
│       ├── console.html    # 控制台模态框
│       ├── file-manager.html
│       ├── file-upload.html
│       ├── file-download.html
│       ├── hvnc-fullscreen.html
│       └── ...
└── tools/
    └── html-splitter.js    # HTML拆分工具
```

## 使用方法

### 方式一：使用模块化版本（推荐）

1. 将 `index-modular.html` 重命名为 `index.html`（备份原文件）
2. 确保所有组件文件已正确放置
3. 系统会自动加载所有组件

### 方式二：渐进式迁移

组件加载器支持与现有HTML共存：

```javascript
// 在现有页面中引入组件加载器
import componentLoader from './components/component-loader.js';

// 按需加载特定组件
await componentLoader.loadComponent('modals/console.html', '#modals-container', true);
```

## 组件开发规范

### 页面组件

```html
<!-- pages/example.html -->
<div id="examplePage" class="page-content">
    <div class="max-w-full mx-auto px-6 py-6">
        <h2 class="text-2xl font-bold mb-6">页面标题</h2>
        <!-- 页面内容 -->
    </div>
</div>
```

### 模态框组件

```html
<!-- modals/example.html -->
<div id="exampleModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="text-xl font-bold">模态框标题</h3>
            <button class="modal-close" onclick="window.closeExampleModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <!-- 模态框内容 -->
        </div>
    </div>
</div>
```

### 组件内脚本

组件可以包含内联脚本，加载器会自动执行：

```html
<div id="myComponent">
    <!-- 组件HTML -->
</div>

<script>
    // 组件初始化代码
    document.addEventListener('DOMContentLoaded', function() {
        console.log('组件已加载');
    });
</script>
```

## API 参考

### ComponentLoader

```javascript
// 加载单个组件
await componentLoader.loadComponent('pages/dashboard.html', '#pages-container');

// 追加模式加载
await componentLoader.loadComponent('modals/console.html', '#modals-container', true);

// 批量加载
await componentLoader.loadComponents([
    { path: 'pages/dashboard.html', target: '#pages-container', append: true },
    { path: 'pages/beacons.html', target: '#pages-container', append: true }
]);

// 加载所有页面
await componentLoader.loadPages();

// 加载所有模态框
await componentLoader.loadModals();

// 清除缓存
componentLoader.clearCache();

// 重新加载组件
await componentLoader.reloadComponent('pages/dashboard.html');

// 检查组件是否已加载
componentLoader.isLoaded('pages/dashboard.html');

// 获取已加载的组件列表
componentLoader.getLoadedComponents();
```

## 迁移清单

逐步将以下内容迁移到组件文件：

- [x] 顶部导航栏 → `layout/header.html`
- [x] 左侧导航栏 → `layout/sidebar.html`
- [x] 页脚 → `layout/footer.html`
- [x] Dashboard 页面 → `pages/dashboard.html`
- [x] 监听器页面 → `pages/listeners.html`
- [x] 任务页面 → `pages/tasks.html`
- [ ] Beacon 页面 → `pages/beacons.html`（需要拆分子页面）
- [ ] AI 页面 → `pages/ai.html`
- [ ] 自动编排页面 → `pages/automation.html`
- [ ] 客户端生成页面 → `pages/client.html`
- [ ] 系统管理页面 → `pages/system.html`
- [x] 控制台模态框 → `modals/console.html`
- [x] HVNC全屏模态框 → `modals/hvnc-fullscreen.html`
- [ ] 文件管理模态框 → `modals/file-manager.html`
- [ ] 其他模态框...

## 注意事项

1. **ID唯一性**：确保组件中的元素ID在整个页面中唯一
2. **脚本作用域**：组件内的脚本在全局作用域执行
3. **加载顺序**：布局组件应先于页面组件加载
4. **事件绑定**：推荐使用全局函数（`window.xxx`）或事件委托
5. **缓存管理**：开发时可调用 `clearCache()` 强制刷新

## 常见问题

### Q: 组件加载失败怎么办？

A: 检查浏览器控制台，确认：
- 组件文件路径正确
- 服务器支持静态文件访问
- 无跨域问题

### Q: 如何调试组件？

A: 使用浏览器开发者工具：
```javascript
// 查看已加载的组件
console.log(componentLoader.getLoadedComponents());

// 强制重新加载
await componentLoader.reloadComponent('pages/dashboard.html');
```

### Q: 如何添加新组件？

1. 在 `components/` 目录下创建HTML文件
2. 使用 `loadComponent()` 加载
3. 如果是新页面，在 `page-registry.js` 中注册
