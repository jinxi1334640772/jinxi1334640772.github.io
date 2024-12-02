# flex布局

>设置容器内子元素在主轴和交叉轴上如何排列

## 主轴和交叉轴

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/1716220d46d4bdaf~tplv-t2oaga2asx-image.image)

## 设置在父元素上的属性

>设置flex属性后，float,clear,vertical-align属性将失效

- display:flex;
- flex-direction ：row | row-reverse | column | column-reverse ; 主轴方向
- flex-wrap : wrap | nowrap | wrap-reserve ; 换行方式
- flex-flow : flex-direction || flex-wrap ; 简写形式
- justify-content : flex-start | flex-end | center | space-between | space-around ; 主轴排列方式
- align-items : flex-start | flex-end | center | baseline | stretch ; 交叉轴排列方式
- align-content ：flex-start |flex-end | center | space-between | space-around | stretch ; 多个主轴线，在交叉轴排列方式

### 设置在item上的属性

>当某个item不按照默认规则显示时，需要单独对item配置

- order : n ; 整数值，item的排序索引
- flex-basis : 像素 | 百分比 | auto ; 配置item应该占据的主轴空间，默认为width
- flex-grow : n ; item占据剩余空间的份数，默认0，不占据
- flex-shrink : n ;item缩放份数，默认1，按比例缩放
- flex : flex-grow || flex-shrink || flex-basis ; 简写形式，默认0 1 auto
- align-self : auto | flex-start | flex-end | center | baseline | stretch ; item在交叉轴上排列方式
