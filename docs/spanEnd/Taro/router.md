## 路由配置
Taro 遵循微信小程序的路由规范。只需要修改全局配置的 pages 属性，配置为 Taro 应用中每个页面的路径即可。

H5 路由还支持设置路由模式、设置 basename、路由守卫等能力
```js
//跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
Taro.switchTab({
  url: '/index',
  complete(res){},
  success(res){},
  fail(res){}
})

// 跳转到目的页面，打开新页面
Taro.navigateTo({
  url: '/pages/page/path/name',
})
  
  // 传入参数 id=2&type=test
  Taro.navigateTo({
    url: '/pages/page/path/name?id=2&type=test',
  })

// 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
Taro.redirectTo({
  url: '/pages/page/path/name',
})

//关闭所有页面，打开到应用内的某个页面
Taro.reLaunch({
  url: 'test?id=1'
})

//关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
Taro.navigateTo({
  url: 'B?id=1'
})

// 页面间事件通信通道
EventChannel

<template>
  <view className="index" />
</template>

<script>
  import Taro from '@tarojs/taro'

  export default {
    created() {
      // 建议在页面初始化时把 getCurrentInstance() 的结果保存下来供后面使用，
      // 而不是频繁地调用此 API
      this.$instance = Taro.getCurrentInstance()
    },
    mounted() {
      // 获取路由参数
      console.log(this.$instance.router.params) // 输出 { id: 2, type: 'test' }
    },
  }
</script>
```
## 路由库
前端路由库的基本原理是监听 popstate 或 hashchange 事件触发后，读取 location 对象对视图进行操控更新。 Taro 为了支持前端路由库的使用，在运行时中引入了 histroy location 对象的实现，且尽可能与 Web 端规范对齐，你可以在 window 对象上访问到 history 和 location 对象。

在路由库中，诸如`<Link>` 组件内部会动态生成 `<a>` 标签，因此需要引入 @tarojs/plugin-html 插件以支持在 Taro 中使用 html 标签开发组件。
```js
{
  "plugins": ["@tarojs/plugin-html"]
}
```
使用路由库app.js：
```js
import { createApp } from 'vue'
import { createWebHistory } from 'vue-router'
// 自定义组件
import Home from './components/home.vue'
import Tab1 from './components/tab-1.vue'
import Tab2 from './components/tab-2.vue'
import Tab3 from './components/tab-3.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/tab1', component: Tab1 },
  { path: '/tab2', component: Tab2 },
  { path: '/tab3/:groupId/:id', component: Tab3 },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const App = createApp({
  onShow(options) {},
})

App.use(router)

export default App
```
另一个页面/pages/index/index.vue：
```js
<template>
  <view>
    <view>
      <a></a>
      <view>
        <view class="tab-box">
          <router-link class="tab-item" to="/" replace>Home</router-link>
          <router-link class="tab-item" to="/tab1?name=advancedcat&from=china" replace>Tab 1</router-link>
          <router-link class="tab-item" to="/tab2">Tab 2</router-link>
          <router-link class="tab-item" to="/tab3/1234/8765">Tab 3</router-link>
          <router-link class="tab-item" :to="{ name: 'user', params: { id: '9876' }}">User</router-link>
        </view>
        <router-view></router-view>
      </view>
    </view>
  </view>
</template>

<script setup></script>
```
>在 Web 端可以通过赋值 location.href 实现页面加载，但在小程序中不适用，小程序端的页面跳转仍建议使用 Taro.navigateTo 等官方 api。在小程序侧，应该将 location 上的属性视为只读。