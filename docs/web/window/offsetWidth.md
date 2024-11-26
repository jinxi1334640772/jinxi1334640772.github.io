# offsetWidth、clientWidth、scrollWidth理解

> height和top与width和left同理，只拿width和left举例

## offsetWidth

offsetWidth是容器的可见宽度,width+padding+border

## clientWidth

clientWidth是容器可见内容的宽度,width+padding-滚动条的宽度

## scrollWidth

scrollWidth是内容的宽度，包括看不到的部分

## offsetLeft

offsetLeft是容器距离offsetParent左边的距离，offsetParent是距离祖宗元素中最近的定位元素或者是table,th,td,body元素。当前元素display：none时，其offsetParent为null

## clientLeft

其等于当前元素的border-left的宽度

## scrollLeft

元素向左滚动的距离（滚动条向右移动）

scrollWidth = clientWidth+最大的scrollLeft(水平滚动条，滚动到最右边)
scrollHeight = clientHeight+最大的scrollTop(垂直滚动条，滚动到最下边)

## innerWidth

窗口中文档显示区域的宽度，不包括菜单栏、工具栏等部分，该属性可读可写。注意，IE浏览器不支持该属性。

## outerWidth

窗口中文档显示区域的宽度，包含菜单栏、工具栏等部分。