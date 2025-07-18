---
title: 💻 VSCode 开发环境配置完全指南
description: Visual Studio Code 编辑器的详细配置指南，包括插件推荐、设置优化、团队协作、调试配置等最佳实践，提升开发效率
outline: deep
---

# 💻 VSCode 开发环境配置完全指南

> Visual Studio Code 是一款轻量级但功能强大的代码编辑器，广泛应用于前端开发，通过合理配置可以显著提升开发效率。

<details>
<summary>📋 目录导航</summary>

- [编辑器概述](#编辑器概述)
- [基础配置](#基础配置)
- [插件生态](#插件生态)
- [团队协作配置](#团队协作配置)
- [调试配置](#调试配置)
- [快捷键与工作流](#快捷键与工作流)
- [代码片段配置](#代码片段配置)
- [主题与外观](#主题与外观)
- [性能优化](#性能优化)
- [故障排除](#故障排除)

</details>

## 🎯 编辑器概述

### 核心特性

| 特性 | 描述 | 优势 |
|------|------|------|
| **⚡ 轻量级** | 启动快速，占用内存小 | 高效的开发体验 |
| **🔧 丰富插件** | 强大的插件生态系统 | 可扩展性强 |
| **🧠 智能提示** | IntelliSense 代码补全 | 提升编码效率 |
| **🖥️ 集成终端** | 内置终端支持 | 一站式开发环境 |
| **🔄 版本控制** | 内置 Git 集成 | 无缝版本管理 |
| **🐛 调试支持** | 强大的调试功能 | 高效问题定位 |

::: tip 💡 强烈建议
VSCode 是轻量级 IDE，性能好，占用内存小，广泛用于前端开发中。项目一般都有统一的代码风格，建议团队开发先配置好 ESLint、Prettier，把配置共享给其他同事，共用相同代码风格配置更利于项目开发、维护。
:::

**官网地址**: [https://code.visualstudio.com/](https://code.visualstudio.com/)

### 系统要求

| 操作系统 | 最低版本 | 推荐配置 |
|----------|----------|----------|
| **Windows** | Windows 10 | Windows 11 + 16GB RAM |
| **macOS** | macOS 10.15 | macOS 13+ + 16GB RAM |
| **Linux** | Ubuntu 18.04 | Ubuntu 22.04+ + 16GB RAM |

## ⚙️ 基础配置

### 用户设置配置

VSCode 配置分为**用户配置**和**项目配置**：

- **用户配置**：被所有项目使用，配置文件保存在用户目录
- **项目配置**：单个项目使用，优先级更高，保存在 `.vscode/settings.json`

#### 推荐用户配置

```json
{
  // ===== 编辑器基础设置 =====
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.5,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.wordWrap": "on",
  "editor.wordWrapColumn": 100,
  "editor.rulers": [80, 100, 120],
  
  // ===== 智能提示与补全 =====
  "editor.quickSuggestions": {
    "other": true,
    "comments": true,
    "strings": true
  },
  "editor.quickSuggestionsDelay": 0,
  "editor.suggestSelection": "first",
  "editor.tabCompletion": "on",
  "editor.acceptSuggestionOnCommitCharacter": true,
  "editor.acceptSuggestionOnEnter": "on",
  
  // ===== 代码格式化 =====
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.formatOnType": false,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true,
    "source.organizeImports": true,
    "source.removeUnusedImports": true
  },
  
  // ===== 文件与文件夹 =====
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.trimFinalNewlines": true,
  "files.insertFinalNewline": true,
  "files.encoding": "utf8",
  "files.eol": "\n",
  "files.associations": {
    "*.vue": "vue",
    "*.wxml": "html",
    "*.wxss": "css",
    "*.wxs": "javascript",
    ".env*": "properties"
  },
  
  // ===== 搜索与文件排除 =====
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true,
    "**/.DS_Store": true,
    "**/coverage": true,
    "**/*.min.js": true,
    "**/*.min.css": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/coverage": true,
    "**/*.min.js": true,
    "**/*.min.css": true
  },
  
  // ===== 工作台外观 =====
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.startupEditor": "welcomePage",
  "workbench.statusBar.visible": true,
  "workbench.activityBar.visible": true,
  "workbench.sideBar.location": "left",
  "workbench.tree.indent": 12,
  "workbench.tree.renderIndentGuides": "always",
  "window.zoomLevel": 0,
  "window.autoDetectHighContrast": false,
  
  // ===== 终端配置 =====
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "'Fira Code', 'Cascadia Code', monospace",
  "terminal.integrated.copyOnSelection": true,
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.linux": "bash",
  
  // ===== 编程语言特定设置 =====
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.maxTokenizationLineLength": 2500
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.maxTokenizationLineLength": 2500
  },
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "yzhang.markdown-all-in-one",
    "editor.wordWrap": "on",
    "editor.quickSuggestions": {
      "comments": "off",
      "strings": "off",
      "other": "off"
    }
  },
  
  // ===== Git 配置 =====
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "git.autofetch": true,
  "git.showPushSuccessNotification": true,
  "git.ignoreLimitWarning": true,
  
  // ===== Emmet 配置 =====
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact",
    "vue-html": "html"
  },
  "emmet.showSuggestionsAsSnippets": true,
  "emmet.triggerExpansionOnTab": true,
  
  // ===== 性能优化 =====
  "editor.semanticHighlighting.enabled": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.minimap.enabled": true,
  "editor.minimap.maxColumn": 120,
  "editor.renderWhitespace": "boundary",
  "editor.renderControlCharacters": false,
  "extensions.ignoreRecommendations": false,
  "telemetry.telemetryLevel": "off"
}
```

### 项目配置示例

#### 前端项目配置 (.vscode/settings.json)

```json
{
  // 项目特定的格式化设置
  "prettier.printWidth": 100,
  "prettier.singleQuote": true,
  "prettier.semi": true,
  "prettier.trailingComma": "es5",
  "prettier.tabWidth": 2,
  "prettier.useTabs": false,
  
  // TypeScript 配置
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  
  // ESLint 配置
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "eslint.workingDirectories": ["./"],
  
  // 调试配置
  "debug.inlineValues": true,
  "debug.openDebug": "openOnDebugBreak",
  
  // 项目特定的文件关联
  "files.associations": {
    "*.env.example": "properties",
    "*.config.js": "javascript"
  }
}
```

## 🔌 插件生态

### 必装插件 (Core Extensions)

#### 基础开发工具

```bash
# 一键安装命令
code --install-extension ms-ceintl.vscode-language-pack-zh-hans
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension formulahendry.auto-rename-tag
code --install-extension formulahendry.auto-close-tag
```

| 插件名称 | 功能描述 | 重要性 |
|----------|----------|--------|
| **Chinese Language Pack** | 中文语言包 | ⭐⭐⭐⭐⭐ |
| **Prettier** | 代码格式化工具 | ⭐⭐⭐⭐⭐ |
| **ESLint** | JavaScript/TypeScript 代码检查 | ⭐⭐⭐⭐⭐ |
| **Auto Rename Tag** | 自动重命名配对标签 | ⭐⭐⭐⭐⭐ |
| **Auto Close Tag** | 自动闭合 HTML/XML 标签 | ⭐⭐⭐⭐⭐ |

#### 前端框架支持

```bash
# Vue 生态
code --install-extension Vue.volar
code --install-extension Vue.vscode-typescript-vue-plugin

# React 生态
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss

# Angular 生态
code --install-extension Angular.ng-template
```

#### 开发效率工具

```bash
# 路径与智能提示
code --install-extension christian-kohler.path-intellisense
code --install-extension christian-kohler.npm-intellisense

# Git 工具
code --install-extension eamodio.gitlens
code --install-extension donjayamanne.githistory

# 调试与测试
code --install-extension ms-vscode.vscode-json
code --install-extension humao.rest-client
```

### 插件分类详解

#### 🎨 主题与图标

```json
{
  "recommendations": [
    "PKief.material-icon-theme",      // Material 图标主题
    "zhuangtongfa.material-theme",    // One Dark Pro 主题
    "dracula-theme.theme-dracula",    // Dracula 主题
    "monokai.theme-monokai-pro-vscode" // Monokai Pro 主题
  ]
}
```

#### 🔧 代码质量工具

```json
{
  "recommendations": [
    "stylelint.vscode-stylelint",     // CSS/SCSS 代码检查
    "ms-vscode.vscode-typescript-next", // TypeScript 增强
    "usernamehw.errorlens",           // 错误信息显示增强
    "streetsidesoftware.code-spell-checker" // 拼写检查
  ]
}
```

#### 🚀 生产力工具

```json
{
  "recommendations": [
    "alefragnani.bookmarks",          // 代码书签
    "alefragnani.project-manager",    // 项目管理
    "gruntfuggly.todo-tree",         // TODO 高亮
    "aaron-bond.better-comments",     // 注释增强
    "ms-vscode.live-server",         // 实时预览服务器
    "ritwickdey.liveserver"          // Live Server
  ]
}
```

#### 🐛 调试与测试

```json
{
  "recommendations": [
    "ms-vscode.vscode-jest",          // Jest 测试支持
    "hbenl.vscode-test-explorer",     // 测试资源管理器
    "ms-playwright.playwright",      // Playwright 支持
    "cypress-io.cypress-snippets"    // Cypress 代码片段
  ]
}
```

### 团队插件配置

#### .vscode/extensions.json

```json
{
  "recommendations": [
    // 必装插件
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "Vue.volar",
    "PKief.material-icon-theme",
    "eamodio.gitlens",
    
    // 开发效率
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "formulahendry.auto-close-tag",
    "bradlc.vscode-tailwindcss",
    
    // 代码质量
    "stylelint.vscode-stylelint",
    "usernamehw.errorlens",
    "streetsidesoftware.code-spell-checker",
    
    // 团队协作
    "ms-vsliveshare.vsliveshare",
    "alefragnani.project-manager",
    "gruntfuggly.todo-tree"
  ],
  "unwantedRecommendations": [
    "hookyqr.beautify",
    "ms-vscode.vscode-typescript-tslint-plugin"
  ]
}
```

## 👥 团队协作配置

### 工作空间配置

#### .vscode/settings.json (团队共享)

```json
{
  // 统一的代码风格
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  
  // 统一的格式化工具
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  
  // 项目特定的设置
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "vue-html": "html"
  },
  
  // 文件关联
  "files.associations": {
    "*.env.*": "properties"
  },
  
  // 排除文件
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.env.local": true
  }
}
```

### 任务配置

#### .vscode/tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "npm: dev",
      "type": "npm",
      "script": "dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": ["$eslint-stylish"]
    },
    {
      "label": "npm: build",
      "type": "npm",
      "script": "build",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "silent",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "npm: test",
      "type": "npm",
      "script": "test",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "ESLint: Fix All",
      "type": "shell",
      "command": "npx",
      "args": ["eslint", ".", "--fix"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

## 🐛 调试配置

### JavaScript/TypeScript 调试

#### .vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "name": "Attach to Chrome",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}/src"
    },
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    },
    {
      "name": "Debug Vite Dev",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["--debug"],
      "console": "integratedTerminal",
      "env": {
        "DEBUG": "*vite*"
      }
    }
  ]
}
```

### Vue.js 调试配置

```json
{
  "name": "Debug Vue.js",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}/src",
  "breakOnLoad": true,
  "sourceMapPathOverrides": {
    "webpack:///./src/*": "${webRoot}/*"
  },
  "userDataDir": "${workspaceFolder}/.vscode/chrome-debug-user-data",
  "runtimeArgs": [
    "--disable-web-security",
    "--disable-features=VizDisplayCompositor"
  ]
}
```

## ⌨️ 快捷键与工作流

### 核心快捷键

#### 编辑操作

| 快捷键 | 功能 | 类别 |
|--------|------|------|
| `Ctrl+D` | 选择下一个匹配项 | 编辑 |
| `Ctrl+Shift+L` | 选择所有匹配项 | 编辑 |
| `Alt+Click` | 多光标编辑 | 编辑 |
| `Ctrl+Shift+K` | 删除当前行 | 编辑 |
| `Ctrl+Enter` | 在下方插入新行 | 编辑 |
| `Ctrl+Shift+Enter` | 在上方插入新行 | 编辑 |
| `Alt+↑/↓` | 移动行 | 编辑 |
| `Shift+Alt+↑/↓` | 复制行 | 编辑 |

#### 导航操作

| 快捷键 | 功能 | 类别 |
|--------|------|------|
| `Ctrl+P` | 快速打开文件 | 导航 |
| `Ctrl+Shift+P` | 命令面板 | 导航 |
| `Ctrl+G` | 跳转到行 | 导航 |
| `Ctrl+Shift+O` | 跳转到符号 | 导航 |
| `F12` | 跳转到定义 | 导航 |
| `Alt+F12` | 查看定义 | 导航 |
| `Shift+F12` | 查看引用 | 导航 |
| `Ctrl+T` | 显示所有符号 | 导航 |

#### 面板操作

| 快捷键 | 功能 | 类别 |
|--------|------|------|
| `Ctrl+B` | 切换侧边栏 | 面板 |
| `Ctrl+J` | 切换面板 | 面板 |
| `Ctrl+Shift+E` | 显示资源管理器 | 面板 |
| `Ctrl+Shift+F` | 显示搜索 | 面板 |
| `Ctrl+Shift+G` | 显示源代码管理 | 面板 |
| `Ctrl+Shift+D` | 显示运行和调试 | 面板 |
| `Ctrl+Shift+X` | 显示扩展 | 面板 |

### 自定义快捷键

#### keybindings.json

```json
[
  {
    "key": "ctrl+shift+i",
    "command": "editor.action.formatDocument"
  },
  {
    "key": "ctrl+k ctrl+0",
    "command": "workbench.action.closeAllEditors"
  },
  {
    "key": "ctrl+k ctrl+w",
    "command": "workbench.action.closeEditorsInGroup"
  },
  {
    "key": "ctrl+alt+n",
    "command": "explorer.newFile"
  },
  {
    "key": "ctrl+alt+shift+n",
    "command": "explorer.newFolder"
  },
  {
    "key": "ctrl+shift+c",
    "command": "copyFilePath"
  },
  {
    "key": "ctrl+k ctrl+shift+c",
    "command": "copyRelativeFilePath"
  }
]
```

## 📝 代码片段配置

### Vue.js 代码片段

```json
{
  "Vue3 Composition API Component": {
    "prefix": "vue3-comp",
    "body": [
      "<template>",
      "  <div class=\"${1:component-name}\">",
      "    $0",
      "  </div>",
      "</template>",
      "",
      "<script setup lang=\"ts\">",
      "import { ref, reactive, computed, onMounted } from 'vue'",
      "",
      "// Props",
      "interface Props {",
      "  ${2:propName}: ${3:string}",
      "}",
      "",
      "const props = withDefaults(defineProps<Props>(), {",
      "  ${2:propName}: '${4:defaultValue}'",
      "})",
      "",
      "// Emits",
      "const emit = defineEmits<{",
      "  ${5:eventName}: [value: ${6:string}]",
      "}>",
      "",
      "// Reactive data",
      "const ${7:data} = ref(${8:''})",
      "",
      "// Lifecycle",
      "onMounted(() => {",
      "  ${9:// Component mounted}",
      "})",
      "</script>",
      "",
      "<style scoped lang=\"${10:scss}\">",
      ".${1:component-name} {",
      "  ${11:// Component styles}",
      "}",
      "</style>"
    ],
    "description": "Vue 3 Composition API 组件模板"
  },
  
  "TypeScript Interface": {
    "prefix": "tsi",
    "body": [
      "interface ${1:InterfaceName} {",
      "  ${2:property}: ${3:string}",
      "  $0",
      "}"
    ],
    "description": "TypeScript 接口定义"
  },
  
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react'",
      "",
      "interface ${1:ComponentName}Props {",
      "  ${2:prop}: ${3:string}",
      "}",
      "",
      "export const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({",
      "  ${2:prop}",
      "}) => {",
      "  return (",
      "    <div className=\"${4:className}\">",
      "      $0",
      "    </div>",
      "  )",
      "}",
      "",
      "export default ${1:ComponentName}"
    ],
    "description": "React 函数组件模板"
  },
  
  "Console Log": {
    "prefix": "cl",
    "body": "console.log('$1:', $1)$0",
    "description": "快速 console.log"
  },
  
  "Try Catch Block": {
    "prefix": "try",
    "body": [
      "try {",
      "  $1",
      "} catch (error) {",
      "  console.error('${2:Error message}:', error)",
      "  $0",
      "}"
    ],
    "description": "Try-catch 错误处理"
  }
}
```

### CSS 代码片段

```json
{
  "Flexbox Center": {
    "prefix": "flex-center",
    "body": [
      "display: flex;",
      "justify-content: center;",
      "align-items: center;"
    ],
    "description": "Flexbox 居中布局"
  },
  
  "Grid Layout": {
    "prefix": "grid",
    "body": [
      "display: grid;",
      "grid-template-columns: ${1:repeat(auto-fit, minmax(200px, 1fr))};",
      "gap: ${2:16px};"
    ],
    "description": "CSS Grid 布局"
  },
  
  "Media Query": {
    "prefix": "mq",
    "body": [
      "@media (${1:min-width}: ${2:768px}) {",
      "  $0",
      "}"
    ],
    "description": "媒体查询"
  }
}
```

## 🎨 主题与外观

### 推荐主题

#### 暗色主题

| 主题名称 | 特点 | 适用场景 |
|----------|------|----------|
| **One Dark Pro** | 优雅的暗色主题 | 长时间编码 |
| **Dracula** | 高对比度暗色主题 | 夜间开发 |
| **Material Theme** | Google Material 风格 | 现代化界面 |
| **Monokai Pro** | 专业暗色主题 | 专业开发 |

#### 亮色主题

| 主题名称 | 特点 | 适用场景 |
|----------|------|----------|
| **Light+** | 默认亮色主题 | 白天开发 |
| **GitHub Light** | GitHub 风格主题 | Web 开发 |
| **Quiet Light** | 柔和亮色主题 | 长时间阅读 |

### 字体推荐

```json
{
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Source Code Pro', Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.fontSize": 14,
  "editor.lineHeight": 1.5
}
```

#### 字体特性对比

| 字体 | 连字符 | 可读性 | 特点 |
|------|--------|--------|------|
| **Fira Code** | ✅ | ⭐⭐⭐⭐⭐ | 开源，连字符丰富 |
| **Cascadia Code** | ✅ | ⭐⭐⭐⭐⭐ | 微软开发，现代设计 |
| **JetBrains Mono** | ✅ | ⭐⭐⭐⭐ | 专为开发者设计 |
| **Source Code Pro** | ❌ | ⭐⭐⭐⭐ | Adobe 开源字体 |

## ⚡ 性能优化

### 提升启动速度

```json
{
  // 禁用不必要的功能
  "extensions.autoCheckUpdates": false,
  "extensions.autoUpdate": false,
  "telemetry.telemetryLevel": "off",
  "update.mode": "manual",
  
  // 优化编辑器性能
  "editor.semanticHighlighting.enabled": false,
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.renderControlCharacters": false,
  
  // 文件监控优化
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.git/**": true
  }
}
```

### 内存优化

```json
{
  // 限制工作进程
  "typescript.preferences.maxTsServerMemory": 3072,
  "typescript.suggest.autoImports": false,
  
  // 搜索优化
  "search.followSymlinks": false,
  "search.maxResults": 2000,
  
  // Git 优化
  "git.autofetch": false,
  "git.decorations.enabled": false
}
```

### 大型项目优化

```json
{
  // 文件排除优化
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true,
    "**/coverage": true,
    "**/*.min.js": true,
    "**/*.map": true
  },
  
  // TypeScript 项目优化
  "typescript.disableAutomaticTypeAcquisition": true,
  "typescript.surveys.enabled": false,
  
  // 编辑器限制
  "editor.maxTokenizationLineLength": 20000,
  "editor.largeFileOptimizations": true
}
```

## 📁 EditorConfig 配置

### 统一代码风格

```ini
# .editorconfig - 团队代码风格统一配置
root = true

# 所有文件的默认设置
[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
max_line_length = 100

# JavaScript/TypeScript 文件
[*.{js,jsx,ts,tsx,vue}]
indent_size = 2
quote_type = single

# HTML 文件
[*.{html,htm}]
indent_size = 2

# CSS/SCSS/LESS 文件
[*.{css,scss,less,styl}]
indent_size = 2

# JSON 文件
[*.{json,jsonc}]
indent_size = 2

# YAML 文件
[*.{yml,yaml}]
indent_size = 2

# Markdown 文件
[*.md]
trim_trailing_whitespace = false
max_line_length = off

# Python 文件
[*.py]
indent_size = 4

# Makefile
[Makefile]
indent_style = tab

# 配置文件
[*.{config,conf}]
indent_size = 4

# 特定项目文件
[{package.json,.travis.yml}]
indent_size = 2
```

## 🔧 故障排除

### 常见问题解决

#### 插件冲突解决

```bash
# 1. 重置插件设置
code --disable-extensions

# 2. 清除缓存
# Windows
rm -rf %APPDATA%/Code/User/workspaceStorage
# macOS
rm -rf ~/Library/Application\ Support/Code/User/workspaceStorage
# Linux
rm -rf ~/.config/Code/User/workspaceStorage

# 3. 重新启用插件
code --list-extensions
```

#### 格式化问题

```json
{
  // 重置格式化配置
  "editor.defaultFormatter": null,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  // 解决格式化冲突
  "prettier.requireConfig": true,
  "prettier.configPath": ".prettierrc"
}
```

#### TypeScript 智能提示失效

```json
{
  // 重启 TypeScript 服务
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### 性能问题诊断

```bash
# 1. 查看扩展性能
code --inspect-extensions

# 2. 生成性能日志
code --prof-modules

# 3. 分析启动时间
code --inspect-brk=9229
```

## 📚 最佳实践总结

### 开发环境配置清单

```markdown
## ✅ VSCode 配置清单

### 基础配置
- [ ] 安装中文语言包
- [ ] 配置用户设置
- [ ] 设置默认终端
- [ ] 配置字体和主题
- [ ] 启用自动保存

### 代码质量
- [ ] 安装 ESLint 插件
- [ ] 安装 Prettier 插件
- [ ] 配置格式化规则
- [ ] 设置保存时自动格式化
- [ ] 配置 EditorConfig

### 团队协作
- [ ] 创建 .vscode/settings.json
- [ ] 配置 .vscode/extensions.json
- [ ] 设置 .vscode/tasks.json
- [ ] 配置调试设置
- [ ] 统一代码片段

### 性能优化
- [ ] 排除不必要文件
- [ ] 限制内存使用
- [ ] 禁用遥测数据
- [ ] 优化搜索设置
```

### 团队配置建议

| 配置项 | 建议 | 原因 |
|--------|------|------|
| **代码格式化** | 统一使用 Prettier | 避免格式冲突 |
| **代码检查** | 统一 ESLint 配置 | 保证代码质量 |
| **插件管理** | 使用 extensions.json | 团队插件一致 |
| **调试配置** | 共享 launch.json | 统一调试环境 |
| **任务配置** | 配置 tasks.json | 简化开发流程 |

## 📖 参考资源

### 官方文档
- [VSCode 官方文档](https://code.visualstudio.com/docs)
- [VSCode API 参考](https://code.visualstudio.com/api)
- [插件市场](https://marketplace.visualstudio.com/)

### 配置指南
- [VSCode 设置同步](https://code.visualstudio.com/docs/editor/settings-sync)
- [调试配置](https://code.visualstudio.com/docs/editor/debugging)
- [任务配置](https://code.visualstudio.com/docs/editor/tasks)

### 社区资源
- [Awesome VSCode](https://github.com/viatsko/awesome-vscode)
- [VSCode Tips](https://github.com/microsoft/vscode-tips-and-tricks)
- [插件开发指南](https://code.visualstudio.com/api/get-started/your-first-extension)

---

> 💡 **提示**：VSCode 的强大之处在于其可扩展性和可定制性。通过合理配置，可以打造一个高效、舒适的开发环境，显著提升开发效率。
