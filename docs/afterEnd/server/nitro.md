## Nitro 服务器

Nitro 是 Nuxt 团队最新推出的一个全新的部署工具，是 Nuxt.js 3 的后端运行和部署工具。

Nitro 的目标是提供在 (SSR) 应用程序中，最快速的冷启动和最小的冷启动延迟。

Nitro 是一个强大的后端开发框架，但它并不是仅限于与 Nuxt.js 一起使用。

Nitro 是一个开源的 TypeScript 框架，用于快速开发和部署 Web 服务器，零配置且支持热模块替换。其特点有：

- 💼 便携紧凑：告别 node_modules，输出大小小于 1MB。

- 📁 文件系统路由：自动注册服务器和 API 路由。

- 🤏 极简设计：设计极简，适用于任何解决方案，开销最小。

- 🚀 代码拆分：采用异步块加载，实现快速服务器启动时间和响应。

- 👕 TypeScript：开箱即用支持 TypeScript，附带一些额外的好东西。

- 💾 存储层：多驱动程序和平台无关的存储系统。

- 💰 缓存 API：强大的内置缓存 API。

- 🐱 可定制：通过插件挂钩系统定制化，具有高度可塑性。

- ✨ 自动导入：自动导入实用程序，实现最小且清晰的代码库。仅添加到最终捆绑包中的已使用的实用程序。

- 🏛️ 向后兼容：因此，您可以使用旧版 npm 包、CommonJS 和为工作人员模拟 Node.js 模块
- 快速冷启动速度：云函数在每次请求时都可能需要冷启动。Nitro 针对这一点进行了优化，可以在几毫秒内启动
- 服务器渲染 (SSR)：nitro 能够更快、更有效地进行服务器端渲染，优化了渲染性能。
- Edge-ready：Nitro 是为边缘计算设计的，完全兼容云平台和边缘推理服务，如 Cloudflare Workers，同时也支持 传统的 Node.js 服务器。
- 支持静态站点生成：Nitro 不仅支持 SSR，也支持预渲染静态站点
- 实时函数和 API Route：Nitro 自带实时函数的功能，无需额外设置即可使用。在任何地方编写 Serverless 函数，并与你的前端代码共享相同的 Typescript 或 JavaScript 代码。

## Nitro 配置

- 可以使用单个配置文件自定义 Nitro 服务器：nitro.config.ts。
- 如果使用的是 Nuxt，请在 Nuxt 配置中使用 nitro 选项。

```ts nitro.config.ts
import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  //使用preset选项的NITRO_PRESET 环境变量来自定义production预设
  preset,
  // 日志的详细级别，小于等于该级别的日志都会进行输出。生产环境下默认是3，开发环境下默认为1。
  logLevel: 0,
  //服务运行时配置
  runtimeConfig,
  // 启用实验性功能。默认值：{}
  experimental,
  // 存储配置，默认值：{}
  storage,
  // 是否启用时序信息（包括：1. nitro启用时间日志；2. HTTP响应上的Server-Timing标头）
  timing: false,
  //主渲染路径（文件应默认到处事件处理程序）
  render,
  // 在生产环境中提供公共资产
  serveStatic,
  //生产包的输出目录。
  output: {
    dir: ".output",
    serverDir: ".output/server",
    publicDir: ".output/public",
  },
  //路由配置规则。
  routeRules: {
    "/blog/**": { swr: true },
    "/blog/**": { swr: 600 },
    "/blog/**": { static: true },
    "/blog/**": {
      cache: {
        /* cache options*/
      },
    },
    "/assets/**": { headers: { "cache-control": "s-maxage=0" } },
    "/api/v1/**": {
      cors: true,
      headers: { "access-control-allow-methods": "GET" },
    },
    "/old-page": { redirect: "/new-page" },
    "/proxy/example": { proxy: "https://example.com" },
    "/proxy/**": { proxy: "/api/**" },
  },
  //用于开发和捆绑生产环境下的的公共资产目录
  publicAssets: [
    {
      baseURL: "images",
      dir: "public/images",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  ],
  // 开发服务器选项，可以使用watch监听指定路径文件的修改，一旦修改重新加载开发服务器。
  devServer,
  // 注册nitro的插件，他们将在第一次初始化的时候按顺序执行。
  plugins: [],
  // .....
});
```

```ts nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    // Nitro options
  },
});
```
