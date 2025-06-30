---
title: 📋 Tasksfile 任务管理工具完全指南
description: 基于 JavaScript 的任务执行工具，提供简单的方式在函数任务中执行 shell 命令，支持同步和异步操作
outline: deep
---

# 📋 Tasksfile 任务管理工具完全指南

> Tasksfile 提供了一种以同步和异步方式在函数任务中，执行 shell 命令的简单方法，是现代前端项目的任务管理利器。

## 🎯 Tasksfile 简介

Tasksfile 提供了一种以同步和异步方式在函数任务中，执行 shell 命令的简单方法 

安装依赖：`npm install tasksfile --save-dev`

在根项目目录中创建：tasksfile.js
```js
// 引入依赖包
const { sh, cli, help,prefixTransform,rawArgs } = require('tasksfile')
const dedent = require('dedent')

// 可以获取控制台中，执行命令携带的参数
function hello(options, name = 'Mysterious') {
  console.log(`Hello ${name}!`)
  console.log('Given options:', options)
  //rawArgs:返回以原始、未解析的格式传递给 task 的参数/选项。
  console.log('RAW ARGS', rawArgs(options))
}

function test (options, file) {}
//对任务使用help函数以获取其他说明
help(test, 'Run unit tests', {
  params: ['file'],
  options: {
    watch: 'run tests in a watch mode'
  },
  examples: dedent`
    task test dummyComponent.js
    task test dummyComponent.js --watch
  `
})


// 函数任务中，执行shell命令
function makedir() {
  sh('mkdir somedir')
  sh('jest')
  sh(`webpack-dev-server --config webpack.config.js`, {
    async?: true,
    cwd?:string,
    env?:Nodejs.ProcessEnv,
    timeout?:number,
    // if true, it will send output directly to parent process (stdio="inherit")
    nopipe?:boolean,
    silent?:boolean,
    transform?:(output:string)=>string,// 转换输出
    transform:prefixTransform('[prefix]'),//允许向 shell 输出添加前缀。
  })
}

// 数据比较多时，可以使用命名空间
function default() {
  hello()
  test()
}


// 导出任务
cli({
  hello,
  makedir,
  test,
  default
})
```
在package.json文件中添加命令：
```json
{
  "scripts": {
    "task": "node ./tasksfile.js"
  }
}
```
通过 npm 脚本在您的终端中调用并执行函数任务：
```sh
$ npm run task -- hello Tommy
$ npm run task -- makedir
$ yarn task hello Tommy
$ yarn task makedir

#通过npx执行命令
$ npx task hello Tommy
Hello Tommy!
$ npx task makedir
mkdir somedir

#传递参数
$ npx task hello -a --test=something world
Hello world!
Given options: { a: true, test: 'something' }

#获取函数任务说明
$ npx task test --help
Usage: test [options] [file]

Run unit tests

Options:

  --watch       run tests in a watch mode
  
Examples:

task test dummyComponent.js
task test dummyComponent.js --watch

#使用命名空间
$ npx task default:test

#获取原始参数
$ npx task hello 1 2 3 --test
RAW ARGS ['1', '2', '3', '--test']
```