# Visual Studio Code

## 简介

Visual Studio Code (VS Code) 是微软开发的一款免费、开源、跨平台的代码编辑器，支持几乎所有主流编程语言。

### 特点

- **轻量快速** - 启动速度快，占用资源少
- **跨平台** - 支持 Windows、Linux、macOS
- **丰富的扩展** - 海量插件生态系统
- **智能提示** - IntelliSense 代码补全
- **内置 Git** - 集成版本控制
- **调试功能** - 强大的调试工具

## 安装

### 下载安装

访问 [官网](https://code.visualstudio.com/) 下载对应平台的安装包。

### 命令行安装

```bash
# macOS (使用 Homebrew)
brew install --cask visual-studio-code

# Ubuntu/Debian
sudo snap install code --classic

# Windows (使用 Chocolatey)
choco install vscode
```

## 基本使用

### 快捷键

#### 通用快捷键

- `Cmd/Ctrl + P` - 快速打开文件
- `Cmd/Ctrl + Shift + P` - 命令面板
- `Cmd/Ctrl + B` - 切换侧边栏
- `Cmd/Ctrl + J` - 切换终端
- `Cmd/Ctrl + ,` - 打开设置

#### 编辑快捷键

- `Cmd/Ctrl + X` - 剪切行
- `Cmd/Ctrl + C` - 复制行
- `Cmd/Ctrl + V` - 粘贴
- `Cmd/Ctrl + Z` - 撤销
- `Cmd/Ctrl + Shift + Z` - 重做
- `Alt + ↑/↓` - 移动行
- `Shift + Alt + ↑/↓` - 复制行
- `Cmd/Ctrl + /` - 切换注释
- `Cmd/Ctrl + D` - 选择下一个相同内容

#### 多光标编辑

- `Alt + Click` - 添加光标
- `Cmd/Ctrl + Alt + ↑/↓` - 在上/下添加光标
- `Cmd/Ctrl + Shift + L` - 选择所有匹配项

#### 搜索和替换

- `Cmd/Ctrl + F` - 查找
- `Cmd/Ctrl + H` - 替换
- `Cmd/Ctrl + Shift + F` - 全局搜索
- `Cmd/Ctrl + Shift + H` - 全局替换

#### 导航

- `Cmd/Ctrl + G` - 跳转到行
- `Cmd/Ctrl + Shift + O` - 跳转到符号
- `F12` - 跳转到定义
- `Alt + F12` - 查看定义
- `Shift + F12` - 查看引用

## 必备插件

### 通用插件

#### Chinese (Simplified) Language Pack
中文语言包，汉化界面。

#### Prettier - Code formatter
代码格式化工具，支持多种语言。

```json
// settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

#### ESLint
JavaScript/TypeScript 代码检查工具。

#### GitLens
增强 Git 功能，显示代码作者、提交历史等。

#### Path Intellisense
路径自动补全。

#### Auto Rename Tag
自动重命名配对的 HTML/XML 标签。

#### Bracket Pair Colorizer 2
给括号添加颜色，便于识别。

#### indent-rainbow
给缩进添加颜色。

#### TODO Highlight
高亮显示 TODO、FIXME 等注释。

#### Better Comments
增强注释显示效果。

### 前端开发

#### Live Server
启动本地开发服务器，支持热重载。

#### HTML CSS Support
HTML 中的 CSS 类名智能提示。

#### JavaScript (ES6) code snippets
ES6 代码片段。

#### Vue Language Features (Volar)
Vue 3 官方插件。

#### ES7+ React/Redux/React-Native snippets
React 代码片段。

### 后端开发

#### Java Extension Pack
Java 开发工具包。

#### Spring Boot Extension Pack
Spring Boot 开发工具包。

#### Python
Python 开发支持。

#### C#
C# 开发支持。

#### REST Client
在 VS Code 中测试 REST API。

### 数据库

#### SQLTools
数据库管理工具，支持多种数据库。

#### MongoDB for VS Code
MongoDB 数据库管理。

### 其他工具

#### Docker
Docker 容器管理。

#### Remote - SSH
通过 SSH 连接远程服务器。

#### Remote - Containers
在容器中开发。

#### Markdown All in One
Markdown 编辑增强。

#### Draw.io Integration
在 VS Code 中绘制流程图。

## 配置

### settings.json

```json
{
  // 编辑器设置
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  
  // 文件设置
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true
  },
  
  // 终端设置
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.shell.osx": "/bin/zsh",
  
  // 工作台设置
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.startupEditor": "none",
  
  // Git 设置
  "git.autofetch": true,
  "git.confirmSync": false,
  
  // 语言特定设置
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### keybindings.json

```json
[
  {
    "key": "cmd+shift+d",
    "command": "editor.action.copyLinesDownAction"
  },
  {
    "key": "cmd+shift+k",
    "command": "editor.action.deleteLines"
  }
]
```

## 代码片段

### 创建自定义代码片段

`Cmd/Ctrl + Shift + P` → `Preferences: Configure User Snippets`

#### JavaScript 代码片段示例

```json
{
  "Console Log": {
    "prefix": "clg",
    "body": [
      "console.log('$1', $1);"
    ],
    "description": "Console log"
  },
  "Arrow Function": {
    "prefix": "af",
    "body": [
      "const $1 = ($2) => {",
      "  $3",
      "};"
    ],
    "description": "Arrow function"
  },
  "Try Catch": {
    "prefix": "tryc",
    "body": [
      "try {",
      "  $1",
      "} catch (error) {",
      "  console.error(error);",
      "}"
    ],
    "description": "Try catch block"
  }
}
```

## 调试

### launch.json 配置

#### Node.js 调试

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/app.js"
    }
  ]
}
```

#### Chrome 调试

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## 工作区

### 多根工作区

创建 `.code-workspace` 文件：

```json
{
  "folders": [
    {
      "path": "frontend"
    },
    {
      "path": "backend"
    }
  ],
  "settings": {
    "editor.fontSize": 14
  }
}
```

## 终端

### 集成终端

- `Cmd/Ctrl + `` - 打开/关闭终端
- `Cmd/Ctrl + Shift + `` - 新建终端
- `Cmd/Ctrl + \` - 拆分终端

### 任务自动化

创建 `.vscode/tasks.json`：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "npm start",
      "type": "shell",
      "command": "npm start",
      "problemMatcher": []
    },
    {
      "label": "npm build",
      "type": "shell",
      "command": "npm run build",
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

## 主题推荐

- **One Dark Pro** - Atom 风格暗色主题
- **Dracula Official** - 流行的暗色主题
- **Material Theme** - Material Design 风格
- **Night Owl** - 适合夜间编码
- **GitHub Theme** - GitHub 风格主题

## 图标主题推荐

- **Material Icon Theme** - Material Design 图标
- **vscode-icons** - 丰富的文件图标

## 最佳实践

1. **使用工作区** - 为不同项目创建工作区配置
2. **善用代码片段** - 提高编码效率
3. **配置格式化** - 保存时自动格式化代码
4. **使用 Git 集成** - 在编辑器内完成版本控制
5. **学习快捷键** - 提高操作效率
6. **定期更新插件** - 保持工具最新状态
7. **备份配置** - 使用 Settings Sync 同步配置

## 性能优化

### 禁用不需要的插件

定期检查并禁用不常用的插件。

### 排除文件监控

```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true
  }
}
```

### 限制搜索范围

```json
{
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
```

## 总结

VS Code 是一款功能强大、高度可定制的代码编辑器：

- ✅ 免费开源
- ✅ 跨平台支持
- ✅ 丰富的插件生态
- ✅ 强大的调试功能
- ✅ 活跃的社区支持

掌握 VS Code 可以大大提高开发效率。

## 参考资源

- [VS Code 官网](https://code.visualstudio.com/)
- [VS Code 文档](https://code.visualstudio.com/docs)
- [插件市场](https://marketplace.visualstudio.com/)
- [快捷键参考](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
