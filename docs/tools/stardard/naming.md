---
title: 📝 前端命名规范完全指南
description: 前端开发中的命名规范，包括HTML、CSS、JavaScript的命名约定和最佳实践
outline: deep
---

# 📝 前端命名规范完全指南

> 统一的命名规范是团队协作的基础，能够提高代码的可读性、可维护性和团队开发效率。

## 📖 概述

### ✨ 命名规范的重要性

| 优势 | 描述 | 影响 |
|------|------|------|
| 🔍 **可读性** | 清晰的命名提高代码理解速度 | 降低学习成本 |
| 🛠️ **可维护性** | 统一规范便于代码维护 | 减少维护成本 |
| 👥 **团队协作** | 统一标准提升协作效率 | 提高开发效率 |
| 🐛 **减少错误** | 规范命名减少命名冲突 | 提升代码质量 |
| 📚 **知识传承** | 标准化便于知识传递 | 降低人员流动成本 |

### 🎯 常见命名方式

| 命名方式 | 格式 | 示例 | 适用场景 |
|----------|------|------|----------|
| **Pascal Case** | 大驼峰式 | `StudentInfo`, `UserInfo` | 类名、构造函数 |
| **Camel Case** | 小驼峰式 | `studentInfo`, `userInfo` | 变量、函数名 |
| **Kebab Case** | 烤串命名法 | `student-info`, `user-info` | CSS类名、文件名 |
| **Snake Case** | 蛇形命名法 | `student_info`, `user_info` | 常量、数据库字段 |
| **Upper Case** | 全大写 | `MAX_COUNT`, `API_URL` | 常量定义 |

## 📄 HTML 文档规范

### 🏗️ 文档结构规范

使用 HTML5 的文档声明类型 `<!DOCTYPE html>` 来开启标准模式。若不添加该声明，浏览器会开启怪异模式，按照浏览器自己的解析方式渲染页面，那么，在不同的浏览器下面可能会有不同的样式。

```html
<!-- HTML5文档声明使用标准模式 -->
<!DOCTYPE html>
<!-- 定义文档使用的语言，浏览器会根据语言进行排版和格式化 -->
<html lang="zh-CN">
  <head>
    <!-- 统一使用 UTF-8 编码，避免乱码问题 -->
    <meta charset="UTF-8" />
    <!-- 移动端定义视口宽度 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- SEO 优化 -->
    <meta name="description" content="页面描述" />
    <meta name="keywords" content="关键词1,关键词2" />
    <title>页面标题</title>
  </head>
  <body>
    <!-- 使用语义化标签代替div进行布局 -->
    <header>
      <nav>
        <ul>
          <li><a href="#home">首页</a></li>
          <li><a href="#about">关于</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <section>
        <article>
          <h1>文章标题</h1>
          <p>文章内容...</p>
        </article>
      </section>
    </main>
    
    <footer>
      <p>&copy; 2024 版权信息</p>
    </footer>
  </body>
</html>
```

### 🏷️ 语义化标签使用

| 标签 | 语义 | 使用场景 |
|------|------|----------|
| `<header>` | 页面或区块头部 | 网站头部、文章头部 |
| `<nav>` | 导航链接 | 主导航、面包屑导航 |
| `<main>` | 主要内容 | 页面主体内容 |
| `<section>` | 独立的内容区块 | 文章章节、功能模块 |
| `<article>` | 独立的文章内容 | 博客文章、新闻条目 |
| `<aside>` | 侧边栏内容 | 相关链接、广告区域 |
| `<footer>` | 页面或区块底部 | 网站底部、文章底部 |

## 📁 文件资源命名规范

### 📝 基本原则

::: tip 💡 文件命名原则
- **推荐使用烤串命名法** (kebab-case)
- **文件名不得含有空格**
- **建议只使用小写字母**，不使用大写字母
- **使用相对路径**引入资源
- **避免特殊字符**，只使用字母、数字、连字符
:::

### 🎯 文件类型命名规范

#### 📄 HTML 文件

```bash
# 页面文件
index.html
home.html
about-us.html
contact-us.html
user-profile.html
product-detail.html

# 模板文件
header-template.html
footer-template.html
sidebar-template.html
```

#### 🎨 CSS 文件

```bash
# 样式文件
style.css
main.css
reset.css
normalize.css
components.css
utilities.css

# 模块样式
header.css
navigation.css
sidebar.css
footer.css
```

#### 📜 JavaScript 文件

```bash
# 脚本文件
main.js
app.js
utils.js
config.js
constants.js

# 模块文件
user-service.js
product-manager.js
data-validator.js
```

#### 🖼️ 图片文件

```bash
# 图标文件
icon-home.png
icon-user.svg
icon-search.png

# 背景图片
bg-header.jpg
bg-hero-section.jpg
bg-pattern.png

# 内容图片
product-image-1.jpg
user-avatar-default.png
banner-promotion.jpg
```

### 🔗 资源引入规范

引入资源使用相对路径，不要指定资源所带的具体协议 (`http:`, `https:`)，除非这两者协议都不可用。

```html
<!-- ✅ 推荐：协议相对URL -->
<script src="//cdn.bootcss.com/vue/2.6.10/vue.common.dev.js"></script>
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans">

<!-- ❌ 不推荐：硬编码协议 -->
<script src="https://cdn.bootcss.com/vue/2.6.10/vue.common.dev.js"></script>
<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans">

<!-- ✅ 推荐：相对路径 -->
<link rel="stylesheet" href="../css/main.css">
<script src="./js/app.js"></script>
```

## 🔤 JavaScript 命名规范

### 📝 变量命名

**命名方式**: 小驼峰式命名方法 (camelCase)
**命名规范**: 类型+对象描述的方式，如果没有明确的类型，就可以使前缀为名词

#### 🎯 变量类型前缀

| 类型 | 前缀 | 示例 |
|------|------|------|
| **String** | `str` | `strUserName`, `strTitle` |
| **Number** | `num` | `numCount`, `numPrice` |
| **Boolean** | `is/has/can` | `isVisible`, `hasData`, `canEdit` |
| **Array** | `arr/list` | `arrUsers`, `listProducts` |
| **Object** | `obj/data` | `objUser`, `dataConfig` |
| **Function** | `fn` | `fnCallback`, `fnValidator` |

#### ✅ 推荐示例

```javascript
// ✅ 推荐：语义清晰的变量名
const userName = "张三";
const userAge = 25;
const isUserActive = true;
const userList = [];
const userInfo = {};

// ✅ 推荐：布尔值使用is/has/can前缀
const isLoading = false;
const hasPermission = true;
const canEdit = false;

// ✅ 推荐：数组使用复数形式
const users = [];
const products = [];
const categories = [];
```

#### ❌ 不推荐示例

```javascript
// ❌ 不推荐：含糊不清的命名
const getTitle = "LoginTable"; // 应该是 tableTitle
const data = {}; // 太模糊，应该具体说明
const temp = []; // 临时变量也应该有意义的名字
const a = 10; // 单字母变量名
```

### 🔢 常量命名

**命名方法**: 全部大写 (UPPER_CASE)
**命名规范**: 使用大写字母和下划线来组合命名，下划线用以分割单词

```javascript
// ✅ 推荐：常量命名
const MAX_COUNT = 10;
const MIN_COUNT = 1;
const API_BASE_URL = "https://api.example.com";
const DEFAULT_TIMEOUT = 5000;
const ERROR_MESSAGES = {
  NETWORK_ERROR: "网络连接失败",
  VALIDATION_ERROR: "数据验证失败",
  PERMISSION_DENIED: "权限不足"
};

// 配置常量
const CONFIG = {
  API_VERSION: "v1",
  MAX_FILE_SIZE: 1024 * 1024 * 5, // 5MB
  SUPPORTED_FORMATS: ["jpg", "png", "gif"]
};
```

### 🔧 函数命名

**命名方式**: 小驼峰方式 (camelCase) - 构造函数使用大驼峰命名法 (PascalCase)
**命名规则**: 前缀为动词

#### 🎯 函数动词前缀

| 前缀 | 含义 | 示例 |
|------|------|------|
| **can** | 判断是否可执行某个动作 | `canEdit()`, `canDelete()` |
| **has** | 判断是否含有某个值 | `hasPermission()`, `hasData()` |
| **is** | 判断是否为某个值 | `isVisible()`, `isValid()` |
| **get** | 获取某个值 | `getUserInfo()`, `getConfig()` |
| **set** | 设置某个值 | `setUserName()`, `setConfig()` |
| **load** | 加载数据 | `loadUserData()`, `loadConfig()` |
| **save** | 保存数据 | `saveUserInfo()`, `saveSettings()` |
| **create** | 创建 | `createUser()`, `createElement()` |
| **update** | 更新 | `updateUserInfo()`, `updateStatus()` |
| **delete** | 删除 | `deleteUser()`, `removeItem()` |
| **validate** | 验证 | `validateForm()`, `validateEmail()` |
| **format** | 格式化 | `formatDate()`, `formatCurrency()` |
| **parse** | 解析 | `parseJSON()`, `parseURL()` |
| **render** | 渲染 | `renderComponent()`, `renderList()` |
| **handle** | 处理事件 | `handleClick()`, `handleSubmit()` |

#### ✅ 函数命名示例

```javascript
// ✅ 推荐：清晰的函数命名
function getUserById(id) {
  return users.find(user => user.id === id);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount);
}

function handleFormSubmit(event) {
  event.preventDefault();
  // 处理表单提交逻辑
}

// 构造函数使用大驼峰
function UserManager(config) {
  this.config = config;
}

class ProductService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }
  
  async fetchProducts() {
    return await this.apiClient.get('/products');
  }
}
```

### 🏗️ 类和构造函数命名

```javascript
// ✅ 推荐：类名使用大驼峰
class UserManager {
  constructor(config) {
    this.config = config;
  }
}

class ProductService {
  // 类方法使用小驼峰
  getProductById(id) {
    // 实现逻辑
  }
}

// 构造函数
function UserValidator(rules) {
  this.rules = rules;
}
```

## 🎨 CSS 命名规范

### 🎯 基本原则

1. **id** 采用驼峰式命名 (camelCase)
2. **Less/Sass** 中的变量、函数、混合等采用驼峰式命名
3. **class** 使用 BEM 规范

### 🏗️ BEM 规范详解

**BEM 规范** (Block, Element, Modifier) 是一种基于组件化的前端开发方式，旨在提升界面开发效率和代码复用性。

#### 📝 BEM 核心概念

| 概念 | 说明 | 示例 |
|------|------|------|
| **Block** | 页面上的独立功能单元 | `button`, `menu`, `header` |
| **Element** | Block 的组成部分 | `button__icon`, `menu__item` |
| **Modifier** | Block 或 Element 的状态/变体 | `button--disabled`, `menu--vertical` |

#### 🔤 BEM 命名规则

```css
/* 命名格式：block__element--modifier */

/* Block */
.button { }
.menu { }
.card { }

/* Element */
.button__icon { }
.button__text { }
.menu__item { }
.menu__link { }
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.button--primary { }
.button--disabled { }
.button--large { }
.menu--vertical { }
.menu--horizontal { }
.card--highlighted { }
```

#### ✅ BEM 实际应用示例

```html
<!-- 按钮组件 -->
<button class="button button--primary button--large">
  <span class="button__icon">👤</span>
  <span class="button__text">登录</span>
</button>

<!-- 卡片组件 -->
<div class="card card--featured">
  <div class="card__header">
    <h3 class="card__title">产品标题</h3>
  </div>
  <div class="card__body">
    <p class="card__description">产品描述...</p>
  </div>
  <div class="card__footer">
    <button class="card__action button button--secondary">查看详情</button>
  </div>
</div>

<!-- 导航菜单 -->
<nav class="menu menu--horizontal">
  <ul class="menu__list">
    <li class="menu__item menu__item--active">
      <a href="#" class="menu__link">首页</a>
    </li>
    <li class="menu__item">
      <a href="#" class="menu__link">产品</a>
    </li>
  </ul>
</nav>
```

```css
/* 对应的CSS样式 */
.button {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.button--primary {
  background-color: #007bff;
  color: white;
}

.button--secondary {
  background-color: #6c757d;
  color: white;
}

.button--large {
  padding: 12px 24px;
  font-size: 16px;
}

.button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button__icon {
  margin-right: 8px;
}

.button__text {
  flex: 1;
}

.card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.card--featured {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.card__header {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
}

.card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.card__body {
  padding: 16px;
}

.card__footer {
  padding: 16px;
  background-color: #f8f9fa;
}

.menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu--horizontal .menu__list {
  display: flex;
}

.menu--vertical .menu__list {
  flex-direction: column;
}

.menu__item {
  margin: 0;
}

.menu__item--active .menu__link {
  color: #007bff;
  font-weight: 600;
}

.menu__link {
  display: block;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  transition: color 0.2s;
}

.menu__link:hover {
  color: #007bff;
}
```

### 🎯 BEM 的优势

| 优势 | 说明 |
|------|------|
| 🔍 **可读性强** | 通过明确的命名方式，开发者可以快速理解类名所代表的意义 |
| 🛠️ **易于维护** | 结构化的 CSS 使得代码更容易维护和扩展 |
| ⚡ **降低冲突风险** | 使用特定的命名模式减少了类名之间的冲突 |
| 👥 **促进团队协作** | 统一的命名规范使得团队成员更容易理解彼此编写的代码 |
| 🔄 **组件化思维** | 促进组件化开发，提高代码复用性 |

### 📚 CSS 类名词汇表

#### 🏗️ 布局相关

```css
/* 布局容器 */
.doc          /* 文档 */
.header       /* 头部 */
.main         /* 主体 */
.footer       /* 尾部 */
.sidebar      /* 侧栏 */
.container    /* 容器 */
.wrapper      /* 包装器 */
.section      /* 区块 */

/* 网格系统 */
.grid         /* 网格 */
.row          /* 行 */
.col          /* 列 */
.col-1        /* 1列 */
.col-md-6     /* 中等屏幕6列 */
```

#### 🧩 通用组件

```css
/* 基础组件 */
.list         /* 列表 */
.item         /* 列表项 */
.table        /* 表格 */
.form         /* 表单 */
.field        /* 表单字段 */
.input        /* 输入框 */
.button       /* 按钮 */
.link         /* 链接 */
.image        /* 图片 */
.icon         /* 图标 */

/* 内容相关 */
.title        /* 标题 */
.subtitle     /* 副标题 */
.heading      /* 标题 */
.content      /* 内容 */
.text         /* 文本 */
.description  /* 描述 */
.summary      /* 摘要 */
.excerpt      /* 摘录 */
```

#### 🎛️ 交互组件

```css
/* 导航组件 */
.nav          /* 导航 */
.navbar       /* 导航栏 */
.menu         /* 菜单 */
.submenu      /* 子菜单 */
.breadcrumb   /* 面包屑 */
.pagination   /* 分页 */
.tabs         /* 标签页 */
.tab          /* 标签 */

/* 交互组件 */
.modal        /* 模态框 */
.dialog       /* 对话框 */
.popup        /* 弹出框 */
.tooltip      /* 工具提示 */
.dropdown     /* 下拉菜单 */
.accordion    /* 手风琴 */
.carousel     /* 轮播图 */
.slider       /* 滑块 */
.progress     /* 进度条 */
.loading      /* 加载中 */
.spinner      /* 加载动画 */
```

#### 🎨 状态和修饰符

```css
/* 显示状态 */
.show         /* 显示 */
.hide         /* 隐藏 */
.visible      /* 可见 */
.invisible    /* 不可见 */
.open         /* 打开 */
.close        /* 关闭 */
.expand       /* 展开 */
.collapse     /* 折叠 */

/* 交互状态 */
.active       /* 激活 */
.inactive     /* 未激活 */
.current      /* 当前 */
.selected     /* 选中 */
.disabled     /* 禁用 */
.enabled      /* 启用 */
.checked      /* 选中 */
.unchecked    /* 未选中 */

/* 状态修饰 */
.primary      /* 主要 */
.secondary    /* 次要 */
.success      /* 成功 */
.warning      /* 警告 */
.error        /* 错误 */
.info         /* 信息 */
.danger       /* 危险 */
.muted        /* 静音/灰色 */

/* 尺寸修饰 */
.large        /* 大 */
.medium       /* 中 */
.small        /* 小 */
.xs           /* 超小 */
.xl           /* 超大 */
```

#### 🎯 功能性类名

```css
/* 定位相关 */
.relative     /* 相对定位 */
.absolute     /* 绝对定位 */
.fixed        /* 固定定位 */
.sticky       /* 粘性定位 */

/* 浮动相关 */
.float-left   /* 左浮动 */
.float-right  /* 右浮动 */
.clearfix     /* 清除浮动 */

/* 文本相关 */
.text-left    /* 左对齐 */
.text-center  /* 居中对齐 */
.text-right   /* 右对齐 */
.text-bold    /* 粗体 */
.text-italic  /* 斜体 */

/* 间距相关 */
.m-0          /* margin: 0 */
.mt-1         /* margin-top: 0.25rem */
.p-2          /* padding: 0.5rem */
.mb-3         /* margin-bottom: 1rem */
```

## 🎯 最佳实践

### ✅ 推荐做法

::: tip 🎯 命名最佳实践
1. **保持一致性**: 在整个项目中使用统一的命名规范
2. **语义化命名**: 名称应该反映其用途和含义
3. **避免缩写**: 除非是广泛认知的缩写，否则使用完整单词
4. **使用英文**: 统一使用英文命名，避免中英文混合
5. **遵循约定**: 遵循团队或社区的命名约定
6. **适度长度**: 名称应该足够描述性，但不要过长
:::

### 🚫 避免的做法

::: warning ⚠️ 命名禁忌
- **避免使用拼音**: 如 `yonghu` 应该使用 `user`
- **避免无意义的名称**: 如 `data1`, `temp`, `test`
- **避免过度缩写**: 如 `usr` 应该使用 `user`
- **避免数字后缀**: 如 `button1`, `div2`
- **避免特殊字符**: 除了允许的连字符和下划线
- **避免保留字**: 不要使用编程语言的保留字
:::

### 📋 命名检查清单

在提交代码前，检查以下项目：

- [ ] 所有变量名都有明确的含义
- [ ] 函数名清楚地表达了其功能
- [ ] CSS 类名遵循 BEM 规范
- [ ] 文件名使用 kebab-case 格式
- [ ] 常量使用 UPPER_CASE 格式
- [ ] 没有使用保留字作为标识符
- [ ] 命名风格在整个项目中保持一致

### 🛠️ 工具推荐

#### 代码检查工具

```json
// .eslintrc.js 配置示例
{
  "rules": {
    "camelcase": ["error", { "properties": "always" }],
    "id-length": ["error", { "min": 2, "max": 30 }],
    "id-match": ["error", "^[a-z][a-zA-Z0-9]*$", { "properties": true }]
  }
}
```

#### CSS 命名检查

```json
// stylelint 配置示例
{
  "rules": {
    "selector-class-pattern": "^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$",
    "selector-id-pattern": "^[a-z][a-zA-Z0-9]+$"
  }
}
```

## 🌟 总结

良好的命名规范是高质量代码的基础，它能够：

- ✅ **提高代码可读性**: 让代码更容易理解和维护
- ✅ **减少沟通成本**: 统一的规范减少团队沟通成本
- ✅ **降低错误率**: 清晰的命名减少理解错误
- ✅ **提升开发效率**: 规范化的代码更容易开发和调试
- ✅ **便于知识传承**: 标准化的代码便于团队知识传递

通过遵循这些命名规范，我们可以编写出更加专业、可维护的前端代码，为项目的长期发展奠定坚实的基础。
