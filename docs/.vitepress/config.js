// 解析markdown转为HTML文件时，各种配置，例如：页面title，head,script,meta等
import { defineConfig } from "vitepress";
// 解析markdown转为HTML文件时，给特定标签添加特定属性和属性值
import mdItCustomAttrs from "markdown-it-custom-attrs";
import markdownItAnchor from "markdown-it-anchor";
// 页面配置
export default defineConfig({
  // 应用级别配置选项
  // 往head里添加标签
  head: [
    ["link", { rel: "icon", href: "/vitepress/images/favicon.ico" }],
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
  lastUpdated: true,
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
    // search: {
    //   provider: 'local'
    // },
    search: {
      provider: "algolia",
      options: {
        apiKey: "ef1d5913298c3b377842ab406af9cbf6",
        appId: "VZD7WV0OU8",
        indexName: "vue-next-admin-doc-preview",
        placeholder: "请输入内容...",
      },
    },
    // 自定义右侧大纲标题
    outlineTitle: "大纲",
    // 开启大纲深层导航：1，1.1，1.2.1
    outline: "deep",
    // 自定义底部编辑链接
    editLink: {
      pattern:
        "https://gitee.com/myPrettyCode/vitepress/edit/master/docs/:path",
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
        text: "web技术",
        activeMatch: "/web/",
        items: [
          { text: "HTML", link: "/web/html/" },
          { text: "CSS", link: "/web/css/" },
          { text: "JavaScript", link: "/web/javascript/" },
          { text: "jQuery", link: "/web/javascript/jQuery" },
          { text: "TypeScript", link: "/web/javascript/TypeScript" },
          { text: "qiankun微前端", link: "/web/javascript/qiankun" },
          { text: "Window", link: "/web/window/" },
          { text: "VitePress", link: "/web/vitepress/" },
        ],
      },
      {
        text: "后端开发",
        activeMatch: "/afterEnd/",
        items: [
          { text: "node", link: "/afterEnd/node/module" },
          { text: "express", link: "/afterEnd/express/server" },
          { text: "数据库", link: "/afterEnd/database/mongoose" },
          { text: "Nginx服务器", link: "/afterEnd/nginx/nginx" },
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
            text: "构建工具",
            items: [
              { text: "Webpack", link: "/tools/buildTools/webpack" },
              { text: "Gulp", link: "/tools/buildTools/gulp" },
              { text: "Vite", link: "/tools/buildTools/vite" },
              { text: "Docker", link: "/tools/buildTools/docker" },
              { text: "Jenkins", link: "/tools/buildTools/Jenkins" },
              { text: "脚手架开发", link: "/tools/buildTools/scaffolder" },
            ],
          },
          { text: "数据结构和算法", link: "/tools/questions/algorithm" },
          { text: "架构设计", link: "/tools/questions/system" },
          { text: "设计模式", link: "/tools/questions/designMode" },
          { text: "Git版本管理", link: "/tools/stardard/git" },
          { text: "Cypress 测试框架", link: "/tools/package/test/Cypress" },
          { text: "Lodash工具库", link: "/tools/package/lodash" },
          { text: "Vue-I18n国际化", link: "/tools/package/vueI18n" },
          { text: "Whistle网络调试", link: "/tools/package/whistle" },
          { text: "mockjs数据模拟", link: "/tools/package/mockjs" },
          { text: "Echarts图表库", link: "/tools/package/echarts" },
          { text: "AntV图表库", link: "/tools/package/antv" },
          { text: "VueRouter", link: "/tools/package/VueRouter" },
          { text: "Pinia状态管理", link: "/tools/package/pinia" },
        ],
      },
      {
        text: "性能优化",
        link: "/performace/codePerformace/dnsPrefetch",
        activeMatch: "/performace/",
      },
    ],
    // 右上角社交账号配置
    socialLinks: [
      { icon: "github", link: "https://github.com/jinxi1334640772" },
    ],
    // 左侧导航栏配置：根据页面路由匹配，可分组
    sidebar: {
      "/tools/": [
        {
          text: "开发规范",
          collapsed: false,
          items: [
            { text: "学习文档", link: "/tools/study" },
            { text: "eslint", link: "/tools/stardard/eslint" },
            { text: "prettier", link: "/tools/stardard/prettier" },
            { text: "vsCode配置", link: "/tools/stardard/vscode" },
            { text: "git版本管理", link: "/tools/stardard/git" },
          ],
        },
        {
          text: "好用的npm包",
          collapsed: false,
          items: [
            { text: "Echarts图表库", link: "/tools/package/echarts" },
            { text: "AntV图表库", link: "/tools/package/antv" },
            { text: "我的Webpack插件", link: "/tools/package/myplugin" },
            { text: "Pinia状态管理", link: "/tools/package/pinia" },
            { text: "VueRouter路由管理", link: "/tools/package/VueRouter" },
            { text: "Vue-I18n国际化", link: "/tools/package/vueI18n" },
            { text: "lodash工具库", link: "/tools/package/lodash" },
          ],
        },
        {
          text: "构建工具",
          collapsed: false,
          items: [
            { text: "Vite", link: "/tools/buildTools/vite" },
            { text: "Webpack", link: "/tools/buildTools/Webpack" },
            { text: "gulp", link: "/tools/buildTools/gulp" },
            { text: "Docker", link: "/tools/buildTools/docker" },
            { text: "Jenkins", link: "/tools/buildTools/Jenkins" },
            { text: "脚手架开发", link: "/tools/buildTools/scaffolder" },
          ],
        },
        {
          text: "常见问题",
          collapsed: false,
          items: [
            { text: "promise", link: "/tools/questions/promise" },
            { text: "架构设计", link: "/tools/questions/system" },
            { text: "手写日常", link: "/tools/questions/handwrite" },
            { text: "数据结构与算法", link: "/tools/questions/algorithm" },
            { text: "内容输出问题", link: "/tools/questions/print" },
            { text: "发布npm包", link: "/tools/questions/npmPublish" },
            { text: "设计模式", link: "/tools/questions/designMode" },
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
            { text: "权限策略", link: "/network/http/premission" },
            { text: "内容安全策略", link: "/network/http/contentSecurity" },
            { text: "CORS跨域资源共享", link: "/network/http/cors" },
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
          text: "Taro开发跨端开发",
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
          ],
        },
        {
          text: "express",
          collapsed: false,
          items: [{ text: "创建服务器", link: "/afterEnd/express/server" }],
        },
        {
          text: "数据库",
          collapsed: false,
          items: [{ text: "MongooseDB", link: "/afterEnd/database/mongoose" }],
        },
        {
          text: "服务器",
          collapsed: false,
          items: [{ text: "Nginx服务器", link: "/afterEnd/nginx/nginx" }],
        },
      ],
      "/web/": [
        {
          text: "html",
          collapsed: true,
          items: [
            { text: "HTML简介", link: "/web/html/" },
            { text: "多媒体与嵌入", link: "/web/html/media" },
            { text: "DOM对象", link: "/web/html/dom" },
          ],
        },
        {
          text: "css",
          collapsed: true,
          items: [
            { text: "CSS简介", link: "/web/css/" },
            { text: "滚动条设置", link: "/web/css/setScrollBar" },
            { text: "常见布局", link: "/web/css/layout" },
            { text: "响应式布局", link: "/web/css/responseDesign" },
            {
              text: "float&position&上下文",
              link: "/web/css/floatAndPosition",
            },
            { text: "flex布局", link: "/web/css/flex" },
            { text: "grid布局", link: "/web/css/grid" },
            { text: "multicol布局", link: "/web/css/multicol" },
            { text: "变形和渐变色", link: "/web/css/transformAndGradient" },
            { text: "css选择器", link: "/web/css/selector" },
            { text: "less的使用", link: "/web/css/less" },
            { text: "sass的使用", link: "/web/css/sass" },
            { text: "CSS动画", link: "/web/css/animation" },
            { text: "CSS坐标系", link: "/web/css/coordinateSystem" },
            { text: "CSS计数器", link: "/web/css/counter" },
            { text: "CSS嵌套样式规则", link: "/web/css/insert" },
            { text: "滚动吸附", link: "/web/css/scrollSnap" },
            { text: "定义盒子形状", link: "/web/css/boxShape" },
            { text: "CSS属性锦集", link: "/web/css/attrbutes" },
            { text: "@查询规则锦集", link: "/web/css/atRules" },
            { text: "CSS函数锦集", link: "/web/css/function" },
          ],
        },
        {
          text: "javascript",
          collapsed: true,
          items: [
            { text: "javascript简介", link: "/web/javascript/" },
            { text: "问题锦集", link: "/web/javascript/questions" },
            { text: "Error错误对象", link: "/web/javascript/Error" },
            { text: "RegExp正则", link: "/web/javascript/RegExp" },
            { text: "基本数据类型", link: "/web/javascript/object" },
            { text: "Set和Map", link: "/web/javascript/setAndMap" },
            { text: "ArrayBuffer相关", link: "/web/javascript/ArrayBuffer" },
            { text: "encodeURI相关", link: "/web/javascript/encodeURI" },
            { text: "Atomics原子操作", link: "/web/javascript/Atomics" },
            { text: "Intl国际化", link: "/web/javascript/Intl" },
            { text: "JSON对象", link: "/web/javascript/json" },
            { text: "Proxy & Reflect", link: "/web/javascript/proxy" },
            { text: "jQuery框架", link: "/web/javascript/jQuery" },
            { text: "TypeScript", link: "/web/javascript/TypeScript" },
            { text: "qiankun微前端", link: "/web/javascript/qiankun" },
          ],
        },
        {
          text: "window",
          collapsed: false,
          items: [
            { text: "Window简介", link: "/web/window/" },
            { text: "navigator属性", link: "/web/window/navigator" },
            { text: "navigator方法", link: "/web/window/navigatorFunction" },
            { text: "Web Worker", link: "/web/window/webWorker" },
            { text: "Service Worker", link: "/web/window/serviceWorker" },
            { text: "window属性", link: "/web/window/properties" },
            { text: "window方法", link: "/web/window/function" },
            { text: "window事件", link: "/web/window/events" },
            { text: "crypto加密", link: "/web/window/crypto" },
            { text: "web Components", link: "/web/window/webComponents" },
            { text: "indexedDB", link: "/web/window/indexedDB" },
            { text: "Performance", link: "/web/window/Performance" },
            { text: "web语音识别&合成", link: "/web/window/speech" },
          ],
        },
        {
          text: "Web API",
          collapsed: false,
          items: [
            { text: "Canvas API", link: "/web/window/Canvas" },
            { text: "Web API锦集a-i", link: "/web/window/webapi1" },
            { text: "Web API锦集k-u", link: "/web/window/webapi2" },
            { text: "Web API锦集v-z", link: "/web/window/webapi3" },
            { text: "Web Observer锦集", link: "/web/window/observer" },
            { text: "Web payment支付", link: "/web/window/payment" },
            { text: "Stream API", link: "/web/window/stream" },
            { text: "Web RTC", link: "/web/window/webRTC" },
            { text: "Web Socket", link: "/web/window/Socket" },
          ],
        },
        {
          text: "VitePress",
          collapsed: false,
          items: [
            { text: "什么是VitePress", link: "/web/vitepress/" },
            { text: "路由配置", link: "/web/vitepress/routerConfig/" },
            { text: "markdown写作", link: "/web/vitepress/mdWrite/" },
            { text: "markdown使用Vue", link: "/web/vitepress/mdUseVue/" },
          ],
        },
      ],
      "/performace/": [
        {
          text: "代码优化",
          collapsed: false,
          items: [
            {
              text: "DNS预解析和预连接",
              link: "/performace/codePerformace/dnsPrefetch",
            },
            {
              text: "资源预获取和预加载",
              link: "/performace/codePerformace/prefetch",
            },
          ],
        },
      ],
    },
  },
});
