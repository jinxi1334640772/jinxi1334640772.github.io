## vuex-persist
Vue2版本的项目一般都使用官方的vuex状态管理库，但是vuex在页面刷新后，会进行初始化而丢失数据，vuex-persist是为了解决这个问题而生。

Vuex-Persist 是一个轻量级的Vuex插件，旨在实现 Vuex store 数据的本地存储，通常使用浏览器的 localStorage 或 sessionStorage，从而在页面刷新时能够保留应用的状态。这个项目对于希望在前端应用中保持状态跨页面或刷新的开发者而言是极其有用的工具。

## 使用方式

```js
// 安装依赖包
npm install vuex-persist

// 引入依赖包
import VuexPersistence from 'vuex-persist'

// 使用依赖包
const vuexLocal = new VuexPersistence({
  // 使用localStorage保存vuex的数据，刷新不会丢失
  storage: window.localStorage,
  // 如果不用这个函指定，那么默认所有vuex数数都作持久化处理
  reducer(val) {
      return {
          user: val.user, // 这里只对user模块作数据持久化
          preferences: val.preferences
      }
  }
})

// 添加入vuex的plugins插件中
const store = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  modules: {
      user,
      ...
  }
  plugins: [vuexLocal.plugin]
}
```
在 Vue 生态系统中，Vuex-Persist 可广泛应用于任何依赖 Vuex 状态管理的项目，尤其适合单页应用（SPA）。结合其他如 Vue Router 的路由管理，可以在导航切换间维持用户上下文，提高用户体验。此外，对于构建有多个独立视图但需共享状态的应用，比如管理后台系统，其价值尤为明显，确保各个视图状态一致性和持久化。