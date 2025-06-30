// VitePress 配置文件
// 详细配置文档: https://vitepress.dev/reference/site-config

import { defineConfig } from 'vitepress'

export default defineConfig({
  // ===== 基础配置 =====
  title: '💻 VitePress 技术文档站点',
  description: '专业的前端技术知识库，涵盖前端、后端、网络工程、开发工具等技术领域',
  lang: 'zh-CN',
  
  // ===== 头部配置 =====
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'keywords', content: 'VitePress,前端,技术文档,JavaScript,Vue,React,Node.js' }],
    ['meta', { property: 'og:title', content: 'VitePress 技术文档站点' }],
    ['meta', { property: 'og:description', content: '专业的前端技术知识库' }],
    ['meta', { property: 'og:type', content: 'website' }],
    // Fancybox 图片灯箱效果
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js' }]
  ],

  // ===== 路由配置 =====
  cleanUrls: true,
  
  // ===== 主题配置 =====
  themeConfig: {
    // ----- 网站信息 -----
    logo: '/images/logo-mini.svg',
    siteTitle: '🚀 技术文档',
    
    // ----- 导航栏 -----
    nav: [
      { 
        text: '🏠 首页', 
        link: '/home' 
      },
      { 
        text: '👤 简历', 
        link: '/' 
      },
      {
        text: '🎨 前端技术',
        items: [
          { text: '📝 HTML & CSS', link: '/frontEnd/css/dom' },
          { text: '⚡ JavaScript', link: '/frontEnd/javascript/' },
          { text: '🖥️ 浏览器 API', link: '/frontEnd/window/properties' },
          { text: '🚀 现代框架', link: '/frontEnd/web/vue' }
        ]
      },
      {
        text: '⚙️ 后端技术',
        items: [
          { text: '🟢 Node.js', link: '/afterEnd/node/module' },
          { text: '🚂 Express 框架', link: '/afterEnd/express/server' },
          { text: '🗄️ 数据库', link: '/afterEnd/database/mysql' },
          { text: '🌐 服务器', link: '/afterEnd/server/nginx' }
        ]
      },
      {
        text: '🌐 网络工程',
        items: [
          { text: '📡 HTTP 协议', link: '/network/http/' },
          { text: '🔒 网络安全', link: '/network/httpSecure/https' },
          { text: '📨 网络请求', link: '/network/ajaxAndFetch/ajax' }
        ]
      },
      {
        text: '🛠️ 开发工具',
        items: [
          { text: '📦 构建工具', link: '/tools/buildTools/vite' },
          { text: '📚 常用包', link: '/tools/package/lodash' },
          { text: '📋 开发规范', link: '/tools/stardard/git' },
          { text: '❓ 问题集合', link: '/tools/questions/handwrite' }
        ]
      },
      {
        text: '📱 跨端开发',
        items: [
          { text: '🎯 Taro', link: '/spanEnd/Taro/' },
          { text: '🦄 uni-app', link: '/spanEnd/uniapp/' },
          { text: '💻 Electron', link: '/spanEnd/electron' }
        ]
      },
      {
        text: '⚡ 性能优化',
        link: '/performace/performace'
      }
    ],

    // ----- 侧边栏 -----
    sidebar: {
      // 前端技术侧边栏
      '/frontEnd/': [
        {
          text: '🎨 CSS 基础',
          collapsed: false,
          items: [
            { text: '📄 DOM 操作', link: '/frontEnd/css/dom' },
            { text: '🎯 CSS 选择器', link: '/frontEnd/css/selector' },
            { text: '📐 布局技术', link: '/frontEnd/css/layout' },
            { text: '🎭 CSS 函数', link: '/frontEnd/css/function' },
            { text: '🎬 动画效果', link: '/frontEnd/css/animation' },
            { text: '🔄 变换属性', link: '/frontEnd/css/transform' },
            { text: '📋 HTML 基础', link: '/frontEnd/css/html' },
            { text: '📏 Less 预处理', link: '/frontEnd/css/less' },
            { text: '🎨 Sass 预处理', link: '/frontEnd/css/sass' },
            { text: '📝 At-Rules', link: '/frontEnd/css/atRules' }
          ]
        },
        {
          text: '⚡ JavaScript 核心',
          collapsed: false,
          items: [
            { text: '🏁 JavaScript 入门', link: '/frontEnd/javascript/' },
            { text: '🎯 对象详解', link: '/frontEnd/javascript/object' },
            { text: '🔗 Proxy 代理', link: '/frontEnd/javascript/proxy' },
            { text: '📝 正则表达式', link: '/frontEnd/javascript/RegExp' },
            { text: '🔢 集合类型', link: '/frontEnd/javascript/setAndMap' },
            { text: '⚠️ 错误处理', link: '/frontEnd/javascript/Error' },
            { text: '🌍 国际化', link: '/frontEnd/javascript/Intl' },
            { text: '📊 JSON 处理', link: '/frontEnd/javascript/json' },
            { text: '💾 二进制数据', link: '/frontEnd/javascript/ArrayBuffer' },
            { text: '🔒 原子操作', link: '/frontEnd/javascript/Atomics' }
          ]
        },
        {
          text: '🖥️ 浏览器 API',
          collapsed: false,
          items: [
            { text: '🌐 窗口属性', link: '/frontEnd/window/properties' },
            { text: '🎪 事件机制', link: '/frontEnd/window/events' },
            { text: '🔧 实用函数', link: '/frontEnd/window/function' },
            { text: '👀 观察者模式', link: '/frontEnd/window/observer' },
            { text: '📏 元素尺寸', link: '/frontEnd/window/offsetWidth' },
            { text: '🎨 Canvas 绘图', link: '/frontEnd/window/Canvas' },
            { text: '🔐 加密 API', link: '/frontEnd/window/crypto' },
            { text: '🗄️ IndexedDB', link: '/frontEnd/window/indexedDB' },
            { text: '🧭 导航信息', link: '/frontEnd/window/navigator' },
            { text: '🔧 导航功能', link: '/frontEnd/window/navigatorFun' },
            { text: '💳 支付 API', link: '/frontEnd/window/payment' },
            { text: '📊 性能监控', link: '/frontEnd/window/Performance' },
            { text: '🎤 语音 API', link: '/frontEnd/window/speech' },
            { text: '🌊 流处理', link: '/frontEnd/window/stream' },
            { text: '🔗 Socket 通信', link: '/frontEnd/window/Socket' },
            { text: '🛠️ Service Worker', link: '/frontEnd/window/serviceWorker' },
            { text: '👷 Web Worker', link: '/frontEnd/window/webWorker' },
            { text: '🧩 Web Components', link: '/frontEnd/window/webComponents' },
            { text: '📹 WebRTC', link: '/frontEnd/window/webRTC' },
            { text: '🌐 Web API 1', link: '/frontEnd/window/webapi1' },
            { text: '🌐 Web API 2', link: '/frontEnd/window/webapi2' },
            { text: '🌐 Web API 3', link: '/frontEnd/window/webapi3' },
            { text: '🧭 路由管理', link: '/frontEnd/window/route' }
          ]
        },
        {
          text: '🚀 现代框架',
          collapsed: false,
          items: [
            { text: '💚 Vue.js', link: '/frontEnd/web/vue' },
            { text: '🔷 TypeScript', link: '/frontEnd/web/TypeScript' },
            { text: '⚡ VitePress', link: '/frontEnd/web/VitePress' },
            { text: '🎭 Svelte', link: '/frontEnd/web/svelte' },
            { text: '💎 jQuery', link: '/frontEnd/web/jQuery' },
            { text: '🚀 Nuxt.js', link: '/frontEnd/web/nuxt' },
            { text: '🔧 无代码开发', link: '/frontEnd/web/lessCode' },
            { text: '🏗️ 微前端 qiankun', link: '/frontEnd/web/qiankun' }
          ]
        }
      ],

      // 后端技术侧边栏
      '/afterEnd/': [
        {
          text: '🟢 Node.js',
          collapsed: false,
          items: [
            { text: '📦 模块系统', link: '/afterEnd/node/module' },
            { text: '🌐 HTTP 模块', link: '/afterEnd/node/server' },
            { text: '🔧 实用工具', link: '/afterEnd/node/util' },
            { text: '📂 文件系统', link: '/afterEnd/node/fs' },
            { text: '📍 路径处理', link: '/afterEnd/node/path' },
            { text: '⚙️ 进程管理', link: '/afterEnd/node/process' },
            { text: '🔍 断言库', link: '/afterEnd/node/assert' },
            { text: '💾 缓冲区', link: '/afterEnd/node/buffer' },
            { text: '📡 事件系统', link: '/afterEnd/node/events' },
            { text: '🌊 流处理', link: '/afterEnd/node/stream' },
            { text: '🔗 查询字符串', link: '/afterEnd/node/querystring' },
            { text: '📝 读取行', link: '/afterEnd/node/readline' },
            { text: '🕷️ 网络爬虫', link: '/afterEnd/node/reptile' },
            { text: '🚀 HTTP/2', link: '/afterEnd/node/http2' },
            { text: '🧪 测试工具', link: '/afterEnd/node/test' }
          ]
        },
        {
          text: '🚂 Express 框架',
          collapsed: false,
          items: [
            { text: '🌐 服务器搭建', link: '/afterEnd/express/server' },
            { text: '🥚 Egg.js', link: '/afterEnd/express/egg' },
            { text: '🎯 Koa.js', link: '/afterEnd/express/koa' }
          ]
        },
        {
          text: '🗄️ 数据库',
          collapsed: false,
          items: [
            { text: '🐬 MySQL', link: '/afterEnd/database/mysql' },
            { text: '🍃 MongoDB', link: '/afterEnd/database/mongoose' }
          ]
        },
        {
          text: '🌐 服务器',
          collapsed: false,
          items: [
            { text: '🌊 Nginx', link: '/afterEnd/server/nginx' },
            { text: '⚡ Nitro', link: '/afterEnd/server/nitro' }
          ]
        }
      ],

      // 网络工程侧边栏
      '/network/': [
        {
          text: '📡 HTTP 协议',
          collapsed: false,
          items: [
            { text: '🌐 HTTP 基础', link: '/network/http/' },
            { text: '📊 状态码', link: '/network/http/status' },
            { text: '🎭 MIME 类型', link: '/network/http/mime' },
            { text: '✅ Accept 协商', link: '/network/http/accept' },
            { text: '🔗 连接管理', link: '/network/http/connection' },
            { text: '📄 范围请求', link: '/network/http/range' },
            { text: '🏗️ OSI 模型', link: '/network/http/osi' }
          ]
        },
        {
          text: '🔒 网络安全',
          collapsed: false,
          items: [
            { text: '🔐 HTTPS 协议', link: '/network/httpSecure/https' },
            { text: '🛡️ 内容安全', link: '/network/httpSecure/contentSecurity' },
            { text: '🌍 跨域处理', link: '/network/httpSecure/crossOrigin' },
            { text: '🔑 权限管理', link: '/network/httpSecure/premission' },
            { text: '🛡️ 安全策略', link: '/network/httpSecure/secure' }
          ]
        },
        {
          text: '📨 网络请求',
          collapsed: false,
          items: [
            { text: '📡 Ajax 技术', link: '/network/ajaxAndFetch/ajax' },
            { text: '🚀 Fetch API', link: '/network/ajaxAndFetch/fetch' },
            { text: '📊 Axios 库', link: '/network/ajaxAndFetch/axios' }
          ]
        }
      ],

      // 开发工具侧边栏
      '/tools/': [
        {
          text: '📦 构建工具',
          collapsed: false,
          items: [
            { text: '⚡ Vite', link: '/tools/buildTools/vite' },
            { text: '📦 Webpack', link: '/tools/buildTools/webpack' },
            { text: '🔧 Rollup', link: '/tools/buildTools/rollup' },
            { text: '🏗️ 脚手架', link: '/tools/buildTools/scaffolder' },
            { text: '🌊 Gulp', link: '/tools/buildTools/gulp' },
            { text: '📦 NPM', link: '/tools/buildTools/npm' },
            { text: '🎯 Lerna', link: '/tools/buildTools/lerna' },
            { text: '🐳 Docker', link: '/tools/buildTools/docker' },
            { text: '🚀 Jenkins', link: '/tools/buildTools/Jenkins' },
            { text: '⚙️ GitHub Actions', link: '/tools/buildTools/actions' }
          ]
        },
        {
          text: '📚 常用包',
          collapsed: false,
          items: [
            { text: '🛠️ Lodash', link: '/tools/package/lodash' },
            { text: '📊 ECharts', link: '/tools/package/echarts' },
            { text: '🎭 Anime.js', link: '/tools/package/anime' },
            { text: '📈 AntV', link: '/tools/package/antv' },
            { text: '🎨 Bootstrap', link: '/tools/package/bootstrap' },
            { text: '🌍 Cesium', link: '/tools/package/Cesium' },
            { text: '📊 D3.js', link: '/tools/package/D3' },
            { text: '📅 Day.js', link: '/tools/package/dayjs' },
            { text: '🖼️ DomToImage', link: '/tools/package/DomToImage' },
            { text: '🔍 Fuse.js', link: '/tools/package/fuse' },
            { text: '📱 Hybrid 开发', link: '/tools/package/hybrid' },
            { text: '🎨 Iconfont', link: '/tools/package/iconfont' },
            { text: '🎬 Lottie', link: '/tools/package/Lottie' },
            { text: '🎭 Mock.js', link: '/tools/package/mockjs' },
            { text: '🍍 Pinia', link: '/tools/package/pinia' },
            { text: '📊 Sentry', link: '/tools/package/sentry' },
            { text: '🧩 SodaJS', link: '/tools/package/sodajs' },
            { text: '📚 Storybook', link: '/tools/package/Storybook' },
            { text: '📝 TinyMCE', link: '/tools/package/TinyMCE' },
            { text: '⚡ Velocity.js', link: '/tools/package/Velocity' },
            { text: '🌍 Vue I18n', link: '/tools/package/vueI18n' },
            { text: '🧭 Vue Router', link: '/tools/package/VueRouter' },
            { text: '💾 Vuex Persist', link: '/tools/package/vuexPersist' },
            { text: '🔍 Whistle', link: '/tools/package/whistle' },
            { text: '📋 Tasks 文件', link: '/tools/package/tasksfile' },
            { text: '🎬 动画库', link: '/tools/package/animate' },
            { text: '📋 SignalR', link: '/tools/package/SignalR使用指南' }
          ]
        },
        {
          text: '🧪 测试工具',
          collapsed: false,
          items: [
            { text: '🌲 Cypress', link: '/tools/package/test/Cypress' }
          ]
        },
        {
          text: '📋 开发规范',
          collapsed: false,
          items: [
            { text: '🔄 Git 版本控制', link: '/tools/stardard/git' },
            { text: '✨ Prettier', link: '/tools/stardard/prettier' },
            { text: '🔍 ESLint', link: '/tools/stardard/eslint' },
            { text: '💻 VS Code', link: '/tools/stardard/vscode' },
            { text: '📖 命名规范', link: '/tools/stardard/naming' },
            { text: '📊 质量管控', link: '/tools/stardard/quality' }
          ]
        },
        {
          text: '❓ 问题集合',
          collapsed: false,
          items: [
            { text: '✍️ 手写题汇总', link: '/tools/questions/handwrite' },
            { text: '🧮 算法题解', link: '/tools/questions/algorithm' },
            { text: '🎨 设计模式', link: '/tools/questions/designMode' },
            { text: '🐞 调试技巧', link: '/tools/questions/debugging' },
            { text: '🔄 兼容性处理', link: '/tools/questions/compatibility' },
            { text: '📱 移动端适配', link: '/tools/questions/mobileFit' },
            { text: '🎯 Promise 实现', link: '/tools/questions/promise' },
            { text: '🤖 机器人协议', link: '/tools/questions/robots' },
            { text: '🖨️ 打印功能', link: '/tools/questions/print' },
            { text: '💳 微信支付', link: '/tools/questions/wechatPay' },
            { text: '🏗️ 系统设计', link: '/tools/questions/system' },
            { text: '📊 Grafana', link: '/tools/questions/Grafana' },
            { text: '📦 NPM 发布', link: '/tools/questions/npmPublish' },
            { text: '🔍 NPM 镜像', link: '/tools/questions/npmHub' },
            { text: '📄 LeetCode', link: '/tools/questions/leetCode' },
            { text: '❓ 综合问题', link: '/tools/questions/questions' }
          ]
        },
        {
          text: '📚 学习指南',
          collapsed: false,
          items: [
            { text: '📖 学习方法', link: '/tools/study' }
          ]
        }
      ],

      // 跨端开发侧边栏
      '/spanEnd/': [
        {
          text: '🎯 Taro 框架',
          collapsed: false,
          items: [
            { text: '🏁 Taro 入门', link: '/spanEnd/Taro/' },
            { text: '⚙️ 基础配置', link: '/spanEnd/Taro/basic' },
            { text: '🔧 配置详解', link: '/spanEnd/Taro/config' },
            { text: '📊 API 使用', link: '/spanEnd/Taro/api' },
            { text: '📱 媒体组件', link: '/spanEnd/Taro/media' },
            { text: '📋 表单组件', link: '/spanEnd/Taro/form' },
            { text: '🧭 导航系统', link: '/spanEnd/Taro/navigator' },
            { text: '🌐 开放能力', link: '/spanEnd/Taro/open' },
            { text: '🧭 路由管理', link: '/spanEnd/Taro/router' },
            { text: '📦 容器视图', link: '/spanEnd/Taro/viewContrainer' },
            { text: '💚 Vue 集成', link: '/spanEnd/Taro/vue' },
            { text: '☁️ 云开发', link: '/spanEnd/Taro/cloud' }
          ]
        },
        {
          text: '🦄 uni-app',
          collapsed: false,
          items: [
            { text: '🏁 uni-app 入门', link: '/spanEnd/uniapp/' },
            { text: '📊 API 文档', link: '/spanEnd/uniapp/api' },
            { text: '🧩 组件库', link: '/spanEnd/uniapp/components' }
          ]
        },
        {
          text: '💻 桌面应用',
          collapsed: false,
          items: [
            { text: '⚡ Electron', link: '/spanEnd/electron' }
          ]
        }
      ],

      // 性能优化侧边栏
      '/performace/': [
        {
          text: '⚡ 性能优化',
          collapsed: false,
          items: [
            { text: '📊 性能分析', link: '/performace/performace' },
            { text: '🖼️ 图片优化', link: '/performace/image' },
            { text: '🌐 DNS 预解析', link: '/performace/dnsPrefetch' },
            { text: '📦 资源预加载', link: '/performace/prefetch' },
            { text: '🔍 SEO 优化', link: '/performace/seo' }
          ]
        }
      ]
    },

    // ----- 社交链接 -----
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jinxi1334640772' },
      { 
        icon: { 
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>掘金</title><path d="M12 14.316l7.454-5.88-2.022-1.625L12 11.1l-.004.003-5.432-4.289-2.022 1.625L12 14.316z"/><path d="M12 0l12 9.5-2.518 2L12 4.5 2.518 11.5 0 9.5 12 0z"/></svg>' 
        }, 
        link: 'https://juejin.cn/user/1451011080204040' 
      }
    ],

    // ----- 搜索配置 -----
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
    },

    // ----- 编辑链接 -----
    editLink: {
      pattern: 'https://github.com/jinxi1334640772/jinxi1334640772.github.io/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    // ----- 页脚配置 -----
    footer: {
      message: '基于 <a href="https://vitepress.dev/" target="_blank">VitePress</a> 构建的技术文档站点',
      copyright: 'Copyright © 2024 <a href="https://github.com/jinxi1334640772" target="_blank">张进喜</a>'
    },

    // ----- 大纲配置 -----
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // ----- 返回顶部 -----
    returnToTopLabel: '回到顶部',

    // ----- 深色模式切换 -----
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    // ----- 侧边栏 -----
    sidebarMenuLabel: '菜单',

    // ----- 外部链接图标 -----
    externalLinkIcon: true,

    // ----- 最后更新时间 -----
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // ----- 文档页脚 -----
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  },

  // ===== Markdown 配置 =====
  markdown: {
    // 行号显示
    lineNumbers: true,
    
    // 代码块主题
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },

    // 容器配置
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },

  // ===== 构建配置 =====
  vite: {
    // 静态资源处理
    assetsInclude: ['**/*.awebp'],
    
    // 服务器配置
    server: {
      port: 9000,
      open: true
    },

    // 构建优化
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  },

  // ===== 站点地图 =====
  sitemap: {
    hostname: 'https://jinxi1334640772.github.io'
  }
})
