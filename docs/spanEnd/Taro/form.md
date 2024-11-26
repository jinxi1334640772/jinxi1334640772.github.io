## 表单组件
- `Button`
- `Checkbox`
- `CheckboxGroup`
- `Editor` 富文本编辑器，可以对图片、文字进行编辑。
- `Form`
- `Input`
- `KeyboardAccessory` 设置 Input / Textarea 聚焦时键盘上方 CoverView / CoverImage 工具栏视图。需要配置 Taro 插件 @tarojs/plugin-platform-weapp 的 enablekeyboardAccessory 参数为 true 后才能使用，

- `Label` 用来改进表单组件的可用性。
- `Picker` 从底部弹起的滚动选择器
- `PickerView` 嵌入页面的滚动选择器 其中只可放置 picker-view-column 组件，其它节点不会显示
- `PckerViewColumn` 滚动选择器子项 仅可放置于 <PickerView /> 中，其孩子节点的高度会自动设置成与 picker-view 的选中框的高度一致
- `Radio`
- `RadioGroup`
- `Slider` 滑动选择器
- `Switch`
- `Textarea`
```vue
<template>
  <view class="form">
    <h2 style="color: red">Form表单，包含所有表单组件</h2>
    <form @submit="formSubmit" @reset="formReset">
      <view class="item">
        <view class="title">Button&Switch组件的使用</view>
        <button
          size="default"
          type="primary"
          :loading="true"
          formType="submit"
          hover-class="buttonHover">
          loading primary按钮
        </button>
        <button
          size="default"
          type="primary"
          formType="submit"
          hover-class="buttonHover">
          不可点击的按钮
        </button>
        <button
          size="mini"
          :plain="true"
          type="primary"
          :disabled="false"
          :loading="false"
          formType="submit"
          hover-class="buttonHover">
          mini plain disabled submit按钮
        </button>
        <button type="warn">warn button</button>
        <switch
          name="switch"
          type="switch"
          color="#777777"
          :checked="true"
          :disabled="false"
          @change="e => console.log(e)"></switch>
      </view>
      <view class="item">
        <view class="title">Checkbox&CheckboxGroup组件的使用</view>
        <checkbox-group name="sex" @change="checkboxGroupChange">
          <checkbox value="选中" :checked="true" :disabled="false" color="red"
            >选中
          </checkbox>
          <checkbox style="margin-left: 20rpx" value="未选中">未选中</checkbox>
        </checkbox-group>
      </view>
      <view class="item">
        <view class="title">Editor组件的使用</view>
        <editor
          id="editor"
          name="editor"
          :readOnly="false"
          :showImgSize="true"
          :showImgToolbar="true"
          :showImgResize="true"
          placeholder="这是placeholder"
          @ready="editorReady"></editor>
      </view>
      <view class="item">
        <view class="title">radio-group&radio&label组件</view>
        <radio-group
          name="radioName"
          @change="e => console.log('radioName', e)">
          <label class="example-body__label" for="1" key="1">
            <radio
              id="1"
              value="USA"
              :checked="true"
              :disabled="false"
              color="#777777" />USA
          </label>
          <label class="example-body__label" for="2" key="2">
            <radio id="2" value="CHN" :checked="true" />CHN
          </label>
        </radio-group>
      </view>
      <view class="item">
        <view class="title">Input组件的使用</view>
        <text>带小数点的 input</text>
        <input name="digit" type="digit" placeholder="带小数点的数字键盘" />
        <text>身份证输入的 input</text>
        <input name="idcard" type="idcard" placeholder="身份证输入键盘" />
        <text
          >type=text,number,password,digit,idcard 控制占位符颜色的 input</text
        >
        <input
          name="text"
          type="text"
          placeholder="占位符字体是红色的"
          placeholder-style="color:red;"
          :disabled="false"
          :focus="true"
          :confirmHold="true"
          :maxlength="150"
          :cursorSpacing="10"
          :cursor="10"
          value="zhangjinxi"
          confirmType="zhangjinxi" />
      </view>
      <view class="item">
        <view class="title">Picker组件,multiSelector</view>
        <picker
          name="selector"
          mode="selector"
          :value="1"
          :disabled="false"
          :range="selector"
          @change="value => console.log(value, e)"
          @cancel="e => console.log(e)">
          <view class="picker">
            selector选择器,当前选择：{{ selectorChecked }}
          </view>
        </picker>
        <picker
          name="time"
          mode="time"
          :value="1"
          start="11:10"
          end="12:12"
          @change="e => console.log(e)">
          <view class="picker"> 时间time选择器,当前选择：{{ timeSel }} </view>
        </picker>
        <picker
          name="date"
          mode="date"
          fields="day"
          @change="e => console.log(e)">
          <view class="picker"> 日期date选择器,当前选择：{{ dateSel }} </view>
        </picker>
        <picker
          mode="region"
          level="region"
          @change="value => console.log(value, e)">
          <view class="picker"> 省市区选择器：mode = region当前选择：XXX </view>
        </picker>
      </view>
      <view class="item">
        <view class="title">PickerView嵌入页面的滚动选择器</view>
        <picker-view
          title="这是pickerView Title"
          indicator-style="height: 30px;"
          style="width: 100%; height: 300px"
          :value="value"
          @change="onChange">
          <picker-view-column>
            <view v-for="(item, index) in years" :key="index"
              >{{ item }}年</view
            >
          </picker-view-column>
          <picker-view-column>
            <view v-for="(item, index) in months" :key="index"
              >{{ item }}月</view
            >
          </picker-view-column>
          <picker-view-column>
            <view v-for="(item, index) in days" :key="index">{{ item }}日</view>
          </picker-view-column>
        </picker-view>
      </view>
      <view class="item">
        <view class="title">Slider滑动选择器</view>
        <slider
          step="1"
          value="100"
          :trackSize="10"
          :show-value="true"
          min="50"
          max="200"
          :disabled="false"
          backgroundColor="#888888"
          active-color="#666666" />
      </view>
      <view class="item">
        <view class="title">Textarea&KeyboardAccessory组件</view>
        <textarea
          name="textarea"
          :auto-height="true"
          value="这是默认内容"
          placeholder="placeholder"
          :disabled="false"
          :maxlength="150"
          :autofocus="true"
          :cursor-spaceing="20"
          :show-count="true"
          :auto-focusd="true">
            <!-- <keyboard-accessory class="container" style="height:50rpx">
                <cover-view style="height:20rpx;background-color: yellow;">coverView</cover-view>
            </keyboard-accessory> -->
            </textarea
        >
      </view>
      <button type="primary" form-type="submit">Submit</button>
      <button type="warn" form-type="reset">Reset</button>
    </form>
  </view>
</template>

<script>
import { ref, reactive } from "vue";
import "./index.scss";
import Taro from "@tarojs/taro";
export default {
  setup() {
    let editorCtx = reactive({});
    let selector = reactive(["美国", "中国", "巴西", "日本"]);
    let selectorChecked = ref("美国");
    let timeSel = ref("12:01");
    let dateSel = ref("2018-04-22");
    const checkboxChange = function (e) {
      console.log(e);
    };
    const checkboxGroupChange = function (e) {
      console.log("checkboxGroupChange", e);
    };
    const formSubmit = function (e) {
      console.log("formSubmit", e);
    };
    const formReset = function (e) {
      console.log("formReset", e);
    };
    const editorReady = function () {
      console.log("编辑器初始化完成时触发");
      Taro.createSelectorQuery()
        .select("#editor")
        .context(res => (editorCtx = res.context))
        .exec();
    };
    const date = new Date();
    const years = reactive([]);
    const months = reactive([]);
    const days = reactive([]);
    const value = reactive([3, 1, 1]);
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    const onChange = function (e) {
      const val = e.detail.value;
      console.log(val);
    };
    return {
      checkboxChange,
      checkboxGroupChange,
      editorReady,
      formSubmit,
      formReset,
      selector,
      selectorChecked,
      timeSel,
      dateSel,
      onChange,
      years,
      months,
      days,
      value,
    };
  },
};
</script>
```
![alt text](3d52b8a5cb83749f57cd2aa2ba8b88b.jpg)