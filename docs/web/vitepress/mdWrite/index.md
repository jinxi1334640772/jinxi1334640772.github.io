---
title: Docs with VitePress
editLink: true
---
## 导入数据
<script setup>
import { data } from '../../../example.data.js'
console.log(11,data) // {hello:'world'}
</script>

<pre>{{ data }}</pre>
# markdown扩展

::: tip 布局不生效
VitePress 带有内置的 Markdown 扩展。这里为提示tip。这里定义的是变量 ：{{ $frontmatter.title }}
:::
## 标题
```md
# 标题一
## 标题二
### 标题三
#### 标题四
##### 标题五
###### 标题六 最多6层标题
```
## 列表

### 无序列表
```md
- 列表项1
- 列表项2
- 列表项3
  
* 列表项1
* 列表项2
* 列表项3

```
- 列表项1
- 列表项2
- 列表项3
  
* 列表项1
* 列表项2
* 列表项3

### 有序列表
```md
1. item1
2. item2
3. item3
```
1. item1
2. item2
3. item3

## 文字效果

-  `**加粗Ctrl + B**` **加粗Ctrl + B** 
-  `*斜体Ctrl + I*` *斜体Ctrl + I* 或者 `_斜体Ctrl + I_` _斜体Ctrl + I_
-  `***加粗&斜体***` ***加粗&斜体*** 或 `**_加粗&斜体_**` **_加粗&斜体_**

- `~~删除线 ~~`  ~~删除线 ~~
-   \`\<style\>原样输出\`  `<style>原样输出`

## 引用
```
> 区块引用
>>区块嵌套 
```
> 区块引用
>>区块嵌套 

## 分割线
```md
---
***
```
效果：
---
***
## 缩进
```md
&nbsp;&nbsp;段首缩进 空格+回车换行 

&emsp;&emsp;段首缩进 空格+回车换行 

&emsp;&emsp;段首缩进
> 段首缩进
``` 

&nbsp;&nbsp;段首缩进 空格+回车换行 

&emsp;&emsp;段首缩进 空格+回车换行 

&emsp;&emsp;段首缩进
> 段首缩进

## 链接
```md
[百度首页](http://baidu.com)
```

[百度首页](http://baidu.com)

## 图片
```md
![引入静态资源](https://doc.houdunren.com/xj.png) 

```
![引入静态资源](https://gips2.baidu.com/it/u=1651586290,17201034&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f600_800) 
## 数学公式
1. 行内公式
```md
$E=mc^2$
```
$E=mc^2$ 

2. 居中公式块
```md
$$
\sum_{i=0}^n i^2=\frac{(n^2+n)(2n+1)}{6} \tag{1}
$$
```
$$
\sum_{i=0}^n i^2=\frac{(n^2+n)(2n+1)}{6} \tag{1}
$$
3. 上标和下标
```md
$$
x_i^3+y_i^3=z_i^3
$$
```
$$
x_i^3+y_i^3=z_i^3   
$$
4. 括号
```md
$$
\{[(x_1+x_2)^2-(y_1-y_2)^4]\times w\}
\times (z_1^2-z_2^2) \tag{3}
$$

# 对数
$\lg 10^3$
$\log_2 10$
$\ln (\pi+2)$

# 三角函数
$$
\sin(x+y)+\cos(y+z)+\tan(z+x)+\arcsin(x+y+z) \tag{7}
$$
```
$$
\{[(x_1+x_2)^2-(y_1-y_2)^4]\times w\}
\times (z_1^2-z_2^2) \tag{3}
$$

$\lg 10^3$
$\log_2 10$
$\ln (\pi+2)$

$$
\sin(x+y)+\cos(y+z)+\tan(z+x)+\arcsin(x+y+z) \tag{7}
$$

5. 累加、累乘、并集和交集

```md
$$
Y_i=\sum_{i=0}^{n} X_i \tag{5}
$$
$$
\sum_{i=1}^n \frac{1}{i^2} \quad and 
\quad \prod_{i=1}^n \frac{1}{i^2} \quad 
and \quad \bigcup_{i=1}^{2} \Bbb{R} 
\quad and \quad \bigcap_{i=1}^3 X_i \tag{6}
$$
```
$$
Y_i=\sum_{i=0}^{n} X_i \tag{5}
$$
$$
\sum_{i=1}^n \frac{1}{i^2} \quad and 
\quad \prod_{i=1}^n \frac{1}{i^2} \quad 
and \quad \bigcup_{i=1}^{2} \Bbb{R} 
\quad and \quad \bigcap_{i=1}^3 X_i \tag{6}
$$
## GitHub风格的表格

```md
| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |


## 默认表格
```md
| Tables        |      Are      |  Cool |
| ------------- | ------------- | ----- |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

| Tables        |      Are      |  Cool |
| ------------- | ------------- | ----- |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

## Emoji 🎉
```md
:tada: :100:
```
🎉 💯  :tada: :100:

## 自定义容器
自定义容器可以通过它们的类型、标题和内容来定义。markdown插件赋予markdown的功能
```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details 点我查看代码，这是自定义标题
This is a details block.
:::
```
编译后输出样式为：
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## 通过标注文件类型，可以实现语法高亮效果，
```js{1,4,6-8}
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum',
    }
  }
}
```

## 代码块行样式
```js
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',// [!code highlight]
      lorem: 'ipsum',// [!code focus]
      q: 'ipsum',// [!code --]
      w: 'ipsum',// [!code ++]
      r: 'ipsum',
      msg: 'Error', // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
```
## 启用和禁用行号
```ts:line-numbers=2 {1}
// 行号已启用，并从 2 开始
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```
## 导入代码片段
```md
// @为源目录 #snippet代码指定部分 2为需要高亮的行数

<<< @/index.md{2}

// #region snippet
function foo() {
  // ..
}
// #endregion snippet

```
<<< @/index.md{20}

## 包含markdown文件
<!--@include: @/index.md{30,45}-->
## 代码组

::: code-group

```js [index.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```

:::