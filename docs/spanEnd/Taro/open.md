## 小程序开放能力
- `Ad` Banner 广告
- `AdCustom` Banner 广告
- `AwemeData` 直播间状态组件
- `CommentList` 评论列表
- `CommentDetail` 评论详情
- `ContactButton` 智能客服
- `FollowSwan` 关注小程序
- `InlinePaymentPanel` 内嵌支付组件
- `Lifestyle` 关注生活号
- `Like` 点赞

- `Login` 联合登录 / 手机号授权内嵌组件
- `OfficialAccount` 公众号关注组件。当用户扫小程序码打开小程序时，开发者可在小程序内配置公众号关注组件，方便用户快捷关注公众号，可嵌套在原生组件内。
- `OpenData` 用于展示平台开放的数据
- `WebView` web-view 组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面。个人类型与海外类型的小程序暂不支持使用

```vue
<template>
  <view class="open">
    <view class="item">
      <view class="title">Ad & AdCustom:Banner广告</view>
      <ad
        unit-id="id"
        ad-intervals="60"
        @load="e => console.log(e)"
        @error="e => console.log(e)"
        @close="e => console.log(e)" />
    </view>
    <view class="item">
      <view class="title" @tap="e => (webViewShow = true)"
        >WebView:承载网页的容器，自动铺满整个小程序页面,点击加载微信公众号平台</view
      >
      <web-view
        v-if="webViewShow"
        src="https://mp.weixin.qq.com/"
        @message="e => console.log(e)" />
    </view>
    <view class="item">
      <view class="title">OpenData:用于展示平台开放的数据</view>
      <open-data
        type="userAvatarUrl"
        defaultText="defaultText"
        defaultAvatar="https://avatars2.githubusercontent.com/u/1782542?s=460&u=d20514a52100ed1f82282bcfca6f49052793c889&v=4" />
      <open-data
        type="groupCloudStorage"
        defaultText="defaultText"
        defaultAvatar="https://avatars2.githubusercontent.com/u/1782542?s=460&u=d20514a52100ed1f82282bcfca6f49052793c889&v=4" />
      <open-data
        type="userCity"
        defaultText="defaultText"
        defaultAvatar="https://avatars2.githubusercontent.com/u/1782542?s=460&u=d20514a52100ed1f82282bcfca6f49052793c889&v=4" />
    </view>
  </view>
</template>

<script>
import { ref } from "vue";
import "./index.scss";

export default {
  setup() {
    const msg = ref("Hello world");
    const webViewShow = ref(false);
    return {
      msg,
      webViewShow,
    };
  },
};
</script>
```