## vite 介绍

1. 快速冷启动

当冷启动开发服务器时，基于打包器的方式启动必须优先抓取并构建你的整个应用，然后才能提供服务。而 Vite 通过在一开始将应用中的模块区分为 依赖 和 源码 两类，改进了开发服务器启动时间。

- 依赖 大多为在开发时不会变动的纯 JavaScript。一些较大的依赖（例如有上百个模块的组件库）处理的代价也很高。依赖也通常会存在多种模块化格式（例如 ESM 或者 CommonJS）。

Vite 将会使用 esbuild 预构建依赖。esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。

- 源码 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）。

Vite 以 原生 ESM 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

2. 快速更新

基于打包启动时，当源文件被修改后，重新构建整个包是低效的，原因显而易见：更新速度会随着应用体积的增加而线性下降。在 Vite 中，HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活（大多数时候只是模块本身），使得无论应用大小如何，HMR 始终能保持快速更新。

Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 304 Not Modified 进行协商缓存，而依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable 进行强缓存，因此一旦被缓存它们将不需要再次请求。

## 安装 vite

create-vite 是一个快速生成主流框架基础模板的工具

```bash
# 全局安装 create-vite 按照提示操作即可！
npm create vite@latest

# 进入目录
cd xxx

# 安装依赖
npm install

# 运行
npm run dev
```

## 配置 vite

当以命令行方式运行 vite 时，Vite 会自动解析 项目根目录 下名为 vite.config.js 的配置文件（也支持其他 JS 和 TS 扩展名）。

配置 `vite.config.ts`：

```ts
import type { UserConfig } , { defineConfig, loadEnv }from "vite";

const viteConfig: UserConfig = {
  //项目根目录（index.html 文件所在的位置）
  root:process.cwd(),
  //开发或生产环境服务的公共基础路径
  base:'/',
  // 默认： 'development' 用于开发，'production' 用于构建
  mode:'development',
  // 定义全局常量替换方式
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
  // 需要用到的插件数组
  plugins:[function(){
    return {
      // 必须的，将会在 warning 和 error 中显示
    name: 'transform-file',
    // 默认情况下插件在开发（serve）和构建（build）模式中都会调用
    apply: 'build', // 或 'serve'
    // 定义插件执行顺序
    enforce:'pre' | 'post',
    //以下钩子在服务器启动时被调用
    options(){},
    buildStart(){},
    //以下钩子会在每个传入模块请求时被调用：
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      },
    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null // 如果可行将提供 source map
        }
      }
    },
    // 以下钩子在服务器关闭时被调用：
    buildEnd(){},
    closeBundle(){},
    //Vite 独有钩子
    config(config, { command }) {
      if (command === 'build') { config.root = 'foo'}
    },
    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig
    },
      //是用于配置开发服务器的钩子
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理...
      })
    },
    //转换 index.html 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文
    transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`,
        )
    },
    //执行自定义 HMR 更新处理
    handleHotUpdate({ server, modules, timestamp }) {
      // 手动使模块失效
      const invalidatedModules = new Set()
      for (const mod of modules) {
        server.moduleGraph.invalidateModule(
          mod,
          invalidatedModules,
          timestamp,
          true
        )
      }
      server.ws.send({ type: 'full-reload' })
      return []
    }
  }
  }],
  // 作为静态资源服务的文件夹。
  publicDir:'public',
  // 存储缓存文件的目录
  cacheDir:"node_modules/.vite",
  resolve:{
    alias:{'@assets':'./src/assets'},
    //package.json 中，在解析包的入口点时尝试的字段列表
    mainFields:['browser', 'module', 'jsnext:main', 'jsnext'],
    extensions:['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    // 强制 Vite 始终将列出的依赖项解析为同一副本（从项目根目录）
    dedupe:[],
    //解决程序包中 情景导出 时的其他允许条件。
    conditions:['module', 'browser', 'development|production'],
  },
  css:{
     //配置 CSS modules 的行为。选项将被传递给 postcss-modules。
    modules:{
      scopeBehaviour:'global | local',
      globalModulesPaths:[],
      exportGlobals:true,
    },
    //内联的 PostCSS 配置（格式同 postcss.config.js），或者一个（默认基于项目根目录的）自定义的 PostCSS 配置路径。
    postcss:{},
    //指定传递给 CSS 预处理器的选项。文件扩展名用作选项的键
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      scss: {
        api: 'modern-compiler', // 或 "modern"，"legacy"
        //为每一段样式内容添加额外的代码
        additionalData: `$injectedColor: orange;`,
        importers: [
          // ...
        ],
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
    },
    //尽可能在 worker 线程中运行。true 表示 CPU 数量减 1。
    preprocessorMaxWorkers:true,
    devSourcemap:true,
    //用于 CSS 处理的引擎
    transformer:'postcss | lightningcss',
    lightningcss:{
    targets?: Targets
    include?: Features
    exclude?: Features
    drafts?: Drafts
    nonStandard?: NonStandard
    pseudoClasses?: PseudoClasses
    unusedSymbols?: string[]
    cssModules?: CSSModulesConfig,
    // ...
    },
  },
  // json配置
  json:{
    //是否支持从 .json 文件中进行按名导入。
    namedExports:true,
    //若设置为 true，导入的 JSON 会被转换为 export default JSON.parse("...")
    stringify:boolean | 'auto',
  },
  // 继承自 esbuild 转换选项:默认情况下，esbuild 会被应用在 ts、jsx、tsx 文件。你可以通过 esbuild.include 和 esbuild.exclude 对要处理的文件类型进行配置
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    //为每一个被 esbuild 转换的文件注入 JSX helper。
    jsxInject: `import React from 'react'`,
    minify:true
  },
  //指定额外的 picomatch 模式 作为静态资源处理
  assetsInclude:string | RegExp | (string | RegExp)[],
  // 调整控制台输出的级别，默认为 'info'。
  logLevel:'info' | 'warn' | 'error' | 'silent',
  // 使用自定义 logger 记录消息
  customLogger:{
    info(msg: string, options?: LogOptions): void
    warn(msg: string, options?: LogOptions): void
    warnOnce(msg: string, options?: LogOptions): void
    error(msg: string, options?: LogErrorOptions): void
    clearScreen(type: LogType): void
    hasErrorLogged(error: Error | RollupError): boolean
    hasWarned: boolean
  },
  // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
  clearScreen:true,
  // 用于加载 .env 文件的目录。
  envDir:root,
  // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中。
  envPrefix:'VITE_',
  // 默认： 'development' 用于开发，'production' 用于构建
  appType:'spa' | 'mpa' | 'custom',
  // 构建选项
  build:{
    //设置最终构建的浏览器兼容目标
    target:'modules',
    //默认情况下，一个 模块预加载 polyfill 会被自动注入
    modulePreload:{
      folyfill:true
    },
    outDir:'dist',
    //指定生成静态资源的存放路径（相对于 build.outDir）
    assetsDir:'assets',
    //启用/禁用 CSS 代码拆分
    cssCodeSplit:true,
    // 与 build.target 一致
    cssTarget:'modules',
    //覆盖 CSS 最小化压缩的配置，而不是使用默认的 build.minify
    cssMinify:boolean | 'esbuild' | 'lightningcss',
    //构建后是否生成 source map 文件
    sourcemap:boolean | 'inline' | 'hidden',
    //自定义底层的 Rollup 打包配置
    rollupOptions:{
      output: {
        // 分包配置
        manualChunks: {
          'group-user': [
            './src/UserDetails',
            './src/UserDashboard',
            './src/UserProfileEdit',
          ],
        },
      },
    },
    //以库的形式构建
    lib: {
      entry: ['src/main.js'],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: 'my-lib-style',
      formats:'umd'
    },
    minify:boolean | 'terser' | 'esbuild',
    // 选项来指定最大的工作线程数
    terserOptions:{
      // 选项来指定最大的工作线程数
      maxWorkers: number,
    },
    //设置为 false 来禁用将构建后的文件写入磁盘
    write:true,
    //默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
    emptyOutDir:true,
    //Vite 会在构建阶段将 publicDir 目录中的所有文件复制到 outDir 目录中
    copyPublicDir:true,
  },
  //预览选项
  preview:{
    //为开发服务器指定 ip 地址
    host:string | boolean,
    port:4173,
    strictPort:false,
    https:{},
    open:true,
    proxy:{},
    cors:true,
    headers:{}
  },
  //依赖优化选项
  optimizeDeps:{
    //默认情况下，Vite 会抓取你的 index.html 来检测需要预构建的依赖项
    entries:string | string[],
    exclude: ['esm-dep > cjs-dep'],
    include: ['my-lib/components/**/*.vue'],
    esbuildOptions:{},
    // 设置为 true 可以强制依赖预构建，而忽略之前已经缓存过的、已经优化过的依赖
    force:true,
    //当导入这些依赖项时，会强制 ESM 转换
    needsInterop:string[]
  },
  server: {
    hostname: "localhost", // 主机名
    port: 8080, // 端口号g
    open: true, // 运行自动打开浏览器
    //设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。
    strictPort:false,
    //启用 TLS + HTTP/2。注意：当 server.proxy 选项 也被使用时，将会仅使用 TLS
    https:{},
    //为开发服务器配置 CORS。默认启用并允许任何源
    cors:boolean | CorsOptions,
    //指定服务器响应的 header。
    headers:OutgoingHttpHeaders,
    //禁用或配置 HMR 连接（用于 HMR websocket 必须使用不同的 http 服务器地址的情况）
    hmr:true,
    //用于定义开发调试阶段生成资源的 origin。
    origin: 'http://127.0.0.1:8080',
    proxy: {
      '/foo': 'http://localhost:4567',
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 正则表达式写法：http://localhost:5173/fallback/
      // -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // 使用 proxy 实例
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
        }
      },
      // 代理 websockets 或 socket.io 写法：ws://localhost:5173/socket.io
      // -> ws://localhost:5174/socket.io
      // 在使用 `rewriteWsOrigin` 时要特别谨慎，会让代理服务器暴露在 CSRF 攻击之下
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
};

export default viteConfig;

// 导出一个接受参数的函数
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有
  // `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
      // vite 配置
      define: {
        __APP_ENV__: JSON.stringify(env.APP_ENV),
      },
    }
  } else {
    // command === 'build'
    return {
      // build 独有配置
    }
  }
})
```

:::tip vite 配置参考

- github：[github/vite/config.ts](https://github.com/vitejs/vite/blob/73196e517643af88a790ab5222d3e6b68dbbf987/packages/vite/src/node/config.ts)
- issues：[https://github.com/vitejs/vite/issues/1467](https://github.com/vitejs/vite/issues/1467)
- plugins：[alias#entries](https://github.com/rollup/plugins/tree/master/packages/alias#entries)
  :::

## 安装 typescript

### 1. 安装

```bash
# 安装
cnpm install typescript --save-dev

# 初始化 tsconfig.json，注意初始化时与安装 typescript 同级（项目根目录）
npx tsc --init
```

### 2. 改成 `.ts` 后缀

将 `main.js` 修改为 `main.ts`，同时将 `index.html` 里面的引用也修改为 `main.ts`，然后在 `script` 里添加 `lang="ts"`

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`app.vue`

```html
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>

<script lang="ts">
  import HelloWorld from "./components/HelloWorld.vue";
  export default {
    name: "App",
    components: {
      HelloWorld,
    },
  };
</script>
```

### 3. 出现问题：找不到模块 `./App.vue` 或其相应的类型声明

打开 main.ts 会发现 `import App from App.vue` 会报错: 找不到模块 `./App.vue` 或其相应的类型声明，这是因为现在 ts 还没有识别 vue 文件，需要进行下面的配置：

在项目根目录添加 `shim.d.ts` 文件：

```ts
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

### 4. 出现问题：安装了 `Vetur` 的话，出现 `[vue/no-multiple-template-root]The template root requires exactly one element.eslint-plugin-vue` 的警告

处理方法：关闭了 `Vetur`，Vetur 认为这是 Vue 2 项目，因为它位于 VS Code 工作区中。

::: warning 提示
参考顶部 `vsCode` 链接中，打开 `首选项 - 设置 - settings.json`
:::

```json
"vetur.validation.template": false,
"vetur.validation.script": false,
"vetur.validation.style": false,
```

## 安装 element-plus

`element-plus` 官网：[https://element-plus.gitee.io/#/zh-CN](https://element-plus.gitee.io/#/zh-CN)

### 1. npm 安装

```bash
npm install element-plus --save
```

### 2. CDN 链接引入

```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://unpkg.com/element-plus/lib/theme-chalk/index.css" />
<!-- 引入组件库 -->
<script src="https://unpkg.com/element-plus/lib/index.full.js"></script>
```

### 3. 引入 Element Plus

```ts
import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
```

## 安装 sass sass-loader

::: tip 提示
安装完成不用配置，经过本地测试，可以直接使用。
:::

```bash
cnpm install sass sass-loader --save-dev
```

## 定义 Element Plus 主题

Element Plus 的 theme-chalk 使用 SCSS 编写，如果你的项目也使用了 SCSS，那么可以直接在项目中改变 Element Plus 的样式变量。新建一个样式文件，例如 `element-variables.scss`，写入以下内容：

### 1. element-variables.scss

`404问题`：[在 vite 当中使用主题，字体路径的 ~ 无法正常解析，build 和 dev 均报错](https://github.com/element-plus/element-plus/issues/958)临时处理：把字体文件复制到 src 下了，用相对路径引入。

::: warning 提示
由于 vite 目前（2020.12.17）不支持 [自定义主题 Element Plus](https://element-plus.org/#/zh-CN/component/custom-theme) 文档中的写法，若强行使用打包会出现问题：
:::

```ts
/* 改变主题色变量 */
$--color-primary: teal;

/* 改变 icon 字体路径变量，必需 */
$--font-path: '~element-plus/lib/theme-chalk/fonts';

@import "~element-plus/packages/theme-chalk/src/index";
```

::: tip 提示
所以采用 CSS3 `:root`（:root 选择器选取文档的根元素） 写法，具体方法我会在顶部导航 `主题` 中进行说明：
:::

```css
/* 定义一个名为 "--main-bg-color" 的属性，然后使用 var() 函数调用该属性： */
:root {
  --main-bg-color: red;
}

#div1 {
  background-color: var(--main-bg-color);
}

#div2 {
  background-color: var(--main-bg-color);
}
```

改变变量的颜色：

- 当有内联样式或者 js 设置的值时：`document.documentElement.style.getPropertyValue` 获取到的是实际的值
- 当只有 :root 选择器或者 html 选择器时，`document.documentElement.style.getPropertyValue` 获取到的值为空

```ts
// 读取变量
document.documentElement.style.getPropertyValue("--main-bg-color").trim();

// 设置变量
document.documentElement.style.setProperty("--main-bg-color", "blue");

// 删除变量
document.body.style.removeProperty("--main-bg-color");
```

### 2. 配置目录别名 `@`，方便引用

在 `vite.config.ts` 中，根据需求自己定义。注意写法 `/@assets/`，键必须以 `/` 斜线开始和结束：

```ts
import type { UserConfig } from "vite";
const path = require("path");

const viteConfig: UserConfig = {
  port: 8080,
  hostname: "localhost",
  open: true,
  alias: {
    "/@/": path.resolve(__dirname, "./src"),
    "/@assets/": path.resolve(__dirname, "./src/assets"),
    "/@views/": path.resolve(__dirname, "./src/views"),
    "/@components/": path.resolve(__dirname, "./src/components"),
    "/@utils/": path.resolve(__dirname, "./src/utils"),
  },
};

export default viteConfig;
```

### 3. 页面中使用

注意 `/@` 写法，一定要以 `/` 开头，否则报 `404`

```ts
import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "/@/style/index.css";

createApp(App).use(ElementPlus).mount("#app");
```

### 4. 动态换肤功能

使用 `ColorPicker 颜色选择器`：[https://element-plus.gitee.io/#/zh-CN/component/color-picker](https://element-plus.gitee.io/#/zh-CN/component/color-picker)，实现动态换肤功能

::: tip 提示
请移步顶部导航 `主题` 中查看详细内容
:::

## 安装 vue-router-next

### 1. cmd 安装

- [vue-router-next 代码仓库（github）](https://github.com/vuejs/vue-router-next)
- [vue-router-next 文档地址](https://next.router.vuejs.org/)

```bash
cnpm install vue-router@4 --save
```

### 2. 页面中使用

- 页面下新增文件夹 `src/router/index.ts`

`index.ts` 中写入：

```ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("/@/views/layout/index.vue"),
    redirect: "/home",
    meta: {
      title: "首页",
    },
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("/@/views/home/index.vue"),
        meta: {
          title: "首页",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("/@/views/login/index.vue"),
    meta: {
      title: "登陆",
    },
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes,
});

export default router;
```

- `main.ts` 中引入 `src/router/index.ts`

```ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "/@/theme/index.scss";
import { locale } from "element-plus";

createApp(App).use(router).use(ElementPlus, { locale }).mount("#app");
```

- 页面测试：地址栏输入路由地址 `http://localhost:8080/#/login`，出现 `login` 中的文字就证明配置成功了。

::: tip 提示
地址栏带 `#号` 与不带 `#号` ，参考：[next.router history-mode.html](https://next.router.vuejs.org/guide/essentials/history-mode.html)

访问路由器和内部的当前路由 setup：[Vue 路由器和 Composition API](https://next.router.vuejs.org/guide/advanced/composition-api.html#accessing-the-router-and-current-route-inside-setup)
:::
