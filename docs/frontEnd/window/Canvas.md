# Canvas API 详解

Canvas API 提供了一个通过 JavaScript 和 HTML 的 `<canvas>` 元素来绘制图形的方式。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。

Canvas API 主要聚焦于 2D 图形，而同样使用 `<canvas>` 元素的 WebGL API 则用于绘制硬件加速的 2D 和 3D 图形。

## 目录

1. [Canvas 基础](#1-canvas-基础)
2. [绘制上下文获取](#2-绘制上下文获取)
3. [基本绘制操作](#3-基本绘制操作)
4. [路径和形状](#4-路径和形状)
5. [样式和颜色](#5-样式和颜色)
6. [文本绘制](#6-文本绘制)
7. [图像处理](#7-图像处理)
8. [变换操作](#8-变换操作)
9. [状态管理](#9-状态管理)
10. [像素操作](#10-像素操作)
11. [实际应用示例](#11-实际应用示例)
12. [最佳实践](#12-最佳实践)
13. [参考资料](#13-参考资料)

## 1. Canvas 基础

### 1.1 HTML 结构

```html
<canvas id="canvas" width="800" height="600">
  <!-- 不支持Canvas时的后备内容 -->
  <img src="images/fallback.png" width="800" height="600" alt="Canvas 不被支持" />
</canvas>
```

### 1.2 基本设置

```javascript
const canvas = document.getElementById('canvas');

// 检查浏览器支持
if (!canvas.getContext) {
  console.error('Canvas 不被支持');
  return;
}

// 获取 2D 渲染上下文
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = 800;
canvas.height = 600;

// 高分辨率屏幕适配
const dpr = window.devicePixelRatio || 1;
canvas.width = 800 * dpr;
canvas.height = 600 * dpr;
canvas.style.width = '800px';
canvas.style.height = '600px';
ctx.scale(dpr, dpr);
```

## 2. 绘制上下文获取

### 2.1 上下文选项

```javascript
// 基本2D上下文
const ctx = canvas.getContext('2d');

// 带选项的上下文
const ctx = canvas.getContext('2d', {
  // 不需要透明度，可以优化性能
  alpha: false,
  // 指定是否对抗锯齿
  antialias: true,
  // 颜色空间
  colorSpace: 'srgb',
  // 是否希望用户代理减少延迟
  desynchronized: false
});
```

## 3. 基本绘制操作

### 3.1 矩形绘制

```javascript
// 绘制填充矩形
ctx.fillStyle = '#3498db';
ctx.fillRect(50, 50, 200, 100);

// 绘制矩形边框
ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 3;
ctx.strokeRect(300, 50, 200, 100);

// 清除矩形区域
ctx.clearRect(75, 75, 150, 50);

// 组合使用示例
function drawButton(x, y, width, height, text) {
  // 背景
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(x, y, width, height);
  
  // 边框
  ctx.strokeStyle = '#34495e';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  
  // 文本
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + width/2, y + height/2);
}

drawButton(100, 200, 120, 40, '按钮');
```

## 4. 路径和形状

### 4.1 基本路径操作

```javascript
// 开始新路径
ctx.beginPath();

// 移动到起点
ctx.moveTo(100, 100);

// 绘制直线
ctx.lineTo(200, 150);
ctx.lineTo(150, 200);

// 闭合路径
ctx.closePath();

// 填充或描边
ctx.fillStyle = '#9b59b6';
ctx.fill();
ctx.strokeStyle = '#8e44ad';
ctx.stroke();
```

### 4.2 圆形和弧形

```javascript
// 绘制完整圆形
ctx.beginPath();
ctx.arc(400, 300, 50, 0, Math.PI * 2);
ctx.fillStyle = '#e67e22';
ctx.fill();

// 绘制弧形
ctx.beginPath();
ctx.arc(500, 300, 50, 0, Math.PI, false); // 半圆
ctx.strokeStyle = '#d35400';
ctx.lineWidth = 5;
ctx.stroke();

// 扇形绘制
function drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color) {
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// 绘制饼图
const data = [30, 25, 20, 15, 10];
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
let currentAngle = 0;

data.forEach((value, index) => {
  const sliceAngle = (value / 100) * Math.PI * 2;
  drawPieSlice(300, 400, 80, currentAngle, currentAngle + sliceAngle, colors[index]);
  currentAngle += sliceAngle;
});
```

### 4.3 贝塞尔曲线

```javascript
// 二次贝塞尔曲线
ctx.beginPath();
ctx.moveTo(50, 300);
ctx.quadraticCurveTo(150, 200, 250, 300);
ctx.strokeStyle = '#2ecc71';
ctx.lineWidth = 3;
ctx.stroke();

// 三次贝塞尔曲线
ctx.beginPath();
ctx.moveTo(50, 400);
ctx.bezierCurveTo(100, 300, 200, 500, 250, 400);
ctx.strokeStyle = '#27ae60';
ctx.lineWidth = 3;
ctx.stroke();

// 平滑曲线绘制函数
function drawSmoothCurve(points) {
  if (points.length < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length - 1; i++) {
    const cp1x = (points[i].x + points[i-1].x) / 2;
    const cp1y = (points[i].y + points[i-1].y) / 2;
    const cp2x = (points[i].x + points[i+1].x) / 2;
    const cp2y = (points[i].y + points[i+1].y) / 2;
    
    ctx.quadraticCurveTo(points[i].x, points[i].y, cp2x, cp2y);
  }
  
  ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
  ctx.stroke();
}
```

### 4.4 Path2D 对象

```javascript
// 创建 Path2D 对象
const rectangle = new Path2D();
rectangle.rect(100, 100, 150, 100);

const circle = new Path2D();
circle.arc(200, 150, 40, 0, Math.PI * 2);

// 从 SVG 路径创建
const heartPath = new Path2D('M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z');

// 绘制路径
ctx.fillStyle = '#e74c3c';
ctx.fill(rectangle);
ctx.fillStyle = '#3498db';
ctx.fill(circle);

// 路径组合
const combinedPath = new Path2D();
combinedPath.addPath(rectangle);
combinedPath.addPath(circle);
ctx.strokeStyle = '#2c3e50';
ctx.stroke(combinedPath);
```

## 5. 样式和颜色

### 5.1 基本样式

```javascript
// 填充和描边颜色
ctx.fillStyle = '#3498db';        // 纯色
ctx.fillStyle = 'rgb(52, 152, 219)'; // RGB
ctx.fillStyle = 'rgba(52, 152, 219, 0.7)'; // RGBA
ctx.fillStyle = 'hsl(204, 70%, 53%)'; // HSL

ctx.strokeStyle = '#e74c3c';

// 线条样式
ctx.lineWidth = 5;
ctx.lineCap = 'round';    // 'butt', 'round', 'square'
ctx.lineJoin = 'round';   // 'miter', 'round', 'bevel'
ctx.miterLimit = 10;

// 虚线样式
ctx.setLineDash([10, 5]);  // 10px实线，5px空白
ctx.lineDashOffset = 0;

// 恢复实线
ctx.setLineDash([]);
```

### 5.2 渐变

```javascript
// 线性渐变
const linearGradient = ctx.createLinearGradient(0, 0, 200, 0);
linearGradient.addColorStop(0, '#ff6b6b');
linearGradient.addColorStop(0.5, '#feca57');
linearGradient.addColorStop(1, '#48dbfb');

ctx.fillStyle = linearGradient;
ctx.fillRect(50, 50, 200, 100);

// 径向渐变
const radialGradient = ctx.createRadialGradient(350, 100, 10, 350, 100, 80);
radialGradient.addColorStop(0, '#ff9ff3');
radialGradient.addColorStop(1, '#54a0ff');

ctx.fillStyle = radialGradient;
ctx.fillRect(300, 50, 100, 100);

// 圆锥渐变 (Canvas 2D Level 2)
if (ctx.createConicGradient) {
  const conicGradient = ctx.createConicGradient(0, 250, 250);
  conicGradient.addColorStop(0, '#ff6b6b');
  conicGradient.addColorStop(0.25, '#feca57');
  conicGradient.addColorStop(0.5, '#48dbfb');
  conicGradient.addColorStop(0.75, '#ff9ff3');
  conicGradient.addColorStop(1, '#ff6b6b');
  
  ctx.fillStyle = conicGradient;
  ctx.fillRect(200, 200, 100, 100);
}
```

### 5.3 图案和纹理

```javascript
// 创建图案
const img = new Image();
img.onload = function() {
  const pattern = ctx.createPattern(img, 'repeat');
  // 'repeat', 'repeat-x', 'repeat-y', 'no-repeat'
  
  ctx.fillStyle = pattern;
  ctx.fillRect(100, 300, 200, 100);
};
img.src = 'pattern.png';

// 使用 Canvas 作为图案
const patternCanvas = document.createElement('canvas');
patternCanvas.width = 20;
patternCanvas.height = 20;
const patternCtx = patternCanvas.getContext('2d');

// 绘制图案
patternCtx.fillStyle = '#ff6b6b';
patternCtx.fillRect(0, 0, 10, 10);
patternCtx.fillStyle = '#4ecdc4';
patternCtx.fillRect(10, 10, 10, 10);

const canvasPattern = ctx.createPattern(patternCanvas, 'repeat');
ctx.fillStyle = canvasPattern;
ctx.fillRect(350, 300, 200, 100);
```

### 5.4 阴影效果

```javascript
// 设置阴影
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;

ctx.fillStyle = '#3498db';
ctx.fillRect(100, 450, 150, 80);

// 清除阴影
ctx.shadowColor = 'transparent';
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;
```

## 6. 文本绘制

### 6.1 基本文本

```javascript
// 文本样式设置
ctx.font = '24px Arial, sans-serif';
ctx.fillStyle = '#2c3e50';
ctx.textAlign = 'start';  // 'start', 'end', 'left', 'right', 'center'
ctx.textBaseline = 'alphabetic'; // 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'
ctx.direction = 'ltr';    // 'ltr', 'rtl', 'inherit'

// 绘制填充文本
ctx.fillText('Hello Canvas!', 100, 100);

// 绘制描边文本
ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 2;
ctx.strokeText('Outlined Text', 100, 150);

// 限制最大宽度
ctx.fillText('Long text that will be compressed', 100, 200, 150);
```

### 6.2 文本测量和对齐

```javascript
// 测量文本尺寸
const text = 'Measure me!';
const metrics = ctx.measureText(text);

console.log('文本宽度:', metrics.width);
console.log('文本高度:', metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);

// 居中文本绘制函数
function drawCenteredText(text, x, y, maxWidth) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y, maxWidth);
}

// 多行文本绘制
function drawMultilineText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

// 使用示例
ctx.font = '16px Arial';
ctx.fillStyle = '#2c3e50';
drawMultilineText(
  '这是一段很长的文本，需要自动换行来适应指定的宽度限制。',
  50, 300, 200, 20
);
```

## 7. 图像处理

### 7.1 图像绘制

```javascript
const img = new Image();
img.onload = function() {
  // 基本图像绘制
  ctx.drawImage(img, 0, 0);
  
  // 指定尺寸
  ctx.drawImage(img, 200, 0, 150, 100);
  
  // 图像裁剪和缩放
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  ctx.drawImage(
    img,
    50, 50, 100, 100,  // 源图像的裁剪区域
    400, 0, 200, 150   // 目标绘制区域
  );
};
img.src = 'example.jpg';

// 图像平滑控制
ctx.imageSmoothingEnabled = false; // 禁用抗锯齿
ctx.imageSmoothingQuality = 'high'; // 'low', 'medium', 'high'
```

### 7.2 图像滤镜和效果

```javascript
// 基本图像滤镜实现
function applyGrayscaleFilter(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
    // data[i + 3] 是 alpha 通道，保持不变
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// 亮度调整
function adjustBrightness(canvas, brightness) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + brightness));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness));
  }
  
  ctx.putImageData(imageData, 0, 0);
}
```

## 8. 变换操作

### 8.1 基本变换

```javascript
// 保存当前状态
ctx.save();

// 平移
ctx.translate(100, 100);

// 旋转（弧度）
ctx.rotate(Math.PI / 4); // 45度

// 缩放
ctx.scale(1.5, 0.8);

// 绘制变换后的图形
ctx.fillStyle = '#e74c3c';
ctx.fillRect(-25, -25, 50, 50);

// 恢复状态
ctx.restore();
```

### 8.2 变换矩阵

```javascript
// 设置变换矩阵
// transform(a, b, c, d, e, f)
// a: 水平缩放, b: 水平倾斜, c: 垂直倾斜, d: 垂直缩放, e: 水平移动, f: 垂直移动
ctx.transform(1, 0.5, -0.5, 1, 100, 100);

// 重置变换矩阵
ctx.setTransform(1, 0, 0, 1, 0, 0);

// 应用新的变换矩阵（替换当前矩阵）
ctx.setTransform(2, 0, 0, 2, 50, 50);

// 重置为单位矩阵
ctx.resetTransform();
```

### 8.3 复杂变换示例

```javascript
// 3D 效果模拟
function draw3DBox(x, y, width, height, depth) {
  ctx.save();
  
  // 前面
  ctx.fillStyle = '#3498db';
  ctx.fillRect(x, y, width, height);
  
  // 顶面
  ctx.fillStyle = '#2980b9';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + depth, y - depth);
  ctx.lineTo(x + width + depth, y - depth);
  ctx.lineTo(x + width, y);
  ctx.closePath();
  ctx.fill();
  
  // 右面
  ctx.fillStyle = '#21618c';
  ctx.beginPath();
  ctx.moveTo(x + width, y);
  ctx.lineTo(x + width + depth, y - depth);
  ctx.lineTo(x + width + depth, y + height - depth);
  ctx.lineTo(x + width, y + height);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
}

draw3DBox(200, 200, 100, 80, 30);
```

## 9. 状态管理

### 9.1 状态保存和恢复

```javascript
// 保存当前绘制状态
ctx.save();

// 修改状态
ctx.fillStyle = '#e74c3c';
ctx.strokeStyle = '#c0392b';
ctx.lineWidth = 5;
ctx.translate(100, 100);
ctx.rotate(Math.PI / 6);

// 绘制内容
ctx.fillRect(0, 0, 100, 50);

// 恢复之前的状态
ctx.restore();

// 现在回到保存前的状态
ctx.fillRect(200, 200, 100, 50);
```

### 9.2 状态栈管理

```javascript
class CanvasStateManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.stateStack = [];
  }
  
  saveState() {
    this.ctx.save();
    this.stateStack.push({
      fillStyle: this.ctx.fillStyle,
      strokeStyle: this.ctx.strokeStyle,
      lineWidth: this.ctx.lineWidth,
      font: this.ctx.font,
      globalAlpha: this.ctx.globalAlpha
    });
  }
  
  restoreState() {
    if (this.stateStack.length > 0) {
      this.ctx.restore();
      this.stateStack.pop();
    }
  }
  
  getCurrentState() {
    return this.stateStack[this.stateStack.length - 1] || null;
  }
}

// 使用示例
const stateManager = new CanvasStateManager(ctx);
stateManager.saveState();
// 进行绘制操作...
stateManager.restoreState();
```

## 10. 像素操作

### 10.1 ImageData 操作

```javascript
// 创建 ImageData 对象
const imageData = ctx.createImageData(100, 100);

// 填充像素数据
for (let i = 0; i < imageData.data.length; i += 4) {
  imageData.data[i] = 255;     // Red
  imageData.data[i + 1] = 0;   // Green
  imageData.data[i + 2] = 0;   // Blue
  imageData.data[i + 3] = 255; // Alpha
}

// 绘制到画布
ctx.putImageData(imageData, 0, 0);

// 获取像素数据
const pixelData = ctx.getImageData(0, 0, 100, 100);

// 像素级图像处理
function invertColors(imageData) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];         // Red
    data[i + 1] = 255 - data[i + 1]; // Green
    data[i + 2] = 255 - data[i + 2]; // Blue
    // Alpha 保持不变
  }
  return imageData;
}
```

### 10.2 图像导出

```javascript
// 导出为 Data URL
const dataURL = canvas.toDataURL('image/png', 0.9);

// 导出为 Blob
canvas.toBlob(function(blob) {
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'canvas-image.png';
  link.href = url;
  link.click();
  
  // 清理对象 URL
  URL.revokeObjectURL(url);
}, 'image/png', 0.9);

// 高质量导出函数
function exportCanvasAsImage(canvas, filename, quality = 0.9) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(function(blob) {
      if (blob) {
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      } else {
        reject(new Error('导出失败'));
      }
    }, 'image/png', quality);
  });
}
```

## 11. 实际应用示例

### 11.1 简单绘图板

```javascript
class DrawingBoard {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    
    this.setupEventListeners();
    this.setupCanvas();
  }
  
  setupCanvas() {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#2c3e50';
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
  }
  
  startDrawing(e) {
    this.isDrawing = true;
    [this.lastX, this.lastY] = this.getMousePos(e);
  }
  
  draw(e) {
    if (!this.isDrawing) return;
    
    const [currentX, currentY] = this.getMousePos(e);
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
    
    [this.lastX, this.lastY] = [currentX, currentY];
  }
  
  stopDrawing() {
    this.isDrawing = false;
  }
  
  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return [
      e.clientX - rect.left,
      e.clientY - rect.top
    ];
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  setColor(color) {
    this.ctx.strokeStyle = color;
  }
  
  setBrushSize(size) {
    this.ctx.lineWidth = size;
  }
}

// 使用示例
const drawingBoard = new DrawingBoard(document.getElementById('canvas'));
```

### 11.2 数据可视化图表

```javascript
class SimpleChart {
  constructor(canvas, data) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = data;
    this.padding = 60;
    this.chartWidth = canvas.width - this.padding * 2;
    this.chartHeight = canvas.height - this.padding * 2;
  }
  
  drawBarChart() {
    const barWidth = this.chartWidth / this.data.length;
    const maxValue = Math.max(...this.data.map(d => d.value));
    
    this.data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * this.chartHeight;
      const x = this.padding + index * barWidth;
      const y = this.canvas.height - this.padding - barHeight;
      
      // 绘制柱子
      this.ctx.fillStyle = item.color || '#3498db';
      this.ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
      
      // 绘制标签
      this.ctx.fillStyle = '#2c3e50';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        item.label,
        x + barWidth / 2,
        this.canvas.height - this.padding + 20
      );
      
      // 绘制数值
      this.ctx.fillText(
        item.value.toString(),
        x + barWidth / 2,
        y - 5
      );
    });
    
    this.drawAxes();
  }
  
  drawLineChart() {
    if (this.data.length < 2) return;
    
    const stepX = this.chartWidth / (this.data.length - 1);
    const maxValue = Math.max(...this.data.map(d => d.value));
    const minValue = Math.min(...this.data.map(d => d.value));
    const valueRange = maxValue - minValue;
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#e74c3c';
    this.ctx.lineWidth = 3;
    
    this.data.forEach((item, index) => {
      const x = this.padding + index * stepX;
      const y = this.canvas.height - this.padding - 
                ((item.value - minValue) / valueRange) * this.chartHeight;
      
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      
      // 绘制数据点
      this.ctx.save();
      this.ctx.fillStyle = '#c0392b';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
    
    this.ctx.stroke();
    this.drawAxes();
  }
  
  drawAxes() {
    this.ctx.strokeStyle = '#7f8c8d';
    this.ctx.lineWidth = 1;
    
    // Y轴
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding, this.padding);
    this.ctx.lineTo(this.padding, this.canvas.height - this.padding);
    this.ctx.stroke();
    
    // X轴
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding, this.canvas.height - this.padding);
    this.ctx.lineTo(this.canvas.width - this.padding, this.canvas.height - this.padding);
    this.ctx.stroke();
  }
}

// 使用示例
const chartData = [
  { label: '一月', value: 120, color: '#ff6b6b' },
  { label: '二月', value: 150, color: '#4ecdc4' },
  { label: '三月', value: 80, color: '#45b7d1' },
  { label: '四月', value: 200, color: '#96ceb4' },
  { label: '五月', value: 170, color: '#ffeaa7' }
];

const chart = new SimpleChart(document.getElementById('chart-canvas'), chartData);
chart.drawBarChart();
```

### 11.3 粒子系统

```javascript
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
  }
  
  createParticle(x, y) {
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.005,
      size: Math.random() * 5 + 2,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
  }
  
  addParticles(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(x, y));
    }
  }
  
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 更新生命值
      particle.life -= particle.decay;
      
      // 添加重力效果
      particle.vy += 0.1;
      
      // 移除死亡的粒子
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.drawParticles();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  start() {
    this.animate();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// 使用示例
const particleSystem = new ParticleSystem(document.getElementById('particle-canvas'));

// 鼠标点击创建粒子
document.getElementById('particle-canvas').addEventListener('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  particleSystem.addParticles(x, y, 20);
});

particleSystem.start();
```

## 12. 最佳实践

### 12.1 性能优化

```javascript
// 1. 减少绘制调用
// ❌ 低效的做法
for (let i = 0; i < 1000; i++) {
  ctx.fillRect(i % 10 * 20, Math.floor(i / 10) * 20, 18, 18);
}

// ✅ 高效的做法
ctx.beginPath();
for (let i = 0; i < 1000; i++) {
  ctx.rect(i % 10 * 20, Math.floor(i / 10) * 20, 18, 18);
}
ctx.fill();

// 2. 使用离屏 Canvas 缓存复杂图形
class OffscreenCache {
  constructor() {
    this.cache = new Map();
  }
  
  getOrCreate(key, width, height, drawFunction) {
    if (!this.cache.has(key)) {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const offscreenCtx = offscreenCanvas.getContext('2d');
      
      drawFunction(offscreenCtx);
      this.cache.set(key, offscreenCanvas);
    }
    
    return this.cache.get(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

// 3. 避免不必要的状态更改
class OptimizedRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.currentState = {};
  }
  
  setFillStyle(style) {
    if (this.currentState.fillStyle !== style) {
      this.ctx.fillStyle = style;
      this.currentState.fillStyle = style;
    }
  }
  
  setStrokeStyle(style) {
    if (this.currentState.strokeStyle !== style) {
      this.ctx.strokeStyle = style;
      this.currentState.strokeStyle = style;
    }
  }
}
```

### 12.2 响应式设计

```javascript
class ResponsiveCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    
    this.setupResponsive();
    window.addEventListener('resize', () => this.handleResize());
  }
  
  setupResponsive() {
    // 获取CSS尺寸
    const rect = this.canvas.getBoundingClientRect();
    
    // 设置实际尺寸为CSS尺寸乘以设备像素比
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    
    // 缩放上下文以匹配设备像素比
    this.ctx.scale(this.dpr, this.dpr);
    
    // 设置CSS尺寸
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }
  
  handleResize() {
    this.setupResponsive();
    this.redraw();
  }
  
  redraw() {
    // 重新绘制canvas内容
  }
}
```

### 12.3 错误处理和降级

```javascript
class SafeCanvasRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = null;
    this.isSupported = false;
    
    this.init();
  }
  
  init() {
    if (!this.canvas) {
      console.error('Canvas 元素未找到');
      return;
    }
    
    if (!this.canvas.getContext) {
      this.showFallback();
      return;
    }
    
    try {
      this.ctx = this.canvas.getContext('2d');
      this.isSupported = true;
    } catch (error) {
      console.error('Canvas 上下文获取失败:', error);
      this.showFallback();
    }
  }
  
  showFallback() {
    const fallback = document.createElement('div');
    fallback.innerHTML = '您的浏览器不支持 Canvas，请升级浏览器。';
    fallback.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ecf0f1;
      color: #2c3e50;
      font-family: Arial, sans-serif;
    `;
    
    this.canvas.parentNode.replaceChild(fallback, this.canvas);
  }
  
  safeDrawOperation(drawFunction) {
    if (!this.isSupported) return;
    
    try {
      drawFunction(this.ctx);
    } catch (error) {
      console.error('绘制操作失败:', error);
    }
  }
}
```

## 13. 参考资料

- [MDN - Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [MDN - CanvasRenderingContext2D](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D)
- [HTML5 Canvas Deep Dive](https://joshondesign.com/p/books/canvasdeepdive/toc.html)
- [Canvas API 规范](https://html.spec.whatwg.org/multipage/canvas.html)
- [WebGL 规范](https://www.khronos.org/webgl/)
- [Canvas 最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Can I Use - Canvas](https://caniuse.com/?search=canvas)
