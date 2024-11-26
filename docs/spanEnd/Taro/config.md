## 模式和环境变量
模式 在 Taro cli 中，是用于给环境变量分组并加载其分组下的环境变量，它是一组环境变量的 name。 它参考了 vue-cli 中的模式和环境变量加载方式 
>只有以 TARO_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中。这是为了避免和系统内置环境变量冲突。
```bash
.env.development     # 在 development 模式时被载入
.env.production      # 在 production 模式时被载入

#自定义环境变量文件
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略

# 需要指定--mode模式，来指定使用哪个环境变量文件
taro build --type weapp --mode uat

#环境文件只包含环境变量的“键=值”对：
TARO_APP_API="https://api.tarojs.com"
```
被载入的环境变量我们可以在所有 taro 插件、 config/index.ts配置文件 以及 src 目录下面的项目文件中使用, 例如：
```js
// src/service/request.ts
const request = axios.create({
  baseURL: process.env.TARO_APP_API
};
export default request
```
Taro 在编译时提供了一些内置的环境变量来帮助用户做一些特殊处理。
process.env.`TARO_ENV`:取值：`weapp / swan / alipay / tt / qq / jd / h5 / rn`
## 编译配置
开发者可以导入 defineConfig 函数包裹配置对象， 以获得 类型提示 和 自动补全.
```js
// config/index.ts
import { defineConfig } from '@tarojs/cli'

// export default defineConfig<T>({
//   // ...Taro 配置
// })
const config = {
  // 项目名称
  projectName: 'Awesome Next',
  // 项目创建日期
  date: '2020-6-2',
  // 设计稿尺寸
  designWidth: 750,
  // 设计稿尺寸换算规则
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  // 项目源码目录
  sourceRoot: 'src',
  // 项目产出目录
  outputRoot: `dist/${process.env.TARO_ENV}`
  // Taro 插件配置
  plugins: [
    // 从本地绝对路径引入插件
    '/absulute/path/plugin/filename',
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
      },
    ],
  ],
  // 用于配置一些全局变量供业务代码中进行使用。
  defineConstants: {
    A: '"a"', // JSON.stringify('a')
  },
  // 用于把文件从源码目录直接拷贝到编译后的生产目录。
  copy: {
    patterns: [
      { from: 'src/asset/tt/', to: 'dist/asset/tt/', ignore: ['*.js'] }, // 指定需要 copy 的目录
      { from: 'src/asset/tt/sd.jpg', to: 'dist/asset/tt/sd.jpg' }, // 指定需要 copy 的文件
    ],
    options: {
      ignore: ['*.js', '*.css'], // 全局的 ignore
    },
  },
  // 用于配置目录别名，从而方便书写代码引用路径。
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/package': path.resolve(__dirname, '..', 'package.json'),
    '@/project': path.resolve(__dirname, '..', 'project.config.json'),
  },
   // 用于设置环境变量，如 process.env.NODE_ENV。
  env: {
    NODE_ENV: '"development"', // JSON.stringify('development')
  },
  // 配置 terser 工具以压缩 JS 代码
  terser: {
    enable: true,
    config: {
      // 配置项同 https://github.com/terser/terser#minify-options
    },
  },
   // 配置 csso 工具以压缩 CSS 代码。
  csso: {
    enable: true,
    config: {
      // 配置项同 https://cssnano.co/docs/what-are-optimisations/
    },
  },
   // ...
  sass: {
    resource: ['src/styles/variable.scss', 'src/styles/mixins.scss'],
    projectDirectory: path.resolve(__dirname, '..'),
    data: '$nav-height: 48px;',
  },
    // preset 是一系列 Taro 插件的集合
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
    // 从本地绝对路径引入插件集，同样如果需要传入参数也是如上
    '/absulute/path/preset/filename',
  ],
  // 框架，react，nerv，vue, vue3 等
  framework: 'react',
  //可选值：webpack4、webpack5、vite。
  compiler:'webpack4',
  // 小程序端专用配置
  mini: {
    postcss: {
      autoprefixer: {
        enable: true,
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
      //  px 单位进行转换的规则
      pxtransform: {
        enable: true,
        config: {
          onePxTransform: true,//1px是否需要被转换
          unitPrecision: 5,//rem单位允许的小数位
          propList: ['*'],//允许转换的属性
          selectorBlackList: [],//黑名单的选择器将会被忽略
          replace: true,//直接替换而不是追加一条进行覆盖
          mediaQuery: false,//允许媒体查询里的px单位转换
          minPixelValue: 0,//设置一个可被转化的最小px值
          targetUnit:'rpx',//转换后的单位
        }
      }
    },
    // 自定义 Webpack 配置
    webpackChain(chain, webpack) {},
  },
  // H5 端专用配置
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
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
          baseFontSize:20,//h5字体尺寸大小基准值
          maxRootSize:40,//h5根节点font-size最大值
          minRootSize:20,//h5根节点font-size最小值
        }
      }
    },
    // 自定义 Webpack 配置
    webpackChain(chain, webpack) {},
    devServer: {},
  },
}

export default defineConfig(async (mergin, { command, mode }) => {
    if (mode === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
})
```
## 项目配置
通过 Taro 模板创建的项目都会默认拥有 project.config.json 这一项目配置文件，这个文件 只能用于微信小程序，若要兼容到其他小程序平台，请按如下对应规则来增加相应平台的配置文件，其配置与各自小程序平台要求的一致：

- 微信小程序，project.config.json
- 百度小程序，project.swan.json
- 抖音小程序，project.tt.json
- QQ 小程序，project.qq.json
- 支付宝小程序，mini.alipay.json
- 飞书小程序，project.lark.json
- 京东小程序，暂无发现 jd

## 全局配置
开发者可以使用编译时宏函数 defineAppConfig 包裹配置对象，以获得类型提示和自动补全，如：
```js
export default defineAppConfig({
  //页面路径列表
  pages: ['pages/index/index', 'pages/logs/logs'],
  //全局的默认窗口表现:用于设置小程序的状态栏、导航条、标题、窗口背景色，其配置项如下。
  window: {
    backgroundTextStyle: 'light',
    backgroundColorTop: '#fff',
    backgroundColorBottom: '#fff',
    backgroundColor: 'black',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '导航条title文本',
    navigationBarTextStyle: 'black',
    navigationStyle: 'default',
    enablePullDownRefresh: false,
    onReachBottomDistance:50,
    pageOrientation:'auto',
  },
  //底部 tab 栏的表现
  tabBar:{
    color:'#ff2322',
    selectedColor:'#344232',
    backgroundColor:'#534232',
    borderStyle:'black',
    position:'bottom',
    custom:false,
    list:[{
      pagePath:'src/pages/index',
      text:'首页',
      iconPath:'src/image/icon.jpg',
      selectedIconPath:'src/image/iconSelected.jpg'
    }]
  },
  //分包结构配置
  subPackages:[],
  //以下小程序端特有属性
  networkTimeout:{
    request:60000,
    connectSocket:60000,
    uploadFile:60000,
    downloadFile:60000
  },
  debug:false,
  //小程序接口权限相关设置
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    },
  },
  // 申明需要后台运行的能力 后台音乐播放和定位
  requiredBackgroundModes:['audio', 'location'],
  preloadRule:{},
  entryPagePath: 'pages/index/index',
  workers:'Worker代码放置的目录',
  navigateToMiniProgramAppIdList:[]
})
```
## 页面配置
每一个小程序页面都可以使用 .config.js 文件来对本页面的窗口表现进行配置。页面中配置项在当前页面会覆盖全局配置 app.config.json 的 window 中相同的配置项。
```js
//在页面配置文件中使用
export default definePageConfig({
  navigationBarTitleText: '首页',
  transparentTitle:'none',//导航栏透明设置
  disableScroll:false,//是否禁止滚动
  disableSwipeBack:false,//禁止页面右滑返回
  enableShareAppMessage:false,//是否启用分享给好友
  enableShareTimeline:false,//是否启用分享朋友圈
  usingComponents:{},//页面自定义组件配置
  renderer:'webview',//渲染后端
})

//还可以在页面 JS 文件中使用
<template>
  <view className="index" />
</template>

<script>
  definePageConfig({
    navigationBarTitleText: '首页',
  })

  export default {}
</script>
```
## Babel配置
Taro 项目的 Babel 配置位于根目录的 babel.config.js 文件中，里面默认添加了一个 preset：babel-preset-taro，它会根据项目的技术栈添加一些常用的 presets 和 plugins。
```js
module.exports = {
  presets: [
    [
      'taro',
      {
        /** 配置项 */
      },
    ],
  ],
}
```