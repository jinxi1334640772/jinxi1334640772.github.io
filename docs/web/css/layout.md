# CSS layout布局
## 常用布局方式
- 正常布局流：
  - 不对页面进行任何布局控制时，浏览器默认的 HTML 布局方式
- 盒模型
- flex弹性盒
- grid网格
- float浮动
- position定为
- table表格
- multicol多列布局

每种技术都有它们的用途，各有优缺点，相互辅助。通过理解各个布局方法的设计理念，你能够找到构建你想要的网页需要的布局方案

## 元素垂直居中

>text-align只对文本或子元素display：inline或者inline-block有效，vertical-align只能定义在display：为inline或者inline-block的元素（table-cell也算是inline-block）。对于display：inline元素，设置padding和margin的top和bottom无效，左右有效，border都有效。

```html
 <div class="nav">
     <div class="zhangjinxi2"><span>222222222222222</span></div>
 </div>
```
1. 容器display为inline

这种一般都是对文字的居中对齐，水平方向上text-aligin：center，垂直方向上，vertical-align:middle或者使line-height === height,

2. 容器和子元素都为block或者inline-block

- 父子宽高都固定
  - 利用盒模型的margin和padding实现，
  - 利用position定位的left和top实现。

- 父子至少有一个不固定
  - 利用flex，这个是最简单的方式了  
    ```less
    .nav {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    ```
  - 利用grid布局
    ```less
    .nav {
        display: grid;
        .zhangjinxi2 {
            justify-self: center;
            align-self: center;
        }
    }
    ```
  - 利用position+transform定位
      ```less
      .nav {
          position: relative;
          .zhangjinxi2 {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
          }
      }
      ```
  - 利用position+margin:auto定位

    ```less
    .nav {
        position: relative;
        .zhangjinxi2 {
            position: absolute;
            top: 0;
            left: 0;
            right:0;
            bottom:0;
            margin:auto;
        }
    }
    ```
    ![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/171635d0cd9048c1~tplv-t2oaga2asx-image.image)

## 三列布局

```html
    <div class="nav">
        <div class="zhangjinxi">111</div>
        <div class="zhangjinxi2">222</div>
        <div class="zhangjinxi3">33333</div>
    </div>
```
1.  圣杯布局 利用float + margin-left实现

```less
.nav {
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
2. 双飞翼布局 利用position实现

```less
.nav {
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
3. flex布局

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
4. grid布局 最简单

> fr:剩余空间占据的份数
```less
.nav {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
```
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/17162f97f09b47fa~tplv-t2oaga2asx-image.image)