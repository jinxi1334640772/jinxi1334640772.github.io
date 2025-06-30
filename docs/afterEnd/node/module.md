---
title: Node.js 模块系统详解
description: Node.js 模块加载机制、CommonJS vs ES模块、package.json 配置和模块解析规则完整指南
outline: deep
---

# 📦 Node.js 模块系统详解

Node.js 拥有强大的模块系统，支持 CommonJS 和 ES 模块两种标准。理解模块系统对于 Node.js 开发至关重要。

::: tip 📚 本章内容
深入学习 Node.js 模块加载机制、模块类型判断、package.json 配置和最佳实践。
:::

## 🔄 模块加载器对比

Node.js 提供两个独立的模块系统来解析和加载模块：

### 📊 两种加载器特性对比

| 特性 | CommonJS 模块加载器 | ECMAScript 模块加载器 |
|------|-------------------|---------------------|
| **同步性** | 完全同步 | 异步（除非用于 require()） |
| **处理函数** | `require()` 调用 | `import` 语句和 `import()` 表达式 |
| **可修补性** | ✅ 可修补 | ❌ 不可修补，可用加载器钩子定制 |
| **文件夹支持** | ✅ 支持文件夹作为模块 | ❌ 必须完全指定目录索引 |
| **扩展名搜索** | ✅ 自动添加 .js、.json、.node | ❌ 必须提供文件扩展名 |
| **JSON 支持** | ✅ 直接支持 .json 文件 | ✅ 需要导入类型属性 |
| **文件类型** | 所有缺少扩展名的文件视为 JS | 只接受 .js、.mjs、.cjs |

### 🔧 CommonJS 模块加载器

CommonJS 加载器具有以下特点：

```javascript
// ✅ 完全同步加载
const fs = require('fs')
const path = require('path')

// ✅ 支持扩展名搜索
const myModule = require('./myModule') // 自动查找 .js、.json、.node

// ✅ 支持文件夹作为模块
const utils = require('./utils') // 查找 utils/index.js

// ✅ 可修补和扩展
require.cache // 访问模块缓存
```

**特性详解**：
- 🔄 **完全同步**：所有模块加载都是同步的
- 🛠️ **可修补**：可以修改 `require` 行为
- 📁 **文件夹支持**：支持将文件夹作为模块
- 🔍 **扩展名搜索**：自动尝试 `.js`、`.json`、`.node` 扩展名
- 📄 **JSON 支持**：将 `.json` 文件视为 JSON 文本
- 🔌 **插件支持**：`.node` 文件作为编译插件模块
- 🔄 **ES 模块兼容**：启用 `--experimental-require-module` 时可加载 ES 模块

### ⚡ ECMAScript 模块加载器

ES 模块加载器的现代化特性：

```javascript
// ✅ 静态导入
import fs from 'fs'
import { readFile } from 'fs/promises'

// ✅ 动态导入
const module = await import('./myModule.js')

// ✅ JSON 模块导入（需要类型属性）
import data from './data.json' with { type: 'json' }

// ✅ 必须指定完整路径
import utils from './utils/index.js' // 必须包含 index.js
```

**特性详解**：
- ⚡ **异步加载**：除非用于 `require()` 的模块
- 🎯 **精确路径**：不支持文件夹作为模块，必须完全指定
- 🔒 **不可修补**：使用加载器钩子进行定制
- 📝 **扩展名必需**：相对或绝对文件 URL 必须提供扩展名
- 📊 **JSON 支持**：需要导入类型属性
- 🔄 **CommonJS 兼容**：可以加载 CommonJS 模块

## 🎯 模块系统判断

Node.js 根据以下规则确定文件的模块系统：

### ✅ ES 模块判断条件

| 条件 | 说明 | 示例 |
|------|------|------|
| **扩展名 .mjs** | 明确标识为 ES 模块 | `module.mjs` |
| **package.json type: "module"** | 最近父级 package.json 设置 | `{ "type": "module" }` |
| **--input-type=module** | 命令行参数指定 | `node --input-type=module -e "import..."` |
| **语法检测** | 包含 ES 模块专有语法 | `import` 或 `export` 语句 |

### ❌ CommonJS 模块判断条件

| 条件 | 说明 | 示例 |
|------|------|------|
| **扩展名 .cjs** | 明确标识为 CommonJS | `module.cjs` |
| **package.json type: "commonjs"** | 或未设置 type 字段 | `{ "type": "commonjs" }` |
| **--input-type=commonjs** | 命令行参数指定 | `node --input-type=commonjs -e "..."` |

### 🔍 语法检测示例

```javascript
// ✅ ES 模块语法
import { readFile } from 'fs'
export const utils = {}

// ✅ CommonJS 语法  
const fs = require('fs')
module.exports = { utils: {} }

// ✅ 两者都支持的语法
const data = await import('./data.js') // 动态导入
```

## 📋 package.json 配置详解

### 🎯 基础配置

```json
{
  "name": "@my/package",
  "packageManager": "pnpm@10.6.0",
  "main": "./index.js",
  "type": "module"
}
```

### 📤 exports 字段配置

`exports` 字段提供了比 `main` 更强大的入口点控制：

```json
{
  "exports": {
    // 主入口点
    ".": "./index.js",
    
    // 条件导出
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs"
    },
    
    // 子路径导出
    "./lib": "./lib/index.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./src/feature/index.js",
    "./feature/*.js": "./feature/*.js",
    
    // 禁止导出
    "./feature/internal/*": null,
    
    // 特殊文件
    "./package.json": "./package.json",
    
    // 复杂条件导出
    "./feature.js": {
      "node": "./feature-node.js",
      "node": {
        "import": "./feature-node.mjs",
        "require": "./feature-node.cjs"
      },
      "import": "./index-module.js",
      "require": "./index-require.cjs",
      "module-sync": "./index-module-sync.cjs",
      "default": "./feature.js"
    }
  }
}
```

### 📥 imports 字段配置

用于创建包内部的私有映射：

```json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    },
    "#internal/*.js": "./src/internal/*.js"
  }
}
```

**使用示例**：
```javascript
// 在包内部使用
import '#dep' // 根据环境解析到不同模块
import '#internal/utils.js' // 映射到 ./src/internal/utils.js
```

## 🔀 条件导出详解

条件导出允许根据不同环境提供不同的模块入口：

### 📊 条件优先级

| 条件 | 优先级 | 说明 | 使用场景 |
|------|--------|------|----------|
| `node-addons` | 最高 | Node.js + 原生插件 | C++ 扩展模块 |
| `node` | 高 | Node.js 环境 | 服务端特定代码 |
| `import` | 中高 | ES 模块导入 | 现代模块语法 |
| `require` | 中高 | CommonJS 导入 | 传统模块语法 |
| `module-sync` | 中 | 同步 ES 模块 | 无顶层 await |
| `default` | 最低 | 通用回退 | 默认入口 |

### 🎯 条件导出示例

```json
{
  "exports": {
    ".": {
      "node-addons": "./native-addon.js",
      "node": {
        "import": "./node-esm.js",
        "require": "./node-cjs.js"
      },
      "import": "./esm.js",
      "require": "./cjs.js",
      "module-sync": "./sync-esm.js",
      "default": "./index.js"
    }
  }
}
```

### 🛠️ 自定义条件

```bash
# 使用自定义条件
node --conditions=development index.js
node --conditions=development,testing index.js
```

```json
{
  "exports": {
    ".": {
      "development": "./dev.js",
      "testing": "./test.js",
      "production": "./prod.js",
      "default": "./index.js"
    }
  }
}
```

## 🔄 双模块包支持

为了同时支持 CommonJS 和 ES 模块，可以创建双模块包：

### 📦 包结构示例

```
my-package/
├── package.json
├── index.js          # CommonJS 入口
├── index.mjs         # ES 模块入口
├── lib/
│   ├── common.js     # 共享代码
│   ├── esm.mjs       # ES 模块特定代码
│   └── cjs.js        # CommonJS 特定代码
```

### ⚙️ package.json 配置

```json
{
  "name": "my-dual-package",
  "main": "./index.js",
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js"
    },
    "./utils": {
      "import": "./lib/esm.mjs", 
      "require": "./lib/cjs.js"
    }
  }
}
```

### 💻 使用示例

```javascript
// CommonJS 用法
const myPackage = require('my-dual-package')
const utils = require('my-dual-package/utils')

// ES 模块用法
import myPackage from 'my-dual-package'
import { utils } from 'my-dual-package/utils'
```

## 🎯 最佳实践

### ✅ 推荐做法

1. **明确模块类型**
   ```json
   {
     "type": "module",  // 明确指定模块类型
     "exports": {       // 使用 exports 而非 main
       ".": "./index.js"
     }
   }
   ```

2. **提供条件导出**
   ```json
   {
     "exports": {
       ".": {
         "import": "./esm/index.js",
         "require": "./cjs/index.js"
       }
     }
   }
   ```

3. **使用完整路径**
   ```javascript
   // ✅ ES 模块中使用完整路径
   import utils from './utils/index.js'
   
   // ❌ 避免省略扩展名
   import utils from './utils'
   ```

### ❌ 避免的问题

1. **混淆模块语法**
   ```javascript
   // ❌ 在 ES 模块中使用 CommonJS 语法
   import fs from 'fs'
   module.exports = {} // 错误！
   
   // ✅ 使用正确的 ES 模块语法
   import fs from 'fs'
   export default {}
   ```

2. **忽略文件扩展名**
   ```javascript
   // ❌ ES 模块中省略扩展名
   import './module'
   
   // ✅ 明确指定扩展名
   import './module.js'
   ```

3. **条件导出顺序错误**
   ```json
   {
     "exports": {
       ".": {
         "default": "./index.js",  // ❌ default 应该放在最后
         "import": "./esm.js"
       }
     }
   }
   ```

## 🔧 实用工具

### 📊 模块类型检测

```javascript
// 检测当前模块类型
if (typeof module !== 'undefined' && module.exports) {
  console.log('运行在 CommonJS 环境')
} else {
  console.log('运行在 ES 模块环境')
}

// 检测 import.meta 支持
if (typeof import.meta !== 'undefined') {
  console.log('支持 import.meta:', import.meta.url)
}
```

### 🔄 模块转换工具

```bash
# 使用工具转换模块格式
npm install -g @babel/cli @babel/preset-env

# CommonJS 转 ES 模块
babel src --out-dir dist --presets=@babel/preset-env

# 使用 TypeScript 编译器
tsc --module commonjs src/index.ts
tsc --module es2020 src/index.ts
```

## 📚 相关资源

- [Node.js 模块文档](https://nodejs.org/api/modules.html)
- [ES 模块规范](https://nodejs.org/api/esm.html)
- [Package.json 配置](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)
- [模块解析算法](https://nodejs.org/api/modules.html#all-together)

---

::: tip 🚀 继续学习
掌握了模块系统后，建议深入学习 Node.js 的其他核心模块，如文件系统、HTTP 服务器、流处理等。
:::
