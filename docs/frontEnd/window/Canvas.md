## Canvas API

Canvas API 提供了一个通过 JavaScript 和 HTML 的 `<canvas> `元素来绘制图形的方式。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。

Canvas API 主要聚焦于 2D 图形。而同样使用 `<canvas>` 元素的 WebGL API 则用于绘制硬件加速的 2D 和 3D 图形。

```js
<canvas id="canvas" width="150" height="150">
  <img src="images/clock.png" width="150" height="150" alt="" />
</canvas>;

const canvas = document.getElementById("canvas");

if (canvas.getContext) {
  // 使用画布而且不需要透明，这个选项可以帮助浏览器进行内部优化。
  var ctx = canvas.getContext("2d", { alpha: false });
  var img = new Image(); // 创建 img 元素
  img.onload = function () {

    // 绘制图片：drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 。
    // 前4个是定义图像源的切片位置和大小，后 4 个则是定义切片的目标显示位置和大小。
    ctx.drawImage(img, 0, 0, 150, 150);
  };
  img.src = "myImage.png"; // 设置图片源地址
  // 控制图像的缩放行为
  ctx.imageSmoothingEnabled = false;

  // 设置图形的填充颜色。
  ctx.fillStyle = "green";
  //设置图形轮廓的颜色。rgb(255,165,0,0.5)
  ctx.strokeStyle = "#FFA500";

  //设置线条宽度。
  ctx.lineWidth = 20;
  //设置线条末端样式。butt,round,square
  ctx.lineCap = type;
  //设定线条与线条间接合处的样式。miter,round,bevel
  ctx.lineJoin = type;
  //限制当两条线相交时交接处最大长度
  ctx.miterLimit = 20;

  //返回一个包含当前虚线样式，长度为非负偶数的数组。
  ctx.getLineDash();
  //设置当前虚线样式。
  ctx.setLineDash(segments);
  ctx.setLineDash([4, 2]);
  //设置虚线样式的起始偏移量。
  ctx.lineDashOffset = 20;

  // 4 个参数，表示渐变的起点 (x1,y1) 与终点 (x2,y2)。
  let lineargradient = ctx.createLinearGradient(x1, y1, x2, y2);

  // 前三个定义一个以 (x1,y1) 为原点，半径为 r1 的圆，
  //后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。
  ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);

  // 给渐变上色
  lineargradient.addColorStop(0, "white");
  lineargradient.addColorStop(1, "black");

  // 绘制一个填充的矩形
  ctx.fillRect(10, 10, 150, 100);
  // 绘制一个矩形的边框
  ctx.strokeRect(x, y, width, height);
  // 清除指定矩形区域，让清除部分完全透明
  ctx.clearRect(x, y, width, height);

  //新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
  ctx.beginPath();
  //移动笔触位置
  ctx.moveTo(75, 50);
  //绘制一条从当前位置到指定 x 以及 y 位置的直线。
  ctx.lineTo(100, 75);
  ctx.lineTo(100, 25);

  //画一个以（x,y）为圆心的以 radius 为半径的圆弧（圆），从 startAngle 开始
  //到 endAngle 结束，按照 anticlockwise 给定的方向（默认为顺时针）来生成。
  arc(x, y, radius, startAngle, endAngle, anticlockwise);
  //根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点
  arcTo(x1, y1, x2, y2, radius);
  //绘制二次贝塞尔曲线，cp1x,cp1y 为一个控制点，x,y 为结束点。
  quadraticCurveTo(cp1x, cp1y, x, y);
  //绘制三次贝塞尔曲线，cp1x,cp1y为控制点一，cp2x,cp2y为控制点二，x,y为结束点。
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  // 绘制弧线
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
  //通过填充路径的内容区域生成实心的图形。
  ctx.fill();
  //通过线条来绘制图形轮廓。
  ctx.stroke();
  // 闭合路径之后图形绘制命令又重新指向到上下文中。
  ctx.closePath();

  //Path2D 对象：用来缓存或记录绘画命令，这样你将能快速地回顾路径
  /**
     * new Path2D(); // 空的 Path 对象
        new Path2D(path); // 克隆 Path 对象
        new Path2D(d); // 从 SVG 建立 Path 对象
     */

  //使用 SVG paths：这条路径将先移动到点 (M10 10) 然后再水平移动 80 个单位(h 80)，
  //然后下移 80 个单位 (v 80)，接着左移 80 个单位 (h -80)，再回到起点处 (z)。
  var p = new Path2D("M10 10 h 80 v 80 h -80 Z");

  var rectangle = new Path2D();
  rectangle.rect(10, 10, 50, 50);

  var circle = new Path2D();
  circle.moveTo(125, 35);
  circle.arc(100, 35, 25, 0, 2 * Math.PI);

  ctx.stroke(rectangle);
  ctx.fill(circle);

  // 图案样式：Image 可以是一个 Image 对象的引用，或者另一个 canvas 对象。
  //Type 必须是下面的字符串值之一：repeat，repeat-x，repeat-y 和 no-repeat。
  createPattern(image, type);

  //设定阴影在 X 延伸距离
  ctx.shadowOffsetX = 2;
  //设定阴影在 Y 轴的延伸距离
  ctx.shadowOffsetY = 2;
  //阴影的模糊距离
  ctx.shadowBlur = 2;
  // 用于设定阴影颜色效果，默认是全透明的黑色。
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

  //绘制文本的样式。这个字符串使用和 CSS font 属性相同的语法。默认的字体是 10px sans-serif。
  ctx.font = "20px Times New Roman";
  // 文本对齐选项。可选的值包括：start, end, left, right or center
  ctx.textAlign = "start";
  //基线对齐选项。可选的值包括：top, hanging, middle, alphabetic, ideographic, bottom
  ctx.textBaseline = "alphabetic";
  //文本方向。可能的值包括：ltr, rtl, inherit。默认值是 inherit。
  ctx.direction = "inherit";
  ctx.fillStyle = "Black";
  // 返回TextMetrics对象的文本宽度、所在像素，这些体现文本特性的属性。
  var text = ctx.measureText("foo"); // TextMetrics object
  text.width; // 16;
  // 在指定的 (x,y) 位置填充指定的文本，绘制的最大宽度是可选的。
  ctx.fillText("Sample String", 5, 30, 20);
  // 在指定的 (x,y) 位置绘制文本边框，绘制的最大宽度是可选的。
  ctx.strokeText("Sample String", 5, 30, 20);
  // 填充规则：nonzero,evenodd
  ctx.fill("evenodd");

  //保存画布 (canvas) 的所有状态
  ctx.save();
  // 恢复 save时状态
  ctx.restore();

  // 移动画布
  ctx.translate(x, y);
  // 旋转画布
  ctx.rotate(angle);
  // 缩放画布
  ctx.scale(x, y);
  // 变形矩阵
  ctx.transform(a, b, c, d, e, f);
  // 这个方法会将当前的变形矩阵重置为单位矩阵
  ctx.setTransform(a, b, c, d, e, f);
  // 重置当前变形为单位矩阵，等于：ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.resetTransform();

  //画新图形时采用的遮盖策略
  ctx.globalCompositeOperation = type;

  //将当前正在构建的路径转换为当前的裁剪路径。
  ctx.clip();

  // 创建特定尺寸的 ImageData 对象。所有像素被预设为透明黑。
  ctx.createImageData(width, height);
  ctx.createImageData(anotherImageData);
  // 获取画布像素数据的 ImageData 对象
  ctx.getImageData(left, top, width, height);
  // 写入像素数据
  ctx.putImageData(myImageData, dx, dy);

  // 保存图片:放到拥有download属性的超链接里的src
  ctx.toDataURL("image/png", quality);
  // 画布创建一个 Blob 对象。
  ctx.toBlob(callback, type, encoderOptions);
} else {
  // canvas-unsupported code here
}
```
