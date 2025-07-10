---
title: Sass 预处理器
description: Sass 是一种 CSS 预处理器，提供变量、嵌套、混入、继承等功能，增强 CSS 的功能和灵活性
outline: deep
---

# Sass 预处理器

## 1. 概述

Sass (Syntactically Awesome StyleSheets) 是一种 CSS 预处理器，用于增强 CSS 的功能和灵活性。它扩展了 CSS，并引入了许多有用的功能，如变量、嵌套、混入、继承以及模块化的结构。

Sass 有两种语法格式：
- **SCSS (Sassy CSS)**: 使用大括号和分号，语法更接近 CSS
- **Sass (缩进语法)**: 使用缩进和换行，语法更简洁

### 1.1 主要特性

- **变量支持**: 使用 `$` 符号定义变量，便于维护
- **嵌套规则**: 支持选择器嵌套，代码结构更清晰
- **混入(Mixins)**: 代码复用，减少重复编写
- **继承**: 样式继承，避免代码重复
- **控制指令**: 条件语句和循环语句
- **内置函数**: 丰富的内置函数库
- **模块化**: 支持文件导入和模块化组织

### 1.2 Sass vs SCSS

```scss
// SCSS 语法 (推荐)
$primary-color: #007bff;
$margin: 10px;

.header {
  background-color: $primary-color;
  margin: $margin;
  
  .nav {
    padding: 5px;
  }
}
```

```sass
// Sass 语法 (缩进语法)
$primary-color: #007bff
$margin: 10px

.header
  background-color: $primary-color
  margin: $margin
  
  .nav
    padding: 5px
```

## 2. 安装与配置

### 2.1 安装方式

#### 通过 npm 安装

```bash
# 全局安装
npm install -g sass

# 项目安装
npm install --save-dev sass
```

#### 通过 Dart Sass 安装

```bash
# 推荐使用 Dart Sass (最新版本)
npm install -g sass
```

### 2.2 编译方式

#### 命令行编译

```bash
# 编译单个文件
sass input.scss output.css

# 编译并压缩
sass input.scss output.css --style compressed

# 监听文件变化
sass --watch input.scss:output.css

# 监听目录
sass --watch scss:css
```

#### 生成 Source Maps

```bash
# 生成 source map
sass input.scss output.css --source-map

# 嵌入 source map
sass input.scss output.css --embed-source-map
```

## 3. 基本语法

### 3.1 变量定义

#### 功能介绍

Sass 使用 `$` 符号定义变量，可以存储颜色、字符串、数字、布尔值、列表等值，便于重复使用和维护。

#### 基本特点

- **全局作用域**: 在文件顶层定义的变量是全局变量
- **局部作用域**: 在选择器内部定义的变量是局部变量
- **变量覆盖**: 可以使用 `!global` 强制全局变量
- **默认值**: 可以使用 `!default` 设置默认值

#### 代码示例

```scss
// 基本变量
$primary-color: #007bff;
$secondary-color: #6c757d;
$font-size: 16px;
$line-height: 1.5;

// 字符串变量
$font-family: "Helvetica Neue", Arial, sans-serif;
$image-path: "/images";

// 数值变量
$header-height: 60px;
$content-width: 1200px;

// 布尔值变量
$enable-rounded: true;
$enable-shadows: false;

// 列表变量
$font-sizes: 12px, 14px, 16px, 18px, 20px;
$colors: red, green, blue, yellow;

// 映射变量
$breakpoints: (
  small: 576px,
  medium: 768px,
  large: 992px,
  xlarge: 1200px
);

// 使用变量
.header {
  background-color: $primary-color;
  height: $header-height;
  font-family: $font-family;
  font-size: $font-size;
  line-height: $line-height;
}

// 变量作用域
$global-variable: "global";

.component {
  $local-variable: "local";
  $global-variable: "override" !global;
  
  content: $local-variable;
}

// 默认值
$baseline: 1.5 !default;
$primary-color: #333 !default;
```

### 3.2 变量插值

```scss
$prefix: "app";
$property: "margin";

.#{$prefix}-header {
  #{$property}-top: 10px;
  background-image: url("#{$image-path}/logo.png");
}

// 编译后
.app-header {
  margin-top: 10px;
  background-image: url("/images/logo.png");
}
```

### 3.3 嵌套规则

#### 功能介绍

嵌套允许在选择器内部编写子选择器，使样式结构更加清晰，与 HTML 结构保持一致。

#### 基本特点

- **层级嵌套**: 子选择器自动继承父选择器的路径
- **父选择器引用**: 使用 `&` 符号引用父选择器
- **属性嵌套**: 可以嵌套具有相同前缀的属性

#### 代码示例

```scss
// 基本嵌套
.navbar {
  background-color: $primary-color;
  padding: 1rem;
  
  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    
    .nav-item {
      display: inline-block;
      margin-right: 1rem;
      
      .nav-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        &.active {
          background-color: rgba(255, 255, 255, 0.2);
          font-weight: bold;
        }
      }
    }
  }
}

// 属性嵌套
.box {
  font: {
    family: $font-family;
    size: $font-size;
    weight: bold;
  }
  
  margin: {
    top: 10px;
    bottom: 15px;
    left: 20px;
    right: 25px;
  }
}

// 父选择器引用的高级用法
.button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  
  // 修饰符
  &--primary {
    background-color: $primary-color;
    color: white;
  }
  
  &--secondary {
    background-color: $secondary-color;
    color: white;
  }
  
  // 状态
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  // 上下文
  .sidebar & {
    width: 100%;
  }
}
```

## 4. 混入 (Mixins)

### 4.1 功能介绍

混入将一组 CSS 属性打包成可复用的代码块。它类似于函数，可以接收参数来定制样式，也可以不传递参数直接使用。

### 4.2 基本混入

```scss
// 定义基本混入
@mixin border-radius {
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
}

@mixin box-shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

// 使用混入
.card {
  @include border-radius;
  @include box-shadow;
  padding: 20px;
}
```

### 4.3 参数化混入

```scss
// 带参数的混入
@mixin border-radius($radius: 4px) {
  border-radius: $radius;
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
}

@mixin box-shadow($x: 0, $y: 2px, $blur: 4px, $color: rgba(0, 0, 0, 0.1)) {
  box-shadow: $x $y $blur $color;
  -webkit-box-shadow: $x $y $blur $color;
  -moz-box-shadow: $x $y $blur $color;
}

@mixin transition($property: all, $duration: 0.3s, $timing: ease) {
  transition: $property $duration $timing;
  -webkit-transition: $property $duration $timing;
  -moz-transition: $property $duration $timing;
}

// 使用带参数的混入
.button {
  @include border-radius(8px);
  @include box-shadow(0, 4px, 8px, rgba(0, 0, 0, 0.2));
  @include transition(all, 0.2s, ease-in-out);
}

// 关键字参数
.modal {
  @include box-shadow($blur: 10px, $color: rgba(0, 0, 0, 0.3));
}
```

### 4.4 可变参数混入

```scss
@mixin box-shadow($shadows...) {
  box-shadow: $shadows;
  -webkit-box-shadow: $shadows;
  -moz-box-shadow: $shadows;
}

// 使用可变参数
.complex-shadow {
  @include box-shadow(
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1)
  );
}
```

### 4.5 内容块混入

```scss
@mixin media-query($breakpoint) {
  @if $breakpoint == small {
    @media (max-width: 767px) {
      @content;
    }
  } @else if $breakpoint == medium {
    @media (min-width: 768px) and (max-width: 991px) {
      @content;
    }
  } @else if $breakpoint == large {
    @media (min-width: 992px) {
      @content;
    }
  }
}

// 使用内容块
.header {
  font-size: 24px;
  
  @include media-query(small) {
    font-size: 18px;
  }
  
  @include media-query(medium) {
    font-size: 20px;
  }
}
```

## 5. 继承 (Extend)

### 5.1 功能介绍

继承允许一个选择器继承另一个选择器的样式，避免重复编写相同的样式代码。

### 5.2 基本继承

```scss
// 基础样式
.button {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

// 继承基础样式
.button-primary {
  @extend .button;
  background-color: $primary-color;
  color: white;
  
  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

.button-secondary {
  @extend .button;
  background-color: $secondary-color;
  color: white;
  
  &:hover {
    background-color: darken($secondary-color, 10%);
  }
}
```

### 5.3 占位符选择器

```scss
// 占位符选择器 (不会编译到 CSS 中)
%button-base {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

// 继承占位符选择器
.btn-primary {
  @extend %button-base;
  background-color: $primary-color;
  color: white;
}

.btn-secondary {
  @extend %button-base;
  background-color: $secondary-color;
  color: white;
}
```

## 6. 控制指令

### 6.1 条件语句

#### 功能介绍

Sass 支持 `@if`、`@else if`、`@else` 条件语句，可以根据条件来选择应用哪些样式。

#### 代码示例

```scss
$theme: "dark";
$enable-rounded: true;

// 基本条件语句
@mixin theme-colors($theme) {
  @if $theme == "dark" {
    background-color: #333;
    color: white;
  } @else if $theme == "light" {
    background-color: white;
    color: #333;
  } @else {
    background-color: #f8f9fa;
    color: #495057;
  }
}

// 使用条件语句
.header {
  @include theme-colors($theme);
}

// 条件样式
.button {
  padding: 10px 20px;
  
  @if $enable-rounded {
    border-radius: 4px;
  }
}
```

### 6.2 循环语句

#### @for 循环

```scss
// @for 循环
@for $i from 1 through 5 {
  .col-#{$i} {
    width: 20% * $i;
  }
}

// 生成网格系统
@for $i from 1 through 12 {
  .col-#{$i} {
    width: percentage($i / 12);
  }
}
```

#### @each 循环

```scss
// @each 循环
$colors: primary, secondary, success, warning, danger;

@each $color in $colors {
  .text-#{$color} {
    color: var(--#{$color}-color);
  }
  
  .bg-#{$color} {
    background-color: var(--#{$color}-color);
  }
}

// 遍历映射
$social-colors: (
  facebook: #3b5998,
  twitter: #1da1f2,
  instagram: #e1306c,
  youtube: #ff0000
);

@each $network, $color in $social-colors {
  .btn-#{$network} {
    background-color: $color;
    color: white;
  }
}
```

#### @while 循环

```scss
$index: 6;

@while $index > 0 {
  .item-#{$index} {
    width: 10px * $index;
  }
  $index: $index - 2;
}
```

## 7. 内置函数

### 7.1 功能介绍

Sass 提供了丰富的内置函数，用于处理颜色、字符串、数字、列表、映射等数据类型。

### 7.2 常用内置函数

#### 数学函数

| 函数名 | 描述 | 示例 |
|--------|------|------|
| `percentage()` | 转换为百分比 | `percentage(0.8)` → `80%` |
| `round()` | 四舍五入 | `round(20.6px)` → `21px` |
| `ceil()` | 向上取整 | `ceil(20.2px)` → `21px` |
| `floor()` | 向下取整 | `floor(20.8px)` → `20px` |
| `abs()` | 绝对值 | `abs(-10px)` → `10px` |
| `min()` | 最小值 | `min(10px, 20px, 5px)` → `5px` |
| `max()` | 最大值 | `max(10px, 20px, 5px)` → `20px` |
| `random()` | 随机数 | `random()` → `0.8394` |

#### 颜色函数

| 函数名 | 描述 | 示例 |
|--------|------|------|
| `lighten()` | 变亮 | `lighten(#000, 20%)` → `#333` |
| `darken()` | 变暗 | `darken(#fff, 20%)` → `#ccc` |
| `saturate()` | 增加饱和度 | `saturate(#c69, 20%)` |
| `desaturate()` | 降低饱和度 | `desaturate(#c69, 20%)` |
| `adjust-hue()` | 调整色相 | `adjust-hue(#c69, 20deg)` |
| `complement()` | 补色 | `complement(#c69)` |
| `mix()` | 混合颜色 | `mix(#c69, #fff, 50%)` |
| `rgba()` | 设置透明度 | `rgba(#c69, 0.5)` |

#### 字符串函数

| 函数名 | 描述 | 示例 |
|--------|------|------|
| `quote()` | 添加引号 | `quote(hello)` → `"hello"` |
| `unquote()` | 移除引号 | `unquote("hello")` → `hello` |
| `str-length()` | 字符串长度 | `str-length("hello")` → `5` |
| `str-slice()` | 截取字符串 | `str-slice("hello", 2, 4)` → `"ell"` |
| `to-upper-case()` | 转大写 | `to-upper-case("hello")` → `"HELLO"` |
| `to-lower-case()` | 转小写 | `to-lower-case("HELLO")` → `"hello"` |

### 7.3 自定义函数

```scss
// 自定义函数
@function calculate-rem($px) {
  @return $px / 16px * 1rem;
}

@function power($base, $exponent) {
  $result: 1;
  @for $i from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}

// 使用自定义函数
.text {
  font-size: calculate-rem(24px); // 1.5rem
  margin: calculate-rem(16px);    // 1rem
}

.scale {
  transform: scale(power(2, 3)); // scale(8)
}
```

## 8. 模块化和组织

### 8.1 文件导入

#### 功能介绍

Sass 支持使用 `@import` 和 `@use` 指令来导入其他 Sass 文件，实现模块化开发。

#### 代码示例

```scss
// 传统 @import 方式
@import "variables";
@import "mixins";
@import "base";
@import "components/buttons";
@import "components/forms";

// 现代 @use 方式 (推荐)
@use "variables" as *;
@use "mixins" as mix;
@use "base";
```

### 8.2 模块系统

```scss
// _variables.scss
$primary-color: #007bff !default;
$secondary-color: #6c757d !default;

// _mixins.scss
@mixin button-style($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

// main.scss
@use "variables" as vars;
@use "mixins";

.primary-button {
  @include mixins.button-style(vars.$primary-color);
}
```

### 8.3 文件组织结构

```
styles/
├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _utilities.scss
├── components/
│   ├── _buttons.scss
│   ├── _forms.scss
│   └── _cards.scss
├── layout/
│   ├── _header.scss
│   ├── _footer.scss
│   └── _grid.scss
├── pages/
│   ├── _home.scss
│   └── _about.scss
├── vendors/
│   └── _bootstrap.scss
└── main.scss
```

## 9. 高级特性

### 9.1 映射 (Maps)

```scss
// 定义映射
$breakpoints: (
  small: 576px,
  medium: 768px,
  large: 992px,
  xlarge: 1200px
);

$theme-colors: (
  primary: #007bff,
  secondary: #6c757d,
  success: #28a745,
  warning: #ffc107,
  danger: #dc3545
);

// 使用映射
@each $name, $color in $theme-colors {
  .text-#{$name} {
    color: $color;
  }
  
  .bg-#{$name} {
    background-color: $color;
  }
}

// 映射函数
@function get-color($color-name) {
  @return map-get($theme-colors, $color-name);
}

.custom-button {
  background-color: get-color(primary);
}
```

### 9.2 列表操作

```scss
$font-stack: "Helvetica Neue", Helvetica, Arial, sans-serif;
$margins: 10px 15px 20px 25px;

.text {
  font-family: $font-stack;
  margin: $margins;
}

// 列表函数
$colors: red, green, blue;
.first-color { color: nth($colors, 1); } // red
.list-length { content: "#{length($colors)}"; } // 3
```

### 9.3 字符串插值

```scss
$prefix: "app";
$version: "1.0";

.#{$prefix}-header {
  content: "Version #{$version}";
}
```

## 10. 最佳实践

### 10.1 命名规范

```scss
// 使用有意义的变量名
$primary-color: #007bff;
$secondary-color: #6c757d;
$success-color: #28a745;
$warning-color: #ffc107;
$danger-color: #dc3545;

// 使用 BEM 命名约定
.block {
  &__element {
    &--modifier {
      // 样式
    }
  }
}

// 使用前缀分组
$color-primary: #007bff;
$color-secondary: #6c757d;
$spacing-small: 8px;
$spacing-medium: 16px;
$spacing-large: 24px;
```

### 10.2 代码组织

```scss
// 1. 导入
@use "sass:math";
@use "variables" as *;
@use "mixins" as *;

// 2. 变量
$local-variable: value;

// 3. 混入
@mixin component-mixin {
  // 样式
}

// 4. 基础样式
.component {
  // 基础样式
}

// 5. 变体和状态
.component {
  &--variant {
    // 变体样式
  }
  
  &:hover {
    // 状态样式
  }
}
```

### 10.3 性能优化

```scss
// 使用占位符选择器而不是类选择器
%button-base {
  display: inline-block;
  padding: 10px 20px;
}

// 避免过深的嵌套
.header {
  .nav {
    .menu {
      // 最多三层嵌套
    }
  }
}

// 使用 @use 而不是 @import
@use "variables";
@use "mixins";
```

## 11. 常见问题

### 11.1 编译错误

**问题**: 变量未定义
```scss
// 错误
.element {
  color: $undefined-color;
}
```

**解决方案**:
```scss
// 正确
$primary-color: #007bff;

.element {
  color: $primary-color;
}
```

### 11.2 嵌套过深

**问题**: 过深的嵌套导致 CSS 选择器过于复杂
```scss
// 避免
.header {
  .nav {
    .menu {
      .item {
        .link {
          // 过深的嵌套
        }
      }
    }
  }
}
```

**解决方案**:
```scss
// 推荐
.header {
  // 基础样式
}

.nav {
  // 导航样式
}

.menu-item {
  // 菜单项样式
}

.menu-link {
  // 链接样式
}
```

### 11.3 混入 vs 继承

**混入适用场景**:
- 需要传递参数
- 动态生成样式
- 不会产生多余的 CSS

**继承适用场景**:
- 样式完全相同
- 不需要参数
- 可以减少 CSS 文件大小

## 12. 与其他工具集成

### 12.1 构建工具

#### Webpack 配置
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
};
```

#### Vite 配置
```javascript
// vite.config.js
export default {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables" as *;`
      }
    }
  }
};
```

### 12.2 VS Code 插件

推荐插件：
- **Sass**: 语法高亮和智能提示
- **Live Sass Compiler**: 实时编译
- **Sass Formatter**: 代码格式化

## 13. 参考资料

- [Sass 官方文档](https://sass-lang.com/)
- [Sass 函数参考](https://sass-lang.com/documentation/modules)
- [Sass 指南](https://sass-guidelin.es/)
- [Sass 在线编译器](https://www.sassmeister.com/)
- [Sass 最佳实践](https://sass-guidelin.es/#architecture)

## 14. 总结

Sass 作为一个强大的 CSS 预处理器，提供了丰富的功能来增强 CSS 的开发体验：

### 核心特性
- **变量**: 统一管理样式值，提高可维护性
- **嵌套**: 更直观的层级结构，代码组织更清晰
- **混入**: 代码复用和模块化，减少重复编写
- **继承**: 样式继承和扩展，优化 CSS 输出
- **控制指令**: 条件语句和循环，增强动态生成能力
- **函数**: 复杂计算和处理，提供强大的数据处理能力

### 优势
- **提高开发效率**: 减少重复代码编写
- **增强可维护性**: 变量和模块化使代码更易维护
- **更好的组织结构**: 嵌套和模块化提供清晰的代码结构
- **动态生成**: 控制指令允许动态生成样式

这些特性让样式表更加模块化、可维护和可扩展，大大提高了前端开发的效率和质量。
