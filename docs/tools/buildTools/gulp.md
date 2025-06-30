---
title: 🌊 Gulp 自动化构建工具完全指南
description: 基于流的自动化构建工具 Gulp 的详细使用指南，包括任务配置、插件使用、项目构建等实践
outline: deep
---

# 🌊 Gulp 自动化构建工具完全指南

> Gulp 是基于流/Node.js 的自动化构建工具，主要使用管道传输机制，提供简洁高效的构建体验。

## 🎯 Gulp 简介

Gulp 是基于流/Node.js 的自动化构建工具，主要使用管道传输机制，常用命令：

- gulp.src 指定需要打包的文件的入口
- gulp.pipe 指定插件处理文件
- gulp.dest 指定打包之后文件的输出路径
- gulp.task 注册任务
- gulp.series 串联执行多个任务
- gulp.parallel 并行执行多个任务
- gulp.watch 监控文件变动，然后执行操作
- gulp.symlink 创建一个流（stream），用于连接 Vinyl 对象到文件系统。
- gulp.lastRun 检索在当前运行进程中成功完成任务的最后一次时间.当与 src() 组合时，通过跳过自上次成功完成任务以来没有更 改的文件，使增量构建能够加快执行时间
- gulp.tree 获取当前任务依赖关系树——在极少数情况下需要它。
- gulp.registry 将自定义注册表插入到任务系统中，从而提供共享任务或增强功能

## Gulp 常用插件：

- del 清空 build 目录
- gulp-babel ES6 转换为 ES5
- gulp-concat 合并文件
- gulp-uglify 压缩 js 文件
- gulp-rename 文件重命名
- gulp-htmlmin 压缩 js 文件
- gulp-less less 文件转换为 css 文件
- gulp-clean-css 压缩 css 文件
- gulp-imagemin 压缩图片
- gulp-rename 修改输入文件名
- gulp-if 根据条件处理文件

## Gulp 配置
根目录下创建一个名为 gulpfile.js 的文件，项目根目录执行gulp命令，会获取并执行task：
```js
//安装好 gulp 命令行工具 npm install --global gulp-cli
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify"); // 压缩js
const minifyCss = require("gulp-minify-css");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const clean = require("gulp-clean");
const pump = require("pump");
const connect = require("gulp-connect"); // gulp微服务

let dir = "./distLWebProject/src/"; // 目标路径

/** 压缩 主页html文件
 * 每个 gulp 任务（task）都是一个异步的 JavaScript 函数
 * callback 返回 streams、promises、event emitters、child processes, 或 observables
 * 当前callback返回stream
 */
gulp.task("html", function () {
  return gulp
    .src("./src/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true, //清除html文件的空格
        minifyJS: true, //压缩html文件的js代码
        minifyCSS: true, //压缩html文件的css代码
        removeComments: true, //清除html文件的注释
        removeSciptTypeAttributes: true, //清除所有script标签中的type="text/javascript"属性
        removeStyleLinkTypeAttributes: true, //清楚所有Link标签上的type属性
      })
    )
    .pipe(gulp.dest(dir)); //最后输出文件保存在dist文件根目录中
});

// 压缩子页面的html
gulp.task("page", function () {
  return gulp
    .src("./src/page/app/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        removeSciptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      })
    )
    .pipe(gulp.dest(dir + "page/app"));
});

// 压缩js文件
gulp.task("js", function () {
  return gulp
    .src("./src/page/js/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(dir + "page/js"));
});

//压缩css文件
gulp.task("css", function () {
  return gulp
    .src("./src/assets/css/**/*.css")
    .pipe(minifyCss())
    .pipe(gulp.dest(dir + "assets/css/"));
});

//压缩图片
gulp.task("img", function () {
  return gulp
    .src("./src/assets/img/**/*.*")
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest(dir + "assets/img"));
});

// 压缩config文件夹
gulp.task("config", function () {
  return gulp
    .src("./src/config/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(dir + "config"));
});

// 压缩router文件夹
gulp.task("router", function () {
  return gulp
    .src("./src/router/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(dir + "router"));
});

// 压缩sysPage文件夹
gulp.task("sysPage", function () {
  return gulp
    .src("./src/sysPage/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        removeSciptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      })
    )
    .pipe(gulp.dest(dir + "sysPage"));
});

// 压缩third文件夹
gulp.task("third", function () {
  return gulp.src("./src/third/**/*").pipe(gulp.dest(dir + "third"));
});

// 压缩utils文件夹
gulp.task("utils", function () {
  return gulp
    .src("./src/utils/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(dir + "utils"));
});

// 删除旧包
gulp.task("clean", function (cb) {
  pump([gulp.src(dir), clean()], cb);
});

// 使用connect启动一个Web服务器
gulp.task("serve", function () {
  connect.server({
    host: "localhost",
    port: 3000,
    open: "./index.html",
    root: "src/",
    livereload: true,
  });
});

// 默认命令
gulp.task(
  "default",
  // 串联执行多个命令
  gulp.series(
    "clean",
    "html",
    "page",
    "js",
    "css",
    "img",
    "config",
    "router",
    "sysPage",
    "third",
    "utils",
    done => {
      done();
    }
  )
);

// or  exports.build= gulp.series()
```
