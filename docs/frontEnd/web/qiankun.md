## 微前端

微前端是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将 Web 应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。各个前端应用还可以独立运行、独立开发、独立部署。  
微前端优点：

- 技术栈无关 ：主框架不限制接入应用的技术栈，微应用具备完全自主权
- 独立开发、独立部署 ：微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新
- 增量升级 ：在面对各种复杂场景时，很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略
- 独立运行时 ： 每个微应用之间状态隔离，运行时状态不共享

  ![alt text](image-1.png)

微前端的挑战：

- 性能问题： 如果不同的微前端应用使用了不同的库或框架，可能会导致加载和运行的性能问题。
- 一致性： 保持不同的微前端应用在用户体验、设计和行为上的一致性可能会比较困难。
- 状态共享： 在微前端应用之间共享状态可能会比较复杂，需要使用特殊的工具或模式。
- 复杂性： 尽管微前端可以解决大型项目的复杂性问题，但是它自身也带来了一些复杂性，比如需要管理和协调多个独立的应用。
- 安全性： 微前端架构可能会增加跨域等安全问题。

## qiankun 微前端

基于 single-spa 的微前端实现库。孵化自蚂蚁金融科技，能更简单、无痛的构建一个生产可用微前端架构系统。特性有：

- 📦 基于 single-spa 封装，提供了更加开箱即用的 API。
- 📱 技术栈无关，任意技术栈的应用均可 使用/接入，不论是 React/Vue/Angular/JQuery 还是其他等框架。
- 💪 HTML Entry 接入方式，让你接入微应用像使用 iframe 一样简单。
- 🛡​ 样式隔离
  - sandbox:true，启用沙箱。
  - 通过 shadow dom 启用 strictStyleIsolation:true，开启严格的样式隔离模式。
  - 通过 experimentalStyleIsolation：true，给样式添加命名空间。
- 🧳 JS 沙箱，通过 Proxy 对象创建了一个 JavaScript 沙箱，用于隔离子应用的全局变量，防止子应用之间的全局变量污染
- ⚡️ 资源预加载，在浏览器空闲时间预加载未打开的微应用资源，加速微应用打开速度。
- 🔌 umi 插件，提供了 @umijs/plugin-qiankun 供 umi 应用一键切换成微前端架构系统。

## qiankun 应用之间的通信方式

1. localStorage 和 sessionStorage  
   子应用使用不同的域名也是可以的，因为在 qiankun 中，主应用是通过 fetch 来拉取子应用的模板，然后渲染在主应用的 dom 上的，说白了还是运行在主应用上，所以还是运行在同一个域名上，也就是主应用的域名。

2. 路由参数  
   因为只有一个 url，不管子应用还是主应用给 url 上拼接一些参数，那么父子应用都可以通过 route 来获取到。

3. Actions 通信
   qiankun 内部提供了 initGlobalState 方法用于注册 MicroAppStateActions 实例用于通信，该实例有三个方法，分别是：

   - setGlobalState：设置 globalState - 设置新的值时，内部将执行 浅检查，如果检查到 globalState 发生改变则触发通知，通知到所有的 观察者 函数。
   - onGlobalStateChange：注册 观察者 函数 - 响应 globalState 变化，在 globalState 发生改变时触发该 观察者 函数。
   - offGlobalStateChange：取消 观察者 函数 - 该实例不再响应 globalState 变化。

4. 状态管理库(Vuex)维护一个状态池  
   通过 shared 实例暴露一些方法给子应用使用。同时，子应用需要单独维护一份 shared 实例，在独立运行时使用自身的 shared 实例，在嵌入主应用时使用主应用的 shared 实例，这样就可以保证在使用和表现上的一致性
   - 在主应用中维护一个公共状态池，暴露 set、get 方法，在定义子应用的时候通过 props 传递给子应用
   - 子应用接受 prop，并在自己代码库中维护一套相同的空状态池(目的是为了可以独立运行)
   - 子应用调用方法获取修改。

## 为何不用 iframe

iframe 最大的特性就是提供了浏览器原生的硬隔离方案，不论是样式隔离、js 隔离这类问题统统都能被完美解决。但他的最大问题也在于他的隔离性无法被突破，导致应用间上下文无法被共享，随之带来的开发体验、产品体验的问题。

1. url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
2. UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..
3. 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。
4. 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

## JS entry 和 HTML entry 区别

- JS entry：子应用将资源打成一个 entry script。子应用的所有资源打包到一个 js bundle 里，包括 css、图片等资源。除了打出来的包可能体积庞大之外的问题之外，资源的并行加载等特性也无法利用上。
- HTML entry：将子应用打出来 HTML 作为入口，主框架可以通过 fetch html 的方式获取子应用的静态资源，同时将 HTML document 作为子节点塞到主框架的容器中。减少主应用的接入成本，子应用的开发方式及打包方式基本上也不需要调整，而且可以天然的解决子应用之间样式隔离的问题。
  - 加载 HTML 入口文件：html entry 内部是通过 import-html-entry 包实现，它会通过创建一个 标签来加载子应用的 HTML 入口文件。这样可以确保子应用的资源得到正确加载，并在加载完成后进行处理。
  - 解析 HTML 入口文件：一旦 HTML 入口文件加载完成，import-html-entry 将解析该文件的内容，提取出子应用的 JavaScript 和 CSS 资源的 URL。
  - 动态加载 JavaScript 和 CSS 资源：import-html-entry 使用动态创建 `<script>` 和 `<link>` 标签的方式，按照正确的顺序加载子应用的 JavaScript 和 CSS 资源。
  - 创建沙箱环境：在加载子应用的 JavaScript 资源时，import-html-entry 会通过 Proxy 创建一个沙箱环境（sandbox），用于隔离子应用的全局变量和运行环境，防止子应用之间的冲突和污染。
  - 返回子应用的入口模块：最后，import-html-entry 返回一个可以加载子应用的 JavaScript 模块。这个模块通常是一个包含子应用初始化代码的函数，可以在主应用中调用以加载和启动子应用。

## 使用 qiankun

### 主应用适配

1. 安装 qiankun，运行命令：`yarn add qiankun # 或者 npm i qiankun -S`
2. 在主应用中注册微应用

```js
import {
  registerMicroApps,
  start,
  loadMicroApp,
  prefetchApps,
  setDefaultMountApp,
  runAfterFirstMounted,
  addGlobalUncaughtErrorHandler,
  removeGlobalUncaughtErrorHandler,
  initGlobalState,
  MicroAppStateActions
  } from "qiankun";

/** 添加全局的未捕获异常处理器。
 * @handler - (...args: any[]) => void - 必选
 */
addGlobalUncaughtErrorHandler((event) => console.log(event));

/** 移除全局的未捕获异常处理器。
 * @handler - (...args: any[]) => void - 必选
 */
removeGlobalUncaughtErrorHandler(handler);

/** 调用initGlobalState(state)，初始化 state，应用间共享数据
 * return MicroAppStateActions实例，该实例可通过props传给微应用，用于应用间通讯
 */
const actions: MicroAppStateActions = initGlobalState(state);
// 修改state数据
actions.setGlobalState(state);
// 监听state数据变动，拿到新老state数据
actions.onGlobalStateChange((state, oldState) => {
  // state: 变更后的状态; oldState 变更前的状态
  console.log(state, oldState);
});
// 卸载监听器
actions.offGlobalStateChange();

//可选，主应用可以拿到微应用的全局生命周期钩子
const lifeCyle = {
  beforeLoad : Lifecycle | Array<Lifecycle>,
  beforeMount : Lifecycle | Array<Lifecycle>,
  afterMount : Lifecycle | Array<Lifecycle>,
  beforeUnmount : Lifecycle | Array<Lifecycle>,
  afterUnmount : Lifecycle | Array<Lifecycle>
}
registerMicroApps([
  {
    name: "react app", // 必选，微应用的名称，微应用之间必须确保唯一。
    // 必选，微应用的入口。entry: "//localhost:7100"
    entry:string | { scripts?: string[]; styles?: string[]; html?: string },
    // 必选，微应用的容器节点的选择器或者 Element 实例。例如："#yourContainer"
    container: string | HTMLElement,
    //string | (location: Location) => boolean | Array<string | (location: Location) => boolean> - 必选，微应用的激活规则
    activeRule: "/yourActiveRule",
    //可选，loading 状态发生变化时会调用的方法。
    loader:(loading: boolean) => void,
    //object 可选，主应用需要传递给微应用的数据：传递actions给微应用，应用间通信
    props:{actions}
  },
  {
    name: "vue app",
    entry: { scripts: ["//localhost:7100/main.js"] },
    container: "#yourContainer2",
    activeRule: "/yourActiveRule2",
  },
],lifeCyle);

start({
  //可选，是否开启预加载，默认为 true。
  prefetch:boolean | 'all' | string[] | (( apps: RegistrableApp[] ) => { criticalAppNames: string[]; minorAppsName: string[] }),
  //可选，是否开启沙箱，默认为 true。
  sandbox:boolean | { strictStyleIsolation?: boolean, experimentalStyleIsolation?: boolean },
  //可选，是否为单实例场景，单实例指的是同一时间只会渲染一个微应用。默认为 true
  singular:boolean | ((app: RegistrableApp<any>) => Promise<boolean>),
  //可选，自定义的 fetch 方法。
  fetch:Function,
  //可选，参数是微应用的 entry 值。
  getPublicPath:(entry: Entry) => string ,
  // 参数微应用HTML模板
  getTemplate:(tpl: string) => string,
  //可选，指定部分特殊的动态加载的微应用资源（css/js) 不被 qiankun 劫持处理。
  excludeAssetFilter:(assetUrl: string) => boolean
});

/**
 * 如果微应用不是直接跟路由关联的时候，也可以选择手动加载微应用的方式：
 * @return 微应用实例
 */
loadMicroApp({
  name: "app",
  entry: "//localhost:7100",
  container: "#yourContainer",
  props:{name:zhangjinxi,desciption:'传递给微应用的数据'}
},configuration['为start()的参数对象']);


/**手动预加载指定的微应用静态资源。仅手动加载微应用场景需要，
 * 基于路由自动激活场景直接配置 prefetch 属性即可。
 * @apps  预加载的应用列表{name,entry}
 * @importEntryOpts?  加载配置
 */
prefetchApps([
  { name: 'app1', entry: '//localhost:7001' },
  { name: 'app2', entry: '//localhost:7002' },
]);

/**
 * 参数appLink，设置主应用启动后默认进入的微应用。
 */
setDefaultMountApp('/homeApp');

/** 第一个微应用 mount 后需要调用的方法，比如开启一些监控或者埋点脚本
 * @effect - () => void - 必选
 */
runAfterFirstMounted(() => startMonitor());
```

当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。

### 微应用适配

微应用不需要额外安装任何其他依赖即可接入 qiankun 主应用。

1. 导出相应的生命周期钩子  
   微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用。

```js
import "./public-path";
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import routes from "./router";
import store from "./store";

Vue.config.productionTip = false;

let router = null;
let instance = null;

function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    // 在主应用中运行时，需要添加主应用的publicPath
    base: window.__POWERED_BY_QIANKUN__ ? "/app-vue/" : "/",
    mode: "history",
    routes,
  });

  instance = new Vue({
    router,
    store,
    render: h => h(App),
    //为了避免根 id #app 与其他的 DOM 冲突，需要限制查找范围。
  }).$mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时
 * 会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 * 从props拿到actions，可用于应用间通讯
 */
export async function mount(props) {
  console.log("[vue] props from main framework", props);
  render(props);
  props.actions.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
  });

  props.actions.setGlobalState(state);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log("update props", props);
}
```

2. 配置微应用的打包工具  
   除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别微应用暴露出来的一些信息，微应用的打包工具需要增加如下配置：

```js
const packageName = require("./package.json").name;

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    //// 把微应用打包成 umd 库格式
    libraryTarget: "umd",
    chunkLoadingGlobal: `webpackJsonp_${packageName}`, //webpack v5:
    jsonpFunction: `webpackJsonp_${packageName}`, //webpack v4:
  },
};
```

3. 在 src 目录新增 public-path.js 文件：

```js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```
