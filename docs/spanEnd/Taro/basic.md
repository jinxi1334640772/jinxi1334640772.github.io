## 基础内容组件
- `Icon` 图标。组件属性的长度单位默认为 px
- `Text` 文本

- `Progress` 进度条。组件属性的长度单位默认为 px
- `RichText` 富文本

```vue
<template>
  <view class="baseContent">
    <view class="item">
      <view class="title">icon组件</view>
      <icon type="success" size="23" color="red"></icon>
      <icon type="info" size="23" color="blue"></icon>
      <icon type="warn" size="23" color="green"></icon>
      <icon type="waiting" size="23" color="black"></icon>
      <icon type="success_no_circle" size="23" color="pink"></icon>
      <icon type="download" size="23" color="yellow"></icon>
      <icon type="clear" size="23" color="#66666"></icon>
      <icon type="search" size="23" color="#22222"></icon>
      <icon type="circle" size="23" color="#55555"></icon>
      <icon type="info_circle" size="30" color="#99999"></icon>
    </view>
    <view class="item">
      <view class="title">text组件:超过三行省略，可复制</view>
      <text :selectable="true" :userSelect="true" :decode="true" :numberOfLines="3" :maxLines="3">这是text组件</text>
    </view>
    <view class="item">
      <view class="title">progress组件</view>
      <progress percent="80" stroke-width="20" color="blue" active-color="yellow" background-color="green" :active="true" active-mode="forwards" :duration="100" borderRadius="20" font-size="20" :show-info="true" @activeEnd="activeEnd" />
    </view>
    <view class="item">
      <view class="title">RichText组件：富文本</view>
      <rich-text :nodes="nodes" :user-select="false" image-menu-prevent="true" preview="true"></rich-text>
    </view>
  </view>
</template>
<script>
import { ref } from 'vue'
import './index.scss'

export default {
  setup () {
    const msg = ref('Hello world')
    const nodes = [{
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'line-height: 60px; color: red;'
        },
        children: [{
          type: 'text',
          text: 'Hello World!'
        }]
      }]
    const activeEnd = function(e){console.log(e);}
    return {
      msg,activeEnd,nodes
    }
  }
}
</script>
```
![alt text](e902664f513143d97de5899cd8c45aa.jpg)