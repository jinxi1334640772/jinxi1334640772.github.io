## 基础内容组件

- `text`
  - `selectable` 是否可选
  - `space` 如何显示连续空格 ensp|emsp|nbsp
  - `decode` 是否解码
- `icon`
  - `type` success|success_no_circle|warn|waiting
    cancel|download|search|clear
  - `size` number px 单位
  - `color` icon 的颜色
- `rich-text` 富文本。可渲染文字样式、图片、超链接。支持部分 HTML 标签
  - `nodes` array|string 类型，节点列表
  - `selectable` 文本是否可选
  - `@itemclick` 拦截点击事件
- `progress` 进度条
  - `duration` 进度增加 1%所需毫秒数
  - `percent` 百分比 0~100
  - `show-info` 在进度条右侧显示百分比
  - `border-radius` 在进度条右侧显示百分比
  - `font-size` 右侧百分比字体大小
  - `stroke-width` 右侧百分比字体大小
  - `activeColor` 已选择的进度条的颜色
  - `backgroundColor` 未选择的进度条的颜色
  - `active` 进度条从左往右的动画
  - `active-mode` backwards: 动画从头播；forwards：动画从上次结束点接着播
  - `@activeend` 动画完成事件
- `native-view` 自定义原生 View 组件

## 视图容器

- `view` 基本视图容器
- `scroll-view` 可滚动视图容器
- `nested-scroll-header` scroll-view 嵌套模式场景中属于外层 scroll-view 的节点，仅支持作为 `<scroll-view type='nested'>` 嵌套模式的直接子节点。不支持复数子节点，渲染时会取其第一个子节点来渲染
- `nested-scroll-body` scroll-view 嵌套模式场景中属于嵌套内层 scroll-view 的父节点，仅支持作为 `<scroll-view type='nested'>` 嵌套模式的直接子节点。不支持复数子节点，渲染时会取其第一个子节点来渲染
- `swiper` 滑块视图容器
- `swiper-item` 滑块视图容器子项
- `match-media` 匹配检查节点
- `movable-area` 可拖放区域
- `moveble-view` 可拖放视图容器
- `cover-view` 覆盖在原生组件之上的文本视图，可覆盖的原生组件包括 map、video、canvas、camera，只支持嵌套 cover-view、cover-image
- `cover-image` 覆盖在原生组件之上的图片视图，可覆盖的原生组件同 cover-view，支持嵌套在 cover-view 里
- `list-view `列表容器
- `list-item` 列表容器子项
- `sticky-header` 吸顶布局容器
- `sticky-section` 吸顶布局容器

组件示例：

```vue
<template>
  <!-- #ifdef APP -->
  <scroll-view style="flex: 1">
    <!-- #endif -->
    <view class="uni-container">
      <view class="uni-header-logo">
        <image
          class="uni-header-image"
          src="/static/componentIndex.png"></image>
      </view>
      <view class="uni-text-box">
        <text class="hello-text"
          >uni-app内置组件，展示样式仅供参考，文档详见：</text
        >
        <u-link
          :href="'https://uniapp.dcloud.io/uni-app-x/component/'"
          :text="'https://uniapp.dcloud.io/uni-app-x/component/'"
          :inWhiteList="true"></u-link>
      </view>
      <uni-collapse>
        <template v-for="item in list" :key="item.id">
          <uni-collapse-item :title="item.name" class="item">
            <view
              v-for="(page, key) in item.pages"
              class="uni-navigate-item"
              :hover-class="page.enable == false ? '' : 'is--active'"
              :key="key"
              @click="goDetailPage(page)">
              <text
                class="uni-navigate-text"
                :class="page.enable == false ? 'text-disabled' : ''"
                >{{ page.name }}</text
              >
              <image :src="arrowRightIcon" class="uni-icon"></image>
            </view>
          </uni-collapse-item>
        </template>
      </uni-collapse>

      <!-- #ifdef UNI-APP-X && APP -->
      <uni-upgrade-center-app ref="upgradePopup" @close="upgradePopupClose" />
      <!-- #endif -->
    </view>
    <!-- #ifdef APP -->
  </scroll-view>
  <!-- #endif -->
</template>

<script lang="uts">
// #ifdef UNI-APP-X && APP
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
// #endif

type Page = {
  name : string
  enable ?: boolean
  url ?: string
}
type ListItem = {
  id : string
  name : string
  pages : Page[]
  url ?: string
  enable ?: boolean
}
export default {
  data() {
    return {
      list: [
        {
          id: 'view',
          name: '视图容器',
          pages: [
            {name: 'view',},
            {name: 'scroll-view'},
            {name: 'swiper'},
            {name: 'movable-view',enable: false},
            {name: 'cover-view',enable: false},
            {name: 'list-view'},
            {name: 'sticky-header'},
            {name: 'sticky-section'}
          ] as Page[],
        },
        {
          id: 'content',
          name: '基础内容',
          pages: [
            {name: 'text'},
            {name: 'rich-text'enable: true},
            {name: 'progress'},
          ] as Page[],
        },
        {
          id: 'form',
          name: '表单组件',
          pages: [
            {name: 'button'},
            {name: 'checkbox'},
            {name: 'form'},
            {name: 'input'},
            {name: 'label'enable: false},
            {name: 'picker',enable: false },
            {name: 'picker-view'},
            {name: 'radio'},
            {name: 'slider'},
            {name: 'slider-100'},
            {name: 'switch'},
            {name: 'textarea'},
            {name: 'editor',enable: false},
          ] as Page[],
        },
        {
          id: 'nav',
          name: '导航',
          pages: [{name: 'navigator',enable: true}] as Page[],
        },
        {
          id: 'media',
          name: '媒体组件',
          pages: [
            {name: 'image',enable: true},
            {name: 'video',enable: true},
            {name: 'animation-view',enable: false,},
          ] as Page[],
        },
        {
          id: 'map',
          name: '地图',
          pages: [{name: 'map',enable: false}] as Page[]
        },
        {
          id: 'canvas',
          name: '画布',
          pages: [{name: 'canvas'}] as Page[]
        },
        {
          id: 'web-view',
          name: '网页',
          pages: [
            {
              name: '网络网页',
              enable: true,
              url: '/pages/component/web-view/web-view',
            },
            {
              name: '本地网页',
              enable: true,
              url: '/pages/component/web-view-local/web-view-local',
            },
          ] as Page[],
        },
        {
          id: 'unicloud-db',
          name: 'unicloud-db',
          pages: [
            {
              name: '联系人',
              enable: true,
              url: '/pages/component/unicloud-db-contacts/list'
            }
          ] as Page[],
        },
        {
          id: 'ad',
          url: 'ad',
          name: 'AD组件',
          enable: false,
          pages: [] as Page[]
        },
        {
         id: 'general-attr-event',
         name: '通用属性和事件',
         pages: [
           {
             name: '通用属性',
             url: '/pages/component/general-attribute/general-attribute',
             enable: true,
           },
           {
             name: '通用事件',
             url: '/pages/component/general-event/general-event',
             enable: true,
           },{
             name: 'Transition事件',
             url: '/pages/component/general-event/transition-event',
             enable: true,
           },
         ] as Page[],
       }
      ] as ListItem[],
      arrowUpIcon: '/static/icons/arrow-up.png',
      arrowDownIcon: '/static/icons/arrow-down.png',
      arrowRightIcon: '/static/icons/arrow-right.png',
    }
  },
  methods: {
    goDetailPage(e : Page) {
      if (e.enable == false) {
        uni.showToast({title: '显示提示信息，暂不支持',icon: 'none'})
        return
      }
      const url =
        e.url != null ? e.url! : `/pages/component/${e.name}/${e.name}`
      // 导航到url
      uni.navigateTo({url})
    },
    // #ifdef UNI-APP-X && APP
    upgradePopupClose() {
      console.log('upgradePopup close');
    }
    // #endif
  },
  onReady() {
    // #ifdef UNI-APP-X && APP
  	checkUpdate(this.$refs['upgradePopup'] as UniUpgradeCenterAppComponentPublicInstance)
    // #endif
  },
  beforeUnmount() {
    uni.showTabBar()?.catch(_ => {})
  }
}
</script>

<style>
@import "../../common/uni-uvue.css";

.item {
  margin-bottom: 12px;
}
</style>
```

## 表单组件

- `form`
- `button`
- `checkbox`
- `checkbox-group`
- `input`
- `textarea` 多行文本输入框
- `label`
- `editor` 富文本编辑器
- `picker` 底部弹出滚动选择器
- `picker-view` 嵌入页面的滚动选择器
- `picker-view-column` 滚动选择器子项
- `radio`
- `radio-group`
- `slider` 滑块选择器
- `switch` 开关选择器

## 导航组件

- `navigator`
  - `target` 在哪个目标上发生跳转，默认当前应用
  - `url`
  - `open-type` 跳转方式
    - navigator
    - redirect
    - switchTab
    - relaunch
    - navigateBack
  - `delta` 当 open-type 为 navigateBack 时有效，表示回退的层数
  - `app-id` 当 target="miniProgram"时有效，要打开的小程序 appId
  - `path` 当 target="miniProgram"时有效，打开的页面路径，如果为空则打开首页
  - `extra-data` target="miniProgram"时有效，需要传递给目标应用的数据，目标应用可在 App.onLaunch()，App.onShow() 中获取到这份数据
  - `version` target="miniProgram"时有效，要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版）
  - `animation-type` 当 open-type="navigateTo" 或 open-type="navigateBack" 时有效，窗口的显示/关闭的动画类型。
    - auto|none
    - slide-in-right|slide-in-left|slide-in-top|slide-in-bottom
    - fade-in|fade-out
    - zoom-in|zoom-out|zoom-fade-in|zoom-fade-out
    - pop-in|pop-out
    - slide-out-right|slide-out-left|slide-out-top|slide-out-bottom

## 媒体组件

- `image`
  - `src`
  - `mode` 图片裁剪、缩放的模式
    - scaleToFill
    - aspectFit
    - aspectFill
    - widthFill
    - heightFill
    - top
    - bottom
    - center
    - left
    - right
    - ...位置组合
  - `lazy-load` 图片懒加载。只针对 page 与 scroll-view 下的 image 有效。 安卓默认懒加载不支持修改
  - `fade-show` 图片显示动画效果
  - `webp` 是否支持 webP 格式
  - `show-menu-by-longpress` 开启长按图片显示识别小程序码菜单
  - `draggable` 鼠标长按是否能拖动图片(仅 H5 平台)
  - `@error`
  - `@load`
- `video`
  - `src`
  - `loop`
  - `initial-time`
  - `duration`
  - `controls`
  - `autoplay`
  - `direction`
  - ....
- `animation-view` Lottie 动画
  - `path`
  - `loop`
  - `autoplay`
  - `action`
  - `hidden`
  - `@ended`

## 地图

- `map` 地图由三方专业地图厂商提供 SDK。在 App 和 Web 中，使用三方 SDK 需在 manifest 中进行配置
  - `longitude` 经度
  - `latitude` 维度
  - `scale` 缩放级别
  - `min-scale`
  - `max-scale`
  - `layer-style` 个性化地图（如实现地图暗黑模式）
  - `markers` 标记点
  - `covers` 即将移除，请使用 markers
  - `polyline` 路线
  - `polygons` 多边形
  - `circles` 圆
  - `controls` 控件
  - `include-points` 缩放视野以包含所有给定的坐标点
  - ........

## 画布

```vue
<template>
  <canvas id="canvas"></canvas>
</template>

<script setup>
// HBuilderX 4.25+ 异步调用方式, 跨平台写法
uni.createCanvasContextAsync({
  id: 'canvas',
  component: getCurrentInstance().proxy,
  success: (context : CanvasContext) => {
    const canvasContext = context.getContext('2d')!;
    const canvas = canvasContext.canvas;

    // 处理高清屏逻辑
    const dpr = uni.getDeviceInfo().devicePixelRatio ?? 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    // 仅需调用一次，当调用 reset 方法后需要再次 scale
    canvasContext.scale(dpr, dpr);
  }
})

// 同步调用方式，仅支持 app/web
const canvas = uni.getElementById("canvas") as UniCanvasElement
const context = canvas.getContext("2d")!;
</script>
```

## 网页

- `web-view` 承载网页的容器

  - `src`
  - `allow`
  - `sandbox`
  - `fullscreen`
  - `webview-styles`
  - `horizontalScrollBarAccess`
  - `verticalScrollBarAccess`
  - `@message`
  - `@error`
  - `@load`
  - `@loading`
  - `@download`

  ```js
  <web-view id="web-view"
    class="uni-flex-item"
    :style="{ 'pointer-events': pointerEvents }"
    :src="src"
    :webview-styles="webview_styles" :horizontalScrollBarAccess="horizontalScrollBarAccess"
    :verticalScrollBarAccess="verticalScrollBarAccess" @message="message"
    @error="error"
    @loading="loading"
    @load="load"
    @download="download"
    @touchstart="touchstart"
    @tap="tap">
  </web-view>

  // #ifdef APP
  import { canWebViewGoBack, canWebViewGoForward, hasNativeView } from '@/uni_modules/uts-get-native-view';
  // #endif
  export default {
    data() {
      return {
        src: 'https://www.dcloud.io',
        webview_styles: {
          progress: {color: '#FF3333'}
        },
        webviewContext: null as WebviewContext | null,
        webviewElement: null as UniWebViewElement | null,
        loadError: false,
        horizontalScrollBarAccess: true,
        verticalScrollBarAccess: true,
        canGoBack: false,
        canGoForward: false,
        // 自动化测试
        autoTest: false,
        eventLoading: null as UTSJSONObject | null,
        eventLoad: null as UTSJSONObject | null,
        eventError: null as UTSJSONObject | null,
        pointerEvents: 'auto',
        isTouchEnable: false
      }
    },
    onReady() {
      // #ifdef APP
      // 通过createWebviewContext获取网页上下文
      this.webviewContext = uni.createWebviewContext('web-view', this)
      //推荐使用 getElementById，功能更丰富
      this.webviewElement = uni.getElementById('web-view') as UniWebViewElement

      this.webviewElement?.setAttribute("src","//dcloud.net.cn/")
      // #endif
    },
    methods: {
      getPackageName() : string {
        let packageName : string = ""
        // #ifdef APP-IOS
        const res = uni.getAppBaseInfo();
        packageName = res.bundleId
        // #endif
        return packageName
      },
      isProd() : boolean {
        if (this.getPackageName() == 'io.dcloud.hellouniappx') return true
        return false
      },
      back() {
        this.webviewContext?.back();
      },
      forward() {
        this.webviewContext?.forward();
      },
      reload() {
        this.webviewContext?.reload();
      },
      stop() {
        this.webviewContext?.stop();
      },
      nativeToWeb() {
        this.webviewContext?.evalJS("alert('hello uni-app x')");
      },
      message(event : UniWebViewMessageEvent) {
        console.log(JSON.stringify(event.detail));
      },
      error(event : UniWebViewErrorEvent) {
        this.loadError = true
        if (this.autoTest) {
          this.eventError = {
            "tagName": event.target?.tagName,
            "type": event.type,
            "errCode": event.detail.errCode,
            "errMsg": event.detail.errMsg,
            "url": event.detail.url,
            "fullUrl": event.detail.fullUrl,
            "src": event.detail.src
          };
        }
      },
      loading(event : UniWebViewLoadingEvent) {
        if (this.autoTest) {
          this.eventLoading = {
            "tagName": event.target?.tagName,
            "type": event.type,
            "src": event.detail.src
          };
        }
      },
      load(event : UniWebViewLoadEvent) {
        // #ifdef APP
        this.canGoBack = canWebViewGoBack('web-view');
        this.canGoForward = canWebViewGoForward('web-view');
        // #endif
        if (this.autoTest) {
          this.eventLoad = {
            "tagName": event.target?.tagName,
            "type": event.type,
            "src": event.detail.src
          };
        }
      },
      download(event : UniWebViewDownloadEvent) {
        uni.showModal({
          content: "下载链接: " + event.detail.url + "\n文件大小: " + event.detail.contentLength / 1024 + "KB",
          showCancel: false
        });
      },
      confirm(event : UniInputConfirmEvent) {
        let url = event.detail.value;
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
          url = 'https://' + url;
        }
        this.src = url;
      },
      changeHorizontalScrollBarAccess(event : UniSwitchChangeEvent) {
        this.horizontalScrollBarAccess = event.detail.value;
      },
      changeVerticalScrollBarAccess(event : UniSwitchChangeEvent) {
        this.verticalScrollBarAccess = event.detail.value;
      },
      // 自动化测试
      touchstart(event : UniTouchEvent) {
        if (this.autoTest) {
          this.isTouchEnable = event.touches[0].clientX > 0 && event.touches[0].clientY > 0;
        }
      },
      tap(event : UniPointerEvent) {
        if (this.autoTest) {
          this.isTouchEnable = event.clientX > 0 && event.clientY > 0;
        }
      },
      getWindowInfo() : GetWindowInfoResult {
        return uni.getWindowInfo();
      },
      //自动化测试专用
      checkNativeWebView() : boolean {
        // #ifdef APP
        return hasNativeView('web-view')
        // #endif

        // #ifdef WEB
        return true
        // #endif
      }
    }
  }
  ```
