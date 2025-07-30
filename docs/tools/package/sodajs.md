---
title: 🧩 SodaJS 模板引擎完全指南
description: 轻量级高性能的 DOM 指令模板引擎，支持自定义指令、过滤器、子模板等功能，兼容性强，体积小巧
outline: deep
---

# 🧩 SodaJS 模板引擎完全指南

> SodaJS 是一个超小体积（gzip 后仅 4K）的高性能 DOM 指令模板引擎，具有良好的兼容性和丰富的功能。

## 1. 模板引擎概述

模板引擎是一种用于将数据和模板结合生成最终文本输出的工具，广泛应用于软件开发中，特别是在需要生成大量重复格式的文本时，如 HTML 页面、邮件模板、代码文件等。其主要作用是快速生成动态页面、提高开发效率，减少重复代码的编写，同时降低维护成本，使代码更加清晰易懂。

### 1.1 工作原理

模板引擎的工作原理通常包括以下几个步骤：

1. **数据填充**：将业务数据填充到模板中的占位符或标记位置
2. **模板渲染**：根据数据生成最终的文本输出，如 HTML 页面、邮件内容等
3. **输出显示**：将生成的文本输出展示给用户

### 1.2 常见模板引擎对比

| 模板引擎 | 特点 | 适用场景 |
|---------|------|---------|
| **JSP** | 功能强大，支持 Java 代码编写，性能较好 | Java Web 开发，适合官方标准 |
| **Freemarker** | 性能良好，支持严格的 MVC 分离，使用方便 | Java 项目，需要严格模板分离 |
| **Thymeleaf** | 基于 HTML 的模板引擎，支持动静分离 | Spring 框架集成，现代 Web 开发 |
| **art-template** | 简约、超快的模板引擎 | 轻量级前端项目 |
| **SodaJS** | 超小体积，高性能 DOM 指令系统 | 前端项目，需要类似 Angular/Vue 指令系统 |

## 2. SodaJS 模板引擎介绍

SodaJS 是目前最好用的指令型模板引擎之一，具有以下特性：

- **超小体积**：gzip 压缩后仅 4KB
- **指令系统**：支持 DOM 指令系统，类似 Angular/Vue
- **良好兼容性**：兼容 IE8 及现代浏览器，同时支持 Node.js 环境
- **安全性**：避免输出的 XSS 漏洞
- **高性能**：高性能 DOM 渲染引擎
- **易于使用**：与 AngularJS 指令兼容，使用非常方便
- **可扩展性**：支持自定义指令和前缀

### 2.1 安装方法

```bash
# NPM 安装
npm install --save sodajs

# Yarn 安装
yarn add sodajs
```

## 3. SodaJS 基本使用

### 3.1 基础配置

```javascript
import soda from "sodajs";

// 自定义指令前缀，默认前缀是 soda-
// 设置为 v-，使语法类似 Vue 模板
soda.prefix("v-");
```

### 3.2 自定义过滤器

```javascript
// 自定义过滤器，并接收参数，用法类似 Vue
soda.filter("nameFilter", function(input, length) {
  return (input || "").substr(0, length);
});
```

### 3.3 自定义指令

```javascript
/** 
 * 自定义指令参数说明：
 * scope: 当前的 scope 数据
 * el: 当前节点
 * expression: 指令的表达式原始字符串
 * parseSodaExpression: 解析 soda 表达式
 * getValue: 从 data 链式获取值
 * compileNode: 继续编译节点
 * document: 使用 document 参数而不是 window.document，兼容 Node 环境
 */
soda.directive("mydirective", {
  priority: 8,
  link({
    scope,
    el,
    parseSodaExpression,
    expression,
    getValue,
    compileNode,
    document,
  }) {
    // 指令实现逻辑
    getValue({ a: { b: 1 } }, "a.b"); // 返回 1
    parseSodaExpression("{{1 + 2 + a}}", { a: 1 }); // 返回 4
    
    var value = parseSodaExpression(expression);
    if (value) {
      var textNode = document.createTextNode(value);
      el.appendChild(textNode);
    }
  },
});
```

### 3.4 定义子模板

```javascript
// 定义静态子模板
soda.discribe("tmpl1", `<h1>{{name}}</h1>`, {
  compile: false, // 是否编译子模板的变量
});

// 子模板可以定义为函数，接收参数
soda.discribe("tmpl2", function(path) {
  return `<h1>{{name}}_${path}</h1>`;
  // Node 环境示例：return fs.readFileSync(path, 'utf-8');
});
```

## 4. 模板语法与指令

### 4.1 基本模板示例

```html
<div v-if="show">条件渲染, 使用变量：{{name}}</div>
<div v-if="!show">I'm hidden!</div>

<div v-html="html">渲染原始HTML</div>
<div v-replace="html">用html替换当前结点</div>

<div v-include="tmpl1">使用定义的子模板，替换当前节点</div>
<div v-include="tmpl2:view.html">使用函数形式的子模板接收view.html参数</div>

<div v-class="show ? 'active' : ''">自定义class</div>
<div v-style="style">自定义style</div>

<div v-checked="{{false}}">false或空字符串时，该属性会被移除</div>
<div v-src="hello{{name}}.png">自定义src</div>

<div v-mydirective="add one tips: {{name}}">使用自定义指令</div>
```

### 4.2 循环渲染

```html
<ul>
  <li v-repeat="(index,item) in list by name" v-if="item.show">
    循环渲染 $index：默认索引，也可以明确索引index，dom的key为name
    {{item.name}}
    {{$index}}
    {{index}}
    {{item.name|nameFilter:10}}
  </li>
</ul>
```

### 4.3 指令列表

| 指令 | 说明 | 示例 |
|------|------|------|
| `v-if` | 条件渲染 | `v-if="show"` |
| `v-html` | 渲染原始 HTML | `v-html="html"` |
| `v-replace` | 用内容替换当前节点 | `v-replace="html"` |
| `v-include` | 使用子模板 | `v-include="tmpl1"` |
| `v-class` | 动态设置 class | `v-class="show ? 'active' : ''"` |
| `v-style` | 动态设置 style | `v-style="style"` |
| `v-checked` 等 | 动态设置属性 | `v-checked="{{false}}"` |
| `v-repeat` | 循环渲染 | `v-repeat="(index,item) in list by name"` |

## 5. 完整示例

```javascript
import soda from "sodajs";

// 配置
soda.prefix("v-");

// 自定义过滤器
soda.filter("nameFilter", function(input, length) {
  return (input || "").substr(0, length);
});

// 自定义指令
soda.directive("mydirective", {
  priority: 8,
  link({ scope, el, parseSodaExpression, expression, document }) {
    var value = parseSodaExpression(expression);
    if (value) {
      var textNode = document.createTextNode(value);
      el.appendChild(textNode);
    }
  },
});

// 定义子模板
soda.discribe("tmpl1", `<h1>{{name}}</h1>`, { compile: false });
soda.discribe("tmpl2", function(path) {
  return `<h1>{{name}}_${path}</h1>`;
});

// 定义模板
const tpl = ` 
<div v-if="show">条件渲染, 使用变量：{{name}}</div>
<div v-if="!show">I'm hidden!</div>

<div v-html="html">渲染原始HTML</div>
<div v-replace="html">用html替换当前结点</div>

<div v-include="tmpl1">使用定义的子模板，替换当前节点</div>
<div v-include="tmpl2:view.html">使用函数形式的子模板接收view.html参数</div>

<div v-class="show ? 'active' : ''">自定义class</div>
<div v-style="style">自定义style</div>

<div v-checked="{{false}}">false 或者 "", 该属性就会被移除，否则，会被添加上去</div>
<div v-src="hello{{name}}.png">自定义src</div>

<div v-mydirective="add one tips: {{name}}">使用自定义指令</div>

<ul>
  <li v-repeat="(index,item) in list by name" v-if="item.show">
    循环渲染 $index：默认索引，也可以明确索引index dom的key为name
    {{item.name}}
    {{$index}}
    {{index}}
    {{item.name|nameFilter:10}}
  </li>
</ul>
`;

// 定义数据
const data = {
  name: "SodaJS",
  show: true,
  html: '<span style="color:red;">test soda-html</span>',
  style: { width: "100px", height: "100px" },
  list: [
    { name: "Hello", show: true },
    { name: "sodajs", show: true },
    { name: "AlloyTeam" },
  ],
};

// 渲染模板
document.body.innerHTML = soda(tpl, data);
```

## 6. Node.js 环境使用

在 Node.js 环境中，可以自定义 DOM 解析引擎。SodaJS 的 Node 版本默认 DOM 解析引擎是 nodeWindow，可以替换为 jsdom 等：

```javascript
var document = require("document");
var soda = require("soda");

soda.setDocument(document);
```

## 7. 最佳实践

### 7.1 性能优化

- **避免过度使用复杂表达式**：复杂的表达式会影响渲染性能
- **合理使用子模板**：将重复的模板抽取为子模板，提高复用性
- **使用 key 优化列表渲染**：在 `v-repeat` 中使用 `by` 指定 key

### 7.2 代码组织

- **模块化模板**：将大型模板拆分为小型、可复用的模板
- **分离数据和模板**：保持数据和模板的清晰分离
- **统一命名规范**：为自定义指令、过滤器和子模板制定统一的命名规范

### 7.3 安全考虑

- **避免直接渲染用户输入**：对用户输入进行过滤和转义
- **谨慎使用 v-html**：只在确保内容安全的情况下使用

## 8. 参考资源

- [SodaJS GitHub 仓库](https://github.com/AlloyTeam/sodajs)
- [SodaJS 官方文档](https://alloyteam.github.io/sodajs/)
- [模板引擎性能对比](https://github.com/aui/art-template/blob/master/benchmark/README.md)