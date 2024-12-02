## Rollup 简介

Rollup 是一个用于 JavaScript 的模块打包工具，它将小的代码片段编译成更大、更复杂的代码，例如库或应用程序。它使用 JavaScript 的 ES6 版本中包含的新标准化代码模块格式，而不是以前的 CommonJS 和 AMD 等特殊解决方案。ES 模块允许你自由无缝地组合你最喜欢的库中最有用的个别函数。这在未来将在所有场景原生支持，但 Rollup 让你今天就可以开始这样做。

Vite 目前打包生产环境代码，用的就是 Rollup。全局安装 rollup：

`npm install --global rollup`

安装完成后，通常会在 package.json 中添加一个单一的构建脚本，为所有贡献者提供方便的命令。例如

```json
{
  "scripts": {
    "build": "rollup --config rollup.config.js"
  }
}
```

## Rollup 配置文件

rollup.config.js：

```js
//对于 Node 18.20+，你可以使用导入断言
import pkg from './package.json' with { type: 'json' };
// ES Module不能使用__dirname。fileURLToPath代替
import { fileURLToPath } from 'node:url';
// 用于类型提示
import type { RollupOptions } from 'rollup';

// Rollup不会自动从node_modules中寻找依赖项，需要这个插件的支持
import resolve from '@rollup/plugin-node-resolve';
// 使支持最新js语法
import babel from '@rollup/plugin-babel';
// 压缩js插件
import terser from '@rollup/plugin-terser';
export default commandLineArgs => {
	const inputBase = commandLineArgs.input || 'main.js';

	// 这会使 Rollup 忽略 CLI 参数
	delete commandLineArgs.input;
	return {
    // 核心输入选项

    // 指出哪些模块应该视为外部模块。
    external: [fileURLToPath(new URL('src/some-file.js', import.meta.url)),'lodash',(id)=>/lodash/.test(id)],
    // 指定项目入口，{a: 'src/main-a.js'}：把每个匹配的文件作为入口
    input: Object.fromEntries(
      globSync('src/**/*.js').map(file => [
        // 这里将删除 `src/` 以及每个文件的扩展名。
        // 因此，例如 src/nested/foo.js 会变成 nested/foo
        path.relative(
          'src',
          file.slice(0, file.length - path.extname(file).length)
        ),
        // 这里可以将相对路径扩展为绝对路径，例如
        // src/nested/foo 会变成 /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url))
      ])
    ),
    // 引入插件
    plugins:[resolve(),babel({ babelHelpers: 'bundled' }],
    jsx: {  // jsx配置
      preset: 'react',
      importSource: 'preact',
      factory: 'h'
    },

    // 进阶输入选项
    cache:true, // 缓存编译的结果，只会对变化的模块重新编译
    logLevel:'info'|'silent',//日志等级
    //外部依赖的绝对路径是否应该在输出中转换为相对路径
    makeAbsoluteExternalsRelative,
    maxParallelFileOps,//并发数
    onLog,//一个用于截取日志信息的函数
    onwarn,//用于拦截警告信息
    preserveEntrySignatures,
    strictDeprecations,

    // 危险区域
    context,
    moduleContext,
    preserveSymlinks,
    shimMissingExports,
    treeshake,

    // 实验性
    experimentalCacheExpiry,
    experimentalLogSideEffects,
    experimentalMinChunkSize,
    perf,

    // 配置文件输出。必需（可以是数组，用于描述多个输出）
    output: {
      // 核心输出选项
      dir, // 输出目录
      file, // 输出的文件，只有一个chunk时可用
      format, // 生成bundle的格式amd|cjs|es|iife|umd|system
      //用于在 umd / iife bundle 中，使用 id: variableName 键值对指定外部依赖
      globals: {
        jquery: '$'
      },

      name:'jQuery',// 输出格式为 iife / umd 的 bundle 的全局变量名
      plugins:[terser()],//指定输出插件

      // 进阶输出选项

      // 自定义构建结果中的静态资源名称
      assetFileNames:"assets/[name]-[hash][extname]",
      //在 bundle 前添加一个字符串
      banner,
      // 在 bundle 后添加一个字符串
      footer,
      //对代码分割中产生的 chunk 自定义命名，其值也可以是一个函数
      chunkFileNames:"[name]-[hash].js",
      compact,//用于压缩 Rollup 产生的额外代码
      dynamicImportInCjs,
      entryFileNames,//用于指定 chunks 的入口文件模式
      extend,//指定是否扩展 umd 或 iife 格式中 name 选项定义的全局变量
      externalImportAttributes,//是否在输出中为外部引入添加导入属性，
      generatedCode:'es5'|'es2015'|{},//使用哪些语言特性
      hashCharacters,
      hoistTransitiveImports,
      importAttributesKey,
      inlineDynamicImports,//内联动态引入，而不是用于创建包含新 chunk 的独立 bundle
      interop,
      intro,
      //手动进行代码分割
      manualChunks:{
        lodash: ['lodash']
      },
      //内部变量导出为单个字母的变量，以便更好地压缩代码
      minifyInternalExports,
      outro,
      // 将外部依赖 ID 映射为路径.路径会取代模块 ID，在生成的 bundle 中使用
      paths:{
        d3: 'https://d3js.org/d3.v4.min'
      },
      //该选项将使用原始模块名作为文件名，为所有模块创建单独的 chunk，而不是创建尽可能少的 chunk
      preserveModules:false,
      preserveModulesRoot,
      sourcemap,
      sourcemapBaseUrl,
      sourcemapDebugIds,
      sourcemapExcludeSources,
      sourcemapFile,
      sourcemapFileNames,
      sourcemapIgnoreList,
      sourcemapPathTransform,
      validate,

      // 危险区域
      amd,
      esModule,
      exports,
      externalLiveBindings,
      freeze,
      indent,
      noConflict,
      sanitizeFileName,
      strict,
      systemNullSetters,

      // 实验性
      experimentalMinChunkSize
    },

    watch: {
      buildDelay,
      chokidar,
      clearScreen,
      exclude,
      include,
      skipWrite
    }
	}:RollupOptions
};
```

## 编写 Rollup 插件

参考：https://cn.rollupjs.org/plugin-development/

## JavaScript API

Rollup 提供了一个可从 Node.js 使用的 JavaScript API。你很少需要使用它，除非你正在扩展 Rollup 本身或者需要编程式地打包等特殊用途，否则应该使用命令行 API。

```js
import { rollup } from 'rollup';

const inputOptions = {
	// 核心输入选项
	external,
	input, // 有条件地需要
	plugins,

	// 进阶输入选项
	cache,
	logLevel,
	makeAbsoluteExternalsRelative,
	maxParallelFileOps,
	onLog,
	onwarn,
	preserveEntrySignatures,
	strictDeprecations,

	// 危险区域
	context,
	moduleContext,
	preserveSymlinks,
	shimMissingExports,
	treeshake,

	// 实验性
	experimentalCacheExpiry,
	experimentalLogSideEffects,
	perf
};

// 你可以从相同的输入创建多个输出，
// 以生成例如 CommonJS 和 ESM 这样的不同格式
const outputOptionsList = [
	{
    // 核心输出选项
    dir,
    file,
    format,
    globals,
    name,
    plugins,

    // 进阶输出选项
    assetFileNames,
    banner,
    chunkFileNames,
    compact,
    dynamicImportInCjs,
    entryFileNames,
    extend,
    externalImportAttributes,
    footer,
    generatedCode,
    hashCharacters,
    hoistTransitiveImports,
    importAttributesKey,
    inlineDynamicImports,
    interop,
    intro,
    manualChunks,
    minifyInternalExports,
    outro,
    paths,
    preserveModules,
    preserveModulesRoot,
    sourcemap,
    sourcemapBaseUrl,
    sourcemapDebugIds,
    sourcemapExcludeSources,
    sourcemapFile,
    sourcemapFileNames,
    sourcemapIgnoreList,
    sourcemapPathTransform,
    validate,

    // 危险区域
    amd,
    esModule,
    exports,
    externalLiveBindings,
    freeze,
    indent,
    noConflict,
    reexportProtoFromExternal,
    sanitizeFileName,
    strict,
    systemNullSetters,

    // experimental
    experimentalMinChunkSize
  };
	{}
];

build();

async function build() {
	let bundle;
	let buildFailed = false;
	try {
		// 新建一个 bundle。如果你使用的是 TypeScript 或支持该特性的运行时，
		// await using bundle = await rollup(inputOptions);
		// 这样做就不需要在下面显式地关闭释放 bundle。
		bundle = await rollup(inputOptions);

		// 一个文件名数组，表示此产物所依赖的文件
		console.log(bundle.watchFiles);

		await generateOutputs(bundle);
	} catch (error) {
		buildFailed = true;
		// 进行一些错误报告
		console.error(error);
	}
	if (bundle) {
		// 关闭打包过程
		await bundle.close();
	}
	process.exit(buildFailed ? 1 : 0);
}

async function generateOutputs(bundle) {
  for (const outputOptions of outputOptionsList) {
    // 生成特定于输出的内存中代码
    // 你可以在同一个 bundle 对象上多次调用此函数
    // 使用 bundle.write 代替 bundle.generate 直接写入磁盘
    const { output } = await bundle.generate(outputOptions);

    for (const chunkOrAsset of output) {
      if (chunkOrAsset.type === 'asset') {
        // 对于资源文件，它包含：
        // {
        //   fileName: string,              // 资源文件名
        //   source: string | Uint8Array    // 资源文件内容
        //   type: 'asset'                  // 标志它是一个资源文件
        // }
        console.log('Asset', chunkOrAsset);
      } else {
        // 对于 chunk，它包含以下内容：
        // {
        //   code: string,                  // 生成的 JS 代码
        //   dynamicImports: string[],      // 此 chunk 动态导入的外部模块
        //   exports: string[],             // 导出的变量名
        //   facadeModuleId: string | null, // 与此 chunk 对应的模块的 ID
        //   fileName: string,              // chunk 文件名
        //   implicitlyLoadedBefore: string[]; // 仅在此 chunk 后加载的条目
        //   imports: string[],             // 此 chunk 静态导入的外部模块
        //   importedBindings: {[imported: string]: string[]} // 每个依赖项的导入绑定
        //   isDynamicEntry: boolean,       // 此 chunk 是否为动态入口点
        //   isEntry: boolean,              // 此 chunk 是否为静态入口点
        //   isImplicitEntry: boolean,      // 是否应在其他 chunk 之后仅加载此 chunk
        //   map: string | null,            // 如果存在，则为源映射
        //   modules: {                     // 此 chunk 中模块的信息
        //     [id: string]: {
        //       renderedExports: string[]; // 包含的导出变量名
        //       removedExports: string[];  // 已删除的导出变量名
        //       renderedLength: number;    // 此模块中剩余代码的长度
        //       originalLength: number;    // 此模块中代码的原始长度
        //       code: string | null;       // 此模块中的剩余代码
        //     };
        //   },
        //   name: string                   // 用于命名模式的此 chunk 的名称
		//   preliminaryFileName: string    // 此 chunk 带有哈希占位符的初始文件名
        //   referencedFiles: string[]      // 通过 import.meta.ROLLUP_FILE_URL_<id> 引用的文件
        //   type: 'chunk',                 // 表示这是一个 chunk
        // }
        console.log('Chunk', chunkOrAsset.modules);
      }
    }
  }
}
```

Rollup 还提供了一个 rollup.watch 函数，当检测到磁盘上的某个模块已更改时，它将重新打包。当你在命令行中使用 --watch 标志运行 Rollup 时，它会在内部使用。请注意，当通过 JavaScript API 使用观察模式时，你需要在响应 BUNDLE_END 事件时调用 event.result.close()，以允许插件在 closeBundle 钩子中清理资源，

```js
const rollup = require("rollup");

const watchOptions = {
  ...inputOptions,
  output: [outputOptions],
  watch: {
    buildDelay,
    chokidar,
    clearScreen,
    skipWrite,
    exclude,
    include,
  },
};
const watcher = rollup.watch(watchOptions);

watcher.on("event", event => {
  // event.code 可以是以下之一：
  //   START        - 监视器正在（重新）启动
  //   BUNDLE_START - 单次打包
  //                  * 如果存在，event.input 将是输入选项对象
  //                  * event.output 包含生成的输出的 "file"
  //                      或 "dir" 选项值的数组
  //   BUNDLE_END   - 完成打包
  //                  * 如果存在，event.input 将是输入选项对象
  //                  * event.output 包含生成的输出的 "file"
  //                      或 "dir" 选项值的数组
  //                  * event.duration 是构建持续时间（以毫秒为单位）
  //                  * event.result 包含 bundle 对象，
  //                      可以通过调用 bundle.generate
  //                      或 bundle.write 来生成其他输出。
  //                      当使用 watch.skipWrite 选项时，这尤其重要。
  //                  生成输出后，你应该调用 "event.result.close()"，
  //                  或者如果你不生成输出，也应该调用。
  //                  这将允许插件通过
  //                  "closeBundle" 钩子清理资源。
  //   END          - 完成所有产物的构建
  //   ERROR        - 在打包时遇到错误
  //                  * event.error 包含抛出的错误
  //                  * 对于构建错误，event.result 为 null，
  //                      对于输出生成错误，它包含 bundle 对象。
  //                      与 "BUNDLE_END" 一样，如果存在，
  //                      你应该在完成后调用 "event.result.close()"。
  // 如果从事件处理程序返回一个 Promise，则 Rollup
  // 将等待 Promise 解析后再继续。
});

// 这将确保在每次运行后正确关闭打包
watcher.on("event", ({ result }) => {
  if (result) {
    result.close();
  }
});

// 此外，你可以挂钩以下内容。
// 同样，返回 Promise 以使 Rollup 在该阶段等待：
watcher.on("change", (id, { event }) => {
  /* 更改了一个文件 */
});
watcher.on("restart", () => {
  /* 新触发了一次运行 */
});
watcher.on("close", () => {
  /* 监视器被关闭了，请看下面的代码 */
});

// 停止监听
watcher.close();
```

rollup 通过一个单独的入口点公开了它用来在命令行界面中加载配置文件的工具函数，为加载配置提供帮助，此工具函数接收一个解析过的 fileName （文件路径）和可选的包含命令行参数的对象：

```js
const { loadConfigFile } = require("rollup/loadConfigFile");
const path = require("node:path");
const rollup = require("rollup");

// 加载位于当前脚本旁边的配置文件；
// 提供的配置对象具有与在命令行上传递 "--format es" 相同的效果，
// 并将覆盖所有输出的格式
loadConfigFile(path.resolve(__dirname, "rollup.config.js"), {
  format: "es",
}).then(async ({ options, warnings }) => {
  // "warnings" 包装了 CLI 传递的默认 `onwarn` 处理程序。
  // 这将打印到此为止所有的警告：
  console.log(`We currently have ${warnings.count} warnings`);

  // 这将打印所有延迟的警告
  warnings.flush();

  // options 是一个包含额外 "output" 属性的 "inputOptions" 对象数组，
  // 该属性包含一个 "outputOptions" 数组。
  // 以下将为所有输入生成所有输出，
  // 并以与 CLI 相同的方式将它们写入磁盘：
  for (const optionsObj of options) {
    // 进行打包构建
    const bundle = await rollup.rollup(optionsObj);
    // 输出打包后的资源到磁盘
    await Promise.all(optionsObj.output.map(bundle.write));
  }

  // 你也可以直接将选项传给 "rollup.watch"
  rollup.watch(options);
});
```

## 应用高级日志过滤器

虽然命令行界面提供了通过 --filterLogs 标志对日志进行强大过滤的方式，但在使用 JavaScript API 时，直接使用此功能是不可用的。然而，Rollup 提供了一个辅助函数 getLogFilter，可以使用与 CLI 相同的语法生成过滤器。这在指定自定义的 onLog 处理方法以及希望为第三方系统提供与 Rollup CLI 类似的过滤功能体验时非常有用。该函数接受一个字符串数组作为参数。需要注意的是，它不会像 CLI 那样拆分以逗号分隔的过滤器列表。

```js
// rollup.config.mjs
import { getLogFilter } from "rollup/getLogFilter";

const logFilter = getLogFilter(["code:FOO", "code:BAR"]);

export default {
  input: "main.js",
  output: { format: "es" },
  onLog(level, log, handler) {
    if (logFilter(log)) {
      handler(level, log);
    }
  },
};
```

## 访问解析器

为了使用 Rollup 的解析器解析任意代码，插件可以使用 this.parse 。为了在 Rollup 构建的上下文之外使用这个功能，解析器也作为一个单独的导出项暴露出来。它的签名与 this.parse 相同：

```js
import { parseAst, parseAstAsync } from "rollup/parseAst";
import assert from "node:assert";

assert.deepEqual(parseAst("return 42;", { allowReturnOutsideFunction: true }), {
  type: "Program",
  start: 0,
  end: 10,
  sourceType: "module",
  body: [
    {
      type: "ReturnStatement",
      start: 0,
      end: 10,
      argument: {
        type: "Literal",
        start: 7,
        end: 9,
        raw: "42",
        value: 42,
      },
    },
  ],
});
```
