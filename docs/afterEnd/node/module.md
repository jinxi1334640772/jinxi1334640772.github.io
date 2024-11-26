## 模块加载器

Node.js 有两个系统用于解析说明符和加载模块。

- CommonJS 模块加载器：

  - 它是完全同步的。

  - 它负责处理 require() 调用。

  - 它是可修补的。

  - 它支持 文件夹作为模块。

  - 解析说明符时，如果未找到完全匹配项，它将尝试添加扩展名（.js、.json，最后是 .node），然后尝试解析 文件夹作为模块。

  - 它将 .json 视为 JSON 文本文件。

  - .node 文件被解释为加载了 process.dlopen() 的编译插件模块。

  - 它将所有缺少 .json 或 .node 扩展名的文件视为 JavaScript 文本文件。

  - 如果启用 --experimental-require-module 时模块图是同步的（不包含顶层 await），则它只能用于 从 CommonJS 模块加载 ECMASCript 模块。当用于加载不是 ECMAScript 模块的 JavaScript 文本文件时，该文件将作为 CommonJS 模块加载

- ECMAScript 模块加载器：

  - 它是异步的，除非它用于加载 require() 的模块。

  - 负责处理 import 语句和 import() 表达式。

  - 它不可修补，可以使用 加载器钩子 进行定制。

  - 它不支持文件夹作为模块，必须完全指定目录索引（例如 './startup/index.js'）。

  - 它不进行扩展名搜索。当说明符是相对或绝对的文件 URL 时，必须提供文件扩展名。

  - 它可以加载 JSON 模块，但需要导入类型属性。

  - 它只接受 JavaScript 文本文件的 .js、.mjs 和 .cjs 扩展名。

  - 它可以用来加载 JavaScript CommonJS 模块。这样的模块通过 cjs-module-lexer 来尝试识别命名的导出，如果可以通过静态分析确定的话是可用的。导入的 CommonJS 模块将其 URL 转换为绝对路径，然后通过 CommonJS 模块加载器加载。

## 确定模块系统

- Node.js 会将以下内容视为 ES 模块：

  - 扩展名为 .mjs 的文件。

  - 当最近的父 package.json 文件包含值为 "module" 的顶层 "type" 字段时，扩展名为 .js 的文件。

  - 字符串作为参数传入 --eval，或通过 STDIN 管道传输到 node，带有标志 --input-type=module。

  - 代码包含仅成功解析为 ES 模块 的语法，例如 import 或 export 语句或 import.meta，没有明确标记应如何解释。显式标记是 .mjs 或 .cjs 扩展、带有 "module" 或 "commonjs" 值的 package.json "type" 字段，或者 --input-type 或 --experimental-default-type 标志。CommonJS 或 ES 模块均支持动态 import() 表达式，并且不会强制将文件视为 ES 模块。参见 语法检测。

- Node.js 会将以下内容视为 CommonJS：

  - 扩展名为 .cjs 的文件。

  - 当最近的父 package.json 文件包含值为 "commonjs" 的顶层字段 "type" 时，则扩展名为 .js 的文件。

  - 字符串作为参数传入 --eval 或 --print，或通过 STDIN 管道传输到 node，带有标志 --input-type=commonjs。

## package.json 和文件扩展名

在包中，package.json "type" 字段定义了 Node.js 应该如何解释 .js 文件。如果 package.json 文件没有 "type" 字段，则 .js 文件将被视为 CommonJS。

- 以 .mjs 结尾的文件总是加载为 ES 模块
- 以 .cjs 结尾的文件总是加载为 CommonJS
- 当设置 --input-type=module 标志时，作为参数传递给 --eval（或 -e）或通过 STDIN 传输到 node 的字符串将被视为 ES 模块。如果未指定 --input-type，作为 CommonJS 运行，这是默认行为。

```js
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"
// 明确作为ES模块运行
```

## 包入口点

在包的 package.json 文件中，两个字段可以定义包的入口点："main" 和 "exports"。这两个字段都适用于 ES 模块和 CommonJS 模块入口点。

"exports" 提供了 "main" 的现代替代方案：

- 优先级更高
- 允许定义多个入口点、环境之间的条件入口解析支持
- 防止除 "exports" 中定义的入口点之外的任何其他入口点
- 此封装允许模块作者清楚地为他们的包定义公共接口。

包 "imports" 字段用于创建仅适用于包本身的导入说明符的私有映射。

"imports" 字段中的条目必须始终以 # 开头，以确保它们与外部包说明符消除歧义。与 "exports" 字段不同，"imports" 字段允许映射到外部包。

```json
{
  "name": "@my/package",
  // require('@my/package') 自引用也适用于范围包

  "packageManager": "pnpm@10.6.0",
  // 处理当前项目时预期使用的包管理器

  "main": "./index.js", // 可以并行，实现兼容性

  // "exports": "./index.js"
  // import { something } from '@my/package';
  "exports": {
    ".": "./index.js", //自定义子路径以及主入口点
    "import": "./index.mjs", // 条件导出主入口文件
    "require": "./index.cjs",

    "./lib": "./lib/index.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./src/feature/index.js",
    "./feature/*.js": "./feature/*.js", // 可以使用模式，导出feature下的所有js
    "./feature/internal/*": null, // feature下internal子目录禁止导出
    "./package.json": "./package.json",
    "./feature.js": {
      // 条件导出

      "node": "./feature-node.js",
      // 匹配任何 Node.js 环境。可以是 CommonJS 或 ES 模块文件

      "node": {
        // 也可以嵌套条件：有双模式入口点用于 Node.js 而不是浏览器
        "import": "./feature-node.mjs",
        "require": "./feature-node.cjs"
      },
      "import": "./index-module.js",
      // 当包通过 import 或 import() 加载时匹配，无论目标文件的模块格式如何，都适用

      "require": "./index-require.cjs",
      //通过 require() 加载包时匹配，无论目标文件的模块格式如何，都适用

      "module-sync": "./index-module-sync.cjs",
      //无论包是通过 import、import() 还是 require() 加载，都会匹配。格式应为 ES 模块

      "default": "./feature.js"
      //始终匹配的通用回退。可以是 CommonJS 或 ES 模块文件。这种情况应该总是排在最后
    }
  },
  //其中 import '#dep' 没有得到外部包 dep-node-native 的解析（依次包括其导出），而是获取了相对于其他环境中的包的本地文件 ./dep-polyfill.js。
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    },
    "#internal/*.js": "./src/internal/*.js"
  }
}
```

## 条件导出

条件导出提供了一种根据特定条件映射到不同路径的方法。CommonJS 和 ES 模块导入都支持它们。

Node.js 实现了以下条件，按从最具体到最不具体的顺序列出，因为应该定义条件：

- "node-addons" - 类似于 "node" 并且匹配任何 Node.js 环境。此条件可用于提供使用原生 C++ 插件的入口点，而不是更通用且不依赖原生插件的入口点。这种情况可以通过 --no-addons 标志 禁用。

- "node" - 匹配任何 Node.js 环境。可以是 CommonJS 或 ES 模块文件。在大多数情况下，没有必要显式调出 Node.js 平台。

- "import" - 当包通过 import 或 import() 加载时匹配，或者通过 ECMAScript 模块加载器通过任何顶层导入或解析操作加载。无论目标文件的模块格式如何，都适用。始终与 "require" 互斥。

- "require" - 通过 require() 加载包时匹配。引用的文件应该可以用 require() 加载，尽管无论目标文件的模块格式如何，条件都匹配。如果启用了 --experimental-require-module，则预期格式包括 CommonJS、JSON、原生插件和 ES 模块。始终与 "import" 互斥。

- "module-sync" - 无论包是通过 import、import() 还是 require() 加载，都会匹配。格式应为 ES 模块，其模块图中不包含顶层 await - 如果是这样，当模块被 require() 化时，将抛出 ERR_REQUIRE_ASYNC_MODULE。

- "default" - 始终匹配的通用回退。可以是 CommonJS 或 ES 模块文件。这种情况应该总是排在最后。

在 "exports" 对象中，键顺序很重要。在条件匹配过程中，较早的条目具有更高的优先级并优先于较晚的条目。一般规则是条件应按对象顺序从最具体到最不具体。

## 解析用户条件

运行 Node.js 时，可以使用 --conditions 标志添加自定义用户条件：

```bash
node --conditions=development index.js
```

然后将解析包导入和导出中的 "development" 条件，同时根据需要解析现有的 "node"、"node-addons"、"default"、"import" 和 "require" 条件。

可以使用重复标志设置任意数量的自定义条件。

## 双 CommonJS/ES 模块包

在 Node.js 中引入对 ES 模块的支持之前，包作者的一种常见模式是在他们的包中包含 CommonJS 和 ES 模块 JavaScript 源代码，其中 package.json "main" 指定了 CommonJS 入口点，而 package.json "module" 指定了 ES 模块入口点。这使 Node.js 能够运行 CommonJS 入口点，而构建工具（例如打包器）使用 ES 模块入口点，因为 Node.js 忽略（并且仍然忽略）顶层 "module" 字段。

Node.js 现在可以运行 ES 模块入口点，并且一个包可以同时包含 CommonJS 和 ES 模块入口点（通过单独的说明符，例如 'pkg' 和 'pkg/es-module'，或者通过 条件导出 在同一说明符中）。与顶层 "module" 字段仅由打包器使用或 ES 模块文件在 Node.js 评估之前动态转换为 CommonJS 的情况不同，ES 模块入口点引用的文件将评估为 ES 模块。
