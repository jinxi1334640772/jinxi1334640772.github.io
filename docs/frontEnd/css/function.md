---
title: CSS 函数详解
description: 全面介绍 CSS 函数，包括计算函数、颜色函数、形状函数、滤镜函数等，掌握现代 CSS 函数的用法和技巧
outline: deep
---

# 🎯 CSS 函数详解

CSS 函数是现代 CSS 的重要组成部分，它们提供了强大的计算、变换和样式处理能力。本文将详细介绍各种 CSS 函数的用法和应用场景。

## 📋 函数分类概览

| 分类 | 主要函数 | 用途 | 兼容性 |
|------|----------|------|--------|
| **计算函数** | `calc()`, `clamp()`, `min()`, `max()` | 数值计算和约束 | ✅ 良好 |
| **颜色函数** | `hsl()`, `color-mix()`, `light-dark()` | 颜色处理和主题 | ✅ 现代浏览器 |
| **形状函数** | `circle()`, `polygon()`, `path()` | 图形绘制和裁剪 | ✅ 现代浏览器 |
| **滤镜函数** | `blur()`, `brightness()`, `contrast()` | 图像效果处理 | ✅ 现代浏览器 |
| **变换函数** | `perspective()`, `drop-shadow()` | 3D 变换和阴影 | ✅ 现代浏览器 |
| **资源函数** | `url()`, `image()`, `image-set()` | 资源引用和优化 | ✅ 良好 |

---

## 🧮 计算函数

### `calc()` - 动态计算

允许在声明 CSS 属性值时执行数学计算，支持四则运算。

```css
/* 基础语法 */
calc(<calc-sum>)

/* 实际应用 */
.container {
  width: calc(100% - 80px);
  height: calc(100vh - 60px);
  margin: calc(1.5rem + 3vw);
  font-size: calc(var(--base-size) * 1.2);
}
```

**适用场景**:
- `<length>`, `<frequency>`, `<angle>`, `<time>`, `<percentage>`, `<number>`, `<integer>`

::: tip 💡 计算规则
- 运算符前后必须有空格：`calc(100% - 20px)` ✅
- 不同单位可以混合计算：`calc(50% + 20px)` ✅
- 支持嵌套：`calc(calc(100% / 2) - 10px)` ✅
:::

### `calc-size()` - 内在尺寸计算

允许对内在值（如 `auto`、`fit-content`）进行计算。

```css
/* 基础语法 */
calc-size(<calc-size-basis>, <calc-sum>)

/* 实际应用 */
.section {
  height: calc-size(min-content, size + 100px);
  width: calc-size(fit-content, size / 2);
  height: calc-size(auto, round(up, size, 50px));
}
```

**参数说明**:
- `<calc-size-basis>`: 参考值（`auto`、`min-content`、`max-content`、`fit-content`）
- `size`: 代表前面的参考值
- `<calc-sum>`: 基于参考值的计算表达式

### `clamp()` - 值约束

将值限制在指定的最小值和最大值之间。

```css
/* 基础语法 */
clamp([<calc-sum> | none], <calc-sum>, [<calc-sum> | none])

/* 实际应用 */
.responsive-text {
  font-size: clamp(1rem, 2.5vw, 2rem);
  padding: clamp(1rem, 5%, 3rem);
  width: clamp(300px, 50%, 800px);
}
```

**等价关系**:
```css
/* clamp(MIN, VAL, MAX) 等同于 max(MIN, min(VAL, MAX)) */
font-size: clamp(16px, 4vw, 32px);
/* 相当于 */
font-size: max(16px, min(4vw, 32px));
```

### `min()` / `max()` - 最值选择

从多个值中选择最小值或最大值。

```css
/* 基础语法 */
min(<calc-sum>#)
max(<calc-sum>#)

/* 实际应用 */
.responsive-container {
  width: min(100%, 1200px);
  height: max(300px, 50vh);
  font-size: max(16px, 1.2vw);
}

/* 复杂组合 */
.complex {
  font-size: max(min(0.5vw, 0.5em), 1rem);
}
```

### `minmax()` - 网格范围

在 Grid 布局中定义轨道的最小和最大尺寸。

```css
/* 网格应用 */
.grid-container {
  grid-template-columns: 
    minmax(200px, 1fr) 
    minmax(100px, 300px) 
    minmax(min-content, max-content);
}
```

---

## 🎨 颜色函数

### `hsl()` - HSL 颜色空间

基于色相（Hue）、饱和度（Saturation）、明度（Lightness）定义颜色。

```css
/* 基础语法 */
hsl(<hue> <saturation> <lightness> [/ <alpha>])

/* 实际应用 */
.color-examples {
  background: hsl(120deg 75% 50%);        /* 绿色 */
  border: hsl(240 100% 50% / 0.8);        /* 半透明蓝色 */
  color: hsl(0 0% 20%);                   /* 深灰色 */
}
```

**参数说明**:
- **色相**: `0-360deg` 或 `0-360`
- **饱和度**: `0-100%`
- **明度**: `0-100%`
- **透明度**: `0-1` 或 `0-100%`

### `lab()` - LAB 颜色空间

在 CIE L*a*b* 颜色空间中表示颜色，覆盖人眼可见的全部颜色范围。

```css
/* 基础语法 */
lab(<lightness> <a> <b> [/ <alpha>])

/* 实际应用 */
.lab-colors {
  color: lab(29.2345% 39.3825 20.0664);
  background: lab(52.2345% 40.1645 59.9971 / 0.5);
}
```

### `color-mix()` - 颜色混合

混合两种颜色，返回指定比例的混合结果。

```css
/* 基础语法 */
color-mix(<color-interpolation-method>, [<color> && <percentage>?]#{2})

/* 实际应用 */
.mixed-colors {
  background: color-mix(in srgb, blue 70%, white);
  border: color-mix(in lch, red 40%, yellow);
  color: color-mix(in hsl longer hue, hsl(120 100% 50%) 20%, white);
}
```

**插值方法**:
- **矩形空间**: `srgb`, `display-p3`, `lab`, `oklab`
- **极坐标空间**: `hsl`, `hwb`, `lch`, `oklch`

### `light-dark()` - 主题适配

根据系统主题返回对应的颜色值。

```css
/* 配置主题支持 */
:root {
  color-scheme: light dark;
}

/* 使用主题颜色 */
.theme-adaptive {
  color: light-dark(#333333, #ffffff);
  background: light-dark(#ffffff, #1a1a1a);
  border: light-dark(rgb(200 200 200), rgb(60 60 60));
}
```

::: warning ⚠️ 使用前提
使用 `light-dark()` 前必须设置 `color-scheme: light dark`
:::

---

## 🔍 滤镜函数

### `blur()` - 模糊效果

对元素应用高斯模糊效果。

```css
/* 基础语法 */
blur(<length>)

/* 实际应用 */
.blur-effects {
  filter: blur(0);        /* 无效果 */
  filter: blur(5px);      /* 5px 模糊半径 */
  filter: blur(1.5rem);   /* 1.5rem 模糊半径 */
}

/* 组合使用 */
.image-overlay {
  filter: blur(2px) brightness(0.8);
}
```

### `brightness()` - 亮度调节

调整元素的亮度。

```css
/* 基础语法 */
brightness(<number> | <percentage>)

/* 实际应用 */
.brightness-effects {
  filter: brightness(0%);     /* 全黑 */
  filter: brightness(0.5);    /* 50% 亮度 */
  filter: brightness(1);      /* 原始亮度 */
  filter: brightness(150%);   /* 150% 亮度 */
}
```

### `contrast()` - 对比度调节

调整元素的对比度。

```css
/* 基础语法 */
contrast(<number> | <percentage>)

/* 实际应用 */
.contrast-effects {
  filter: contrast(0);      /* 完全灰色 */
  filter: contrast(0.5);    /* 50% 对比度 */
  filter: contrast(1);      /* 原始对比度 */
  filter: contrast(200%);   /* 200% 对比度 */
}
```

### `drop-shadow()` - 投影效果

创建符合元素形状的投影效果。

```css
/* 基础语法 */
drop-shadow(<length>{2,3} <color>?)

/* 实际应用 */
.shadow-effects {
  filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.3));
  filter: drop-shadow(0 4px 8px #00000040);
  filter: drop-shadow(2px 2px 4px red);
}
```

::: info 📝 与 box-shadow 的区别
- `box-shadow`: 在元素的整个框后面创建矩形阴影
- `drop-shadow()`: 创建符合元素实际形状（alpha 通道）的阴影
:::

### 其他滤镜函数

```css
/* 灰度效果 */
.grayscale { filter: grayscale(100%); }

/* 饱和度调节 */
.saturate { filter: saturate(200%); }

/* 色彩反转 */
.invert { filter: invert(100%); }

/* 棕褐色效果 */
.sepia { filter: sepia(80%); }

/* 透明度调节 */
.opacity { filter: opacity(50%); }
```

---

## 🎭 形状函数

### `circle()` - 圆形

使用半径和位置定义圆形。

```css
/* 基础语法 */
circle(<radial-size>? [at <position>]?)

/* 实际应用 */
.circle-shapes {
  clip-path: circle(50%);                    /* 圆形裁剪 */
  clip-path: circle(100px at center);        /* 指定半径和位置 */
  shape-outside: circle(6rem at 12rem 8rem); /* 文字环绕 */
}
```

**半径选项**:
- `closest-corner` | `closest-side` | `farthest-corner` | `farthest-side`
- `<length>` | `<percentage>`

### `ellipse()` - 椭圆

定义椭圆形状，需要指定 x 和 y 两个半径。

```css
/* 基础语法 */
ellipse(<radial-size>{2} [at <position>]?)

/* 实际应用 */
.ellipse-shapes {
  clip-path: ellipse(40% 50% at left);
  shape-outside: ellipse(closest-side farthest-side at 30%);
}
```

### `polygon()` - 多边形

通过坐标点定义多边形。

```css
/* 基础语法 */
polygon(<fill-rule>?, [<length-percentage> <length-percentage>]#)

/* 实际应用 */
.polygon-shapes {
  /* 三角形 */
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  
  /* 六边形 */
  clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
  
  /* 星形 */
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
```

**填充规则**:
- `nonzero`: 非零规则（默认）
- `evenodd`: 奇偶规则

### `inset()` - 矩形内缩

定义一个内缩的矩形。

```css
/* 基础语法 */
inset(<length-percentage>{1,4} [round <border-radius>]?)

/* 实际应用 */
.inset-shapes {
  clip-path: inset(20px 50px 10px 0);              /* 内缩矩形 */
  clip-path: inset(1rem round 15px);               /* 带圆角 */
  shape-outside: inset(20px 50px 10px 0 round 50px); /* 复杂圆角 */
}
```

### `path()` - SVG 路径

使用 SVG 路径字符串定义复杂形状。

```css
/* 基础语法 */
path(<fill-rule>?, <string>)

/* 实际应用 */
.path-shapes {
  clip-path: path("M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80");
  offset-path: path("M 20 20 L 80 80");
}
```

---

## 🔧 变换和尺寸函数

### `perspective()` - 透视距离

设置 3D 变换的透视距离。

```css
/* 基础语法 */
perspective(<length>)

/* 实际应用 */
.perspective-container {
  transform: perspective(1000px) rotateX(45deg);
  transform: perspective(500px) rotateY(30deg) rotateX(15deg);
}
```

### `fit-content()` - 内容适配

将尺寸限制在内容大小和最大值之间。

```css
/* 基础语法 */
fit-content(<length-percentage>)

/* 实际应用 */
.fit-content-examples {
  width: fit-content(300px);      /* 最大 300px */
  height: fit-content(50vh);      /* 最大 50vh */
  grid-template-columns: fit-content(200px) 1fr;
}

/* 等价于 */
.equivalent {
  width: clamp(min-content, 300px, max-content);
}
```

---

## 📁 资源函数

### `url()` - 资源引用

引用外部资源文件。

```css
/* 基础语法 */
url(<string> | <url>)

/* 实际应用 */
.resource-examples {
  background-image: url('images/bg.jpg');
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRTNFM0UzIi8+Cjwvc3ZnPgo=");
  font-family: url('fonts/custom.woff2');
  cursor: url('cursors/pointer.cur'), pointer;
}

/* 在其他函数中使用 */
.advanced-usage {
  background: cross-fade(20% url(first.png), url(second.png));
  mask-image: image(url(mask.png), skyblue);
}
```

### `image()` - 图像处理

提供图像引用和回退处理。

```css
/* 基础语法 */
image(<image-tags>? [<image-src>?, <color>?]!)

/* 实际应用 */
.image-examples {
  background: image(rgb(0 0 0 / 25%)), url("fallback.png");
  background: image(ltr, "sprite.png#xywh=32,64,16,16", red);
}
```

**图像标签**:
- `ltr`: 从左到右
- `rtl`: 从右到左

### `image-set()` - 响应式图像

为不同像素密度提供不同的图像。

```css
/* 基础语法 */
image-set(<image-set-option>#)

/* 实际应用 */
.responsive-images {
  background-image: image-set(
    url("image1.jpg") 1x,
    url("image2.jpg") 2x,
    url("image3.jpg") 3x
  );
  
  /* 带格式支持检测 */
  background-image: image-set(
    url("image.avif") type("image/avif"),
    url("image.webp") type("image/webp"),
    url("image.jpg") type("image/jpeg")
  );
}
```

---

## 🔄 数学函数

### `mod()` - 取模运算

返回除法运算的余数。

```css
/* 基础语法 */
mod(<calc-sum>, <calc-sum>)

/* 实际应用 */
.math-examples {
  line-height: mod(7, 2);        /* 1 */
  margin: mod(15%, 2%);          /* 1% */
  rotate: mod(100deg, 30deg);    /* 10deg */
  scale: mod(10 * 2, 1.7);       /* 1.3 */
}
```

### `rem()` - 余数运算

计算余数，支持带单位的计算。

```css
/* 基础语法 */
rem(<calc-sum>, <calc-sum>)

/* 实际应用 */
.remainder-examples {
  line-height: rem(21, 2);       /* 1 */
  margin: rem(14%, 3%);          /* 2% */
  rotate: rem(200deg, 30deg);    /* 20deg */
}
```

### `round()` - 四舍五入

根据策略和间隔进行数值舍入。

```css
/* 基础语法 */
round(<rounding-strategy>?, <calc-sum>, <calc-sum>?)

/* 舍入策略 */
.rounding-examples {
  width: round(nearest, 123px, 10px);    /* 120px */
  width: round(up, 101px, 50px);         /* 150px */
  width: round(down, 156px, 50px);       /* 150px */
  width: round(to-zero, -105px, 10px);   /* -100px */
}
```

**舍入策略**:
- `nearest`: 最接近（默认）
- `up`: 向上舍入
- `down`: 向下舍入  
- `to-zero`: 向零舍入

---

## 🎬 动画函数

### `scroll()` - 滚动时间轴

为滚动驱动的动画提供时间轴。

```css
/* 基础语法 */
scroll([<scroller> || <axis>]?)

/* 实际应用 */
.scroll-animations {
  animation-timeline: scroll();
  animation-timeline: scroll(nearest);    /* 最近的滚动容器 */
  animation-timeline: scroll(root);       /* 根滚动容器 */
  animation-timeline: scroll(self);       /* 自身滚动 */
  
  /* 指定滚动轴 */
  animation-timeline: scroll(block);      /* 块轴方向 */
  animation-timeline: scroll(inline);     /* 内联轴方向 */
  animation-timeline: scroll(x);          /* X 轴 */
  animation-timeline: scroll(y);          /* Y 轴 */
}
```

---

## 🔤 属性函数

### `attr()` - 属性获取

获取元素的属性值用于样式。

```css
/* 基础语法 */
attr(<attr-name> <type-or-unit>?, <attr-fallback>?)

/* 实际应用 */
.attr-examples::before {
  content: attr(data-label);              /* 获取属性值 */
  content: attr(title, "默认标题");        /* 带回退值 */
}

.dynamic-sizing {
  width: attr(data-width px, 100px);      /* 数值类型 */
  color: attr(data-color color, blue);    /* 颜色类型 */
}
```

**HTML 示例**:
```html
<div data-label="重要" data-width="200" data-color="red">内容</div>
```

### `var()` - CSS 变量

获取 CSS 自定义属性的值。

```css
/* 定义变量 */
:root {
  --primary-color: #3498db;
  --spacing: 1rem;
  --font-size: 16px;
}

/* 使用变量 */
.variable-examples {
  color: var(--primary-color);
  margin: var(--spacing);
  font-size: var(--font-size, 14px);     /* 带回退值 */
  
  /* 嵌套回退 */
  background: var(--bg-color, var(--fallback-color, white));
}
```

::: tip 💡 变量最佳实践
- 使用语义化的变量名
- 在 `:root` 中定义全局变量
- 为变量提供合理的回退值
- 利用 CSS 变量实现主题切换
:::

---

## 🎯 高级应用示例

### 响应式设计组合

```css
.responsive-card {
  width: clamp(300px, 50vw, 800px);
  padding: clamp(1rem, 4vw, 2rem);
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  
  /* 动态间距 */
  margin: calc(var(--base-margin) + 2vw);
  
  /* 主题适配 */
  background: light-dark(
    color-mix(in srgb, white 95%, var(--primary-color)),
    color-mix(in srgb, black 90%, var(--primary-color))
  );
}
```

### 复杂形状裁剪

```css
.complex-shape {
  clip-path: polygon(
    20% 0%,
    80% 0%,
    100% 20%,
    100% 80%,
    80% 100%,
    20% 100%,
    0% 80%,
    0% 20%
  );
  
  /* 带动画的形状变化 */
  transition: clip-path 0.3s ease;
}

.complex-shape:hover {
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 100%,
    0% 100%
  );
}
```

### 滤镜效果组合

```css
.image-effects {
  filter: 
    blur(0.5px)
    brightness(1.1)
    contrast(1.2)
    saturate(1.3)
    drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  
  transition: filter 0.3s ease;
}

.image-effects:hover {
  filter: 
    blur(0)
    brightness(1.2)
    contrast(1.3)
    saturate(1.5)
    drop-shadow(0 8px 16px rgba(0,0,0,0.3));
}
```

---

## 📚 总结与最佳实践

### 🎯 函数选择指南

| 需求 | 推荐函数 | 原因 |
|------|----------|------|
| **响应式尺寸** | `clamp()`, `min()`, `max()` | 自适应且有边界 |
| **动态计算** | `calc()` | 灵活的数学运算 |
| **颜色处理** | `color-mix()`, `hsl()` | 现代颜色管理 |
| **图形裁剪** | `clip-path` + 形状函数 | 创意视觉效果 |
| **图像效果** | 滤镜函数组合 | 丰富的视觉体验 |
| **主题切换** | `light-dark()`, `var()` | 用户体验优化 |

### 🚀 性能优化建议

::: tip 🔧 优化技巧
1. **减少重复计算**: 将复杂计算结果存储在 CSS 变量中
2. **合理使用滤镜**: 避免过多滤镜函数导致性能问题
3. **响应式优先**: 使用 `clamp()` 等函数减少媒体查询
4. **渐进增强**: 为不支持的浏览器提供回退方案
:::

### 📈 发展趋势

- ✅ **计算函数**日益完善，支持更多数学运算
- ✅ **颜色函数**向更广色域发展
- ✅ **形状函数**与 SVG 更深度集成
- ✅ **动画函数**支持更复杂的时间轴控制

::: info 🎓 学习建议
1. **掌握基础**: 重点学习 `calc()`、`var()`、`clamp()` 等常用函数
2. **实践应用**: 在项目中尝试使用新的 CSS 函数
3. **关注兼容性**: 了解各函数的浏览器支持情况
4. **组合使用**: 学会将多个函数组合使用以实现复杂效果
:::
