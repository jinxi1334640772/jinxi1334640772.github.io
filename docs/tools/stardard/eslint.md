---
title: 🔍 ESLint 代码规范工具完全指南
description: ESLint 是用于规范和检测 JavaScript 代码风格的工具，提供完整的配置和使用指南
outline: deep
---

# 🔍 ESLint 代码规范工具完全指南

> ESLint 是一个用于规范和检测代码风格的工具。ESLint 配置在开发环境中，帮助我们找出项目中不符合规则的代码并给出提示。在我们的开发环境中，开发者每次修改代码，都会先用 ESLint 检查代码，这样可以让 ESLint 随时提醒开发者代码是否符合规范，从而降低低级 bug 的出现。

## 📖 概述

### ✨ ESLint 的核心价值

| 功能 | 描述 | 价值 |
|------|------|------|
| 🔍 **代码检查** | 自动发现代码中的问题 | 提高代码质量 |
| 📏 **规范统一** | 强制执行编码标准 | 提升团队协作 |
| 🔧 **自动修复** | 自动修复可修复的问题 | 提高开发效率 |
| 🎯 **错误预防** | 在运行前发现潜在错误 | 减少生产环境问题 |
| 🛠️ **可配置性** | 灵活的规则配置 | 适应不同项目需求 |
| 🔌 **插件生态** | 丰富的插件支持 | 扩展检查能力 |

::: tip 💡 温馨提示
ESLint 规范，不同项目或者不同的公司，可能有不同的喜好。适合自己的就好，规范统一就行。ESLint 有很多插件，额外扩展了一些规范。例如：`eslint-plugin-vue` 插件，为 Vue 语法新增了对应的规范。
:::

::: warning ⚠️ 重要提醒
**不建议关闭 ESLint 检查**。ESLint 是保证代码质量的重要工具，关闭检查可能导致代码质量下降和潜在错误增加。
:::

## 🚀 快速开始

### 📦 安装 ESLint

#### 基础安装

```bash
# 安装 ESLint 核心包
npm install --save-dev eslint

# 使用 yarn
yarn add -D eslint

# 使用 pnpm
pnpm add -D eslint
```

#### 插件安装

```bash
# TypeScript 支持
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Vue.js 支持
npm install --save-dev eslint-plugin-vue vue-eslint-parser

# React 支持
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks

# Prettier 集成
npm install --save-dev eslint-plugin-prettier eslint-config-prettier
```

### ⚙️ 初始化配置

```bash
# 使用向导创建配置文件
npx eslint --init

# 或者手动创建配置文件
touch .eslintrc.js
```

### 📝 配置文件格式

ESLint 支持多种配置文件格式：

| 文件名 | 格式 | 优先级 |
|--------|------|--------|
| `.eslintrc.js` | JavaScript | 1 |
| `.eslintrc.yaml` | YAML | 2 |
| `.eslintrc.yml` | YAML | 3 |
| `.eslintrc.json` | JSON | 4 |
| `package.json` | JSON (eslintConfig) | 5 |

## ⚙️ 配置详解

### 📝 基础配置结构

在项目根目录创建 `.eslintrc.js` 文件：

```javascript
module.exports = {
  // 配置解析器
  parser: '@typescript-eslint/parser', // 或 'babel-eslint'
  
  // 解析器选项
  parserOptions: {
    ecmaVersion: 2020,           // ECMAScript 版本
    sourceType: 'module',        // 模块类型
    ecmaFeatures: {
      jsx: true,                 // 启用 JSX
      experimentalObjectRestSpread: true,
      modules: true
    }
  },
  
  // 运行环境
  env: {
    browser: true,               // 浏览器环境
    node: true,                  // Node.js 环境
    es6: true,                   // ES6 环境
    commonjs: true,              // CommonJS 环境
    jest: true                   // Jest 测试环境
  },
  
  // 全局变量
  globals: {
    Vue: 'readonly',             // Vue 全局变量
    $: 'readonly',               // jQuery
    process: 'readonly'          // Node.js process
  },
  
  // 继承的配置
  extends: [
    'eslint:recommended',        // ESLint 推荐规则
    '@vue/standard',             // Vue 标准规则
    '@vue/typescript/recommended', // TypeScript 推荐规则
    'plugin:vue/vue3-essential', // Vue 3 基础规则
    'plugin:prettier/recommended' // Prettier 规则
  ],
  
  // 插件
  plugins: [
    'vue',
    '@typescript-eslint',
    'prettier'
  ],
  
  // 根配置文件标识
  root: true,
  
  // 规则配置
  rules: {
    // 在这里配置具体规则
  }
};
```

### 🎯 规则配置语法

#### 规则值类型

```javascript
rules: {
  // 字符串形式
  "no-console": "error",
  "no-console": "warn",
  "no-console": "off",
  
  // 数字形式
  "no-console": 2,  // error
  "no-console": 1,  // warn
  "no-console": 0,  // off
  
  // 数组形式（带配置）
  "array-bracket-spacing": ["error", "never"],
  "quotes": ["error", "single", { "avoidEscape": true }]
}
```

#### 错误等级说明

| 等级 | 数字 | 字符串 | 描述 | 表现 |
|------|------|--------|------|------|
| **关闭** | `0` | `"off"` | 关闭规则 | 无提示 |
| **警告** | `1` | `"warn"` | 警告级别 | 黄色波浪线 |
| **错误** | `2` | `"error"` | 错误级别 | 红色波浪线，阻止构建 |

### 📋 常用规则配置

#### 🔧 代码质量规则

```javascript
rules: {
  // 基础错误检查
  "no-console": "warn",                    // 禁用 console
  "no-debugger": "error",                  // 禁用 debugger
  "no-alert": "error",                     // 禁用 alert
  "no-unused-vars": "error",               // 禁止未使用的变量
  "no-undef": "error",                     // 禁止未定义的变量
  "no-duplicate-case": "error",            // 禁止重复的 case 标签
  "no-empty": ["error", { "allowEmptyCatch": true }], // 禁止空语句块
  
  // 最佳实践
  "eqeqeq": ["error", "always"],           // 要求使用 === 和 !==
  "no-eval": "error",                      // 禁用 eval()
  "no-implied-eval": "error",              // 禁止使用隐式 eval()
  "no-new-func": "error",                  // 禁止使用 Function 构造函数
  "no-return-assign": "error",             // 禁止在 return 语句中使用赋值语句
  "no-self-compare": "error",              // 禁止自身比较
  "no-throw-literal": "error",             // 禁止抛出字面量错误
  "prefer-const": "error",                 // 要求使用 const 声明那些声明后不再被修改的变量
  
  // 变量声明
  "no-var": "error",                       // 要求使用 let 或 const 而不是 var
  "prefer-const": "error",                 // 优先使用 const
  "no-use-before-define": "error",         // 禁止在变量定义之前使用它们
}
```

#### 🎨 代码风格规则

```javascript
rules: {
  // 缩进和空格
  "indent": ["error", 2],                  // 强制使用一致的缩进
  "no-tabs": "error",                      // 禁用 tab
  "no-mixed-spaces-and-tabs": "error",     // 禁止空格和 tab 的混合缩进
  
  // 引号
  "quotes": ["error", "single", {          // 强制使用单引号
    "avoidEscape": true,
    "allowTemplateLiterals": true
  }],
  
  // 分号
  "semi": ["error", "always"],             // 要求或禁止使用分号
  "no-extra-semi": "error",                // 禁止不必要的分号
  
  // 逗号
  "comma-dangle": ["error", "never"],      // 要求或禁止末尾逗号
  "comma-spacing": ["error", {             // 强制在逗号前后使用一致的空格
    "before": false,
    "after": true
  }],
  
  // 括号和空格
  "space-before-function-paren": ["error", "never"], // 函数圆括号之前的空格
  "space-in-parens": ["error", "never"],   // 强制在圆括号内使用一致的空格
  "array-bracket-spacing": ["error", "never"], // 强制数组方括号中使用一致的空格
  "object-curly-spacing": ["error", "always"], // 强制在大括号中使用一致的空格
  
  // 行尾和换行
  "eol-last": ["error", "always"],         // 要求或禁止文件末尾存在空行
  "no-trailing-spaces": "error",           // 禁用行尾空格
  "no-multiple-empty-lines": ["error", {   // 禁止出现多行空行
    "max": 2,
    "maxEOF": 1
  }]
}
```

#### ⚛️ React 相关规则

```javascript
// 需要安装 eslint-plugin-react
rules: {
  "react/jsx-uses-react": "error",         // 防止 React 被错误地标记为未使用
  "react/jsx-uses-vars": "error",          // 防止在 JSX 中使用的变量被错误地标记为未使用
  "react/jsx-key": "error",                // 在数组或迭代器中验证 JSX 具有 key 属性
  "react/jsx-no-duplicate-props": "error", // 防止在 JSX 中重复的 props
  "react/jsx-no-undef": "error",           // 在 JSX 中禁止未声明的变量
  "react/no-danger": "warn",               // 防止使用危险的 JSX 属性
  "react/no-deprecated": "error",          // 不使用弃用的方法
  "react/no-direct-mutation-state": "error", // 防止直接修改 this.state
  "react/no-find-dom-node": "error",       // 防止使用 findDOMNode
  "react/no-is-mounted": "error",          // 防止使用 isMounted
  "react/no-unknown-property": "error",    // 防止使用未知的 DOM 属性
  "react/prop-types": "off",               // 防止在 React 组件定义中丢失 props 验证
  "react/react-in-jsx-scope": "off"       // React 17+ 不需要在作用域内引入 React
}
```

#### 🖖 Vue 相关规则

```javascript
// 需要安装 eslint-plugin-vue
rules: {
  // Vue 3 基础规则
  "vue/no-unused-vars": "error",           // 禁止未使用的变量
  "vue/no-unused-components": "error",     // 禁止未使用的组件
  "vue/no-multiple-template-root": "off",  // Vue 3 允许多个根元素
  "vue/html-self-closing": ["error", {     // HTML 自闭合标签
    "html": {
      "void": "never",
      "normal": "any",
      "component": "always"
    },
    "svg": "always",
    "math": "always"
  }],
  "vue/max-attributes-per-line": ["error", { // 每行最大属性数
    "singleline": 3,
    "multiline": {
      "max": 1,
      "allowFirstLine": false
    }
  }],
  "vue/html-indent": ["error", 2],         // HTML 缩进
  "vue/html-closing-bracket-newline": ["error", { // 闭合括号换行
    "singleline": "never",
    "multiline": "always"
  }],
  "vue/component-name-in-template-casing": ["error", "PascalCase"], // 组件名大小写
  "vue/no-v-html": "warn"                  // 禁止使用 v-html
}
```

## 🚫 忽略文件配置

### 📝 .eslintignore 文件

在项目根目录创建 `.eslintignore` 文件，告诉 ESLint 忽略特定的文件和目录：

```bash
# 依赖目录
node_modules/
dist/
build/

# 配置文件
*.config.js
*.config.ts

# 静态资源
public/
static/
assets/

# 构建产物
lib/
es/
umd/

# 测试覆盖率
coverage/

# 临时文件
.tmp/
.cache/

# 特定文件类型
*.min.js
*.bundle.js
*.md
*.scss
*.css
*.woff
*.ttf

# IDE 配置
.vscode/
.idea/

# 其他
.DS_Store
Thumbs.db
```

### 💡 行内忽略

#### 忽略整个文件

```javascript
/* eslint-disable */
// 整个文件都不会被 ESLint 检查
```

#### 忽略特定规则

```javascript
/* eslint-disable no-console, no-alert */
console.log('这行不会被检查');
alert('这行也不会被检查');
/* eslint-enable no-console, no-alert */
```

#### 忽略下一行

```javascript
// eslint-disable-next-line no-console
console.log('只有这一行不会被检查');

// eslint-disable-next-line no-console, no-alert
console.log('忽略多个规则');
```

#### 忽略当前行

```javascript
console.log('这行不会被检查'); // eslint-disable-line no-console
```

## 🛠️ 实际项目配置

### 📦 Vue 3 + TypeScript 项目

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/prettier'
  ],
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    // Vue 规则
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/no-multiple-template-root': 'off',
    'vue/html-self-closing': ['error', {
      html: {
        void: 'never',
        normal: 'any',
        component: 'always'
      }
    }],
    
    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

### ⚛️ React + TypeScript 项目

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // React 规则
    'react/react-in-jsx-scope': 'off', // React 17+
    'react/prop-types': 'off',         // 使用 TypeScript
    'react/jsx-uses-react': 'off',     // React 17+
    'react/jsx-uses-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    
    // 通用规则
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

### 🚀 Node.js 项目

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: [
    '@typescript-eslint',
    'node'
  ],
  rules: {
    // Node.js 规则
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',
    'node/no-unpublished-import': 'off',
    
    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    
    // 通用规则
    'no-console': 'off', // Node.js 中允许使用 console
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

## 🔧 集成开发工具

### 📝 VS Code 集成

#### 安装 ESLint 扩展

在 VS Code 中安装 ESLint 扩展，实现实时代码检查。

#### 配置自动修复

在 VS Code 的 `settings.json` 中添加：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "eslint.format.enable": true,
  "editor.formatOnSave": true
}
```

### 🛠️ 命令行使用

```bash
# 检查文件
npx eslint src/

# 检查并自动修复
npx eslint src/ --fix

# 检查特定文件
npx eslint src/components/Button.vue

# 输出格式化报告
npx eslint src/ --format table

# 检查并忽略警告
npx eslint src/ --quiet
```

### 📦 package.json 脚本

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:check": "eslint src/ --max-warnings 0"
  }
}
```

## 🔄 Git Hooks 集成

### 🪝 使用 husky 和 lint-staged

```bash
# 安装依赖
npm install --save-dev husky lint-staged

# 初始化 husky
npx husky install
npm pkg set scripts.prepare="husky install"

# 添加 pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

#### 配置 lint-staged

在 `package.json` 中添加：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": [
      "eslint --fix",
      "git add"
    ]
  }
}
```

## 🎯 最佳实践

### ✅ 推荐做法

::: tip 🎯 ESLint 最佳实践
1. **团队统一**: 整个团队使用相同的 ESLint 配置
2. **渐进式引入**: 在现有项目中逐步引入 ESLint 规则
3. **自动修复**: 启用自动修复功能，减少手动工作
4. **CI/CD 集成**: 在构建流程中集成 ESLint 检查
5. **规则文档化**: 为团队自定义规则提供文档说明
6. **定期更新**: 定期更新 ESLint 和相关插件版本
:::

### 🚫 避免的做法

::: warning ⚠️ 注意事项
- **不要完全关闭 ESLint**: 这会失去代码质量保障
- **避免过度严格**: 过于严格的规则可能影响开发效率
- **不要忽略警告**: 警告也是代码质量问题的信号
- **避免频繁修改规则**: 频繁变更会影响团队适应
- **不要忽略性能**: 过多规则可能影响编辑器性能
:::

### 📊 规则配置策略

#### 按项目阶段调整

```javascript
// 新项目：严格模式
const strictRules = {
  "no-console": "error",
  "no-debugger": "error",
  "@typescript-eslint/no-any": "error"
};

// 现有项目：渐进模式
const progressiveRules = {
  "no-console": "warn",
  "no-debugger": "warn",
  "@typescript-eslint/no-any": "warn"
};

// 生产环境：错误级别
const productionRules = {
  "no-console": process.env.NODE_ENV === 'production' ? 'error' : 'warn'
};
```

## 🌟 总结

ESLint 作为现代前端开发的重要工具，提供了：

- ✅ **代码质量保障**: 自动发现和修复代码问题
- ✅ **团队协作支持**: 统一的代码风格和规范
- ✅ **开发效率提升**: 自动修复和实时反馈
- ✅ **错误预防**: 在开发阶段发现潜在问题
- ✅ **可扩展性**: 丰富的插件和规则生态
- ✅ **工具集成**: 与各种开发工具无缝集成

通过合理配置和使用 ESLint，可以显著提升代码质量、团队协作效率和项目可维护性，是现代前端开发不可缺少的重要工具。
