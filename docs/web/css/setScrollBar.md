# 滚动条设置

滚动条是和元素的overflow属性相关的，只有overflow为auto并且内容超出或者为scroll时，才会出现滚动条。无论什么浏览器，滚动条都在HTML元素上，因为body默认有8px的margin，如果滚动条来自body，应该与页面有8px的间距，实际上并没有，所以滚动条来自HTML。滚动条会占用浏览器的可用宽度。（一个元素的clientHeight不包含滚动条）。

##  IE浏览器

支持通过CSS样式来改变滚动条部件的颜色。

```
scrollbar-face-color  滚动条凸出部分的颜色
scrollbar-shadow-color 立体滚动条阴影的颜色
scrollbar-highlight-color 滚动条空白部分的颜色
scrollbar-3dlight-color 滚动条两边的颜色
scrollbar-darkshadow-color 滚动条强阴影的颜色
scrollbar-track-color 滚动条背景的颜色
scrollbar-arrow-color 滚动条上下按钮上三角箭头的颜色
scrollbar-base-color 滚动条基本的颜色
```

##  webkit浏览器

webkit内核的浏览器支持滚动条自定义样式，但是和IE不同，webkit是通过伪类来实现的

```
：：webkit-scrollbar 滚动条整体部分
：：webkit-scrollbar-track 外层轨道
：：webkit-scrollbar-track-piece 内层轨道
：：webkit-scrollbar-thumb 滚动滑块
：：webkit-scrollbar-button 两端按钮
：：webkit-scrollbar-corner 边角
```

当滚动条设置宽高，单位为百分比时，是相对视口大小来说的。滚动条的层叠关系依次往上为scrollbar，track，track-piece，button，corner，thumb。

相关伪类：

```
：horizontal  适用于任何水平方向上的滚动条
：vertical  适用于任何垂直方向上的滚动条
：no-button  表示轨道结束的位置没有按钮
：corner-present  表示滚动条的角落是都存在
：window-inactive 适用于所有滚动条，表示包含滚动条的区域，焦点不在该窗口的时候
：；webkit-scrollbar-track-piece:start   滚动条上半边或者左半边
：：webkit-scrollbar-thumb：window-inactive  当焦点不在当前区域滚动条滑块的状态
：：webkit-scrollbar-button：horizontal 水平滚动条按钮的状态
```
