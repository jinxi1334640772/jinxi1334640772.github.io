# 滚动吸附

滚动吸附特性可以定义吸附位置。滚动容器的滚动口在完成滚动操作后可能会停在或“吸附到”这些位置。  
在定义滚动吸附前，需要在滚动容器上启用滚动。通过确保滚动容器指定了尺寸且启用 overflow 可启用滚动。
## 滚动吸附相关属性
1. scroll-snap-type 配置滚动方向，以及是否必须吸附到某个点上
   1. 滚动方向：x、y或者逻辑对应关系block、inline。
   2. 是否必须吸附：mandatory强制必须吸附，proximity就近吸附。
2. scroll-snap-align 配给子元素，内容应该吸附到容器的位置 ，可以定义两值，分别是块轴和行内轴的对齐方式
   1. start 吸附到容器开头
   2. end 结尾
   3. center 子容器内居中
   4. none 此盒在此轴上未定义吸附位置。
3. scroll-snap-stop 配给子元素。吸附到而不能越过某个子元素
   1. normal 在滚动元素到滚动容器的可见视口时，滚动容器可“越过”吸附位置。
   2. always 滚动容器不得“越过”吸附位置，必须吸附至此元素的第一个吸附位置。
4. scroll-margin 子元素的吸附外边距
5. scroll-padding 滚动容器的吸附偏移（可能有固定的头部，需要一直显示）

```css
.scroller {
  height: 300px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-padding: 80px;
  
}

.scroller section {
  scroll-snap-align: start;
  scroll-margin:40px;
  scroll-snap-stop: always;
}
```