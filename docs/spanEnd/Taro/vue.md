## 结合Vue
Taro 3 支持将 Web 框架直接运行在各平台，开发者使用的是真实的 Vue/Vue3 和 React 等框架。

但是 Taro 在组件、API、路由等规范上，遵循微信小程序规范，所以在 Taro 中使用 Vue/Vue3 和开发者熟悉的 Web 端有一些差异

Taro 中可以使用小程序规范的内置组件进行开发，如 `<view>、<text>、<button>` 等。事件和 Web 端一样。在事件回调函数中，第一个参数是事件对象，回调中调用 stopPropagation 可以阻止冒泡。Taro 规范:

- 组件名遵从小程序规范（全小写，kebab-case）。
- 组件属性遵从小程序规范（全小写，kebab-case）。
- Boolean 值的组件属性需要显式绑定为 true，不支持简写。

- 使用 @ 修饰符（或 v-on:，更多用法可以参考Vue 文档）替代小程序事件名中的 bind(替代支付宝小程序事件名中的 on)。
- Vue 中点击事件使用 @tap。
- 事件名称一般遵循组件属性规范（全部小写）。
- 在 vue@3.0.6 或之后版本使用 JSX 时，事件名遵循 onCamelcase 规范，例如 onGetphonenumber。
```js
<template>
  <swiper
    class="box"
    :autoplay="true"
    :interval="interval"
    indicator-color="#999"
    @tap="handleTap"
    @animationfinish="handleAnimationFinish"
  >
    <swiper-item>
      <view class="text">1</view>
    </swiper-item>
    <swiper-item>
      <view class="text">2</view>
    </swiper-item>
    <swiper-item>
      <view class="text">3</view>
    </swiper-item>
  </swiper>


  <!-- 注意，Vue 中点击事件需要绑定 @tap，-->
  <!-- 其余小程序事件名把 bind 换成 @ 即是 Taro 事件名（支付宝小程序除外，它的事件就是以 on 开头，需要把 on 换成 @）-->
  <scroll-view
    style="height: 300px"
    :scroll-y="true"
    @tap="handleClick"
    @scroll="handleScroll"
    @scrolltoupper="handleScrollToUpper"
  >
    <view style="height: 200px">1</view>
    <view style="height: 200px">2</view>
    <view style="height: 200px">3</view>
  </scroll-view>
</template>

<script>
  export default {
    data() {
      return {
        interval: 1000,
      }
    },
    methods: {
      handleTap() {
        console.log('tap')
      },
      handleAnimationFinish() {
        console.log('finish')
      },
        handleClick(e) {
        console.log('handleClick')
        e.stopPropagation() // 阻止冒泡
      },
      handleScroll() {
        console.log('handleScroll')
      },
      handleScrollToUpper() {
        console.log('handleScrollToUpper')
      },
    },

    // 生命周期
    beforeMount(){
      //onLoad 之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发。
    },
    mounted(){
      //页面组件渲染到 Taro 的虚拟 DOM 之后触发此时能访问到 Taro 的虚拟 DOM（使用 Vue ref、document.getElementById 等手段），并支持对其进行操作（设置 DOM 的 style 等）.但此时不代表 Taro 的虚拟 DOM 数据已经完成从逻辑层 setData 到视图层。因此这时无法通过 createSelectorQuery 等方法获取小程序渲染层 DOM 节点。 只能在 onReady 生命周期中获取。
    },
    beforeMount(){
      //onLoad 之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发。
    },
    beforeMount(){
      //onLoad 之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发。
    },
    beforeMount(){
      //onLoad 之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发。
    },
  }
</script>
```
## 入口组件
每一个 Taro 应用都需要一个入口组件（Vue 组件）用来注册应用。入口文件默认是 src 目录下的 app.js。

在入口组件中我们可以设置全局状态或访问小程序入口实例的生命周期。
```js
import { createApp } from 'vue'

const app = createApp({
  // 可以使用所有的 Vue 生命周期方法
  mounted () {},

  /** 对应 onLaunch:在此生命周期中通过访问 options 参数或调用 getCurrentInstance().router，可以访问到程序初始化参数。
   * @options 
   * path 启动小程序的路径
   * scene 启动小程序的场景值
   * query 启动小程序的 query 参数
   * shareTicket
   * referrerInfo 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {}
   *  appid 来源小程序，或者公众号（微信中）
   *  extraData 来源小程序传过来的数据，微信和百度小程序在 scene=1037 或 1038 时支持
   *  sourceServiceId 来源插件，当处于插件运行模式时可见
   */
  onLaunch (options) {},

  // 对应 onShow
  onShow (options) {},

  // 对应 onHide
  onHide () {},

  // 小程序发生脚本错误或 API 调用报错时触发。
  onError (error) {},

  /** 程序要打开的页面不存在时触发。
   * path
   * query
   * isEntryPage
   */
  onPageNotFound (Object) {},

  /**小程序有未处理的 Promise 拒绝时触发。
   * reason 拒绝原因，一般是一个 Error 对象
   * promise 被拒绝的 Promise 对象
   */
  onUnhandledRejection (Object){},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
export app
```
## 页面组件
每一个 Taro 应用都至少包括一个页面组件，页面组件可以通过 Taro 路由进行跳转，也可以访问小程序页面的生命周期。

每一个页面组件必须是一个 .vue 文件。
```js
<template>
  <view class="index">
    <text>{{ msg }}</text>
     <view id="only" />
  </view>
</template>

<script>
import { ref } from 'vue'
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro'
export default {
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  },
  // 可以使用所有的 Vue 生命周期方法
  mounted () {},

  // onLoad
  onLoad () {},

  /** onReady
  页面首次渲染完毕时执行。从此生命周期开始可以使用 createCanvasContext 或 createSelectorQuery 等 API 访问小程序渲染层的 DOM 节点。 */
  onReady () {
    eventCenter.once(getCurrentInstance().router.onReady, () => {
        console.log('onReady')

        // onReady 触发后才能获取小程序渲染层的节点
        Taro.createSelectorQuery()
          .select('#only')
          .boundingClientRect()
          .exec((res) => console.log('res: ', res))
      })

      // 异步组件时
       Taro.nextTick(() => {
        // 使用 Taro.nextTick 模拟 setData 已结束，节点已完成渲染
        Taro.createSelectorQuery()
          .select('#only')
          .boundingClientRect()
          .exec((res) => console.log('res: ', res))
      })
  },

  // 对应 onShow
  onShow () {},

  // 对应 onHide
  onHide () {},

  // 对应 onPullDownRefresh
  onPullDownRefresh () {},

  // 监听用户上拉触底事件。
  onReachBottom () {},


  // 监听用户滑动页面事件。也需要 enablePullDownRefresh 配置
  onPageScroll ({strollTop:100}) {},

  // 监听用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容。
  onAddToFavorites ({webviewUrl:'webview的url'}) {
    return {
      title:'自定义标题',
      imageUrl:'src/image/dd.jpg',
      query:'自定义查询字段'
    }
  },
  // 监听用户点击页面内转发按钮（Button 组件 openType='share'）或右上角菜单“转发”按钮的行为，并自定义转发内容。
  onShareAppMessage ({webviewUrl:'webview的url',form,target}) {
    return {
      title:'自定义标题',
      imageUrl:'src/image/dd.jpg',
      query:'自定义查询字段'
    }
  },
  // 监听右上角菜单“分享到朋友圈”按钮的行为，并自定义分享内容。
  onShareTimeline () {
    return {
      title:'自定义标题',
      imageUrl:'src/image/dd.jpg',
      query:'自定义查询字段'
    }
  },
  //小程序屏幕旋转时触发
  onResize(){},
  //点击 tab 时触发。
  onTabItemTap(){{index,pagePath,text}},
  //每当小程序可能被销毁之前会被调用，可以进行退出状态的保存。
  onSaveExitState(){},
  //点击标题触发 只有支付宝小程序支持
  onTitleClick(){},
  //点击导航栏额外图标触发 只有支付宝小程序支持
  onOptionMenuClick(){},
  //只有支付宝小程序支持
  onPopMenuClick(){},
  //下拉截断时触发
  onPullIntercept(){},
}
</script>
```
