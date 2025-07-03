---
title: CSS 选择器详解
description: 深入理解 CSS 选择器，包括属性选择器、伪类选择器、伪元素选择器和关系选择器
outline: deep
---

# CSS 选择器详解

::: info 概述
CSS 选择器是 CSS 的核心概念，用于选择和匹配 HTML 元素。本文详细介绍了各种类型的 CSS 选择器及其使用方法。
:::

## 🎯 属性选择器

属性选择器根据元素的属性来选择元素。

### 基本语法

| 选择器 | 说明 | 示例 |
|--------|------|------|
| `[attribute]` | 具有 attribute 属性的元素 | `[title]` |
| `[attribute=value]` | 属性 attribute 值为 value | `[type="text"]` |
| `[attribute^=value]` | 属性值以 value 开头 | `[class^="btn"]` |
| `[attribute$=value]` | 属性值以 value 结尾 | `[src$=".jpg"]` |
| `[attribute\|=value]` | 属性值为 value 或以 value- 开头 | `[lang\|="en"]` |
| `[attribute*=value]` | 属性值包含 value | `[class*="nav"]` |
| `[attribute~=value]` | 属性值包含以空格分隔的 value | `[class~="active"]` |

### 使用示例

```css
/* 选择所有具有 title 属性的元素 */
[title] {
  border-bottom: 1px dotted #999;
}

/* 选择 type 属性为 "text" 的 input 元素 */
input[type="text"] {
  border: 2px solid #ccc;
  padding: 8px;
}

/* 选择 class 以 "btn" 开头的元素 */
[class^="btn"] {
  padding: 10px 20px;
  border-radius: 4px;
}

/* 选择 src 以 ".jpg" 结尾的图片 */
img[src$=".jpg"] {
  border: 2px solid #f0f0f0;
}

/* 选择 lang 属性为 "en" 或以 "en-" 开头的元素 */
[lang|="en"] {
  font-family: "Arial", sans-serif;
}

/* 选择 class 包含 "nav" 的元素 */
[class*="nav"] {
  background-color: #333;
}

/* 选择 class 包含独立单词 "active" 的元素 */
[class~="active"] {
  color: #007bff;
}
```

::: tip 属性选择器使用场景
- 表单元素样式：`input[type="email"]`
- 外部链接样式：`a[href^="http"]`
- 文件类型图标：`a[href$=".pdf"]`
- 多语言网站：`[lang="zh-CN"]`
:::

## 🎭 伪类选择器

伪类选择器用于选择处于特定状态的元素。

### 结构伪类

#### 子元素位置

| 选择器 | 说明 |
|--------|------|
| `:first-child` | 作为父元素的第一个子元素 |
| `:last-child` | 作为父元素的最后一个子元素 |
| `:nth-child(n)` | 作为父元素的第 n 个子元素 |
| `:nth-last-child(n)` | 从后往前数第 n 个子元素 |
| `:only-child` | 没有兄弟元素的元素 |

#### 同类型元素位置

| 选择器 | 说明 |
|--------|------|
| `:first-of-type` | 同类型中的第一个元素 |
| `:last-of-type` | 同类型中的最后一个元素 |
| `:nth-of-type(n)` | 同类型中的第 n 个元素 |
| `:nth-last-of-type(n)` | 同类型中从后数第 n 个元素 |
| `:only-of-type` | 兄弟元素中唯一的该类型元素 |

### 表单状态伪类

| 选择器 | 说明 |
|--------|------|
| `:enabled` | 可用的表单元素 |
| `:disabled` | 禁用的表单元素 |
| `:checked` | 被选中的单选框或复选框 |
| `:required` | 必填的表单元素 |
| `:optional` | 非必填的表单元素 |
| `:valid` | 验证通过的表单元素 |
| `:invalid` | 验证失败的表单元素 |
| `:in-range` | 值在指定范围内的元素 |
| `:out-of-range` | 值超出指定范围的元素 |

### 用户交互伪类

| 选择器 | 说明 |
|--------|------|
| `:hover` | 鼠标悬停时 |
| `:focus` | 元素获得焦点时 |
| `:focus-visible` | 焦点对用户可见时 |
| `:focus-within` | 元素或其子元素有焦点时 |
| `:active` | 元素被激活时（如点击） |
| `:visited` | 已访问的链接 |
| `:link` | 未访问的链接 |

### 功能性伪类

| 选择器 | 说明 | 示例 |
|--------|------|------|
| `:not()` | 排除匹配的元素 | `:not(.special)` |
| `:is()` | 匹配列表中任意选择器 | `:is(h1, h2, h3)` |
| `:where()` | 类似 `:is()` 但优先级为 0 | `:where(.btn, .link)` |
| `:has()` | 包含特定子元素的元素 | `:has(img)` |

### 其他伪类

| 选择器 | 说明 |
|--------|------|
| `:root` | 文档根元素 |
| `:empty` | 没有子元素的元素 |
| `:target` | URL 片段匹配的元素 |
| `:scope` | 当前作用域根元素 |
| `:default` | 默认的表单元素 |
| `:indeterminate` | 未定状态的复选框 |
| `:placeholder-shown` | 显示占位符的输入框 |
| `:autofill` | 浏览器自动填充的输入框 |
| `:fullscreen` | 全屏模式的元素 |
| `:modal` | 模态框状态的元素 |

### 使用示例

```css
/* 结构伪类示例 */
li:first-child {
  font-weight: bold;
}

li:nth-child(odd) {
  background-color: #f9f9f9;
}

li:nth-child(2n+1) {
  /* 等同于 odd */
  color: #666;
}

/* 表单状态示例 */
input:required {
  border-left: 3px solid #ff6b6b;
}

input:valid {
  border-color: #51cf66;
}

input:invalid {
  border-color: #ff6b6b;
}

/* 用户交互示例 */
button:hover {
  background-color: #007bff;
  transform: translateY(-2px);
}

a:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* 功能性伪类示例 */
p:not(.special) {
  color: #666;
}

:is(h1, h2, h3):hover {
  color: #007bff;
}

/* 目标元素示例 */
:target {
  background-color: #ffeb3b;
  padding: 20px;
  border-radius: 8px;
}

/* 作用域示例 */
@scope (.dark-theme) {
  :scope {
    background-color: #2d3748;
    color: #e2e8f0;
  }
  
  a {
    color: #63b3ed;
  }
}
```

### JavaScript 中的 :scope

```javascript
// :scope 代表当前作用域，即 context 的作用域
const context = document.querySelector('.container');
const selected = context.querySelectorAll(':scope > div');
```

### URL 片段匹配示例

```html
<section id="section2">Example</section>

<style>
/* 当 URL 为 http://www.example.com/index.html#section2 时 */
/* section 元素的 id 与 URL 片段匹配，此时会被选中 */
:target {
  background-color: #ffeb3b;
  padding: 20px;
  border-radius: 8px;
}
</style>
```

## ✨ 伪元素选择器

伪元素选择器用于创建和样式化文档中不存在的元素。

::: warning 重要提示
伪元素使用双冒号 `::` 语法，必须包含 `content` 属性才能显示。
:::

### 常用伪元素

| 选择器 | 说明 |
|--------|------|
| `::before` | 在元素内容前插入内容 |
| `::after` | 在元素内容后插入内容 |
| `::first-line` | 元素的第一行 |
| `::first-letter` | 元素的第一个字母 |
| `::selection` | 用户选中的文本 |
| `::placeholder` | 输入框的占位符文本 |

### 特殊伪元素

| 选择器 | 说明 |
|--------|------|
| `::backdrop` | 全屏元素的背景 |
| `::file-selector-button` | 文件输入框的按钮 |
| `::marker` | 列表项的标记 |
| `::grammar-error` | 语法错误的文本 |
| `::spelling-error` | 拼写错误的文本 |
| `::highlight()` | 自定义高亮样式 |
| `::part()` | Shadow DOM 中的部分 |
| `::slotted()` | 插槽中的元素 |
| `::target-text` | 文本片段目标 |
| `::view-transition` | 视图过渡根元素 |

### 使用示例

```css
/* 基本伪元素 */
.quote::before {
  content: """;
  font-size: 2em;
  color: #ccc;
}

.quote::after {
  content: """;
  font-size: 2em;
  color: #ccc;
}

/* 装饰性图标 */
.external-link::after {
  content: " ↗";
  color: #007bff;
  font-size: 0.8em;
}

/* 首字母大写效果 */
.drop-cap::first-letter {
  font-size: 3em;
  float: left;
  line-height: 1;
  margin-right: 8px;
  margin-top: 6px;
}

/* 第一行特殊样式 */
article p:first-child::first-line {
  font-size: 120%;
  font-weight: bold;
  color: #333;
}

/* 选中文本样式 */
::selection {
  background-color: #007bff;
  color: white;
}

/* 占位符样式 */
input::placeholder {
  color: #999;
  font-style: italic;
}

/* 文件上传按钮 */
input[type="file"]::file-selector-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* 列表标记样式 */
li::marker {
  color: #007bff;
  font-weight: bold;
}

/* 自定义列表样式 */
.custom-list {
  list-style: none;
}

.custom-list li::before {
  content: "✓ ";
  color: #28a745;
  font-weight: bold;
  margin-right: 8px;
}

/* 工具提示效果 */
.tooltip {
  position: relative;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.tooltip:hover::after {
  opacity: 1;
}

/* 加载动画 */
.loading::after {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 🔗 关系选择器

关系选择器用于选择元素之间具有特定关系的元素。

### 基本关系选择器

| 选择器 | 说明 | 示例 |
|--------|------|------|
| `E F` | 后代选择器（所有后代） | `div p` |
| `E > F` | 子选择器（直接子元素） | `ul > li` |
| `E ~ F` | 后续兄弟选择器（所有后续兄弟） | `h2 ~ p` |
| `E + F` | 相邻兄弟选择器（紧邻的下一个兄弟） | `h2 + p` |
| `E, F` | 并列选择器（同时选择多个） | `h1, h2, h3` |
| `*` | 通配符选择器（所有元素） | `*` |

### 使用示例

```css
/* 后代选择器 - 选择 article 内所有的 p 元素 */
article p {
  line-height: 1.6;
  margin-bottom: 1em;
}

/* 子选择器 - 只选择 nav 的直接子 ul 元素 */
nav > ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* 相邻兄弟选择器 - 选择紧跟在 h2 后面的 p 元素 */
h2 + p {
  margin-top: 0;
  font-weight: bold;
}

/* 后续兄弟选择器 - 选择 h2 后面所有的 p 元素 */
h2 ~ p {
  color: #666;
}

/* 并列选择器 - 同时选择多个标题元素 */
h1, h2, h3, h4, h5, h6 {
  font-family: "Georgia", serif;
  font-weight: bold;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

/* 通配符选择器 - 重置所有元素的默认样式 */
* {
  box-sizing: border-box;
}

/* 复合选择器示例 */
/* 选择 .sidebar 内第一个 .widget 的标题 */
.sidebar .widget:first-child h3 {
  margin-top: 0;
}

/* 选择表格中奇数行的单元格 */
table tr:nth-child(odd) td {
  background-color: #f9f9f9;
}

/* 选择导航菜单中活跃项的链接 */
nav ul li.active a {
  color: #007bff;
  font-weight: bold;
}
```

## 🎨 实践示例

### 响应式导航菜单

```css
/* 导航菜单样式 */
.nav {
  background-color: #333;
}

.nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.nav li {
  position: relative;
}

.nav a {
  display: block;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav a:hover,
.nav a:focus {
  background-color: #007bff;
}

/* 当前页面链接样式 */
.nav li.current a {
  background-color: #007bff;
}

/* 下拉菜单 */
.nav li:hover > ul {
  display: block;
}

.nav ul ul {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #444;
  min-width: 200px;
}

.nav ul ul a {
  padding: 10px 15px;
}
```

### 表单样式

```css
/* 表单容器 */
.form-group {
  margin-bottom: 20px;
}

/* 标签样式 */
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

/* 输入框基础样式 */
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

/* 焦点状态 */
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* 必填字段标识 */
.form-group label[for] input:required + label::after {
  content: " *";
  color: #dc3545;
}

/* 验证状态 */
.form-group input:valid {
  border-color: #28a745;
}

.form-group input:invalid:not(:placeholder-shown) {
  border-color: #dc3545;
}

/* 错误消息 */
.form-group input:invalid:not(:placeholder-shown) + .error-message {
  display: block;
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.error-message {
  display: none;
}
```

### 卡片布局

```css
/* 卡片容器 */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

/* 卡片图片 */
.card img:first-child {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* 卡片内容 */
.card-content {
  padding: 20px;
}

.card-content h3:first-child {
  margin-top: 0;
}

.card-content p:last-child {
  margin-bottom: 0;
}

/* 卡片按钮 */
.card .btn {
  margin-top: 15px;
}

.card .btn:not(:last-child) {
  margin-right: 10px;
}
```

## 📚 最佳实践

### 🚀 性能优化

::: tip 选择器性能
```css
/* ❌ 避免：复杂的后代选择器 */
.sidebar .widget .content .title span.highlight {
  color: red;
}

/* ✅ 推荐：使用类选择器 */
.highlight-text {
  color: red;
}
```
:::

::: tip 特异性管理
```css
/* 保持特异性较低，便于覆盖 */
.btn { /* 特异性: 0,0,1,0 */ }
.btn.primary { /* 特异性: 0,0,2,0 */ }
.btn.primary.large { /* 特异性: 0,0,3,0 */ }

/* 避免过高特异性 */
#header .nav ul li a.active { /* 特异性: 0,1,3,3 - 过高 */ }
```
:::

### 🛡️ 可维护性

::: tip 语义化命名
```css
/* ✅ 语义化的类名 */
.navigation-menu { }
.article-title { }
.user-profile { }

/* ❌ 避免：表现性的类名 */
.red-text { }
.big-font { }
.float-left { }
```
:::

### 🔧 兼容性处理

::: warning 浏览器兼容性
```css
/* 渐进增强 */
.element {
  background: #007bff; /* 降级方案 */
  background: linear-gradient(45deg, #007bff, #0056b3); /* 现代浏览器 */
}

/* 特性查询 */
@supports (display: grid) {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@supports not (display: grid) {
  .grid-container {
    display: flex;
    flex-wrap: wrap;
  }
}
```
:::

## 🔗 相关资源

- [MDN CSS 选择器文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)
- [CSS 选择器规范](https://www.w3.org/TR/selectors-4/)
- [Can I Use - CSS 兼容性查询](https://caniuse.com/)
- [CSS 选择器游戏](https://flukeout.github.io/)

## 📝 总结

CSS 选择器是前端开发的基础工具，掌握各种选择器的使用方法对于：

- **精确选择元素** - 准确定位需要样式化的元素
- **提高代码质量** - 编写可维护的 CSS 代码
- **优化性能** - 选择高效的选择器策略
- **增强用户体验** - 实现丰富的交互效果

通过合理使用各种选择器，可以构建出功能强大、性能优异的网页样式系统。
