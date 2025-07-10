---
title: LESS 预处理器
description: LESS 是一个 CSS 预处理器，提供变量、嵌套、运算、混入等特性，让样式表更易于维护
outline: deep
---

# LESS 预处理器

## 1. 概述

LESS (Leaner Style Sheets) 是一个 CSS 预处理器，可以为网站启用可自定义、可管理和可重用的样式表。LESS 是一种动态样式表语言，扩展了 CSS 的功能，并且跨浏览器友好。

CSS 预处理器是一种脚本语言，可扩展 CSS 并将其编译为常规 CSS 语法，以便可以通过 Web 浏览器读取。它提供诸如变量、函数、mixins 和操作等功能，可以构建动态 CSS。

### 1.1 主要特性

- **变量支持**: 定义和使用变量，便于样式管理
- **嵌套规则**: 支持选择器嵌套，代码结构更清晰
- **运算操作**: 支持数学运算，动态计算样式值
- **混入(Mixins)**: 代码复用，减少重复编写
- **函数库**: 内置丰富的函数，处理颜色、字符串、数学等
- **继承**: 样式继承，代码更简洁

## 2. 安装与配置

### 2.1 安装方式

#### 通过 npm 安装

```bash
# 全局安装
npm install -g less

# 项目安装
npm install --save-dev less
```

#### 通过 CDN 引入

```html
<script src="https://cdn.jsdelivr.net/npm/less@4"></script>
```

### 2.2 编译方式

#### 命令行编译

```bash
# 编译单个文件
lessc styles.less styles.css

# 编译并压缩
lessc --clean-css styles.less styles.min.css

# 监听文件变化
lessc --watch styles.less styles.css
```

#### 在线编译

```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<script src="https://cdn.jsdelivr.net/npm/less@4"></script>
```

## 3. 基本语法

### 3.1 变量定义

#### 功能介绍

LESS 变量是存储要在整个样式表中重复使用的值的方法。变量使用 `@` 符号声明，可以存储颜色、字符串、布尔值、数字等。

#### 代码示例

```less
// 基本变量
@primary-color: #007bff;
@secondary-color: #6c757d;
@font-size: 16px;
@border-radius: 4px;

// 字符串变量
@font-family: "Helvetica Neue", sans-serif;
@image-path: "/images";

// 数值变量
@header-height: 60px;
@content-width: 1200px;

// 布尔值变量
@enable-rounded: true;
@enable-shadows: false;

// 使用变量
.header {
  background-color: @primary-color;
  height: @header-height;
  font-family: @font-family;
}

.button {
  background-color: @secondary-color;
  font-size: @font-size;
  border-radius: @border-radius;
}
```

### 3.2 变量插值

```less
// 选择器变量
@my-selector: banner;
@my-property: color;

// 属性变量
@border-style: border-style;
@solid: solid;

// URL 变量
@images: "../../img";

// 声明变量
@background: {
  background-color: red;
  border: 1px solid black;
};

// 使用变量插值
.@{my-selector} {
  @{my-property}: blue;
  @{border-style}: @solid;
  background-image: url("@{images}/logo.png");
  @background();
}
```

### 3.3 嵌套规则

#### 功能介绍

LESS 允许您将 CSS 选择器嵌套在其他选择器内部，这使得代码结构更清晰，更容易维护。

#### 代码示例

```less
/* 多行注释，会编译到CSS文件中 */
// 单行注释，编译时会去掉

.container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  
  .header {
    background-color: @primary-color;
    width: 100%;
    padding: 20px;
    
    .nav {
      width: 100px;
      height: 100px;
      
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        
        li {
          display: inline-block;
          margin-right: 20px;
          
          a {
            color: white;
            text-decoration: none;
            
            &:hover {
              color: @secondary-color;
            }
          }
        }
      }
    }
  }
}
```

### 3.4 父选择器引用

```less
// 使用 & 引用父选择器
.button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  
  // 悬停状态
  &:hover {
    background-color: @primary-color;
  }
  
  // 激活状态
  &:active {
    transform: scale(0.95);
  }
  
  // 禁用状态
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  // 修饰符类
  &.large {
    padding: 15px 30px;
    font-size: 18px;
  }
  
  &.small {
    padding: 5px 10px;
    font-size: 12px;
  }
}
```

## 4. 运算操作

### 4.1 功能介绍

LESS 支持算术运算，包括加号(+)、减号(-)、乘法(*)和除法(/)，它们可以对任何数字、颜色或变量进行操作。运算操作节省了大量的时间，让样式计算更加灵活。

### 4.2 数学运算

```less
@base-font-size: 16px;
@line-height: 1.5;
@spacing: 10px;

.content {
  // 加法运算
  margin: @spacing + 5px;
  
  // 减法运算
  padding: @spacing - 2px;
  
  // 乘法运算
  font-size: @base-font-size * 1.2;
  
  // 除法运算
  line-height: @line-height / 1.2;
  
  // 混合运算
  width: (@spacing * 2) + (@base-font-size / 2);
}
```

### 4.3 颜色运算

```less
@base-color: #007bff;

.color-operations {
  // 颜色加法
  background-color: @base-color + #111;
  
  // 颜色减法
  border-color: @base-color - #222;
  
  // 颜色乘法
  color: @base-color * 2;
  
  // 颜色除法
  box-shadow: 0 2px 4px (@base-color / 3);
}
```

## 5. 混入 (Mixins)

### 5.1 功能介绍

混入类似于编程语言中的函数。Mixins 是一组 CSS 属性，允许您将一个类的属性用于另一个类，并且包含类名作为其属性。可以存储多个值，并且可以在必要时在代码中重复使用。

### 5.2 基本混入

```less
// 定义基本混入
.border-radius {
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
}

.box-shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

// 使用混入
.button {
  .border-radius;
  .box-shadow;
  background-color: @primary-color;
}
```

### 5.3 参数化混入

```less
// 定义带参数的混入
.border-radius(@radius: 4px) {
  border-radius: @radius;
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
}

.border(@width: 1px; @style: solid; @color: #ccc) {
  border: @width @style @color;
}

.transition(@property: all; @duration: 0.3s; @timing: ease) {
  transition: @property @duration @timing;
  -webkit-transition: @property @duration @timing;
  -moz-transition: @property @duration @timing;
}

// 使用带参数的混入
.card {
  .border-radius(8px);
  .border(2px, solid, @primary-color);
  .transition(all, 0.2s, ease-in-out);
}
```

### 5.4 守卫混入

```less
// 定义带守卫的混入
.border-radius(@radius) when (@radius > 0) {
  border-radius: @radius;
}

.font-size(@size) when (@size > 10px) {
  font-size: @size;
}

.font-size(@size) when (@size <= 10px) {
  font-size: 10px;
}

// 复杂守卫条件
.button-style(@color) when (lightness(@color) >= 50%) {
  background-color: @color;
  color: black;
}

.button-style(@color) when (lightness(@color) < 50%) {
  background-color: @color;
  color: white;
}

// 使用守卫混入
.button-primary {
  .button-style(@primary-color);
}
```

## 6. 内置函数

### 6.1 功能介绍

LESS 映射具有值操作的 JavaScript 代码，并使用预定义的函数来操纵样式表中的 HTML 元素。它提供了操作颜色、字符串、数学等的丰富函数库。

### 6.2 常用函数列表

| 函数类别 | 函数名 | 描述 | 示例 |
|----------|--------|------|------|
| **颜色函数** | `lighten()` | 增加颜色亮度 | `lighten(#007bff, 20%)` |
| | `darken()` | 降低颜色亮度 | `darken(#007bff, 20%)` |
| | `saturate()` | 增加颜色饱和度 | `saturate(#007bff, 20%)` |
| | `desaturate()` | 降低颜色饱和度 | `desaturate(#007bff, 20%)` |
| | `fade()` | 设置颜色透明度 | `fade(#007bff, 50%)` |
| | `spin()` | 旋转色相 | `spin(#007bff, 30)` |
| | `mix()` | 混合两种颜色 | `mix(#007bff, #ffffff, 50%)` |
| **数学函数** | `ceil()` | 向上取整 | `ceil(0.7)` → `1` |
| | `floor()` | 向下取整 | `floor(3.3)` → `3` |
| | `round()` | 四舍五入 | `round(3.77)` → `4` |
| | `abs()` | 绝对值 | `abs(-5)` → `5` |
| | `min()` | 最小值 | `min(10, 20, 5)` → `5` |
| | `max()` | 最大值 | `max(10, 20, 5)` → `20` |
| | `percentage()` | 转换为百分比 | `percentage(0.2)` → `20%` |
| **字符串函数** | `escape()` | URL 编码 | `escape("Hello World")` |
| | `e()` | 字符串转义 | `e("Hello")` → `Hello` |
| | `replace()` | 替换字符串 | `replace("Hello", "H", "J")` |
| **类型函数** | `isnumber()` | 判断是否为数字 | `isnumber(1234)` → `true` |
| | `isstring()` | 判断是否为字符串 | `isstring("test")` → `true` |
| | `iscolor()` | 判断是否为颜色 | `iscolor(#fff)` → `true` |
| | `ispixel()` | 判断是否为像素值 | `ispixel(10px)` → `true` |

### 6.3 函数使用示例

```less
@base-color: #007bff;
@light-color: lighten(@base-color, 20%);
@dark-color: darken(@base-color, 20%);

.color-examples {
  background-color: @base-color;
  border-color: @light-color;
  box-shadow: 0 2px 4px @dark-color;
  
  // 数学函数
  width: percentage(0.8);
  padding: ceil(15.3px);
  margin: floor(12.8px);
  
  // 条件判断
  & when (isnumber(@base-font-size)) {
    font-size: @base-font-size;
  }
}
```

## 7. 高级特性

### 7.1 继承 (Extend)

#### 功能介绍

Extend 是一个 LESS 伪类，它通过使用 `:extend` 选择器在一个选择器中扩展其他选择器样式。

#### 代码示例

```less
.base-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.primary-button {
  &:extend(.base-button);
  background-color: @primary-color;
  color: white;
}

.secondary-button {
  &:extend(.base-button);
  background-color: @secondary-color;
  color: white;
}

// 扩展伪类
.hover-effect:hover {
  transform: translateY(-2px);
}

.card {
  &:extend(.hover-effect:hover);
  background: white;
  border: 1px solid #eee;
}
```

### 7.2 命名空间和访问器

#### 功能介绍

将 mixins 分组在通用名称下。使用命名空间可以避免名称冲突，并从外部封装 mixin 组。

#### 代码示例

```less
// 定义命名空间
.buttons {
  .base(@bg: #ccc; @color: #333) {
    background-color: @bg;
    color: @color;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  
  .primary {
    .base(@primary-color, white);
  }
  
  .secondary {
    .base(@secondary-color, white);
  }
}

.forms {
  .input(@border-color: #ccc) {
    border: 1px solid @border-color;
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .error {
    .input(red);
  }
}

// 使用命名空间
.my-button {
  .buttons > .primary;
}

.my-input {
  .forms > .input(#007bff);
}
```

### 7.3 循环结构

#### 功能介绍

当递归 mixin 与 Guard 表达式和模式匹配组合时，可以创建各种迭代/循环结构。

#### 代码示例

```less
// 生成网格系统
.generate-columns(@n, @i: 1) when (@i =< @n) {
  .col-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}

// 生成 12 列网格
.generate-columns(12);

// 生成动画延迟
.generate-delays(@n, @i: 1) when (@i =< @n) {
  .delay-@{i} {
    animation-delay: (@i * 0.1s);
  }
  .generate-delays(@n, (@i + 1));
}

// 生成 10 个延迟类
.generate-delays(10);
```

### 7.4 条件和守卫

```less
// 基于变量的条件
@theme: dark;

.theme-styles() when (@theme = dark) {
  background-color: #333;
  color: white;
}

.theme-styles() when (@theme = light) {
  background-color: white;
  color: #333;
}

// 基于数值的条件
.responsive-font(@size) when (@size > 20px) {
  font-size: @size;
  line-height: 1.2;
}

.responsive-font(@size) when (@size <= 20px) {
  font-size: @size;
  line-height: 1.4;
}

// 使用条件
.header {
  .theme-styles();
  .responsive-font(24px);
}
```

## 8. 文件组织

### 8.1 导入文件

```less
// 导入其他 LESS 文件
@import "variables.less";
@import "mixins.less";
@import "base.less";

// 导入 CSS 文件
@import "normalize.css";

// 条件导入
@import "mobile.less" (max-width: 768px);

// 导入一次（避免重复导入）
@import-once "utils.less";
```

### 8.2 文件结构建议

```
styles/
├── variables.less      # 变量定义
├── mixins.less        # 混入定义
├── base.less          # 基础样式
├── components/        # 组件样式
│   ├── buttons.less
│   ├── forms.less
│   └── cards.less
├── layouts/           # 布局样式
│   ├── header.less
│   ├── footer.less
│   └── grid.less
└── main.less          # 主入口文件
```

## 9. 转义和字符串处理

### 9.1 转义

#### 功能介绍

转义允许你动态构建选择器，并使用属性或变量值作为任意字符串。

#### 代码示例

```less
// 基本转义
.selector {
  color: ~"red";
  content: ~"'Hello World'";
}

// 变量转义
@prefix: ~"webkit";
@property: ~"transform";

.element {
  -@{prefix}-@{property}: scale(1.2);
}

// 编译后的 CSS
.element {
  -webkit-transform: scale(1.2);
}
```

### 9.2 字符串插值

```less
@base-url: "https://example.com";
@image-path: "/images";

.background-image {
  background-image: url("@{base-url}@{image-path}/bg.jpg");
}
```

## 10. 最佳实践

### 10.1 变量命名规范

```less
// 使用有意义的名称
@primary-color: #007bff;
@secondary-color: #6c757d;
@success-color: #28a745;
@warning-color: #ffc107;
@error-color: #dc3545;

// 使用分层命名
@font-size-small: 12px;
@font-size-base: 16px;
@font-size-large: 20px;

@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 32px;
```

### 10.2 代码组织

```less
// 1. 导入文件
@import "variables.less";
@import "mixins.less";

// 2. 全局变量
@enable-responsive: true;
@enable-animations: true;

// 3. 基础样式
html, body {
  margin: 0;
  padding: 0;
  font-family: @font-family-base;
}

// 4. 组件样式
.component {
  // 组件特定的样式
}
```

### 10.3 性能优化

- 合理使用混入，避免产生过多冗余代码
- 使用 `&:extend()` 而不是混入来共享样式
- 避免过深的嵌套层级
- 使用变量管理颜色和尺寸

## 11. 常见问题

### 11.1 编译错误

**问题**: 变量未定义
```less
// 错误：变量未定义
.element {
  color: @undefined-variable;
}
```

**解决方案**:
```less
// 正确：先定义变量
@primary-color: #007bff;

.element {
  color: @primary-color;
}
```

### 11.2 作用域问题

**问题**: 变量作用域混乱
```less
@color: red;

.parent {
  @color: blue;
  color: @color; // blue
  
  .child {
    color: @color; // blue（继承父级作用域）
  }
}
```

### 11.3 运算单位问题

**问题**: 不同单位之间的运算
```less
// 错误：不同单位运算
.element {
  width: 100px + 2em; // 可能产生意外结果
}
```

**解决方案**:
```less
// 正确：使用相同单位
.element {
  width: 100px + 20px; // 或者使用 calc()
  width: calc(100px + 2em);
}
```

## 12. 参考资料

- [LESS 官方文档](https://lesscss.org/)
- [LESS 函数参考](https://lesscss.org/functions/)
- [LESS 在线编译器](https://lesscss.org/less-preview/)
- [LESS 语法高亮插件](https://github.com/less/less-docs)
- [LESS 最佳实践指南](https://github.com/less/less.js/wiki/Best-Practices)

## 13. 相关工具

### 13.1 编辑器支持

- **VS Code**: Less IntelliSense
- **Sublime Text**: LESS 语法高亮
- **WebStorm**: 内置 LESS 支持

### 13.2 构建工具集成

- **Webpack**: less-loader
- **Gulp**: gulp-less
- **Grunt**: grunt-contrib-less
- **Vite**: 内置 LESS 支持
