# InlineExecute PE 前端功能使用指南

## 🎯 功能概述

在Cerberus C2平台的"进阶渗透工具"页面新增了**InlineExecute PE**功能模块，允许用户通过Web界面选择本地PE文件（.exe或.dll），并将其传输到指定的Beacon在内存中执行。

## 📍 功能位置

**路径**: Beacon → 进阶渗透 → InlineExecute PE

**页面标识**: 橙色图标 🧠 (内存符号)

## 🎨 UI功能

### 1. 功能入口卡片

位于"进阶渗透工具"网格中，特征：
- **图标**: 橙色内存图标 (`fas fa-memory`)
- **标题**: InlineExecute PE
- **描述**: 内存加载执行PE文件
- **背景色**: 橙色渐变 (`bg-orange-500/20`)

### 2. 模态对话框

点击功能卡片后弹出对话框，包含以下区域：

#### 顶部标题栏
- 橙色内存图标
- 标题: "InlineExecute PE"
- 副标题: "在内存中加载并执行PE文件"
- 关闭按钮

#### Beacon信息区
显示目标Beacon的关键信息：
- Beacon名称和IP地址
- 操作系统和架构（x86/x64）
- 样式：灰色背景卡片

#### PE文件选择区
支持两种上传方式：

**方式1: 点击选择**
- 点击虚线框区域
- 打开系统文件选择对话框
- 选择 .exe 或 .dll 文件

**方式2: 拖拽上传**
- 直接拖拽PE文件到虚线框
- 悬停时边框变为橙色
- 松开鼠标完成选择

文件选择后显示：
- 文件图标（橙色）
- 文件名
- 文件大小（自动格式化）
- 删除按钮（红色×）

#### 参数输入区
- 输入框：接受命令行参数
- 占位符：`例如: -flag value --verbose`
- 提示：参数将传递给PE的入口点函数

#### 执行信息区
蓝色信息卡片，展示：
- **执行方式**: 内存加载 (InlineExecute)
- **超时时间**: 30秒
- **磁盘落地**: ❌ 否
- **创建进程**: ❌ 否

#### 警告提示区
黄色警告卡片，包含：
- PE文件架构必须与Beacon一致
- 执行可能触发杀软告警
- 建议先在测试环境验证

#### 底部操作栏
- **取消按钮**: 灰色，关闭对话框
- **执行PE按钮**: 橙色，发起执行请求

## 🔄 操作流程

### 步骤1: 选择目标Beacon

1. 进入"Beacon → 进阶渗透"页面
2. 在页面顶部选择器中选择目标Beacon
3. 确认Beacon状态为"在线"

### 步骤2: 打开InlineExecute PE

1. 点击"InlineExecute PE"功能卡片
2. 验证弹出对话框中的Beacon信息是否正确

### 步骤3: 选择PE文件

**点击上传**:
```
点击虚线框 → 选择文件 → 确认
```

**拖拽上传**:
```
拖拽PE文件 → 悬停在虚线框 → 松开鼠标
```

### 步骤4: 输入参数（可选）

如果PE文件需要命令行参数，在参数输入框中填写：
```
例如: -flag1 value1 --verbose
例如: privilege::debug sekurlsa::logonpasswords
```

### 步骤5: 执行

1. 检查所有信息是否正确
2. 点击"执行PE"按钮
3. 系统自动：
   - 读取PE文件
   - 验证PE格式（MZ头）
   - Base64编码
   - 发送到服务端
   - 创建执行任务

### 步骤6: 查看结果

执行成功后：
- 显示Toast提示：任务已创建 + Task ID
- 可选择跳转到Beacon控制台查看执行结果

## 🛡️ 安全验证

### 前端验证

1. **文件类型验证**
   - 仅允许 .exe 和 .dll 文件
   - 其他文件类型将被拒绝

2. **文件大小验证**
   - 最大限制: 50MB
   - 超过限制将提示错误

3. **PE格式验证**
   - 检查MZ头（0x4D 0x5A）
   - 无效格式将被拒绝

4. **Beacon状态验证**
   - 确保Beacon存在
   - 确保Beacon在线

### 后端验证

- AES解密
- Base64解码
- 完整PE结构验证
- 架构匹配检查
- 超时保护（30秒）

## 📊 数据流

```
用户选择PE文件
    ↓
前端读取文件 (FileReader API)
    ↓
验证PE格式 (MZ头检查)
    ↓
Base64编码
    ↓
构建JSON参数
    ↓
POST /api/beacons/{id}/execute
    ↓
服务端接收
    ↓
创建任务 (Task)
    ↓
Beacon轮询获取
    ↓
执行 inline_execute
    ↓
返回结果
    ↓
前端显示Toast
```

## 🎨 代码示例

### HTML结构

```html
<!-- 功能入口卡片 -->
<div class="bg-gray-800 rounded-lg p-6..." 
     onclick="window.openInlineExecutePEFromPage()">
    <div class="w-16 h-16 bg-orange-500/20...">
        <i class="fas fa-memory text-orange-400..."></i>
    </div>
    <h4>InlineExecute PE</h4>
    <p>内存加载执行PE文件</p>
</div>

<!-- 模态对话框 -->
<div id="inlineExecutePEModal"...>
    <!-- Beacon信息 -->
    <!-- 文件选择区 -->
    <!-- 参数输入 -->
    <!-- 执行信息 -->
    <!-- 操作按钮 -->
</div>
```

### JavaScript核心函数

```javascript
// 打开模态框
window.openInlineExecutePE = (beaconId) => {
    // 获取Beacon信息
    // 填充UI
    // 显示对话框
};

// 文件选择处理
peFileInput.addEventListener('change', (e) => {
    // 验证文件类型和大小
    // 显示文件信息
    // 存储文件对象
});

// 拖拽上传处理
dropZone.addEventListener('drop', (e) => {
    // 获取拖拽文件
    // 验证和显示
});

// 确认执行
window.confirmInlineExecutePE = async () => {
    // 读取文件为ArrayBuffer
    // 验证PE格式
    // Base64编码
    // 发送API请求
    // 显示结果
};
```

## 🎯 实战场景

### 场景1: 执行Mimikatz

```
1. 选择目标Beacon
2. 打开InlineExecute PE
3. 选择 mimikatz.exe
4. 参数: privilege::debug sekurlsa::logonpasswords exit
5. 点击执行
6. 查看控制台输出
```

### 场景2: 执行自定义工具

```
1. 准备好自己的PE工具（如端口扫描器）
2. 选择目标Beacon
3. 上传工具
4. 填写参数（如IP范围）
5. 执行并获取结果
```

### 场景3: 批量测试

```
1. 在多个Beacon上执行同一工具
2. 逐个选择Beacon
3. 上传相同的PE文件
4. 调整参数
5. 收集和对比结果
```

## 🐛 故障排除

### 问题1: 无法选择文件

**症状**: 点击虚线框无反应

**解决**:
- 检查浏览器控制台是否有错误
- 确认 `peFileInput` 元素存在
- 尝试刷新页面

### 问题2: 文件上传后无显示

**症状**: 文件选择后信息不显示

**解决**:
- 检查文件类型是否为 .exe 或 .dll
- 检查文件大小是否超过50MB
- 查看浏览器控制台错误信息

### 问题3: 提示PE格式无效

**症状**: 点击执行后提示"无效的PE文件格式"

**解决**:
- 确认文件确实是PE格式
- 用PE工具（如CFF Explorer）验证文件
- 检查文件是否损坏

### 问题4: 执行无结果

**症状**: 任务已创建但长时间无结果

**解决**:
- 检查Beacon是否在线
- 查看服务端日志
- 验证PE文件架构是否与Beacon匹配
- 等待超时（30秒）

## 📝 开发者备注

### 文件清单

```
static/
├── index.html          # HTML结构（模态框）
├── main.js            # JavaScript逻辑
└── style.css          # 样式（已存在）
```

### 关键函数

| 函数名 | 功能 | 位置 |
|--------|------|------|
| `openInlineExecutePEFromPage()` | 从页面调用 | main.js |
| `openInlineExecutePE(id)` | 打开模态框 | main.js |
| `closeInlineExecutePEModal()` | 关闭模态框 | main.js |
| `clearPEFile()` | 清除文件 | main.js |
| `confirmInlineExecutePE()` | 确认执行 | main.js |
| `arrayBufferToBase64()` | 编码工具 | main.js |
| `formatFileSize()` | 格式化大小 | main.js |

### 样式类

- `bg-orange-500/20` - 橙色半透明背景
- `text-orange-400` - 橙色文字
- `border-orange-500` - 橙色边框
- `hover:border-orange-500` - 悬停橙色边框

## 🚀 未来改进

- [ ] 批量上传多个PE文件
- [ ] PE文件预览和信息展示
- [ ] 执行历史记录
- [ ] 常用PE文件模板库
- [ ] 执行结果实时推送
- [ ] PE文件签名验证
- [ ] 自动检测架构匹配

## 📞 技术支持

如遇问题，请检查：
1. 浏览器控制台错误
2. 服务端日志
3. Beacon状态
4. PE文件格式

---

**版本**: 1.0  
**更新日期**: 2026-01-07  
**维护者**: Cerberus Team
