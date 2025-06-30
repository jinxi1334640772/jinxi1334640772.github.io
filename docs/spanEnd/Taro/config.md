---
title: ⚙️ Taro 配置完全指南
description: 深入掌握 Taro 项目配置，包括模式环境变量、编译配置、插件系统和平台适配
outline: deep
---

# ⚙️ Taro 配置完全指南

> 全面掌握 Taro 项目配置的方方面面，从环境变量到编译配置，从插件系统到平台适配，让你的项目配置更加专业和高效。

::: tip 📚 本章内容
详细介绍 Taro 配置系统的完整功能，包括环境管理、编译优化、插件扩展和最佳实践。
:::

## 🌍 模式和环境变量

### 🎯 模式概念

**模式（Mode）**在 Taro CLI 中，是用于给环境变量分组并加载其分组下的环境变量，它是一组环境变量的 name。参考了 vue-cli 中的模式和环境变量加载方式。

| 模式 | 说明 | 使用场景 |
|------|------|----------|
| **development** | 开发模式 | 🔧 本地开发调试 |
| **production** | 生产模式 | 🚀 正式环境部署 |
| **test** | 测试模式 | 🧪 自动化测试 |
| **uat** | 用户验收测试 | 👥 预发布环境 |

::: warning ⚠️ 环境变量规范
只有以 `TARO_APP_` 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中。这是为了避免和系统内置环境变量冲突。
:::

### 📁 环境变量文件

```bash
.env.development     # 在 development 模式时被载入
.env.production      # 在 production 模式时被载入

# 自定义环境变量文件
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```

### 🔧 使用环境变量

```bash
# 需要指定 --mode 模式，来指定使用哪个环境变量文件
taro build --type weapp --mode uat

# 环境文件只包含环境变量的"键=值"对：
TARO_APP_API="https://api.tarojs.com"
TARO_APP_VERSION="1.0.0"
TARO_APP_DEBUG="true"
```

### 💻 在代码中使用

被载入的环境变量可以在所有 Taro 插件、`config/index.ts` 配置文件以及 `src` 目录下面的项目文件中使用：

```typescript
// src/service/request.ts
const request = axios.create({
  baseURL: process.env.TARO_APP_API,
  timeout: Number(process.env.TARO_APP_TIMEOUT) || 5000
})

// 调试模式判断
if (process.env.TARO_APP_DEBUG === 'true') {
  console.log('Debug mode enabled')
}

export default request
```

### 📊 内置环境变量

Taro 在编译时提供了一些内置的环境变量：

| 变量 | 取值 | 说明 |
|------|------|------|
| **process.env.TARO_ENV** | `weapp / swan / alipay / tt / qq / jd / h5 / rn` | 🎯 当前编译平台 |
| **process.env.NODE_ENV** | `development / production` | 🔧 Node.js 环境 |

```javascript
// 平台适配示例
if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序特有逻辑
  console.log('Running on WeChat Mini Program')
} else if (process.env.TARO_ENV === 'h5') {
  // H5 特有逻辑
  console.log('Running on H5')
}
```

## ⚙️ 编译配置

### 🎯 配置文件结构

开发者可以导入 `defineConfig` 函数包裹配置对象，以获得类型提示和自动补全：

```typescript
// config/index.ts
import { defineConfig } from '@tarojs/cli'
import path from 'path'

const config = defineConfig({
  // 🏷️ 项目基本信息
  projectName: 'Awesome Next',
  date: '2020-6-2',
  
  // 📐 设计稿配置
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  
  // 📁 目录配置
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  
  // 🔧 插件配置
  plugins: [
    // 从本地绝对路径引入插件
    '/absolute/path/plugin/filename',
    // 引入 npm 安装的插件
    '@tarojs/plugin-mock',
    ['@tarojs/plugin-mock'],
    ['@tarojs/plugin-mock', {
      mocks: {
        '/api/user/1': {
          name: 'judy',
          desc: 'Mental guy',
        },
      },
    }],
  ],
  
  // 🌍 全局变量配置
  defineConstants: {
    A: '"a"', // JSON.stringify('a')
    VERSION: JSON.stringify(require('../package.json').version)
  },
  
  // 📋 文件拷贝配置
  copy: {
    patterns: [
      { from: 'src/asset/tt/', to: 'dist/asset/tt/', ignore: ['*.js'] },
      { from: 'src/asset/tt/sd.jpg', to: 'dist/asset/tt/sd.jpg' },
    ],
    options: {
      ignore: ['*.js', '*.css'], // 全局的 ignore
    },
  },
  
  // 🔗 目录别名配置
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/package': path.resolve(__dirname, '..', 'package.json'),
    '@/project': path.resolve(__dirname, '..', 'project.config.json'),
  },
  
  // 🌍 环境变量配置
  env: {
    NODE_ENV: '"development"', // JSON.stringify('development')
  },
  
  // 🗜️ JS 压缩配置
  terser: {
    enable: true,
    config: {
      // 配置项同 https://github.com/terser/terser#minify-options
      compress: {
        drop_console: true, // 生产环境删除 console
        drop_debugger: true, // 删除 debugger
      },
      mangle: {
        safari10: true, // Safari 10 兼容
      },
    },
  },
  
  // 🎨 CSS 压缩配置
  csso: {
    enable: true,
    config: {
      // 配置项同 https://cssnano.co/docs/what-are-optimisations/
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true, // 移除所有注释
          },
        },
      ],
    },
  },
  
  // 🎨 Sass 配置
  sass: {
    resource: ['src/styles/variable.scss', 'src/styles/mixins.scss'],
    projectDirectory: path.resolve(__dirname, '..'),
    data: '$nav-height: 48px;',
  },
  
  // 📦 预设配置
  presets: [
    // 引入 npm 安装的插件集
    '@tarojs/preset-sth',
    // 引入 npm 安装的插件集，并传入插件参数
    [
      '@tarojs/plugin-sth',
      {
        arg0: 'xxx',
      },
    ],
    // 从本地绝对路径引入插件集
    '/absolute/path/preset/filename',
  ],
  
  // 🎯 框架选择
  framework: 'react', // react, nerv, vue, vue3
  
  // ⚡ 编译器选择
  compiler: 'webpack5', // webpack4, webpack5, vite
  
  // ... 平台特定配置
})

export default config
```

### 📊 基础配置项说明

| 配置项 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| **projectName** | String | 项目名称 | - |
| **date** | String | 项目创建日期 | - |
| **designWidth** | Number | 设计稿宽度 | 750 |
| **sourceRoot** | String | 源码目录 | 'src' |
| **outputRoot** | String | 输出目录 | 'dist' |
| **framework** | String | 开发框架 | 'react' |
| **compiler** | String | 编译器 | 'webpack5' |

## 📱 小程序端配置

### 🎯 Mini 配置详解

```typescript
const config = defineConfig({
  // ... 其他配置
  
  mini: {
    // 🎨 PostCSS 配置
    postcss: {
      // 自动前缀
      autoprefixer: {
        enable: true,
        config: {
          browsers: ['last 2 versions', 'Android >= 4.0', 'iOS >= 8']
        }
      },
      
      // CSS 模块化
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
      
      // px 转换配置
      pxtransform: {
        enable: true,
        config: {
          onePxTransform: true, // 1px 是否需要被转换
          unitPrecision: 5, // rem 单位允许的小数位
          propList: ['*'], // 允许转换的属性
          selectorBlackList: [], // 黑名单的选择器将会被忽略
          replace: true, // 直接替换而不是追加一条进行覆盖
          mediaQuery: false, // 允许媒体查询里的px单位转换
          minPixelValue: 0, // 设置一个可被转化的最小px值
          targetUnit: 'rpx', // 转换后的单位
        }
      }
    },
    
    // 🔧 自定义 Webpack 配置
    webpackChain(chain, webpack) {
      // 添加新的 loader
      chain.module
        .rule('myloader')
        .test(/\.myext$/)
        .use('myloader')
        .loader('my-loader')
        .options({
          // loader 选项
        })
      
      // 添加插件
      chain.plugin('MyPlugin').use(MyPlugin, [
        {
          // 插件选项
        }
      ])
    },
    
    // 📦 分包配置
    subpackages: [
      {
        root: 'packages/moduleA',
        pages: [
          'pages/cat',
          'pages/dog'
        ]
      }
    ],
    
    // 🎯 优化配置
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          }
        }
      }
    }
  }
})
```

### 📊 PX 转换配置详解

| 配置项 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| **onePxTransform** | Boolean | 1px 是否转换 | true |
| **unitPrecision** | Number | 转换精度 | 5 |
| **propList** | Array | 允许转换的属性 | ['*'] |
| **selectorBlackList** | Array | 选择器黑名单 | [] |
| **replace** | Boolean | 是否直接替换 | true |
| **mediaQuery** | Boolean | 媒体查询转换 | false |
| **minPixelValue** | Number | 最小转换值 | 0 |
| **targetUnit** | String | 目标单位 | 'rpx' |

## 🌐 H5 端配置

### 🎯 H5 配置详解

```typescript
const config = defineConfig({
  // ... 其他配置
  
  h5: {
    // 🌍 静态资源配置
    publicPath: '/',
    staticDirectory: 'static',
    
    // 🎨 PostCSS 配置
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ['last 2 versions']
        }
      },
      
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
      
      pxtransform: {
        enable: true,
        config: {
          onePxTransform: true,
          unitPrecision: 5,
          propList: ['*'],
          selectorBlackList: [],
          replace: true,
          mediaQuery: false,
          minPixelValue: 0,
          baseFontSize: 20, // h5 字体尺寸大小基准值
          maxRootSize: 40, // h5 根节点 font-size 最大值
          minRootSize: 20, // h5 根节点 font-size 最小值
        }
      }
    },
    
    // 🔧 自定义 Webpack 配置
    webpackChain(chain, webpack) {
      // H5 特定的 webpack 配置
      chain.resolve.alias
        .set('@tarojs/components$', '@tarojs/components/dist-h5/react')
      
      // 添加环境变量
      chain.plugin('DefinePlugin').tap(args => {
        args[0] = {
          ...args[0],
          'process.env.PLATFORM': JSON.stringify('h5')
        }
        return args
      })
    },
    
    // 🔥 开发服务器配置
    devServer: {
      host: 'localhost',
      port: 10086,
      https: false,
      hot: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    },
    
    // 🎯 路由配置
    router: {
      mode: 'hash', // hash | browser
      basename: '/app'
    },
    
    // 📱 移动端适配
    esnextModules: ['taro-ui'],
    
    // 🔍 SEO 优化
    htmlPluginOption: {
      title: 'Taro H5 App',
      meta: {
        description: 'A Taro H5 application',
        keywords: 'taro,h5,react'
      }
    }
  }
})
```

### 📊 H5 特有配置项

| 配置项 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| **publicPath** | String | 静态资源路径 | '/' |
| **staticDirectory** | String | 静态资源目录 | 'static' |
| **baseFontSize** | Number | 基准字体大小 | 20 |
| **maxRootSize** | Number | 根字体最大值 | 40 |
| **minRootSize** | Number | 根字体最小值 | 20 |

## 🔌 插件系统

### 🎯 插件配置方式

```typescript
const config = defineConfig({
  plugins: [
    // 🔧 基础插件引入
    '@tarojs/plugin-mock',
    
    // 📦 带配置的插件
    ['@tarojs/plugin-mock', {
      mocks: {
        '/api/user': { name: 'John', age: 30 },
        '/api/posts': [
          { id: 1, title: 'Hello Taro' },
          { id: 2, title: 'Taro is awesome' }
        ]
      }
    }],
    
    // 🛠️ 本地插件
    path.resolve(__dirname, '../plugins/my-plugin'),
    
    // ⚙️ 条件加载插件
    ...(process.env.NODE_ENV === 'development' ? [
      '@tarojs/plugin-mock'
    ] : []),
  ],
  
  // 📋 预设插件
  presets: [
    '@tarojs/preset-sth'
  ]
})
```

### 📊 常用插件列表

| 插件名 | 功能 | 使用场景 |
|--------|------|----------|
| **@tarojs/plugin-mock** | Mock 数据 | 🧪 开发测试 |
| **@tarojs/plugin-sass** | Sass 支持 | 🎨 样式预处理 |
| **@tarojs/plugin-less** | Less 支持 | 🎨 样式预处理 |
| **@tarojs/plugin-stylus** | Stylus 支持 | 🎨 样式预处理 |
| **@tarojs/plugin-platform-*** | 平台支持 | 📱 多端适配 |

## 🛠️ 最佳实践

### 📋 配置优化建议

::: tip ✅ 推荐做法
- 使用 TypeScript 编写配置文件，获得类型提示
- 合理使用环境变量，区分不同环境配置
- 使用别名简化模块引用路径
- 根据项目需求选择合适的编译器
- 生产环境启用代码压缩和优化
:::

::: warning ⚠️ 注意事项
- 环境变量必须以 `TARO_APP_` 开头
- 配置修改后需要重启开发服务器
- 不要在配置文件中暴露敏感信息
- 注意不同平台配置的差异性
:::

### 🚀 性能优化配置

```typescript
const config = defineConfig({
  // 🗜️ 生产环境优化
  ...(process.env.NODE_ENV === 'production' && {
    terser: {
      enable: true,
      config: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        }
      }
    },
    
    csso: {
      enable: true,
      config: {
        preset: ['default', {
          discardComments: { removeAll: true }
        }]
      }
    }
  }),
  
  // 📦 代码分割
  mini: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      }
    }
  },
  
  // 🔧 Webpack 优化
  webpackChain(chain) {
    // 生产环境移除 console
    if (process.env.NODE_ENV === 'production') {
      chain.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.drop_console = true
        return args
      })
    }
  }
})
```

### 🔍 调试配置

```typescript
// 开发环境调试配置
const debugConfig = {
  // 🐛 Source Map
  enableSourceMap: true,
  sourceMapType: 'cheap-module-eval-source-map',
  
  // 📊 打包分析
  analyzer: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true
  },
  
  // 🔍 详细日志
  logger: {
    quiet: false,
    stats: true
  }
}

const config = defineConfig({
  // ... 其他配置
  
  ...(process.env.NODE_ENV === 'development' && debugConfig),
})
```

## 📚 总结

通过本章学习，你已经掌握了 Taro 配置系统的完整功能。从环境变量管理到编译优化，从插件系统到平台适配，这些配置技巧将帮助你构建更加专业和高效的 Taro 项目。

记住配置的核心原则：**环境分离**、**按需配置**、**性能优化**、**可维护性**。合理的配置不仅能提高开发效率，还能确保项目的稳定性和可扩展性。