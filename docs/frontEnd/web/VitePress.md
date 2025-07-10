---
title: VitePress 技术指南
description: VitePress 完整开发指南，包含配置、主题定制、插件开发、部署等核心内容
outline: deep
---

# 🚀 VitePress 技术指南

VitePress 是一个静态站点生成器 (SSG)，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

::: tip 📖 本章内容
全面掌握 VitePress 的配置、主题定制、插件开发和部署技巧，构建现代化的技术文档站点。
:::

## 1. 概述

### 1.1 什么是 VitePress

VitePress 是基于 Vite 和 Vue 3 构建的静态站点生成器，继承了 VuePress 的优秀设计理念，同时提供了更好的性能和开发体验。

### 1.2 核心特性

| 特性 | 描述 | 优势 |
|------|------|------|
| **Vite 驱动** | 基于 Vite 构建系统 | 极快的开发服务器和构建速度 |
| **Vue 3 支持** | 完全支持 Vue 3 生态 | 现代化的组件开发体验 |
| **Markdown 增强** | 丰富的 Markdown 扩展 | 强大的文档编写能力 |
| **主题定制** | 灵活的主题系统 | 高度可定制的外观 |
| **SPA 导航** | 单页应用式导航 | 流畅的用户体验 |
| **SEO 友好** | 服务端渲染支持 | 优秀的搜索引擎优化 |

### 1.3 使用场景

#### 技术文档
VitePress 附带一个专为技术文档设计的默认主题，支持多语言、搜索、代码高亮等功能。

#### 博客网站
通过自定义主题，VitePress 可以构建美观的博客和个人网站。

#### 营销页面
利用 Vue 组件的强大功能，可以创建交互丰富的营销和宣传页面。

### 1.4 性能优势

#### 快速的初始加载

对任何页面的初次访问都将会是静态的、预呈现的 HTML，以实现极快的加载速度和最佳的 SEO。然后页面加载一个 JavaScript bundle，将页面变成 Vue SPA (这被称为“激活”)。

- 静态预渲染的 HTML 提供极快的首屏加载
- 优化的资源加载策略
- 自动代码分割

#### 流畅的导航体验

用户在站点内导航时，不会再触发整个页面的刷新。而是通过获取并动态更新页面的内容来实现切换。VitePress 还会自动预加载视口范围内链接对应的页面片段。为了能够嵌入静态 Markdown 中的动态 Vue 部分，每个 Markdown 页面都被处理为 Vue 组件并编译成 JavaScript。这听起来可能效率低下，但 Vue 编译器足够聪明，可以将静态和动态部分分开，从而最大限度地减少激活成本和有效负载大小。对于初始的页面加载，静态部分会自动从 JavaScript 有效负载中删除，并在激活期间跳过。

- SPA 模式的后续导航
- 智能预加载机制
- 无刷新页面切换

## 2. 安装与配置

### 2.1 项目初始化

```bash
# 使用 npm 创建项目
npm create vitepress@latest my-docs
cd my-docs

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 2.2 目录结构

```
my-docs/
├── .vitepress/          # 配置目录
│   ├── config.js        # 配置文件
│   ├── theme/          # 自定义主题
│   └── cache/          # 缓存目录
├── docs/               # 文档目录
│   ├── index.md        # 首页
│   ├── guide/          # 指南目录
│   └── api/            # API 文档目录
├── public/             # 静态资源
├── package.json        # 项目配置
└── README.md          # 项目说明
```

### 2.3 基础配置

```javascript
// .vitepress/config.js
export default {
  // 站点基本信息
  title: '我的文档站点',
  description: '基于 VitePress 构建的技术文档',
  lang: 'zh-CN',
  base: '/',
  
  // 主题配置
  themeConfig: {
    // 站点标题
    siteTitle: '我的文档',
    
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' }
    ],
    
    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '配置', link: '/guide/configuration' }
          ]
        }
      ]
    },
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-repo' }
    ],
    
    // 页脚
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024 Your Name'
    }
  },
  
  // Markdown 配置
  markdown: {
    lineNumbers: true,
    theme: 'github-dark'
  },
  
  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'Your Name' }]
  ]
}
```

## 3. 路由系统

### 3.1 基于文件的路由

VitePress 使用基于文件的路由系统，目录结构直接映射为 URL 路径：

```
docs/
├── index.md              # /
├── guide/
│   ├── index.md          # /guide/
│   ├── getting-started.md # /guide/getting-started
│   └── advanced.md       # /guide/advanced
└── api/
    ├── index.md          # /api/
    └── reference.md      # /api/reference
```

### 3.2 路由配置

```javascript
// .vitepress/config.js
export default {
  themeConfig: {
    sidebar: {
      // 指南侧边栏
      '/guide/': [
        {
          text: '基础',
          collapsed: false,
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '配置', link: '/guide/configuration' }
          ]
        },
        {
          text: '进阶',
          collapsed: false,
          items: [
            { text: '主题定制', link: '/guide/theme-customization' },
            { text: '插件开发', link: '/guide/plugin-development' }
          ]
        }
      ],
      
      // API 侧边栏
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '配置 API', link: '/api/config' },
            { text: '主题 API', link: '/api/theme' }
          ]
        }
      ]
    }
  }
}
```

### 3.3 动态路由

```javascript
// .vitepress/config.js
export default {
  async transformPageData(pageData) {
    // 动态修改页面数据
    pageData.title = `${pageData.title} - 我的站点`
    return pageData
  },
  
  async buildEnd(siteConfig) {
    // 构建结束后的钩子
    console.log('构建完成')
  },
   async paths() {
    // 使用每个路径对象上的 content 属性将此类内容传递到每个页面
    const posts = await (await fetch("https://my-cms.com/blog-posts")).json();

    return posts.map(post => {
      return {
        params: { id: post.id },
        content: post.content, // 原始 Markdown 或 HTML
      };
    });
  },
}
```

## 4. Markdown 增强

### 4.1 基础语法扩展

VitePress 扩展了标准 Markdown 语法，提供更丰富的文档编写能力：

```markdown
# 标题会自动生成锚点 {#custom-id}

## 表格支持

| 语法 | 描述 | 测试 |
|------|------|------|
| Header | Title | Here's this |
| Paragraph | Text | And more |

## 代码块增强

```javascript {1,3-5}
// 行号高亮
function hello() {
  console.log('Hello World')
  return true
}
```

```typescript
// TypeScript 支持
interface User {
  name: string
  age: number
}
```

### 4.2 警告框

::: info 信息
这是一个信息提示框
:::

::: tip 提示
这是一个提示框
:::

::: warning 警告
这是一个警告框
:::

::: danger 危险
这是一个危险提示框
:::

::: details 详情
这是一个详情框，可以折叠
:::

### 4.3 Vue 组件集成

```markdown
<!-- 在 Markdown 中使用 Vue 组件 -->
<script setup>
import { ref } from 'vue'
import { useData } from "vitepress";

// params 是一个 Vue ref
const { params } = useData();
const count = ref(0)
</script>


# 计数器示例

当前计数: {{ count }}

<button @click="count++">增加</button>

<!-- 使用自定义组件 -->
<CustomComponent :data="someData" />
```

### 4.4 内置组件

```markdown
<!-- Badge 组件 -->
VitePress <Badge type="info" text="默认主题" />
VitePress <Badge type="tip" text="v1.0.0" />
VitePress <Badge type="warning" text="测试版" />
VitePress <Badge type="danger" text="已废弃" />

<!-- 团队成员展示 -->
<VPTeamMembers size="small" :members="members" />

<!-- 图片缩放 -->
![VitePress Logo](./logo.png){data-zoomable}
```


### 4.5 markdown 语法

#### 标题

```md
# 标题一

## 标题二

### 标题三

#### 标题四

##### 标题五

###### 标题六 最多 6 层标题
```

#### 列表

```md
<!-- 无序列表 也可以使用* + 符号 -->

- 列表项 1
- 列表项 2
- 列表项 3

<!-- 有序列表 -->

1. item1
2. item2
3. item3
```

- 列表项 1
- 列表项 2
- 列表项 3

1. item1
2. item2
3. item3

#### 文字效果

- `*斜体Ctrl + I*` 或者 `_斜体Ctrl + I_` _斜体 Ctrl + I_
- `**加粗Ctrl + B**` **加粗 Ctrl + B**
- `***加粗&斜体***` 或 `**_加粗&斜体_**` **_加粗&斜体_**

- `~~删除线 ~~` ~~删除线 ~~
- \`\<style\>原样输出\` `<style>原样输出`

#### 引用

```md
> 区块引用
>
> > 区块嵌套
```

> 区块引用
>
> > 区块嵌套

#### 分割线

```md
---
```

也可以用多个`*****`或者`_____`实现分割线效果：

---

#### 缩进

```md
段首缩进 空格+回车换行  
&nbsp;&nbsp;段首缩进 空格+回车换行  
&emsp;&emsp;段首缩进 空格+回车换行
```

段首缩进 空格+回车换行  
&nbsp;&nbsp;段首缩进 空格+回车换行  
&emsp;&emsp;段首缩进 空格+回车换行

#### 表格

```md
| 默认左对齐    |   居中对齐    | 右对齐 |
| ------------- | :-----------: | -----: |
| col 3 is      | right-aligned |  $1600 |
| col 2 is      |   centered    |    $12 |
| zebra stripes |   are neat    |     $1 |
```

| 默认左对齐    |   居中对齐    | 右对齐 |
| ------------- | :-----------: | -----: |
| col 3 is      | right-aligned |  $1600 |
| col 2 is      |   centered    |    $12 |
| zebra stripes |   are neat    |     $1 |

#### Emoji 🎉

```md
🎉 💯 :tada: :100:
```

🎉 💯 :tada: :100:

#### 链接

```md
行内连接：[百度首页](http://baidu.com)

直接连接（必须协议开头）：<http://cnblogs.com/> http://cnblogs.com/

参考连接： [Google][1] than from [Yahoo][2] or [MSN][3].

[1]: http://google.com/ "Google Alt"
[2]: http://search.yahoo.com/ "Yahoo Alt"
[3]: http://search.msn.com/ "MSN Alt"
```

行内连接：[百度首页](http://baidu.com)

直接连接（必须协议开头）：<http://cnblogs.com/> http://cnblogs.com/

参考连接： [Google][1] than from [Yahoo][2] or [MSN][3].

[1]: http://google.com/ "Google Alt"
[2]: http://search.yahoo.com/ "Yahoo Alt"
[3]: http://search.msn.com/ "MSN Alt"

#### 图片

```md
![行内形式](https://gips2.baidu.com/it/u=1651586290,17201034&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f300_400)

![参考形式][id]

[id]: https://gips2.baidu.com/it/u=1651586290,17201034&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f300_400 "Title 信息"
```

![行内形式](https://gips2.baidu.com/it/u=1651586290,17201034&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f300_400)

![参考形式][id]

[id]: https://gips2.baidu.com/it/u=1651586290,17201034&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f300_400 "Title 信息"

#### 视频

```md
<iframe 
width="100%" 
height="500" 
src="../../tools/package/storybook.mp4" 
title="markdown video player" 
frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
allowfullscreen>
</iframe>
```

<iframe 
width="100%" 
height="500" 
src="../../tools/package/storybook.mp4" 
title="markdown video player" 
frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
allowfullscreen>
</iframe>

#### 数学公式

1. 行内公式

```md
$E=mc^2$
```

$E=mc^2$

2. 居中公式块

```md
$$
\sum_{i=0}^n i^2=\frac{(n^2+n)(2n+1)}{6} \tag{1}
$$
```

$$
\sum_{i=0}^n i^2=\frac{(n^2+n)(2n+1)}{6} \tag{1}
$$

3. 上标和下标

```md
$$
x_i^3+y_i^3=z_i^3
$$
```

$$
x_i^3+y_i^3=z_i^3
$$

4. 括号

```md
$$
\{[(x_1+x_2)^2-(y_1-y_2)^4]\times w\}
\times (z_1^2-z_2^2) \tag{3}
$$

$\lg 10^3$
$\log_2 10$
$\ln (\pi+2)$

$$
\sin(x+y)+\cos(y+z)+\tan(z+x)+\arcsin(x+y+z) \tag{7}
$$
```

$$
\{[(x_1+x_2)^2-(y_1-y_2)^4]\times w\}
\times (z_1^2-z_2^2) \tag{3}
$$

$\lg 10^3$
$\log_2 10$
$\ln (\pi+2)$

$$
\sin(x+y)+\cos(y+z)+\tan(z+x)+\arcsin(x+y+z) \tag{7}
$$

5. 累加、累乘、并集和交集

```md
$$
Y_i=\sum_{i=0}^{n} X_i \tag{5}
$$

$$
\sum_{i=1}^n \frac{1}{i^2} \quad and
\quad \prod_{i=1}^n \frac{1}{i^2} \quad
and \quad \bigcup_{i=1}^{2} \Bbb{R}
\quad and \quad \bigcap_{i=1}^3 X_i \tag{6}
$$
```

$$
Y_i=\sum_{i=0}^{n} X_i \tag{5}
$$

$$
\sum_{i=1}^n \frac{1}{i^2} \quad and
\quad \prod_{i=1}^n \frac{1}{i^2} \quad
and \quad \bigcup_{i=1}^{2} \Bbb{R}
\quad and \quad \bigcap_{i=1}^3 X_i \tag{6}
$$

#### 代码块行样式

高亮指定行:

<pre>
```js{1-2,4}
export default {
  data () {
    return {
      msg: `由js{1-2,4}高亮此行!`,
      motd: '由注释:[!code highlight]高亮此行',// [!code highlight]
      lorem: '聚焦此行',// [!code focus]
      q: '显示-号',// [!code --]
      w: '显示+号',// [!code ++]
      Error: 'Error背景色', // [!code error]
      Warning: 'Warning背景色' // [!code warning]
    }
  }
}
```
</pre>

```js{1-2,4}
export default {
  data () {
    return {
      msg: `由js{1-2,4}高亮此行!`,
      motd: '由注释:[!code highlight]高亮此行',// [!code highlight]
      lorem: '聚焦此行',// [!code focus]
      q: '显示-号',// [!code --]
      w: '显示+号',// [!code ++]
      Error: 'Error背景色', // [!code error]
      Warning: 'Warning背景色' // [!code warning]
    }
  }
}
```

#### 启用和禁用行号

<pre>
```ts:line-numbers=2
// 行号已启用，并从 2 开始
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```
</pre>

```ts:line-numbers=2
// 行号已启用，并从 2 开始
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

#### 导入代码片段

```txt
// @为源目录 #snippet代码指定部分 5-10为需要高亮的行
<<< @/home.md{5-10}
```

<<< @/home.md{5-10}

#### 包含 markdown 文件

以下为导入的 markdown 文件输出的结果：

```md:line-numbers=3
<!--@include: @/home.md{3,10}-->
```

#### 代码组

::: code-group

```js [index.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
};

export default config;
```

```ts [index.ts]
import type { UserConfig } from "vitepress";

const config: UserConfig = {
  // ...
};

export default config;
```

:::

## 5. 主题定制

### 5.1 默认主题定制

```javascript
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('CustomComponent', CustomComponent)
  }
}
```

```css
/* .vitepress/theme/custom.css */
:root {
  /* 自定义 CSS 变量 */
  --vp-c-brand: #646cff;
  --vp-c-brand-light: #747bff;
  --vp-c-brand-lighter: #9499ff;
  --vp-c-brand-lightest: #bcc0ff;
  --vp-c-brand-dark: #535bf2;
  --vp-c-brand-darker: #454ce1;
  --vp-c-brand-dimm: #363844;
}

/* 自定义样式 */
.custom-header {
  background: linear-gradient(135deg, var(--vp-c-brand), var(--vp-c-brand-light));
  color: white;
  padding: 2rem;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-header {
    padding: 1rem;
  }
}
```

### 5.2 布局定制

```vue
<!-- .vitepress/theme/Layout.vue -->
<template>
  <DefaultTheme.Layout>
    <!-- 自定义头部插槽 -->
    <template #nav-bar-title-before>
      <img src="/logo.svg" alt="Logo" class="logo" />
    </template>
    
    <!-- 自定义侧边栏底部 -->
    <template #sidebar-nav-after>
      <div class="custom-sidebar-footer">
        <p>© 2024 我的站点</p>
      </div>
    </template>
    
    <!-- 自定义页面底部 -->
    <template #doc-after>
      <div class="custom-doc-footer">
        <p>在 <a href="https://github.com/your-repo" target="_blank">GitHub</a> 上编辑此页</p>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
</script>

<style scoped>
.logo {
  height: 24px;
  width: auto;
  margin-right: 8px;
}

.custom-sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.custom-doc-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
```

### 5.3 自定义主页

```markdown
---
layout: home

hero:
  name: "我的项目"
  text: "现代化的解决方案"
  tagline: 简单、强大、快速
  image:
    src: /logo.png
    alt: 项目 Logo
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/your-repo

features:
  - icon: ⚡️
    title: 极速体验
    details: 基于 Vite 构建，提供极快的开发和构建体验
  - icon: 🎨
    title: 主题定制
    details: 灵活的主题系统，轻松定制你的站点外观
  - icon: 📱
    title: 响应式设计
    details: 完美适配各种设备和屏幕尺寸
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
```

## 6. 插件开发

### 6.1 Vite 插件集成

```javascript
// .vitepress/config.js
import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
  vite: {
    plugins: [
      // 自定义 Vite 插件
      {
        name: 'custom-plugin',
        configResolved(config) {
          // 插件逻辑
        }
      }
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, '../')
      }
    }
  }
})
```

### 6.2 Markdown 插件

```javascript
// .vitepress/config.js
export default {
  markdown: {
    config: (md) => {
      // 添加自定义 Markdown 插件
      md.use(require('markdown-it-footnote'))
      md.use(require('markdown-it-task-lists'))
      
      // 自定义渲染规则
      md.renderer.rules.table_open = () => '<div class="table-container"><table>'
      md.renderer.rules.table_close = () => '</table></div>'
    }
  }
}
```

### 6.3 自定义组件插件

```vue
<!-- components/CustomAlert.vue -->
<template>
  <div :class="['custom-alert', `custom-alert--${type}`]">
    <div class="custom-alert__icon">
      <component :is="iconComponent" />
    </div>
    <div class="custom-alert__content">
      <h4 v-if="title" class="custom-alert__title">{{ title }}</h4>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning', 'error', 'success'].includes(value)
  },
  title: String
})

const iconComponent = computed(() => {
  const icons = {
    info: 'InfoIcon',
    warning: 'WarningIcon',
    error: 'ErrorIcon',
    success: 'SuccessIcon'
  }
  return icons[props.type]
})
</script>

<style scoped>
.custom-alert {
  display: flex;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.custom-alert--info {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.custom-alert--warning {
  background-color: #fff3e0;
  border-left: 4px solid #ff9800;
}

.custom-alert--error {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
}

.custom-alert--success {
  background-color: #e8f5e8;
  border-left: 4px solid #4caf50;
}

.custom-alert__icon {
  margin-right: 12px;
  flex-shrink: 0;
}

.custom-alert__title {
  margin: 0 0 8px 0;
  font-weight: 600;
}
</style>
```

## 7. 国际化

### 7.1 多语言配置

```javascript
// .vitepress/config.js
export default {
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '我的文档',
      description: '用 VitePress 构建的技术文档',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '指南', link: '/guide/' }
        ],
        sidebar: {
          '/guide/': [
            { text: '快速开始', link: '/guide/getting-started' }
          ]
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'My Docs',
      description: 'Technical documentation built with VitePress',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/' }
        ],
        sidebar: {
          '/en/guide/': [
            { text: 'Getting Started', link: '/en/guide/getting-started' }
          ]
        }
      }
    }
  }
}
```

### 7.2 目录结构

```
docs/
├── index.md              # 中文首页
├── guide/
│   └── getting-started.md # 中文指南
├── en/
│   ├── index.md          # 英文首页
│   └── guide/
│       └── getting-started.md # 英文指南
└── .vitepress/
    └── config.js
```

### 7.3 语言切换组件

```vue
<!-- .vitepress/theme/components/LanguageSwitch.vue -->
<template>
  <div class="language-switch">
    <select v-model="currentLocale" @change="switchLanguage">
      <option
        v-for="locale in locales"
        :key="locale.code"
        :value="locale.code"
      >
        {{ locale.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useData, useRouter } from 'vitepress'

const { site, page } = useData()
const router = useRouter()

const locales = computed(() => [
  { code: 'root', label: '简体中文' },
  { code: 'en', label: 'English' }
])

const currentLocale = ref('root')

function switchLanguage() {
  const targetPath = currentLocale.value === 'root' 
    ? page.value.relativePath.replace(/^en\//, '')
    : `en/${page.value.relativePath}`
  
  router.go(`/${targetPath}`)
}
</script>
```

## 8. 搜索功能

### 8.1 本地搜索

```javascript
// .vitepress/config.js
export default {
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  }
}
```

### 8.2 Algolia 搜索

```javascript
// .vitepress/config.js
export default {
  themeConfig: {
    search: {
      provider: 'algolia',
      options: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_SEARCH_API_KEY',
        indexName: 'YOUR_INDEX_NAME',
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索文档'
          }
        }
      }
    }
  }
}
```

### 8.3 自定义搜索

```vue
<!-- .vitepress/theme/components/CustomSearch.vue -->
<template>
  <div class="custom-search">
    <input
      v-model="searchQuery"
      type="search"
      placeholder="搜索文档..."
      @input="handleSearch"
      @keydown.enter="performSearch"
    />
    
    <div v-if="searchResults.length" class="search-results">
      <div
        v-for="result in searchResults"
        :key="result.id"
        class="search-result"
        @click="navigateTo(result.path)"
      >
        <h4>{{ result.title }}</h4>
        <p>{{ result.excerpt }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])

function handleSearch() {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  
  // 实现搜索逻辑
  searchResults.value = performLocalSearch(searchQuery.value)
}

function performLocalSearch(query) {
  // 简单的本地搜索实现
  const pages = getAllPages() // 获取所有页面数据
  return pages.filter(page => 
    page.title.toLowerCase().includes(query.toLowerCase()) ||
    page.content.toLowerCase().includes(query.toLowerCase())
  )
}

function navigateTo(path) {
  router.go(path)
  searchQuery.value = ''
  searchResults.value = []
}
</script>
```

## 9. 部署

### 9.1 静态部署

```bash
# 构建静态文件
npm run build

# 构建输出在 .vitepress/dist 目录
# 可以部署到任何静态文件服务器
```

### 9.2 GitHub Pages 部署

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: .vitepress/dist
```

### 9.3 Netlify 部署

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".vitepress/dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 9.4 Vercel 部署

```json
{
  "name": "my-vitepress-site",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": ".vitepress/dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 10. 性能优化

### 10.1 构建优化

```javascript
// .vitepress/config.js
export default {
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue'],
            router: ['vue-router']
          }
        }
      }
    }
  }
}
```

### 10.2 图片优化

```javascript
// .vitepress/config.js
export default {
  vite: {
    plugins: [
      {
        name: 'image-optimization',
        generateBundle(options, bundle) {
          // 图片压缩逻辑
        }
      }
    ]
  },
  
  transformHead({ assets }) {
    // 添加图片预加载
    const imageAssets = assets.filter(file => /\.(jpg|jpeg|png|webp)$/.test(file))
    return imageAssets.map(asset => [
      'link',
      { rel: 'preload', href: asset, as: 'image' }
    ])
  }
}
```

### 10.3 缓存策略

```javascript
// .vitepress/config.js
export default {
  head: [
    ['meta', { 'http-equiv': 'Cache-Control', content: 'max-age=3600' }]
  ],
  
  transformPageData(pageData) {
    // 添加页面级别的缓存控制
    pageData.lastUpdated = new Date().toISOString()
    return pageData
  }
}
```

## 11. 最佳实践

### 11.1 文档组织

```
docs/
├── .vitepress/
│   ├── config.js           # 主配置文件
│   ├── theme/              # 主题定制
│   │   ├── index.js
│   │   ├── style.css
│   │   └── components/
│   └── public/             # 静态资源
├── guide/                  # 指南文档
│   ├── index.md
│   ├── getting-started.md
│   └── advanced/
├── api/                    # API 文档
│   ├── index.md
│   └── reference/
├── examples/               # 示例代码
└── assets/                 # 文档资源
    ├── images/
    └── files/
```

### 11.2 Markdown 编写规范

```markdown
---
title: 页面标题
description: 页面描述
head:
  - - meta
    - name: keywords
      content: vitepress,文档,指南
---

# 页面标题

## 概述

使用简洁明了的语言描述内容。

## 代码示例

```javascript
// 添加注释说明代码功能
function example() {
  return 'Hello VitePress'
}
```

### 11.3 SEO 优化

```javascript
// .vitepress/config.js
export default {
  head: [
    ['meta', { name: 'author', content: '作者名称' }],
    ['meta', { name: 'keywords', content: 'VitePress,Vue,文档,静态站点' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '站点名称' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  
  transformPageData(pageData, { siteConfig }) {
    // 动态生成 SEO 数据
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'meta',
      { property: 'og:title', content: pageData.title }
    ])
    
    return pageData
  },
  
  sitemap: {
    hostname: 'https://your-domain.com'
  }
}
```

## 12. 故障排除

### 12.1 常见问题

#### 构建失败
```bash
# 清除缓存
rm -rf .vitepress/cache
rm -rf node_modules/.vite

# 重新安装依赖
npm install

# 检查配置文件语法
node .vitepress/config.js
```

#### 样式不生效
```javascript
// 确保样式文件正确导入
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'  // 检查路径是否正确

export default DefaultTheme
```

#### 路由问题
```javascript
// 检查文件命名和路径
// 确保 Markdown 文件名符合规范
// 避免使用特殊字符和空格
```

### 12.2 调试技巧

```javascript
// .vitepress/config.js
export default {
  // 开启调试模式
  vite: {
    logLevel: 'info'
  },
  
  // 添加调试信息
  transformPageData(pageData) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Processing page:', pageData.relativePath)
    }
    return pageData
  }
}
```

## 13. 参考资料

### 13.1 官方资源
- [VitePress 官方网站](https://vitepress.dev/)
- [VitePress GitHub 仓库](https://github.com/vuejs/vitepress)
- [Vue.js 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)

### 13.2 社区资源
- [VitePress 中文社区](https://vitepress.qzxdp.cn/)
- [Awesome VitePress](https://github.com/logicspark/awesome-vitepress)
- [VitePress 主题集合](https://github.com/topics/vitepress-theme)

### 13.3 相关工具
- [VitePress 插件市场](https://www.npmjs.com/search?q=vitepress-plugin)
- [Markdown 在线编辑器](https://typora.io/)
- [图标库](https://iconify.design/)

### 13.4 部署平台
- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://netlify.com/)
- [Vercel](https://vercel.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/) 