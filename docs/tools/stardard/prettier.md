---
title: 💅 Prettier 代码格式化工具完全指南
description: Prettier 代码格式化工具的详细使用指南，包括安装配置、VSCode 集成、团队协作等最佳实践
outline: deep
---

# 💅 Prettier 代码格式化工具完全指南

> Prettier 是一个代码格式化程序，支持多种语言，通过统一的代码风格提升团队开发效率和代码质量。

## 🎯 Prettier 简介

Prettier 插件用来格式化代码，使代码符合 ESLint 规范。使用 VSCode IDE，在插件市场中，安装 Prettier 插件，该插件可以使用内置的全局配置，也可以使用项目中 `.prettierrc.js` 文件中的配置。

::: tip 💡 什么是 Prettier？
`Prettier` 的中文意思是"漂亮的、机灵的"，是一个代码格式化程序。涉及引号、分号、换行、缩进等。支持目前大部分语言处理，包括 JavaScript、Flow、TypeScript、CSS、SCSS、Less、JSX、Vue、GraphQL、JSON、Markdown。它通过解析代码并使用自己的规则来格式化代码。
:::

### ✨ 主要特性

| 特性 | 描述 | 优势 |
|------|------|------|
| **多语言支持** | 支持 JavaScript、TypeScript、CSS、Vue 等 | 🌐 一站式格式化解决方案 |
| **统一风格** | 强制执行一致的代码风格 | 🎨 消除团队间的风格差异 |
| **自动化** | 保存时自动格式化 | ⚡ 提升开发效率 |
| **可配置** | 支持自定义格式化规则 | 🔧 满足不同项目需求 |

## 📦 安装 Prettier

### 项目安装

```bash
# 安装 Prettier 核心包
npm install --save-dev prettier

# 安装 ESLint 配置（解决冲突）
npm install --save-dev eslint-config-prettier
```

### 全局安装

```bash
# 全局安装 Prettier
npm install -g prettier

# 验证安装
prettier --version
```

## ⚙️ 配置文件

### 根目录新建 .prettierrc.js

VSCode 读取这种单独配置文件的优先级会高于插件内配置。

::: info 📖 参考文档
详细配置选项请参考：[Prettier 官方文档](https://prettier.io/docs/en/)
:::

在项目根目录创建 `.prettierrc.js` 文件：

```javascript
module.exports = {
  // 🎯 基础配置
  // 指定自动换行的行长，默认值为80
  printWidth: 150,
  // 指定每个缩进级别的空格数
  tabWidth: 2,
  // 使用制表符而不是空格缩进行
  useTabs: true,
  
  // 🔤 语法配置
  // 在语句末尾打印分号
  semi: true,
  // 使用单引号而不是双引号
  singleQuote: true,
  // 何时更改引用对象属性 "<as-needed|consistent|preserve>"
  quoteProps: "as-needed",
  // 在JSX中使用单引号而不是双引号
  jsxSingleQuote: false,
  
  // 🎨 格式化配置
  // 在多行逗号分隔的语法结构中打印尾随逗号 "<none|es5|all>"，默认none
  trailingComma: "es5",
  // 在对象文字中的括号之间打印空格，默认true
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 在单独的箭头函数参数周围包括括号 always：(x) => x \ avoid：x => x
  arrowParens: "always",
  
  // 📝 解析配置
  // 格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
  rangeStart: 0,
  rangeEnd: Infinity,
  // 指定要使用的解析器，不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  
  // 🔄 换行配置
  // 使用默认的折行标准 always\never\preserve
  proseWrap: "preserve",
  // 指定HTML文件的全局空格敏感度 css\strict\ignore
  htmlWhitespaceSensitivity: "css",
  // Vue文件脚本和样式标签缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
  endOfLine: "lf",
};
```

### 📄 JSON 格式配置

也可以使用 `.prettierrc` 文件（JSON 格式）：

```json
{
  "printWidth": 150,
  "tabWidth": 2,
  "useTabs": true,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## 🔧 VSCode 集成

### 插件安装

在 VSCode 中安装 ESLint 和 Prettier 插件，以便在代码编写过程中实时检查和格式化代码。

### 配置 VSCode 设置

在 VSCode 设置中配置自动格式化：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 🚀 格式化方式

### 1. 命令行格式化

```bash
# 格式化所有文件
npx prettier --write .

# 格式化指定文件
npx prettier --write src/main.js

# 格式化指定目录
npx prettier --write src/

# 检查格式化状态（不修改文件）
npx prettier --check .

# 格式化并输出到控制台
npx prettier src/main.js
```

### 2. 编辑器右键格式化

在 VSCode 中右键点击代码，选择"格式化文档"选项。

### 3. 自动格式化

通过 VSCode 插件设置保存时自动格式化代码。

::: tip 💡 推荐方式
建议使用**保存时自动格式化**，这样可以确保代码始终保持统一的格式，无需手动操作。
:::

## 🚫 忽略格式化

### .prettierignore 文件

创建 `.prettierignore` 文件来忽略不想格式化的文件或目录：

```bash
# 依赖目录
node_modules/
dist/
build/

# 配置文件
*.config.js
.env*

# 文档
README.md
CHANGELOG.md

# 特定文件类型
*.min.js
*.bundle.js

# 图片和媒体文件
*.png
*.jpg
*.gif
*.svg
```

### 代码内忽略

使用 `prettier-ignore` 注释，会忽略下一行代码的格式化：

```javascript
// prettier-ignore
const uglyCode = {a:1,b:2,c:3};

/* prettier-ignore */
const matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

// prettier-ignore-start
function uglyFunction() {
  return {a:1,b:2,c:3};
}
// prettier-ignore-end
```

## 🤝 解决与 ESLint 的冲突

### 安装配置包

```bash
# 安装 eslint-config-prettier
npm install --save-dev eslint-config-prettier

# 如果使用 stylelint
npm install --save-dev stylelint-config-prettier
```

### 配置 ESLint

在 `.eslintrc.js` 文件的 `extends` 数组中添加 `prettier` 配置：

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@vue/typescript/recommended',
    // 确保 prettier 配置在最后
    'prettier'
  ],
  rules: {
    // 你的自定义规则
  }
};
```

::: warning ⚠️ 配置顺序
确保 `prettier` 配置在 `extends` 数组的最后，这样可以关闭 ESLint 中可能导致冲突的规则。
:::

## 🔄 Git 集成

### Pre-commit 钩子

添加 scripts 脚本到 `package.json` 文件中：

```json
{
  "scripts": {
    "lint": "eslint .",
    "prettier": "prettier --write .",
    "format": "npm run prettier",
    "lint:ci": "npm run lint && npm run prettier"
  }
}
```

### Husky + lint-staged 配置

安装依赖：

```bash
npm install --save-dev husky lint-staged
```

配置 `package.json`：

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write --ignore-unknown",
      "git add"
    ],
    "*.{css,less,sass,scss}": [
      "stylelint --fix",
      "prettier --write --ignore-unknown",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write --ignore-unknown",
      "git add"
    ]
  }
}
```

### 现代 Husky 配置

对于 Husky v6+：

```bash
# 安装 husky
npm install --save-dev husky

# 初始化 husky
npx husky install

# 添加 pre-commit 钩子
npx husky add .husky/pre-commit "npx lint-staged"
```

## 📊 配置对比表

| 配置项 | 推荐值 | 说明 | 影响 |
|--------|--------|------|------|
| `printWidth` | 80-120 | 每行最大字符数 | 影响代码换行 |
| `tabWidth` | 2 | 缩进空格数 | 影响代码层级显示 |
| `useTabs` | false | 使用空格而非制表符 | 影响缩进字符 |
| `semi` | true | 语句末尾加分号 | 影响语法风格 |
| `singleQuote` | true | 使用单引号 | 影响字符串风格 |
| `trailingComma` | "es5" | 尾随逗号 | 影响对象/数组格式 |

## 🎯 最佳实践

### 1. 团队协作

```bash
# 在项目根目录创建配置文件
touch .prettierrc.js .prettierignore

# 确保团队成员使用相同配置
npm install --save-dev prettier eslint-config-prettier
```

### 2. CI/CD 集成

在 GitHub Actions 中添加格式检查：

```yaml
name: Code Quality
on: [push, pull_request]

jobs:
  prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run prettier:check
```

### 3. 渐进式采用

```bash
# 首次格式化整个项目
npx prettier --write .

# 提交格式化更改
git add .
git commit -m "feat: apply prettier formatting"

# 之后启用自动格式化
```

## 🔍 常见问题

### Q: Prettier 和 ESLint 冲突怎么办？

A: 安装 `eslint-config-prettier` 并在 ESLint 配置中启用：

```javascript
module.exports = {
  extends: ['eslint:recommended', 'prettier']
};
```

### Q: 如何在不同项目中使用不同的配置？

A: 在每个项目根目录创建独立的 `.prettierrc.js` 文件，项目配置会覆盖全局配置。

### Q: 如何批量格式化历史代码？

A: 使用命令行工具：

```bash
# 格式化所有 JavaScript 文件
npx prettier --write "**/*.{js,jsx,ts,tsx}"

# 格式化特定目录
npx prettier --write src/
```

## 📚 相关资源

| 资源 | 描述 | 链接 |
|------|------|------|
| **官方文档** | Prettier 完整文档 | [prettier.io](https://prettier.io/) |
| **配置选项** | 所有配置选项说明 | [Options](https://prettier.io/docs/en/options.html) |
| **编辑器集成** | 各编辑器插件 | [Editor Integration](https://prettier.io/docs/en/editors.html) |
| **Playground** | 在线配置测试 | [Prettier Playground](https://prettier.io/playground/) |

::: tip 🎯 总结
Prettier 是现代前端开发中不可或缺的工具，通过统一的代码格式化规则，可以显著提升团队协作效率和代码质量。建议在项目初期就配置好 Prettier，并结合 ESLint 和 Git 钩子使用。
:::

<style scoped>
.tip {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  color: white;
}

.info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  color: white;
}

table {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

code {
  background: rgba(103, 126, 234, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}
</style>
