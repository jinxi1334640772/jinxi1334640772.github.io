# CSS实现两端固定宽度，中间自适应布局

## HTML代码
```html
    <div class="nav">
        <div class="zhangjinxi">111</div>
        <div class="zhangjinxi2">222</div>
        <div class="zhangjinxi3">33333</div>
    </div>
```
### 圣杯布局 利用float + margin-left实现

```less
.nav {
    background: brown;
    .zhangjinxi {
        width: 100%;
        float: left;
        box-sizing: border-box;
        padding: 0 200px;
    }
    .zhangjinxi2 {
        width: 200px;
        float: left;
        margin-left: -100%;
    }
    .zhangjinxi3 {
        width: 200px;
        float: left;
        margin-left: -200px;
    }
}
```
### 双飞翼布局 利用position实现

```less
.nav {
    background: brown;
    position: relative;
    .zhangjinxi {
        width: 100%;
        box-sizing: border-box;
        padding: 0 200px;
    }
    .zhangjinxi2 {
        position: absolute;
        width: 200px;
        top: 0;
    }
    .zhangjinxi3 {
        position: absolute;
        width: 200px;
        top: 0;
        right: 0;
    }
}
```
### flex布局

>两端设置flex-basis为固定宽度，中间元素设置flex-grow:1占满剩余宽度

```less
.nav {
  display: flex;
    .zhangjinxi,.zhangjinxi3 {
      flex-basis: 200px;
    }
    .zhangjinxi2 {
      flex-grow: 1;
    }
}
```
### grid布局 最简单

> fr:剩余空间占据的份数
```less
.nav {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
```
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/17162f97f09b47fa~tplv-t2oaga2asx-image.image)