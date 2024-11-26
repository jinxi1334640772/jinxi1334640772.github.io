## 导航组件
- `FunctionalPageNavigator` 仅在插件中有效，用于跳转到插件功能页
- `NavigatianBar` 页面导航条配置节点，用于指定导航栏的一些属性。只能是 PageMeta 组件内的第一个节点，需要配合它一同使用。 通过这个节点可以获得类似于调用 Taro.setNavigationBarTitle Taro.setNavigationBarColor 等接口调用的效果。

- `Navigator` 页面链接
- `Tabs` 标签栏
- `TabItem` 标签栏子项
```vue
<template>
  <page-meta
    backgroundColor="#434343"
    backgroundTextStyle="light"
    scrollTop="20rpx"
    scroll-duration="3000"
    page-style="background-color:yellow"
    root-fontsize="16"
    rootBackgroundColor="#899976"
    pageFontSize="system"
    pageOrientation="auto"
    @resize="e => console.log(e)">
    <view class="title">
      NavigationBar:页面导航条配置节点，用于指定导航栏的一些属性。只能是PageMeta
      组件内的第一个节点，需要配合它一同使用
    </view>
    <navigation-bar
      title="这是navigation标题"
      :loading="true"
      front-color="#ffffff"
      background-color="#343434"
      :colorAnimatonDuration="1000"
      colorAnimationTimingFunc="easeInOut">
      <text>这是navigationBar content</text>
    </navigation-bar>
    <text>这是 pageMeta 底部</text>
  </page-meta>
  <view class="navigator">
    <view class="item">
      <text class="title">小程序还不完善，当前页面暂时会报错</text>
      <text class="title">FunctionalPageNavigator</text>
      <text class="title">仅在插件中有效，用于跳转到插件功能页</text>
      <functional-page-navigator
        version="develop"
        name="loginAndGetUserInfo"
        :args="{ name: 'zhagjinxi' }"
        @success="e => console.log('success', e)"
        >functional-page-navigator
      </functional-page-navigator>
    </view>
    <view class="item">
      <view class="title">Navigator:跳转页面链接&其他小程序</view>
      <navigator
        target="self"
        openType="navigate"
        appId="navigate"
        url="localhost:8080/path/sub?name=jinxi"
        @success="() => console.log(e)"
        >Navigator
      </navigator>
    </view>
    <view class="item">
      <view class="title">Tabs:标签栏&TabItem:标签栏子项</view>
      <tabs
        tabsBackgroundColor="#fff"
        tabsActiveTextColor="#000"
        tabsInactiveTextColor="#666"
        tabsUnderlineColor="#666"
        activeName="dot"
        :maxTabItemAmount="5"
        urlQueryName="localhost:8080/path/sub?name=jinxi"
        @tabChange="() => console.log(e)">
        <tab-item
          label="slabelelf"
          name="namenavigate"
          badgeType="dot"
          badgeText="localhost:8080/path/sub?name=jinxi"
          @success="() => console.log(e)"></tab-item>
      </tabs>
    </view>
  </view>
</template>

<script>
import { ref } from "vue";
import "./index.scss";

export default {
  setup() {
    const msg = ref("Hello world");
    return {
      msg,
    };
  },
};
</script>
```