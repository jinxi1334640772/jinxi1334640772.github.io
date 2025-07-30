---
title: 📋 Tasksfile 任务管理工具完全指南
description: 基于 JavaScript 的任务执行工具，提供简单的方式在函数任务中执行 shell 命令，支持同步和异步操作
outline: deep
---

# 📋 Tasksfile 任务管理工具完全指南

> Tasksfile 提供了一种以同步和异步方式在函数任务中，执行 shell 命令的简单方法，是现代前端项目的任务管理利器。

## 1. Tasksfile 简介

Tasksfile 是一个基于 JavaScript 的任务执行工具，它提供了一种简单的方式在函数任务中执行 shell 命令，支持同步和异步操作。相比于传统的 Gulp、Grunt 等构建工具，Tasksfile 更加轻量级，配置更简单，适合现代前端项目的任务管理。

### 1.1 安装方法

```bash
# 使用 npm 安装
npm install tasksfile --save-dev

# 使用 yarn 安装
yarn add tasksfile --dev
```

## 2. 基本使用

### 2.1 创建任务文件

在项目根目录中创建 `tasksfile.js` 文件：

```javascript
// 引入依赖包
const { sh, cli, help, prefixTransform, rawArgs } = require('tasksfile');
const dedent = require('dedent');

// 定义一个简单的任务函数
function hello(options, name = 'Mysterious') {
  console.log(`Hello ${name}!`);
  console.log('Given options:', options);
  // rawArgs: 返回以原始、未解析的格式传递给 task 的参数/选项
  console.log('RAW ARGS', rawArgs(options));
}

// 导出任务
cli({
  hello
});
```

### 2.2 配置 package.json

在 `package.json` 文件中添加命令：

```json
{
  "scripts": {
    "task": "node ./tasksfile.js"
  }
}
```

### 2.3 执行任务

通过 npm/yarn 脚本或 npx 在终端中调用并执行函数任务：

```bash
# 使用 npm 执行
$ npm run task -- hello Tommy

# 使用 yarn 执行
$ yarn task hello Tommy

# 使用 npx 执行（推荐）
$ npx task hello Tommy
Hello Tommy!
```

## 3. 高级功能

### 3.1 执行 Shell 命令

Tasksfile 的核心功能是在 JavaScript 函数中执行 shell 命令：

```javascript
function makedir() {
  // 同步执行 shell 命令
  sh('mkdir somedir');
  sh('jest');
  
  // 带选项的 shell 命令执行
  sh(`webpack-dev-server --config webpack.config.js`, {
    async: true,             // 异步执行
    cwd: './src',            // 指定工作目录
    env: process.env,        // 环境变量
    timeout: 5000,           // 超时时间（毫秒）
    nopipe: false,           // 如果为 true，将输出直接发送到父进程 (stdio="inherit")
    silent: false,           // 静默执行，不显示输出
    transform: prefixTransform('[prefix]')  // 允许向 shell 输出添加前缀
  });
}

// 导出任务
cli({
  makedir
});
```

### 3.2 任务帮助文档

为任务添加帮助文档，方便用户了解任务的用法：

```javascript
function test(options, file) {
  // 测试任务的实现...
}

// 为任务添加帮助文档
help(test, 'Run unit tests', {
  params: ['file'],          // 参数说明
  options: {
    watch: 'run tests in a watch mode'  // 选项说明
  },
  examples: dedent`
    task test dummyComponent.js
    task test dummyComponent.js --watch
  `                          // 使用示例
});

// 导出任务
cli({
  test
});
```

用户可以通过 `--help` 参数查看任务的帮助信息：

```bash
$ npx task test --help
Usage: test [options] [file]

Run unit tests

Options:

  --watch       run tests in a watch mode
  
Examples:

task test dummyComponent.js
task test dummyComponent.js --watch
```

### 3.3 命名空间

当任务较多时，可以使用命名空间来组织任务：

```javascript
// 默认任务可以作为命名空间的入口
function default() {
  hello();
  test();
}

// 导出任务
cli({
  hello,
  makedir,
  test,
  default
});
```

使用命名空间执行任务：

```bash
$ npx task default:test
```

### 3.4 参数处理

Tasksfile 支持灵活的参数处理：

```javascript
// 传递命令行参数
$ npx task hello -a --test=something world
Hello world!
Given options: { a: true, test: 'something' }

// 获取原始参数
$ npx task hello 1 2 3 --test
RAW ARGS ['1', '2', '3', '--test']
```

## 4. 完整示例

下面是一个包含多种功能的完整 tasksfile.js 示例：

```javascript
// 引入依赖包
const { sh, cli, help, prefixTransform, rawArgs } = require('tasksfile');
const dedent = require('dedent');

// 基本任务示例
function hello(options, name = 'Mysterious') {
  console.log(`Hello ${name}!`);
  console.log('Given options:', options);
  console.log('RAW ARGS', rawArgs(options));
}

// 带帮助文档的任务
function test(options, file) {
  const watchMode = options.watch ? '--watch' : '';
  sh(`jest ${file || ''} ${watchMode}`);
}

help(test, 'Run unit tests', {
  params: ['file'],
  options: {
    watch: 'run tests in a watch mode'
  },
  examples: dedent`
    task test dummyComponent.js
    task test dummyComponent.js --watch
  `
});

// 执行 shell 命令的任务
function build(options) {
  const mode = options.prod ? 'production' : 'development';
  sh(`webpack --mode ${mode}`, {
    async: options.async || false,
    nopipe: false,
    transform: prefixTransform('[BUILD]')
  });
}

help(build, 'Build the project', {
  options: {
    prod: 'build for production',
    async: 'run build asynchronously'
  }
});

// 组合任务
function dev() {
  sh('npm run lint', { silent: true });
  sh('webpack-dev-server', { async: true });
}

// 默认任务（命名空间）
function default() {
  hello();
  test();
}

// 导出所有任务
cli({
  hello,
  test,
  build,
  dev,
  default
});
```

## 5. 最佳实践

### 5.1 任务组织

- **保持任务简单**：每个任务应该只做一件事，并做好这件事
- **使用命名空间**：对相关任务进行分组，提高可维护性
- **添加帮助文档**：为每个任务提供清晰的帮助信息

### 5.2 Shell 命令执行

- **异步执行长时间运行的命令**：使用 `async: true` 选项
- **添加前缀**：使用 `prefixTransform` 为输出添加前缀，便于区分不同命令的输出
- **错误处理**：处理 shell 命令可能的错误情况

### 5.3 与其他工具集成

Tasksfile 可以与其他工具无缝集成：

```javascript
// 与 webpack 集成
function webpack(options) {
  const configFile = options.config || 'webpack.config.js';
  sh(`webpack --config ${configFile}`);
}

// 与 ESLint 集成
function lint(options) {
  const fix = options.fix ? '--fix' : '';
  sh(`eslint ${fix} ./src`);
}

// 与 Jest 集成
function test(options) {
  const coverage = options.coverage ? '--coverage' : '';
  sh(`jest ${coverage}`);
}

cli({
  webpack,
  lint,
  test
});
```

## 6. 参考资源

- [Tasksfile GitHub 仓库](https://github.com/pawelgalazka/tasksfile)
- [Tasksfile NPM 包](https://www.npmjs.com/package/tasksfile)
- [dedent 库](https://www.npmjs.com/package/dedent)
- [现代前端构建工具对比](https://blog.bitsrc.io/task-runners-vs-build-tools-vs-bundlers-what-to-use-fef1485bddd0)