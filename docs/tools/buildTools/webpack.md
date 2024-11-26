## webpack

webpack 开箱即用，可以无需使用任何配置文件。然而，webpack 会假定项目的入口起点为 src/index.js，然后会在 dist/main.js 输出结果，并且在生产环境开启压缩和优化.

Webpack 有大量的配置项，利用 webpack-cli 的 init 命令，它可以根据你的项目需求快速生成 webpack 配置文件，它会在创建配置文件之前询问你几个问题。

```bash
$ npx webpack init

[webpack-cli] For using this command you need to install: '@webpack-cli/generators' package.
[webpack-cli] Would you like to install '@webpack-cli/generators' package? (That will run 'npm install -D @webpack-cli/generators') (Y/n)
devDependencies:
+ @webpack-cli/generators 2.5.0
? Which of the following JS solutions do you want to use? ES6
? Do you want to use webpack-dev-server? Yes
? Do you want to simplify the creation of HTML files for your bundle? Yes
? Do you want to add PWA support? No
? Which of the following CSS solutions do you want to use? CSS only
? Will you be using PostCSS in your project? Yes
? Do you want to extract CSS for every file? Only for Production
? Do you like to install prettier to format generated configuration? Yes
? Pick a package manager: pnpm
[webpack-cli] ℹ INFO  Initialising project...

devDependencies:
+ @babel/core 7.19.3
+ @babel/preset-env 7.19.4
+ autoprefixer 10.4.12
+ babel-loader 8.2.5
+ css-loader 6.7.1
+ html-webpack-plugin 5.5.0
+ mini-css-extract-plugin 2.6.1
+ postcss 8.4.17
+ postcss-loader 7.0.1
+ prettier 2.7.1
+ style-loader 3.3.1
+ webpack-dev-server 4.11.1
[webpack-cli] Project has been initialised with webpack!
```
## webpack常用配置选项
通常你的项目还需要继续扩展此能力，为此你可以在项目根目录下创建一个 webpack.config.js 文件，然后 webpack 会自动使用它

```js
// 用于删除/清理构建文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 把打包后的文件插入HTML文件中，可以传递变量给HTML
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 将 CSS 提取到单独的文件中。需要 webpack 5 才能工作
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 用于优化 \ 最小化 CSS 资源
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 拆分CSS文件，兼容IE9，最多支持4000个选择器）
const CSSSplitWebpackPlugin = require("css-split-webpack-plugin").default;
//引入CSS cssnano配置压缩选项
const cssnano = require("cssnano");
// 混合外部webpack配置文件：merge(baseConfig,currentConfig)
const merge = require("webpack-merge");

// 导出webpack配置文件
module.exports = {
  // 项目入口文件:String|Array|Object
  entry: {
    app: "/bin.js",
  },
  //构建目录和文件
  output: {
    filename: "[name].[hash:7].js",
    path: "/dist",
    clean: true, // 在生成文件之前清空 output 目录
  },
  // 打包模式 development|production(内部做更多优化，生产部署代码)
  mode: "development",
  // sourceMap配置选项：跟踪原始文件目录|行号|列号，方便调试
  devtool: "cheap-module-eval-source-map",
  //缓存生成的 webpack 模块和 chunk，来改善构建速度
  cache: {
    type: "filesystem",
    allowCollectingMemory: true,
  },
  //告知 webpack 为目标(target)指定一个环境
  target: "browserslist",
  //防止将某些 import 的包打包到 bundle 中，而是在运行时(runtime)再去从外部(jQuery全局变量中)获取这些扩展依赖(external dependencies)。
  externals: {
    //导入jquery在运行时再到全局变量jQuery中获取依赖
    jquery: "jQuery",
    // ./math 是模块，只需要模块下的 subtract 变量子集
    subtract: ["./math", "subtract"],
  },
  //更精确地控制 bundle 信息该怎么显示
  stats: "errors-only",
  // 在 loader 上下文 中暴露自定义值。
  loader: {
    answer: 42,
  },
  //配置如何展示性能提示 object | string
  performance: {
    //只给出 .js 文件的性能提示
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith(".js");
    },
    //打开/关闭提示 'error' | 'warning'| boolean
    hints: false,
    //根据单个资源体积(单位: bytes)，控制 webpack 何时生成性能提示。
    maxAssetSize: 100000,
  },
  // 开发服务器配置，交给webpack-dev-server
  devServer: {
    //public/ 目录当中的所有内容提供一个本地服务(serve)：
    static: {
      directory: path.join(__dirname, "public"),
    },
    contentBase: "/dist", //构建文件的目录
    publicPath: "",
    host: "localhost",
    port: 3000,
    open: true, // 自动打开浏览器
    compress: true, // 启用gzip压缩
    hot: true, // 启动热更新
    inline: true, // 启用内联模式
    // 为所有响应添加 headers：
    headers: {
      "X-Custom-Foo": "bar",
    },
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
      },
    },
  },
  // 模块化配置选项
  module: {
    // 配置如何解析MIME文件类型
    rules: [
      {
        test: /\.js[x]?$/, // jsx、js处理
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(le|c)ss$/, // scss、css处理
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)/, // 图片处理
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]_[hash].[ext]",
              outputPath: "images/",
              limit: 204800, // 小于200kb采用base64转码
            },
          },
        ],
      },
      {
        test: /\.(eot|woff2?|ttf)/, // 字体处理
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 5000, // 5kb限制
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  // 配置如何模块解析策略
  resolve: {
    extensions: [".jsx", ".js"],
    alias: {
      Utilities: path.resolve(__dirname, "src/utilities/"),
      Templates: path.resolve(__dirname, "src/templates/"),
    },
    fallback: {
      assert: require.resolve("assert"),
      buffer: require.resolve("buffer"),
      console: require.resolve("console-browserify"),
    },
    mainFields: ["browser", "module", "main"],
    mainFiles: ["index"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    exportsFields: ["exports", "myCompanyExports"],
    importsFields: ["browser", "module", "main"],
  },
  // 配置优化选项
  optimization: {
    chunkIds: "named",
    moduleIds: "named",
    //设置为 true 或 'multiple'，会为每个入口添加一个只含有 runtime 的额外 chunk
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`,
    },
    removeEmptyChunks: true,
    // process.env.NODE_ENV 设置为一个给定字符串.默认值取决于 mode
    nodeEnv: "production",
    mergeDuplicateChunks: false,
    //使用 TerserPlugin插件压缩 bundle。
    minimize: true,
    //提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)。
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
    // 配置代码分割策略
    splitChunks: {
      // 提取公共代码
      chunks: "all", //  async(动态加载模块)，initital（入口模块），all（全部模块入口和动态的）
      minSize: 3000, // 抽取出来的文件压缩前最小大小
      maxSize: 0, // 抽取出来的文件压缩前的最大大小
      minChunks: 1, // 被引用次数,默认为1
      maxAsyncRequests: 5, // 最大的按需(异步)加载次数，默认为 5；
      maxInitialRequests: 3, // 最大的初始化加载次数，默认为 3；
      automaticNameDelimiter: "~", // 抽取出来的文件的自动生成名字的分割符，默认为 ~；
      name: "vendor/vendor", // 抽取出的文件名，默认为true，表示自动生成文件名
      // 配置具体分割组
      cacheGroups: {
        // 缓存组
        common: {
          // 将node_modules模块被不同的chunk引入超过1次的抽取为common
          test: /[\\/]node_modules[\\/]/,
          name: "common",
          chunks: "initial",
          priority: 2,
          minChunks: 2,
        },
        default: {
          reuseExistingChunk: true, // 避免被重复打包分割
          filename: "common.js", // 其他公共函数打包成common.js
          priority: -20,
        },
      },
    },
  },
  // 引入的各种插件配置
  plugins: [
    new webpack.DefinePlugin({
      // 创建可在编译时配置的全局常量
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:7].css",
      chunkFilename: "[id].css",
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano, // //引入cssnano配置压缩选项
      cssProcessorPluginOptions: {
        preset: [
          "default",
          {
            discardComments: {
              // 移除注释
              removeAll: true,
            },
            normalizeUnicode: false,
          },
        ],
      },
      canPrint: true,
    }),
    new CSSSplitWebpackPlugin({
      size: 4000, // 超过4kb进行拆分
      filename: "[name]-[part].[ext]",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html", // 模板文件名
      template: "/index.html", // 模板文件源
      minify: {
        collapseWhitespace: true, // 压缩空格
        minifyCSS: true, // 压缩css
        minifyJS: true, // 压缩js
        removeComments: true, // 移除注释
        caseSensitive: true, // 去除大小写
        removeScriptTypeAttributes: true, // 移除script的type属性
        removeStyleLinkTypeAttributes: true, // 移除link的type属性
      },
    }),
  ],
};
```
