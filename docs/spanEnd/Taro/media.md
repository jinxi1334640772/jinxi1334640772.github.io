## 媒体组件
- `AnimationVideo` 透明视频动画
- `AnimationView` Lottie 动画
- `ArCamera` AR 相机
- `Image` 图片。支持 JPG、PNG、SVG、WEBP、GIF 等格式以及云文件ID。
- `Audio` 音频。1.6.0版本开始，该组件不再维护。建议使用能力更强的 Taro.createInnerAudioContext 接口
- `Video`
- `Camera` 系统相机
- `ChannelLive` 小程序内嵌视频号直播组件，展示视频号直播状态和封面，并无弹窗跳转至视频号。注意：使用该组件打开的视频号视频需要与小程序的主体一致。
- `ChannelVideo` 小程序内嵌视频号视频组件，支持在小程序中播放视频号视频，并无弹窗跳转至视频号。注意：使用该组件打开的视频号视频需要与小程序相同主体或关联主体。
- `LivePlayer` 实时音视频播放。相关api：Taro.createLivePlayerContext 需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。
- `LivePusher` 实时音视频录制。需要用户授权 scope.camera、scope.record 需要先通过类目审核，再在小程序管理后台，「开发」-「接口设置」中自助开通该组件权限。

- `Lottie`
- `RtcRoom` 实时音视频通话房间
- `RtcRoomItem` 实时音视频通话画面
- `VoipRoom` 多人音视频对话。需用户授权 scope.camera、scope.record。相关接口： Taro.joinVoIPChat 开通该组件权限后，开发者可在 joinVoIPChat 成功后，获取房间成员的 openid，传递给 voip-room 组件，以显示成员画面。
- `Map` 地图。相关api Taro.createMapContext。
- `Canvas` 组件的 RN 版本尚未实现。
```vue
<template>
  <view class="media">
    <view class="item">
      <view class="title">Camera:系统相机</view>
      <camera
        :resourceWidth="100"
        :resourceHeight="100"
        :loop="true"
        :autoplay="true"
        mode="normal"
        resolution="medium"
        frameSize="medium"
        devicePosition="back"
        flash="auto"
        outputDimension="720P"
        @ready="e => console.log(e)"
        >系统相机</camera
      >
    </view>
    <view class="item">
      <view class="title">ChannelLive:小程序内嵌视频号直播组件</view>
      <channel-live feedId="feedId" finderUserName="视频号 id"
        >ChannelLive</channel-live
      >
    </view>
    <view class="item">
      <view class="title">ChannelVideo:小程序内嵌视频号视频组件</view>
      <channel-live
        feedId="feedId"
        finderUserName="视频号 id"
        objectFit="fill"
        :loop="true"
        :muted="true"
        :autoplay="true"
        >ChannelVideo</channel-live
      >
    </view>
    <view class="item">
      <view class="title">Image:支持 JPG、PNG、SVG、WEBP、GIF 等格式</view>
      <image
        src="@/assets/img/1.jpg"
        originalSrc="@/assets/img/1.jpg"
        mode="scaleToFill"
        :lazyLoad="true"
        :showMenuByLongpress="true"
        :fadeIn="true"
        preview="scaleToFill"></image>
    </view>
    <view class="item">
      <view class="title">Video视频。相关api：Taro.createVideoContext</view>
      <video
        id="video"
        src="https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
        poster="https://img1.baidu.com/it/u=4049022245,514596079&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1702054800&t=f78ab44b6c79d50010356b808487b695"
        initial-time="0"
        :controls="true"
        :autoplay="false"
        :loop="false"
        :muted="false" />
    </view>
    <view class="item">
      <view class="title">map:地图Taro.createMapContext</view>
      <map
        id="map"
        style="width: 100%; height: 300px"
        longitude="113.324520"
        latitude="23.099994"
        scale="14"
        :markers="markers"
        :polyline="polyline"
        :show-location="true"
        @regionchange="e => console.log('regionchange', e)"
        @markertap="e => console.log('markertap:', e.detail.markerId)" />
    </view>
    <view class="item">
      <view class="title">Canvas:画布</view>
      <!-- 如果是支付宝小程序，则要加上 id 属性，值和canvasId一致 -->
      <canvas
        style="width: 300px; height: 200px"
        :disableScroll="false"
        id="canvas-id"
        type="2d"
        canvas-id="canvas" />
    </view>
    <view class="item">
      <view class="title">LivePlayer:实时音视频播放</view>
      <live-player src="url" mode="live" :autoplay="true" />
    </view>
    <view class="item">
      <view class="title">LivePusher:实时音视频录制</view>
      <live-pusher url="url" mode="RTC" :autopush="true" />
    </view>
    <view class="item">
      <view class="title">VoipRoom:多人音视频对话</view>
      <voip-room
        openId="openId"
        devicePosition="back"
        objectFit="fill"
        mode="video">
      </voip-room>
    </view>
  </view>
</template>

<script>
import { reactive } from "vue";
import "./index.scss";

export default {
  setup() {
    const markers = reactive([
      {
        iconPath:
          "https://avatars2.githubusercontent.com/u/1782542?s=460&u=d20514a52100ed1f82282bcfca6f49052793c889&v=4",
        id: 0,
        latitude: 23.099994,
        longitude: 113.32452,
        width: 50,
        height: 50,
      },
    ]);
    const polyline = reactive([
      {
        points: [
          {
            longitude: 113.3245211,
            latitude: 23.10229,
          },
          {
            longitude: 113.32452,
            latitude: 23.21229,
          },
        ],
        color: "#FF0000DD",
        width: 2,
        dottedLine: true,
      },
    ]);
    return {
      markers,
      polyline,
    };
  },
};
</script>
```
![alt text](56b1bd9dcf2d498c8bff69c5236900d.jpg)

![alt text](89f8eba3c6f0029ed8b59cc001aa5d4.jpg)