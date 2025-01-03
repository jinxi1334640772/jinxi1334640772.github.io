// 解析markdown转为HTML文件时，各种配置，例如：页面title，head,script,meta等
import { defineConfig } from "vitepress";
// 解析markdown转为HTML文件时，给特定标签添加特定属性和属性值
import mdItCustomAttrs from "markdown-it-custom-attrs";
// 页面配置
export default defineConfig({
  // 应用级别配置选项
  // 往head里添加标签
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "keywords",
        content: "vitepress生成的静态站点，用markdown语法编写HTML页面",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css",
      },
    ],
    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js",
      },
    ],
    [
      "script",
      { type: "text/javascript" },
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?dd9ada7b25f65a181a42780f04b764e6";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      `,
    ],
  ],
  // 配置 Markdown 解析器选项。VitePress 使用 Markdown-it 作为解析器，使用 Shiki 来高亮不同语言语法。在此选项中，可以传递各种 Markdown 相关选项以满足你的需要。
  markdown: {
    // markdown-it-anchor 的选项
    // https://github.com/valeriangalliat/markdown-it-anchor#usage
    // anchor: {
    //   permalink: markdownItAnchor.permalink.headerLink()
    // },
    // @mdit-vue/plugin-toc 的选项
    // https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-toc#options
    toc: { level: [1, 2] },
    lineNumbers: true, // 为代码块启动行号显示
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true,
    },
    // 可以添加markdown插件，添加markdown扩展功能
    config: md => {
      // 遇到img标签，添加自定义属性
      md.use(mdItCustomAttrs, "image", { "data-fancybox": "gallery" });
    },
    // 全局自定义提示信息标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  // 左上角title & 网站title配置
  title: "我的主页",
  // 自定义每个页面的标题后缀或整个标题
  titleTemplate: ":title - 基于vitePress项目",
  // 网页description 描述介绍
  description:
    "🎉🎉🔥VitePress 是一个静态站点生成器 (SSG)，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。",
  // 网页语言
  lang: "zh-CN",
  // 基础baseUrl 类似publicPath
  base: "/",
  // 是否显示更新时间，是否使用 Git 获取每个页面的最后更新时间戳。时间戳将包含在每个页面的页面数据中，可通过 useData 访问。
  lastUpdated: false,
  // 自定义更新text
  lastUpdatedText: "上次更新",
  // 当设置为 true 时，VitePress 将从 URL 中删除 .html 后缀。需要服务端支持
  cleanUrls: false,
  // 源代码目录，默认是根目录。相对于项目根目录的 markdown 文件所在的文件夹。
  // srcDir: './src',
  // 用于匹配应排除作为源内容输出的 markdown 文件，语法详见 glob pattern。
  // srcExclude: ['**/index.md', '**/TODO.md'],
  // 构建生成静态资源的目录，默认assets
  assetsDir: "assets",
  // 是否启用深色模式，默认true，用户首选配色方案。boolean | 'dark' | 'force-dark'
  appearance: true,
  //默认false，当设置为 true 时，将页面元数据提取到单独的 JavaScript 块中，而不是内联在初始 HTML 中。这使每个页面的 HTML 负载更小，并使页面元数据可缓存，从而当站点中有很多页面时可以减少服务器带宽。
  metaChunk: true,
  //缓存文件的位置，默认值./.vitepress/cache
  cacheDir: "./.vitepress/cache",
  // 项目的构建输出位置，相对于项目根目录。
  outDir: "./.vitepress/dist",
  // 重写生成文件的路径
  rewrites: {
    "source/:page": "destination/:page",
  },
  // 将原始 Vite 配置传递给内部 Vite 开发服务器 / bundler。
  vite: {
    // Vite 配置选项
  },
  // 将原始的 @vitejs/plugin-vue 选项传递给内部插件实例。
  vue: {
    // @vitejs/plugin-vue 选项
  },
  // 主题级别配置选项
  themeConfig: {
    // 左上角是否显示logo
    logo: "/images/mogu.jpg",
    search: {
      provider: "local",
    },
    // search: {
    //   provider: "algolia",
    //   options: {
    //     apiKey: "ef1d5913298c3b377842ab406af9cbf6",
    //     appId: "VZD7WV0OU8",
    //     indexName: "vue-next-admin-doc-preview",
    //     placeholder: "请输入内容...",
    //   },
    // },
    // 自定义右侧大纲标题
    outlineTitle: "大纲",
    // 开启大纲深层导航：1，1.1，1.2.1
    outline: "deep",
    // 自定义底部编辑链接
    editLink: {
      pattern: "https://gitee.com/myPrettyCode/vitepress/edit/master/docs/:path",
      text: "欢迎到 Gitee 上编辑此页",
    },
    // VitePress 内置了对 Carbon Ads 的原生支持。通过在配置中定义 Carbon Ads 凭据，VitePress 将在页面上显示广告。
    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement'
    // },
    author: "zhangjinxi",
    // 底部版权声明
    footer: {
      message: "根据 MIT 许可证发布",
      copyright: "Copyright © 2022-present zhangjinxi",
    },
    //  // 可用于自定义出现在上一页和下一页链接上方的文本。如果不是用英语编写文档，这很有帮助。也可用于全局禁用上一页/下一页链接。如果想有选择地启用/禁用上一个/下一个链接，可以使用 frontmatter。
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    // 右上角导航配置
    nav: [
      {
        text: "前端技术",
        activeMatch: "/web/",
        items: [
          { text: "HTML & CSS", link: "/frontEnd/css/dom" },
          { text: "JavaScript", link: "/frontEnd/javascript/" },
          { text: "Window", link: "/frontEnd/window/navigator" },
          { text: "jQuery框架", link: "/frontEnd/web/jQuery" },
          { text: "TypeScript", link: "/frontEnd/web/TypeScript" },
          { text: "qiankun微前端", link: "/frontEnd/web/qiankun" },
          { text: "Svelte框架", link: "/frontEnd/web/svelte" },
          { text: "Vue框架", link: "/frontEnd/web/vue" },
          { text: "Amis低代码", link: "/frontEnd/web/lessCode" },
          { text: "VitePress生成站点", link: "/frontEnd/web/VitePress" },
          { text: "Nuxt SSR服务端渲染", link: "/frontEnd/web/nuxt" },
        ],
      },
      {
        text: "后端技术",
        activeMatch: "/afterEnd/",
        items: [
          { text: "Node", link: "/afterEnd/node/module" },
          { text: "Express", link: "/afterEnd/express/server" },
          { text: "Koa", link: "/afterEnd/express/koa" },
          { text: "数据库", link: "/afterEnd/database/mongoose" },
          { text: "服务器", link: "/afterEnd/server/nginx" },
        ],
      },
      {
        text: "测试技术",
        items: [
          { text: "test 测试模块", link: "/afterEnd/node/test" },
          { text: "assert 断言模块", link: "/afterEnd/node/assert" },
          { text: "Cypress 测试框架", link: "/tools/package/test/Cypress" },
          { text: "Storybook组件测试", link: "/tools/package/Storybook" },
        ],
      },
      {
        text: "跨端开发",
        activeMatch: "/spanEnd/",
        items: [
          { text: "Electron桌面开发", link: "/spanEnd/electron" },
          { text: "Taro", link: "/spanEnd/taro" },
          { text: "Uni-App", link: "/spanEnd/uniapp" },
        ],
      },
      {
        text: "网络工程",
        activeMatch: "/network/",
        items: [
          { text: "HTTP协议", link: "/network/http" },
          { text: "HTTP安全", link: "/network/httpSecure/contentSecurity" },
          { text: "HTTP请求工具", link: "/network/ajaxAndFetch/fetch" },
        ],
      },
      {
        text: "开发工具",
        activeMatch: "/tools/",
        items: [
          { text: "开发规范", link: "/tools/stardard/eslint" },
          { text: "问题锦集", link: "/tools/questions/handwrite" },
          {
            text: "构建工具&CI/CD",
            items: [
              { text: "Webpack", link: "/tools/buildTools/webpack" },
              { text: "Gulp", link: "/tools/buildTools/gulp" },
              { text: "Vite", link: "/tools/buildTools/vite" },
              { text: "Docker", link: "/tools/buildTools/docker" },
              { text: "Jenkins", link: "/tools/buildTools/Jenkins" },
              { text: "GitHub Actions", link: "/tools/buildTools/actions" },
              { text: "脚手架开发", link: "/tools/buildTools/scaffolder" },
            ],
          },
          { text: "数据结构和算法", link: "/tools/questions/algorithm" },
          { text: "架构设计", link: "/tools/questions/system" },
          { text: "设计模式", link: "/tools/questions/designMode" },
          { text: "Git版本管理", link: "/tools/stardard/git" },
          { text: "Lodash工具库", link: "/tools/package/lodash" },
          { text: "Vue-I18n国际化", link: "/tools/package/vueI18n" },
          { text: "Whistle网络调试", link: "/tools/package/whistle" },
          { text: "Mockjs数据模拟", link: "/tools/package/mockjs" },
          { text: "Echarts图表库", link: "/tools/package/echarts" },
          { text: "AntV图表库", link: "/tools/package/antv" },
          { text: "VueRouter", link: "/tools/package/VueRouter" },
          { text: "Pinia状态管理", link: "/tools/package/pinia" },
        ],
      },
      {
        text: "性能优化",
        link: "/performace/dnsPrefetch",
        activeMatch: "/performace/",
      },
    ],
    // 右上角社交账号配置
    socialLinks: [{ icon: "github", link: "https://github.com/jinxi1334640772" }],
    // 左侧导航栏配置：根据页面路由匹配，可分组
    sidebar: {
      "/tools/": [
        {
          text: "开发规范",
          collapsed: false,
          items: [
            { text: "学习文档", link: "/tools/study" },
            { text: "Eslint 代码风格", link: "/tools/stardard/eslint" },
            { text: "Prettier 格式化", link: "/tools/stardard/prettier" },
            { text: "VsCode 配置", link: "/tools/stardard/vscode" },
            { text: "Git 版本管理", link: "/tools/stardard/git" },
            { text: "命名规范", link: "/tools/stardard/naming" },
            { text: "代码质量把控", link: "/tools/stardard/quality" },
          ],
        },
        {
          text: "构建工具&CI/CD",
          collapsed: false,
          items: [
            { text: "Vite", link: "/tools/buildTools/vite" },
            { text: "Webpack", link: "/tools/buildTools/Webpack" },
            { text: "Gulp", link: "/tools/buildTools/gulp" },
            { text: "Rollup", link: "/tools/buildTools/rollup" },
            { text: "Docker", link: "/tools/buildTools/docker" },
            { text: "Jenkins", link: "/tools/buildTools/Jenkins" },
            { text: "脚手架开发", link: "/tools/buildTools/scaffolder" },
            { text: "node&npm包管理", link: "/tools/buildTools/npm" },
            { text: "Lerna多包管理", link: "/tools/buildTools/lerna" },
          ],
        },
        {
          text: "好用的工具",
          collapsed: false,
          items: [
            { text: "animate css动画库", link: "/tools/package/animate" },
            { text: "Anime js动画库", link: "/tools/package/anime" },
            { text: "Lottie js动画库", link: "/tools/package/Lottie" },
            { text: "Velocity js动画库", link: "/tools/package/Velocity" },
            { text: "Echarts 图表库", link: "/tools/package/echarts" },
            { text: "AntV 图表库", link: "/tools/package/antv" },
            { text: "D3.js 数据可视化", link: "/tools/package/D3" },
            { text: "Cesium 地图可视化", link: "/tools/package/Cesium" },
            { text: "Pinia 状态管理", link: "/tools/package/pinia" },
            { text: "VueRouter 路由管理", link: "/tools/package/VueRouter" },
            { text: "Vue-I18n 国际化", link: "/tools/package/vueI18n" },
            { text: "Lodash 工具库", link: "/tools/package/lodash" },
            { text: "Iconfont 字体图表", link: "/tools/package/iconfont" },
            { text: "TinyMCE 富文本", link: "/tools/package/TinyMCE" },
            { text: "dom-to-image", link: "/tools/package/DomToImage" },
            { text: "vuex-persist", link: "/tools/package/vuexPersist" },
            { text: "tasksfile 函数任务", link: "/tools/package/tasksfile" },
            { text: "fuse.js 模糊匹配", link: "/tools/package/fuse" },
            { text: "day.js 日期时间格式化", link: "/tools/package/dayjs" },
            { text: "Cypress 测试框架", link: "/tools/package/test/Cypress" },
            { text: "Storybook 组件测试", link: "/tools/package/Storybook" },
            { text: "sodajs 模板引擎", link: "/tools/package/sodajs" },
            { text: "Sentry 错误监控", link: "/tools/package/sentry" },
            { text: "Hybrid 混合开发", link: "/tools/package/hybrid" },
            { text: "Bootstrap", link: "/tools/package/bootstrap" },
          ],
        },
        {
          text: "常见问题",
          collapsed: false,
          items: [
            { text: "架构设计", link: "/tools/questions/system" },
            { text: "设计模式", link: "/tools/questions/designMode" },
            { text: "数据结构与算法", link: "/tools/questions/algorithm" },
            { text: "LeetCode", link: "/tools/questions/leetCode" },
            { text: "手写日常", link: "/tools/questions/handwrite" },
            { text: "内容输出问题", link: "/tools/questions/print" },
            { text: "发布npm包", link: "/tools/questions/npmPublish" },
            { text: "promise", link: "/tools/questions/promise" },
            { text: "兼容性问题", link: "/tools/questions/compatibility" },
            { text: "问题锦集", link: "/tools/questions/questions" },
            { text: "npm私服搭建", link: "/tools/questions/npmHub" },
            { text: "移动端适配", link: "/tools/questions/mobileFit" },
            { text: "dev-tools 调试", link: "/tools/questions/debugging" },
            { text: "Robots爬虫协议", link: "/tools/questions/robots" },
            { text: "微信支付", link: "/tools/questions/wechatPay" },
            { text: "Grafana数据监控", link: "/tools/questions/Grafana" },
          ],
        },
      ],
      "/network/": [
        {
          text: "HTTP",
          collapsed: false,
          items: [
            { text: "HTTP简介", link: "/network/http" },
            { text: "网络七层模型", link: "/network/http/osi" },
            { text: "HTTP协议和连接", link: "/network/http/connection" },
            { text: "常见状态码", link: "/network/http/status" },
            { text: "MIME类型", link: "/network/http/mime" },
            { text: "HTTP范围请求", link: "/network/http/range" },
            { text: "内容协商", link: "/network/http/accept" },
          ],
        },
        {
          text: "HTTP 安全",
          collapsed: false,
          items: [
            { text: "权限策略", link: "/network/httpSecure/premission" },
            {
              text: "内容安全策略",
              link: "/network/httpSecure/contentSecurity",
            },
            { text: "跨域策略", link: "/network/httpSecure/crossOrigin" },
            { text: "HTTPS 协议", link: "/network/httpSecure/https" },
            { text: "常见安全问题", link: "/network/httpSecure/secure" },
          ],
        },
        {
          text: "HTTP请求工具",
          collapsed: false,
          items: [
            { text: "ajax", link: "/network/ajaxAndFetch/ajax" },
            { text: "fetch", link: "/network/ajaxAndFetch/fetch" },
            { text: "axios", link: "/network/ajaxAndFetch/axios" },
          ],
        },
      ],
      "/spanEnd/": [
        {
          text: "桌面跨端开发",
          collapsed: false,
          items: [{ text: "electron开发", link: "/spanEnd/electron" }],
        },
        {
          text: "uni-app 跨端开发",
          collapsed: false,
          items: [
            { text: "uni-app 介绍", link: "/spanEnd/uniapp/" },
            { text: "uni-app 组件", link: "/spanEnd/uniapp/components" },
            { text: "uni-app API", link: "/spanEnd/uniapp/api" },
          ],
        },
        {
          text: "Taro 跨端开发",
          collapsed: false,
          items: [
            { text: "taro简介", link: "/spanEnd/Taro/" },
            { text: "taro配置", link: "/spanEnd/Taro/config" },
            { text: "taro适配vue", link: "/spanEnd/Taro/vue" },
            { text: "taro路由", link: "/spanEnd/Taro/router" },
            { text: "基础内容组件", link: "/spanEnd/Taro/basic" },
            { text: "视图容器组件", link: "/spanEnd/Taro/viewContrainer" },
            { text: "表单组件", link: "/spanEnd/Taro/form" },
            { text: "导航组件", link: "/spanEnd/Taro/navigator" },
            { text: "媒体组件", link: "/spanEnd/Taro/media" },
            { text: "开放能力", link: "/spanEnd/Taro/open" },
            { text: "taro云开发", link: "/spanEnd/Taro/cloud" },
            { text: "taro API", link: "/spanEnd/Taro/api" },
          ],
        },
      ],
      "/afterEnd/": [
        {
          text: "node",
          collapsed: false,
          items: [
            { text: "模块系统", link: "/afterEnd/node/module" },
            { text: "test 模块", link: "/afterEnd/node/test" },
            { text: "assert 模块", link: "/afterEnd/node/assert" },
            { text: "buffer 模块", link: "/afterEnd/node/buffer" },
            { text: "fs 模块", link: "/afterEnd/node/fs" },
            { text: "path 模块", link: "/afterEnd/node/path" },
            { text: "events 模块", link: "/afterEnd/node/events" },
            { text: "http 模块", link: "/afterEnd/node/server" },
            { text: "http2 模块", link: "/afterEnd/node/http2" },
            { text: "fs Stream", link: "/afterEnd/node/stream" },
            { text: "util 模块", link: "/afterEnd/node/util" },
            { text: "process 模块", link: "/afterEnd/node/process" },
            { text: "readline 模块", link: "/afterEnd/node/readline" },
            { text: "querystring 模块", link: "/afterEnd/node/querystring" },
            { text: "node 爬虫", link: "/afterEnd/node/reptile" },
          ],
        },
        {
          text: "Node 框架",
          collapsed: false,
          items: [
            { text: "Express", link: "/afterEnd/express/server" },
            { text: "Koa", link: "/afterEnd/express/koa" },
            { text: "Egg", link: "/afterEnd/express/egg" },
          ],
        },
        {
          text: "数据库",
          collapsed: false,
          items: [
            { text: "MongoDB", link: "/afterEnd/database/mongoose" },
            { text: "MySQL", link: "/afterEnd/database/mysql" },
          ],
        },
        {
          text: "服务器",
          collapsed: false,
          items: [
            { text: "Nginx服务器", link: "/afterEnd/server/nginx" },
            { text: "Nitro服务器", link: "/afterEnd/server/nitro" },
          ],
        },
      ],
      "/frontEnd/": [
        {
          text: "HTML & CSS",
          collapsed: true,
          items: [
            { text: "HTML元素", link: "/frontEnd/css/html" },
            { text: "DOM 对象", link: "/frontEnd/css/dom" },
            { text: "CSS 样式", link: "/frontEnd/css/index" },
            { text: "常见布局", link: "/frontEnd/css/layout" },
            { text: "变形和渐变色", link: "/frontEnd/css/transform" },
            { text: "CSS 选择器", link: "/frontEnd/css/selector" },
            { text: "CSS 动画", link: "/frontEnd/css/animation" },
            { text: "CSS 函数", link: "/frontEnd/css/function" },
            { text: "CSS @查询规则", link: "/frontEnd/css/atRules" },
            { text: "Less 预处理器", link: "/frontEnd/css/less" },
            { text: "Sass 预处理器", link: "/frontEnd/css/sass" },
          ],
        },
        {
          text: "javascript",
          collapsed: true,
          items: [
            { text: "javascript简介", link: "/frontEnd/javascript/" },
            { text: "Error错误对象", link: "/frontEnd/javascript/Error" },
            { text: "RegExp正则", link: "/frontEnd/javascript/RegExp" },
            { text: "基本数据类型", link: "/frontEnd/javascript/object" },
            { text: "Set和Map", link: "/frontEnd/javascript/setAndMap" },
            { text: "ArrayBuffer相关", link: "/frontEnd/javascript/ArrayBuffer" },
            { text: "Atomics原子操作", link: "/frontEnd/javascript/Atomics" },
            { text: "Intl国际化", link: "/frontEnd/javascript/Intl" },
            { text: "JSON对象", link: "/frontEnd/javascript/json" },
            { text: "Proxy & Reflect", link: "/frontEnd/javascript/proxy" },
          ],
        },
        {
          text: "Web 技术锦集",
          collapsed: false,
          items: [
            { text: "jQuery框架", link: "/frontEnd/web/jQuery" },
            { text: "Vue 框架", link: "/frontEnd/web/vue" },
            { text: "TypeScript", link: "/frontEnd/web/TypeScript" },
            { text: "qiankun微前端", link: "/frontEnd/web/qiankun" },
            { text: "Svelte框架", link: "/frontEnd/web/svelte" },
            { text: "Amis低代码", link: "/frontEnd/web/lessCode" },
            { text: "VitePress生成站点", link: "/frontEnd/web/VitePress" },
            { text: "Nuxt SSR服务端渲染", link: "/frontEnd/web/nuxt" },
          ],
        },
        {
          text: "window",
          collapsed: false,
          items: [
            { text: "navigator属性", link: "/frontEnd/window/navigator" },
            { text: "navigator方法", link: "/frontEnd/window/navigatorFun" },
            { text: "Web Worker", link: "/frontEnd/window/webWorker" },
            { text: "Service Worker", link: "/frontEnd/window/serviceWorker" },
            { text: "window属性", link: "/frontEnd/window/properties" },
            { text: "window方法", link: "/frontEnd/window/function" },
            { text: "window事件", link: "/frontEnd/window/events" },
            { text: "crypto加密", link: "/frontEnd/window/crypto" },
            { text: "web Components", link: "/frontEnd/window/webComponents" },
            { text: "indexedDB", link: "/frontEnd/window/indexedDB" },
            { text: "Performance", link: "/frontEnd/window/Performance" },
            { text: "web语音识别&合成", link: "/frontEnd/window/speech" },
          ],
        },
        {
          text: "Web API",
          collapsed: false,
          items: [
            { text: "Canvas API", link: "/frontEnd/window/Canvas" },
            { text: "Web API锦集a-i", link: "/frontEnd/window/webapi1" },
            { text: "Web API锦集k-u", link: "/frontEnd/window/webapi2" },
            { text: "Web API锦集v-z", link: "/frontEnd/window/webapi3" },
            { text: "Web Observer锦集", link: "/frontEnd/window/observer" },
            { text: "Web payment支付", link: "/frontEnd/window/payment" },
            { text: "Stream API", link: "/frontEnd/window/stream" },
            { text: "Web RTC", link: "/frontEnd/window/webRTC" },
            { text: "Web Socket", link: "/frontEnd/window/Socket" },
          ],
        },
      ],
      "/performace/": [
        {
          text: "代码优化",
          collapsed: false,
          items: [
            {
              text: "性能优化手段",
              link: "/performace/performace",
            },
            {
              text: "DNS预解析和预连接",
              link: "/performace/dnsPrefetch",
            },
            {
              text: "资源预获取和预加载",
              link: "/performace/prefetch",
            },
            {
              text: "图片优化",
              link: "/performace/image",
            },
            {
              text: "优化 SEO",
              link: "/performace/seo",
            },
          ],
        },
      ],
    },
  },
});
