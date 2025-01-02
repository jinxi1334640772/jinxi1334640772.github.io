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

## webpack 配置选项

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

## webpack-chunksMap-plugin

**插件介绍**：对 webpack 配置，使页面路由打包出来的文件，根据路由 path 进行命名。页面文件打包构建后，会生成 js、css、map 文件，可以过滤掉 map 文件，生成路由 path 和 js、css 文件路径的映射关系。最后组装成 script 脚本，注入 HTML 文件里。页面加载后，就可以根据页面的路由 path，找出对应要加载的 js、css 资源。如果知道用户将要去什么页面，就可以预加载对应页面资源了。如果用户要去的是第三方页面，会进行 DNS 预解析流程。

```js
// 引入node crypto加解密模块，用于完整性校验
const crypto = require("crypto");
const Buffer = require("buffer");
const path = require("path");

/** 插件默认配置对象
 * @pluginName 自定义插件名称
 * @indectName 输出的映射资源注入到window的变量名称，或者映射文件名字
 * @chunksMapFileFun 自定义输出的映射资源文件的名称
 *   contentHash 用于完整性校验，内容变动都会改变，更好利用缓存
 * @chunkNameFilter chunk输出过滤器：哪些chunk需要生成映射
 *    chunkName 参数为chunk.name
 *    @return boolean true时输出
 * @chunkKeyFun 自定义输出的映射文件中的json对象里的key
 *    chunkName
 *    @return chunkName
 * @injectToHtmlFilter 要注入到的HTML文件的，HTML文件资源过滤器
 *    assetName 打包生成的资源字符串，默认index.html文件
 *    @return boolean true时注入
 * @assetsFilter assets资源输出过滤器
 *    assetUrl
 *    @return boolean true时输出
 * @assetToChunkRegs 把指定资源，映射到指定chunk中，可配置多个筛选项
 *    chunkNameFilter 指定chunkname过滤器
 *    assetNameFilter 指定asset资源过滤器
 *
 * 把包含link-layout的资源放入，包含link的chunkname对应的映射中
 * [{
    chunkNameFilter:(chunkName)=>/link/.test(chunkName),
    assetNameFilter:(assetUrl)=>/link-layout/.test(assetUrl)}]
 */

const defaultOptions = {
  pluginName: "webpack-chunksMap-plugin",
  injectName: "_chunks_map",
  chunksMapFileFun: contentHash => `${this.injectName}.${contentHash}.js`,
  // chunkNameFilter: chunkName => !!chunkName,
  chunkNameFilter: chunkName => chunkName.includes("_"),
  chunkKeyFun: chunkName => chunkName,
  injectToHtmlFilter: assetName => /^index\.html?$/i.test(assetName),
  assetsFilter: assetUrl => {
    // 默认过滤掉chunk对应的映射中的map文件
    return !["map"].includes(path.extname(assetUrl));
  },
  // [{ chunkNameFilter:(chunkName)=>true,assetNameFilter:(assetUrl)=>true}]
  assetToChunkRegs: [],
};

/**
 * 插件定义，使用类时，必须要有apply方法
 */
class ChunksMapPlugin {
  constructor(options = {}) {
    // 覆盖默认options
    this.options = Object.assign({}, defaultOptions, options);
  }
  // webpack调用apply方法，传入webpack compiler编译器实例
  apply(compiler) {
    const _this = this;

    /** 即将输入生成的文件时，触发emit钩子，tapAsync类型
     * @pluginName 插件名称
     * @callpack 回调函数
     *    complication 保存着本次编译的资源、各种方法
     *    next 处理完自身逻辑，需要调用next()，webpack继续执行
     */
    compiler.hooks.emit.tapAsync(_this.options.pluginName, function (compilation, next) {
      // 要输出的资源资源对象，类似：
      // { _home_page:['_home_page.232.js','_home_page.232.css'] }
      const chunksMap = {};

      // 根据assetNameFilter函数筛选出特定资源，放入该规则的assets属性
      const assetToChunkRegs = _this.options.assetToChunkRegs.map(regObject => {
        // 根据assets Key即资源名称，过滤出需要映射的chunk依赖的资源
        const assets = Object.keys(compilation.assets).filter(item => regObject.assetNameFilter(item));
        return Object.assign({}, regObject, { assets });
      });

      /** compilation
       * @chunks 存放所有打包生成的chunk代码块
       *    files 由chunk生成的文件，一般拆分成js,css,map文件,修改该数组对打包结果没有影响
       *    modulesIterable 依赖模块迭代器
       * @assets 存放即将要输入的资源对象
       */
      compilation.chunks.forEach(function (chunk) {
        // 当前chunk对应的资源数组,包含由chunk生成assets,以及chunk的依赖模块生成的assets
        let files = [];

        // 筛选出路由对应的chunk，生成的文件
        if (_this.options.chunkNameFilter(chunk.name)) {
          // 如果当前chunk需要生成映射

          // 保存由chunk生成assets文件
          files = chunk.files || [];

          for (const regObject of assetToChunkRegs) {
            // 找出满足chunkNameFilter规则的资源也加入映射
            if (regObject.chunkNameFilter(chunk.name)) {
              files = files.concat(regObject.assets);
            }
          }

          /**
           * module.buildInfo 该模块打包信息
           * buildInfo.assets 打包后生成的assets对象
           */
          for (const module of chunk.modulesIterable) {
            if (module.buildInfo && module.buildInfo.assets) {
              // 把该chunk的依赖模块资源也加入映射中
              files = files.concat(Object.keys(module.buildInfo.assets));
            }
          }

          // chunk名称作为映射对象的每个key
          const chunkKey = _this.options.chunkKeyFun(chunk.name);

          // 保存chunk和chunk筛选后的对应资源的映射
          chunksMap[chunkKey] = files.filter(function (url) {
            return _this.options.assetsFilter(url);
          });
        }
      });

      // 把生成的资源映射对象转成JSON字符串
      const chunksMapString = JSON.stringify(chunksMap);

      // 根据资源映射字符串生成内容摘要
      const contentHash = _this.generateHashByContent(chunksMapString);

      // 拼接JavaScript脚本字符串，把资源映射，放入全局变量中
      const configJs = "\n(typeof window=='undefined'?global:window)." + _this.options.injectName + "=" + chunksMapString + ";\n";

      // 获取资源映射的内容要输出的文件名字
      const outputFileName = _this.options.chunksMapFileFun(contentHash);

      // 手动添加要输出映射文件，在assets中用对象表示
      compilation.assets[outputFileName] = {
        name: outputFileName,
        source: () => configJs,
        size: () => {
          return Buffer.byteLength(configJs, "utf8");
        },
      };

      _this.addToHtmlFun(compilation, _this.options.injectToHtmlFilter, outputFileName);
      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
      next();
    });
  }

  /**
   * 根据内容生成 contenthash，如果内容没变生成的contenthash是一样的
   * 修复内容改变，继续使用旧缓存的问题，此时需要获取最新的映射资源
   */
  generateHashByContent(content) {
    if (typeof content !== "string" && !Buffer.isBuffer(content)) {
      throw new TypeError("Expected a Buffer or string");
    }

    /** 使用md5（sha1，sha256默认，sha512）算法生成一个hash实例
     * hash.update('要加密的字符串')，返回hash实例
     * hash.digest('hex) 生成内容摘要。默认是2进制，转成16进制
     * 调用String.slice()截取前十位
     */
    return crypto.createHash("md5").update(content).digest("hex").slice(0, 10);
  }

  // 直接注入脚本代码到HTML文件
  addToHtmlFun(compilation, injectToHtmlFilter, outputFileName) {
    // 从将要输出的资源中，找出index.html文件
    const indexHtmls = Object.keys(compilation.assets).filter(assetName => {
      return injectToHtmlFilter(assetName);
    });

    indexHtmls.forEach(htmlName => {
      const htmlSource = compilation.assets[htmlName];
      // 获取index.html文件的内容
      const htmlContent = htmlSource.source();

      if (htmlContent) {
        // 把生成的映射文件，添加进index.html文件的 body元素最后
        htmlContent = htmlContent.replace(/\<\/body\>/i, m => `<script src=${outputFileName} async></script>${m}`);
      }

      // 把修改后的html，手动添加到要输入文件中
      delete compilation.assets[htmlName];
      compilation.assets[htmlName] = {
        name: htmlName,
        source: () => htmlContent,
        size: () => {
          return Buffer.byteLength(htmlContent, "utf8");
        },
      };
    });
  }
}
module.exports = ChunksMapPlugin;
```

## 插件配套的工具

```js
const path = require("path");

// 每个子路由对象route，大概这个样子
const route = {
  name: "AddNewCard",
  path: "addNewCard",
  meta: { layout: "contentBar" },
  component: () => import("@/pages/newCard"),
  //用于生成webpack分包配置选项的test属性
  chunkPath: "/src/pages/newCard",
};

// 每个webpack分包配置对象chunk，大概这个样子
const chunk = {
  name: "_home_addnewcard",
  priority: 25,
  test: "[\\\\/]src[\\\\/]pages[\\\\/]newCard",
  enforce: true,
  chunks: "all",
};

/** 配置生成chunk的规则
 * @basePriority 生成路由chunk的基础优先级，路由chunk依次++
 * @pathSeparator  把页面路由path的分隔符‘/’替换为其他标识符，
 *  用于根据路由path，生成chunk.name，例如： /cashier/home -> _cashier_home
 * @chunkPathKey 每个路由配置route中的一个字段，用于生成chunk的匹配规则
 * @chunkConfigFun 自定义webpack的分包配置规则，会把匹配到的文件打包进
 *  同一个chunk里。name和basePriority不可自定义
 */
const chunkOptions = {
  basePriority: 20,
  pathSeparator: "_",
  chunkPathKey: "chunkPath",
  chunkConfigFun: (route, chunkPathKey) => ({
    test: new RegExp(route[chunkPathKey].replace(/[/]/g, "[\\\\/]")),
    // test:'[\\\\/]src[\\\\/]pages[\\\\/]newCard',
    enforce: true,
    chunks: "all",
  }),
};

/** 收银台默认默认配置对象
 * @indectName 把映射数据注入window中全局变量名称，用户获取映射资源
 * @isHashMode 路由是否hash模式，用于判断如何从url中拿到路由path
 * @extraInitUrls 额外需要进行dns预解析或资源预加载的url数组（非编译时）
 * @isCurrentDomainFun 用于判断url是否和项目当前域名相同的函数。
 *   相同域名进行资源预加载，不同域名进行DNS预解析流程
 * @chunkOptions  配置生成chunk的规则
 * @routes 需要生成映射资源的页面路由数组
 */
const defaultOptions = {
  injectName: "_chunks_map",
  isHashMode: true,
  extraInitUrls: [],
  isCurrentDomainFun: url => true,
  chunkOptions: chunkOptions,
  routes: [], // 页面路由数组
};

/** 定义ChunksMapUtils Webpack插件，可以定义为函数或者类
 *
 */
class ChunksMapUtils {
  /**
   * 该插件的构造函数，获取自定义的配置对象，可以覆盖默认配置
   */
  constructor(options = {}) {
    // 合并后的总的配置对象
    this.options = Object.assign({}, defaultOptions, options);

    // 用于保存获取到的映射文件的数据
    this.chunksMap = (window && window[this.options.injectName]) || {};

    // 保存已添加到dom的url数组，防止重复资源预加载或者DNS预解析
    this.linkUrls = [];

    // 获取由路由生成的webpack分包配置splitChunks：cacheGroup配置选项
    // 用于后续根据path映射chunkname，再映射到生成的资源
    this.routesChunks = ChunksMapUtils.generateRouterChunks(this.options.chunkOptions);

    // 获取HTML head元素，用于后续资源预加载和DNS预解析
    this.head = window && window.document.head;

    // 需要额外往HTML中注入资源url数组（要放在最后）
    this.injectLinksToDom(this.options.extraInitUrls);
  }

  // 当前插件为单例模式
  static getInstance(options) {
    if (!this.instance) {
      this.instance = new ChunksMapUtils(options);
    }
    return this.instance;
  }

  /** 创建link标签，有后缀资源预加载，否则dns预解析
   * @href 需要进行资源加载或者DNS预解析的URL
   * @return <HTMLLinkElement> | undefined
   */
  getLinkElement(href) {
    // 已添加过的url,不在重复添加
    if (this.linkUrls.includes(href)) return;
    const ext = path.extname(href);

    const link = document.createElement("link");

    const map = new Map([
      ["js", "script"],
      ["css", "style"],
      ["other", "image"],
    ]);

    if (this.options.isCurrentDomainFun(href)) {
      if (ext) {
        // 是当前域名且存在文件后缀，则根据资源类型，映射不同as属性
        link.rel = "prefetch";
        link.as = map.get(ext) || map.get("other");
      }
    } else {
      // 不是当前域名进行DNS预解析
      link.rel = "dns-prefetch";
    }
    link.href = href;

    // 加入缓存防止重复添加进DOM
    this.linkUrls.push(href);
    return link;
  }

  /** 获取url上的pathname，例如：/cashier/result
   * hash:'https://cashier-n.payermax.com/index.html#/cashier/result'
   * history:'https://cashier-n.payermax.com/cashier/result'
   * @href 获取pathname来源的url
   * @return 返回url 的 pathname。例如：/cashier/result
   */
  getPathFromUrl(url) {
    if (!url) return "";

    // 把url解析成URL对象
    const urlObj = new URL(url);

    // hash模式直接返回pathname
    if (!this.options.isHashMode) return urlObj.pathname;

    const hash = urlObj.hash;
    if (!hash) return "";
    const index = hash.indexOf("?");
    // 截取hash中‘#’之后‘？’之前的部分
    if (index > 0) return hash.slice(1, index);
    return hash.slice(1);
  }

  /** 根据pathname获取打包后对应的chunkname，它能映射资源名称
   * @pathname
   * @return chunkname
   */
  getChunkNameByPath(pathname) {
    if (!pathname || typeof pathname !== "string") return "";
    const pathnameLower = pathname.toLowerCase();
    // 从webpack 分包配置选项中，找出当前路由的chunk配置
    const chunk = this.routesChunks[pathnameLower];
    return chunk?.name || "";
  }

  /** 根据URL数组，生成对应的link标签，注入到HTML文档中
   * @urlList url组成的数组
   * @return undefined
   */
  injectLinksToDom(urlList) {
    // 验证安全边界
    if (!urlList || !Array.isArray(urlList) || urlList.length === 0 || !window) return;

    try {
      // 构建documentFragment文档片段对象
      const fragment = document.createDocumentFragment();

      urlList.forEach(url => {
        if (!this.options.isCurrentDomainFun(url)) {
          // 第三方域名，进行dns预解析,
          let linkElement = this.getLinkElement(url);
          return fragment.appendChild(linkElement);
        }
        // 当前域名，进行资源预加载。首选获取url对应的path
        const path = this.getPathFromUrl(url);

        // 获取path对应的，打包后的资源映射的key
        const chunkName = this.getChunkNameByPath(path);

        // 获取path对应的，打包后的资源数组，并遍历
        (this.chunksMap[chunkName] || []).forEach(item => {
          //如果没有被添加过dom，返回构建好的link元素
          let linkElement = this.getLinkElement(item);

          // 统一添加到documentFragment片段，减少回流重绘次数
          linkElement && fragment.appendChild(linkElement);
        });
      });

      // 将documentFragment片段添加进DOM里
      // HTML将自动进行资源预加载或者DNS预解析
      this.head && this.head.append(fragment);
    } catch (error) {
      console.warn("dns预解析和资源预加载失败:", error);
    }
  }

  /** 构建要传给webpack的分包：splitChunks配置选项
   * @options chunkOptions对象
   * @return splitChunks分包配置对象
   */
  static generateRouterChunks(options = this.options.chunkOptions) {
    const chunks = {};

    // 构建每个chunk分组，并保存到chunks的routeFullPath属性
    const setChunks = (route, parentPath) => {
      // 子路由不存在chunkPathKey，默认是chunkPath，则不会映射打包后的资源
      if (!route?.[options.chunkPathKey]) return;

      // 拼接当前route的完整pathname
      const routeFullPath = `${parentPath}/${route.path}`.toLowerCase();

      // 替换完整pathname的分隔符，用于打包后生成的chunk名，会转成文件名
      // 拼接前 /home/page，拼接后 _home_page。因为‘/’是个敏感字符
      const chunkname = routeFullPath.replace(/[\\/]/g, options.pathSeparator);

      // chunks根据routeFullPath分组，优先级priority递增
      chunks[routeFullPath] = Object.assign({}, options.chunkConfigFun(route, options.chunkPathKey), { name: chunkname, priority: ++options.basePriority });
    };

    const parseRoutes = (routes, parentPath) => {
      for (let route of routes) {
        // 构建当前route对应的webpack分组配置chunk选项
        setChunks(route, parentPath);

        if (route.children?.length) {
          // 根据父级path和当前path，拼接完整的path
          const routeFullPath = parentPath ? `${parentPath}/${route.path}` : route.path;

          //递归子路由，配置每个路由的分组配置选项
          parseRoutes(route.children, routeFullPath);
        }
      }
    };

    // 传入要构建页面和资源映射关系的routes数组
    parseRoutes(this.routes);
    return chunks;
  }
}

module.exports = ChunksMapUtils;
```
