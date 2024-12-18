## eslint 简介

用于规范和检测代码风格。eslint 配置在开发环境中，帮助我们找出项目中不符合规则的代码并给出提示。在我们的开发环境中，开发者每次修改代码，都会先用 eslint 检查代码，这样可以让 eslint 随时提醒开发者代码是否符合规范，从而降低低级 bug 的出现。`所以不建议关闭 eslint 检查`。

::: tip 温馨提示
eslint 规范，不同项目或者不同的公司，可能有不同的喜好。适合自己的就好，规范统一就行。eslint 有很多插件，额外扩展了一些规范。例如：eslint-plugin-vue 插件，为 vue 语法新增了对应的规范。
:::

## eslint 使用

- 安装 eslint

```bash
npm install --save-dev  eslint

```

- 安装 eslint 插件

```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

npm install --save-dev eslint-plugin-vue vue-eslint-parser
```

- 根目录新建 .eslintrc.js

其它格式 .eslintrc.\*，参考：http://eslint.cn/docs/user-guide/configuring

- 配置规则 rules

Eslint 规则语法：

```ts
rules: {
  "规则名": "规则值"
  "规则名": ["规则值", "规则配置"]
}
```

更多语法参考：  
http://eslint.cn/docs/rules/ 和 https://eslint.vuejs.org/rules/

规则的错误等级有以下三种：

- `0` 或 `off`： 关闭规则
- `1` 或 `warn`： 打开规则，并且作为一个警告，字体颜色为黄色（并不会导致检查不通过）
- `2` 或 `error`：打开规则，并且作为一个错误 ，色体颜色为红色(退出码为 1，检查不通过)

配置后，如果编写代码时不符合规则规范，页面将会出现 `红色波浪线` 或 `黄色波浪线`

```ts {5,9}
module.exports = {
  ...
  rules: {
    // "no-console": 2, 红色波浪线
    "no-console": "error",

    // "no-console": 1, 黄色波浪线
    "no-console": "warn",

    // "no-console": 0, 关闭规则
    "no-console": "off",

    // 复杂类型：配置Array不要空格。2, 红色波浪线
    "array-bracket-spacing": [2, "never"],
    ...
  },
};
```

## .eslintignore 忽略特定的文件

你可以通过在项目根目录创建一个 `.eslintignore` 纯文本文件，告诉 ESLint 去忽略特定的文件和目录。其中的每一行都是一个 `glob` 模式表明哪些路径应该忽略检测。

::: tip 项目根目录
新建 `.eslintignore`，文档参看：[http://eslint.cn/docs/user-guide/configuring](http://eslint.cn/docs/user-guide/configuring)
:::

例如，以下将忽略部分文件，规则将不会检查以下目录：

```txt
*.sh
node_modules
lib
*.md
*.scss
*.woff
*.ttf
.vscode
.idea
dist
mock
public
bin
build
config
index.html
src/assets
```

## 关闭 eslint 检查

- 加入`.eslintignore`忽略文件

比如：要忽略 `views/login/` 目录的检查，`.eslintignore` 中添加如下内容：

```md
src/views/login/
```

- 使用行内禁用检查的声明
  - 禁用某个文件
  - 禁用某一段代码
  - 禁用某一行代码
  - 禁用具体某个规则

## Eslint 所有配置和解释

vue 项目中， Eslint 配置文件`.eslintrc.js`的内容：

```js
// 包含所有 ESLint 规则, 使用 babel-eslint 作为解析器
module.exports = {
  // 配置解析器，parser也可以和parserOptions同级
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      modules: true,
    },
  },
  // 自定义的全局变量这里需要声明，不会报错
  globals: { Vue: true, $style: true },
  // 继承插件提供的各种 rules
  extends: [
    "plugin:vue/essential",
    "@vue/standard",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],
  // eslint所处的环境：使用对应环境的api时，不会报错
  env: { browser: true, node: true, commonjs: true, es6: true },
  plugins: ["prettier"],
  // 声明所处位置为根目录，不会再往上级查找eslint配置文件了
  root: true,
  // 各种规则的具体配置在这里，包括插件提供的rules
  rules: {
    "for-direction": "error", // 禁止 for 循环出现方向错误的循环，比如 for (i = 0; i < 10; i--)
    "getter-return": ["error", { allowImplicit: false }], // getter 必须有返回值，并且禁止返回空，比如 return;
    "no-await-in-loop": "off", // 禁止将 await 写在循环里，因为这样就无法同时发送多个异步请求了// @off 要求太严格了，有时需要在循环中写 await
    "no-compare-neg-zero": "error", // 禁止与负零进行比较
    "no-cond-assign": ["error", "except-parens"], // 禁止在测试表达式中使用赋值语句，除非这个赋值语句被括号包起来了
    "no-console": "warn", // 禁止使用 console// @off console 的使用很常见
    "no-constant-condition": ["error", { checkLoops: false }], // 禁止将常量作为分支条件判断中的测试表达式，但允许作为循环条件判断中的测试表达式
    "no-control-regex": "off", // 禁止在正则表达式中出现 Ctrl 键的 ASCII 表示，即禁止使用 /\x1f/// @off 几乎不会遇到这种场景
    "no-debugger": "error", // @fixable 禁止使用 debugger
    "no-dupe-args": "error", // 禁止在函数参数中出现重复名称的参数
    "no-dupe-keys": "error", // 禁止在对象字面量中出现重复名称的键名
    "no-duplicate-case": "error", // 禁止在 switch 语句中出现重复测试表达式的 case
    "no-empty": ["warn", { allowEmptyCatch: true }], // 禁止出现空代码块，允许 catch 为空代码块
    "no-empty-character-class": "error", // 禁止在正则表达式中使用空的字符集 []
    "no-ex-assign": "error", // 禁止将 catch 的第一个参数 error 重新赋值
    "no-extra-boolean-cast": "error", // @fixable 禁止不必要的布尔类型转换，比如 !! 或 Boolean foo = (function () { return 1 })
    "no-extra-parens": ["error", "functions"],
    "no-extra-semi": "error", // @fixable 禁止出现多余的分号
    "no-func-assign": "error", // 禁止将一个函数声明重新赋值
    "no-inner-declarations": ["error", "both"], // 禁止在 if 代码块内出现函数声明
    "no-invalid-regexp": "error", // 禁止在 RegExp 构造函数中出现非法的正则表达式
    "no-irregular-whitespace": [
      "error",
      {
        skipStrings: true,
        skipComments: false,
        skipRegExps: true,
        skipTemplates: true,
      },
    ], // 禁止使用特殊空白符,除非字符串中
    "no-obj-calls": "error", // 禁止将 Math, JSON 或 Reflect 直接作为函数调用
    "no-prototype-builtins": "off", // 禁止使用 hasOwnProperty, isPrototypeOf 或 propertyIsEnumerable// @off hasOwnProperty 比较常用
    "no-regex-spaces": "error", // @fixable 禁止在正则表达式中出现连续的空格，必须使用 /foo {3}bar/ 代替
    "no-sparse-arrays": "error", // 禁止在数组中出现连续的逗号，如 let foo = [,,]
    "no-template-curly-in-string": "error", // 禁止在普通字符串中出现模版字符串里的变量形式，如 'Hello ${name}!'
    "no-unexpected-multiline": "error", // 禁止出现难以理解的多行表达式
    "no-unreachable": "error", // 禁止在 return, throw, break 或 continue 之后还有代码
    "no-unsafe-finally": "error", // 禁止在 finally 中出现 return, throw, break 或 continue
    "no-unsafe-negation": "error", // @fixable 禁止在 in 或 instanceof 操作符的左侧使用感叹号，如 if (!key in object)
    "use-isnan": "error", // 必须使用 isNaN(foo) 而不是 foo === NaN
    "valid-jsdoc": "off", // 注释必须符合 jsdoc 的规范// @off jsdoc 要求太严格
    "valid-typeof": "error", // typeof 表达式比较的对象必须是 'undefined', 'object', 'boolean', 'number', 'string', 'function' 或 'symbol'

    // 最佳实践// 这些规则通过一些最佳实践帮助你避免问题

    "accessor-pairs": ["error", { setWithoutGet: true, getWithoutSet: false }], // setter 必须有对应的 getter，getter 可以没有对应的 setter
    "array-callback-return": "error", // 数组的方法除了 forEach 之外，回调函数必须有返回值
    "block-scoped-var": "error", // 将 var 定义的变量视为块作用域，禁止在块外使用
    "class-methods-use-this": "off", // 在类的非静态方法中，必须存在对 this 的引用// @off 太严格了
    complexity: ["error", { max: 20 }], // 禁止函数的循环复杂度超过 20
    "consistent-return": "off", // 禁止函数在不同分支返回不同类型的值// @off 太严格了
    curly: ["error", "multi-line", "consistent"], // @fixable if 后面必须要有 {，除非是单行 if
    "default-case": "off", // switch 语句必须有 default// @off 太严格了
    "dot-location": ["error", "property"], // @fixable 链式调用的时候，点号必须放在第二行开头处，禁止放在第一行结尾处
    "dot-notation": "off", // @fixable 禁止出现 foo['bar']，必须写成 foo.bar// @off 当需要写一系列属性的时候，可以更统一
    eqeqeq: ["error", "always", { null: "ignore" }], // @fixable 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
    "guard-for-in": "error", // for in 内部必须有 hasOwnProperty
    "no-alert": "off", // 禁止使用 alert// @off alert 很常用
    "no-caller": "error", // 禁止使用 caller 或 callee
    "no-case-declarations": "error", // switch 的 case 内有变量定义的时候，必须使用大括号将 case 内变成一个代码块
    "no-div-regex": "off", // 禁止在正则表达式中出现形似除法操作符的开头，如 let a = /=foo/// @off 有代码高亮的话，在阅读这种代码时，也完全不会产生歧义或理解上的困难
    "no-else-return": "off", // @fixable 禁止在 else 内使用 return，必须改为提前结束// @off else 中使用 return 可以使代码结构更清晰
    "no-empty-function": ["warn", { allow: ["functions", "arrowFunctions"] }], // 不允许有空函数，除非是将一个空函数设置为某个项的默认值
    "no-empty-pattern": "error", // 禁止解构中出现空 {} 或 []
    "no-eq-null": "error", // 必须使用 foo === null 或 foo !== null
    "no-eval": "error", // 禁止使用 eval
    "no-extend-native": "error", // 禁止修改原生对象
    "no-extra-bind": "error", // @fixable 禁止出现没必要的 bind
    "no-extra-label": "error", // @fixable 禁止出现没必要的 label
    "no-fallthrough": "error", // switch 的 case 内必须有 break, return 或 throw
    "no-floating-decimal": "error", // @fixable 表示小数时，禁止省略 0，比如 .5
    "no-global-assign": "error", // 禁止对全局变量赋值
    "no-implicit-coercion": ["error", { allow: ["!!"] }], // @fixable 禁止使用 !! ~ 等难以理解的运算符// 仅允许使用 !!
    "no-implicit-globals": "error", // 禁止在全局作用域下定义变量或申明函数
    "no-implied-eval": "error", // 禁止在 setTimeout 或 setInterval 中传入字符串，如 setTimeout('alert("Hi!")', 100);
    "no-invalid-this": "off", // 禁止在类之外的地方使用 this// @off this 的使用很灵活，事件回调中可以表示当前元素，函数也可以先用 this，等以后被调用的时候再 call
    "no-iterator": "error", // 禁止使用 __iterator__
    "no-labels": "error", // 禁止使用 label
    "no-lone-blocks": "error", // 禁止使用没必要的 {} 作为代码块
    "no-loop-func": "error", // 禁止在循环内的函数中出现循环体条件语句中定义的变量
    "no-magic-numbers": "off", // 禁止使用 magic numbers// @off 太严格了
    // @fixable 禁止出现连续的多个空格，除非是注释前，或对齐对象的属性、变量定义、import 等
    "no-multi-spaces": [
      "warn",
      {
        ignoreEOLComments: true,
        exceptions: {
          Property: true,
          BinaryExpression: false,
          VariableDeclarator: true,
          ImportDeclaration: true,
        },
      },
    ],
    "no-multi-str": "error", // 禁止使用 \ 来换行字符串
    "no-new": "error", // 禁止直接 new 一个类而不赋值
    "no-new-func": "error", // 禁止使用 new Function，比如 let x = new Function("a", "b", "return a + b");
    "no-new-wrappers": "error", // 禁止使用 new 来生成 String, Number 或 Boolean
    "no-octal": "error", // 禁止使用 0 开头的数字表示八进制数
    "no-octal-escape": "error", // 禁止使用八进制的转义符
    "no-param-reassign": "error", // 禁止对函数的参数重新赋值
    "no-proto": "error", // 禁止使用 __proto__
    "no-redeclare": "error", // 禁止重复定义变量
    "no-restricted-properties": "off", // 禁止使用指定的对象属性// @off 它用于限制某个具体的 api 不能使用
    "no-return-assign": ["error", "always"], // 禁止在 return 语句里赋值
    "no-return-await": "error", // 禁止在 return 语句里使用 await
    "no-script-url": "error", // 禁止出现 location.href = 'javascript:void(0)';
    "no-self-assign": "error", // 禁止将自己赋值给自己
    "no-self-compare": "error", // 禁止将自己与自己比较
    "no-sequences": "error", // 禁止使用逗号操作符
    "no-throw-literal": "error", // 禁止 throw 字面量，必须 throw 一个 Error 对象
    "no-unmodified-loop-condition": "error", // 循环内必须对循环条件的变量有修改
    "no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ], // 禁止无用的表达式
    "no-unused-labels": "error", // @fixable 禁止出现没用的 label
    "no-useless-call": "error", // 禁止出现没必要的 call 或 apply
    "no-useless-concat": "error", // 禁止出现没必要的字符串连接
    "no-useless-escape": "off", // 禁止出现没必要的转义// @off 转义可以使代码更易懂
    "no-useless-return": "off", // @fixable 禁止没必要的 return// @off 没必要限制 return
    "no-void": "error", // 禁止使用 void
    "no-warning-comments": "off", // 禁止注释中出现 TODO 和 FIXME // @off TODO 很常用
    "no-with": "error", // 禁止使用 with
    "prefer-promise-reject-errors": "error", // Promise 的 reject 中必须传入 Error 对象，而不是字面量
    radix: "error", // parseInt 必须传入第二个参数
    "require-await": "error", // async 函数中必须存在 await 语句
    "vars-on-top": "off", // var 必须在作用域的最前面// @off var 不在最前面也是很常见的用法
    "wrap-iife": ["error", "inside", { functionPrototypeMethods: true }], // @fixable 立即执行的函数必须符合如下格式 (function () { alert('Hello') })()
    yoda: ["error", "never", { onlyEquality: true }], // @fixable 必须使用 if (foo === 5) 而不是 if (5 === foo)
    strict: ["error", "never"], // @fixable 禁止使用 'strict';

    // 这些规则与变量申明有关

    "init-declarations": "off", // 变量必须在定义的时候赋值// @off 先定义后赋值很常见
    "no-catch-shadow": "off", // 禁止 catch 的参数名与定义过的变量重复// @off 太严格了
    "no-delete-var": "error", // 禁止使用 delete
    "no-label-var": "error", // 禁止 label 名称与定义过的变量重复
    "no-restricted-globals": "off", // 禁止使用指定的全局变量// @off 它用于限制某个具体的变量名不能使用
    "no-shadow": "off", // 禁止变量名与上层作用域内的定义过的变量重复 // @off 很多时候函数的形参和传参是同名的
    "no-shadow-restricted-names": "error", // 禁止使用保留字作为变量名
    "no-undef": ["error", { typeof: false }], // 禁止使用未定义的变量
    "no-undef-init": "error", // @fixable 禁止将 undefined 赋值给变量
    "no-undefined": "error", // 禁止对 undefined 重新赋值
    "no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "none",
        caughtErrors: "none",
        ignoreRestSiblings: true,
      },
    ], // 定义过的变量必须使用
    "no-use-before-define": [
      "error",
      { functions: false, classes: false, variables: false },
    ], // 变量必须先定义后使用
    "callback-return": "off", // callback 之后必须立即 return// @off Limitations 太多了
    "global-require": "off", // require 必须在全局作用域下// @off 条件加载很常见
    "handle-callback-err": "error", // callback 中的 error 必须被处理
    "no-buffer-constructor": "error", // 禁止直接使用 Buffer
    "no-mixed-requires": "off", // 相同类型的 require 必须放在一起// @off 太严格了
    "no-new-require": "error", // 禁止直接 new require('foo')
    "no-path-concat": "error", // 禁止对 __dirname 或 __filename 使用字符串连接
    "no-process-env": "off", // 禁止使用 process.env.NODE_ENV// @off 使用很常见
    "no-process-exit": "off", // 禁止使用 process.exit(0)// @off 使用很常见
    "no-restricted-modules": "off", // 禁止使用指定的模块// @off 它用于限制某个具体的模块不能使用
    "no-sync": "off", // 禁止使用 node 中的同步的方法，比如 fs.readFileSync// @off 使用很常见

    // 风格问题// 这些规则与代码风格有关，所以是非常主观的

    "array-bracket-newline": "off", // @fixable 配置数组的中括号内前后的换行格式// @off 配置项无法配制成想要的样子
    "array-bracket-spacing": ["error", "never"], // @fixable 数组的括号内的前后禁止有空格
    "array-element-newline": "off", // @fixable 配置数组的元素之间的换行格式// @off 允许一行包含多个元素，方便大数量的数组的书写
    "block-spacing": ["error", "always"], // @fixable 代码块如果在一行内，那么大括号内的首尾必须有空格，比如 function () { alert('Hello') }
    "brace-style": "off", // @fixable if 与 else 的大括号风格必须一致// @off else 代码块可能前面需要有一行注释
    camelcase: "off", // 变量名必须是 camelcase 风格的// @off 很多 api 或文件名都不是 camelcase
    "capitalized-comments": "off", // @fixable 注释的首字母必须大写// @off 没必要限制
    "comma-dangle": "off", // @fixable 对象的最后一个属性末尾必须有逗号// @off 没必要限制
    "comma-spacing": ["error", { before: false, after: true }], // @fixable 逗号前禁止有空格，逗号后必须要有空格
    "comma-style": ["error", "last"], // @fixable 禁止在行首写逗号
    "computed-property-spacing": ["error", "never"], // @fixable 用作对象的计算属性时，中括号内的首尾禁止有空格
    "consistent-this": "off", // 限制 this 的别名 // @off 没必要限制
    "eol-last": "off", // @fixable 文件最后一行必须有一个空行// @off 没必要限制
    "func-call-spacing": ["error", "never"], // @fixable 函数名和执行它的括号之间禁止有空格
    "func-name-matching": [
      "error",
      "always",
      { includeCommonJSModuleExports: false },
    ], // 函数赋值给变量的时候，函数名必须与变量名一致
    "func-names": "off", // 函数必须有名字// @off 没必要限制
    "func-style": "off", // 必须只使用函数声明或只使用函数表达式 // @off 没必要限制
    "id-blacklist": "off", // 禁止使用指定的标识符 // @off 它用于限制某个具体的标识符不能使用
    "id-length": "off", // 限制变量名长度// @off 没必要限制变量名长度
    "id-match": "off", // 限制变量名必须匹配指定的正则表达式// @off 没必要限制变量名
    indent: ["off", 4, { SwitchCase: 1, flatTernaryExpressions: true }], // @fixable 一个缩进必须用四个空格替代
    "jsx-quotes": ["error", "prefer-double"], // @fixable jsx 中的属性必须用双引号
    "key-spacing": [
      "error",
      { beforeColon: false, afterColon: true, mode: "strict" },
    ], // @fixable 对象字面量中冒号前面禁止有空格，后面必须有空格
    "keyword-spacing": ["error", { before: true, after: true }], // @fixable 关键字前后必须有空格
    "line-comment-position": "off", // 单行注释必须写在上一行// @off 没必要限制
    "linebreak-style": "off", // @fixable 限制换行符为 LF 或 CRLF// @off 没必要限制
    "lines-around-comment": "off", // @fixable 注释前后必须有空行 // @off 没必要限制
    "max-depth": ["error", 5], // 代码块嵌套的深度禁止超过 5 层
    "max-len": "off", // 限制一行的长度// @off 现在编辑器已经很智能了，不需要限制一行的长度
    "max-lines": "off", // 限制一个文件最多的行数// @off 没必要限制
    "max-nested-callbacks": ["error", 3], // 回调函数嵌套禁止超过 3 层，多了请用 async await 替代
    "max-params": ["error", 7], // 函数的参数禁止超过 7 个
    "max-statements": "off", // 限制函数块中的语句数量// @off 没必要限制
    "max-statements-per-line": "off", // 限制一行中的语句数量// @off 没必要限制
    "multiline-ternary": "off", // 三元表达式必须得换行 // @off 三元表达式可以随意使用
    "new-cap": ["error", { newIsCap: true, capIsNew: false, properties: true }], // new 后面的类名必须首字母大写
    "new-parens": "error", // @fixable new 后面的类必须有小括号
    "newline-per-chained-call": "off", // 链式调用必须换行// @off 没必要限制
    "no-array-constructor": "error", // 禁止使用 Array 构造函数
    "no-bitwise": "off", // 禁止使用位运算 // @off 位运算很常见
    "no-continue": "off", // 禁止使用 continue // @off continue 很常用
    "no-inline-comments": "off", // 禁止在代码后添加内联注释// @off 内联注释很常用
    "no-lonely-if": "off", // @fixable 禁止 else 中只有一个单独的 if // @off 单独的 if 可以把逻辑表达的更清楚
    "no-mixed-operators": "off", // 禁止混用不同的操作符，比如 let foo = a && b < 0 || c > 0 || d + 1 === 0// @off 太严格了，可以由使用者自己去判断如何混用操作符
    "no-mixed-spaces-and-tabs": "error", // 禁止混用空格和缩进
    "no-multi-assign": "off", // 禁止连续赋值，比如 a = b = c = 5// @off 没必要限制
    "no-multiple-empty-lines": ["error", { max: 3, maxEOF: 1, maxBOF: 1 }], // @fixable 禁止出现超过三行的连续空行
    "no-negated-condition": "off", // 禁止 if 里面有否定的表达式
    "no-nested-ternary": "off", // 禁止使用嵌套的三元表达式，比如 a ? b : c ? d : e// @off 没必要限制
    "no-new-object": "error", // 禁止直接 new Object
    "no-plusplus": "off", // 禁止使用 ++ 或 --// @off 没必要限制
    "no-restricted-syntax": "off", // 禁止使用特定的语法 // @off 它用于限制某个具体的语法不能使用
    "no-tabs": "off", // 禁止使用 tabs
    "no-ternary": "off", // 禁止使用三元表达式 // @off 三元表达式很常用
    "no-trailing-spaces": "error", // @fixable 禁止行尾有空格
    "no-underscore-dangle": "off", // 禁止变量名出现下划线// @off 下划线在变量名中很常用
    "no-unneeded-ternary": "off", // @fixable 必须使用 !a 替代 a ? false : true// @off 后者表达的更清晰
    "no-whitespace-before-property": "error", // @fixable 禁止属性前有空格，比如 foo. bar()
    "nonblock-statement-body-position": [
      "error",
      "beside",
      { overrides: { while: "below" } },
    ], // @fixable 禁止 if 后面不加大括号而写两行代码
    "object-curly-newline": ["off", { multiline: true, consistent: true }], // @fixable 大括号内的首尾必须有换行
    "object-curly-spacing": [
      "off",
      "always",
      { arraysInObjects: true, objectsInObjects: false },
    ], // @fixable 对象字面量只有一行时，大括号内的首尾必须有空格
    "object-property-newline": "off", // @fixable 对象字面量内的属性每行必须只有一个// @off 没必要限制
    "one-var": ["error", "never"], // 禁止变量申明时用逗号一次申明多个
    "one-var-declaration-per-line": ["error", "always"], // @fixable 变量申明必须每行一个
    "operator-assignment": "off", // @fixable 必须使用 x = x + y 而不是 x += y// @off 没必要限制
    "operator-linebreak": "off", // @fixable 需要换行的时候，操作符必须放在行末
    "padded-blocks": "off", // @fixable 代码块首尾必须要空行// @off 没必要限制
    "padding-line-between-statements": "off", // @fixable 限制语句之间的空行规则，比如变量定义完之后必须要空行// @off 没必要限制
    "quote-props": "off", // @fixable 对象字面量的键名禁止用引号括起来 // @off 没必要限制
    quotes: [
      "error",
      "single",
      { avoidEscape: true, allowTemplateLiterals: true },
    ], // @fixable 必须使用单引号，禁止使用双引号
    "require-jsdoc": "off", // 必须使用 jsdoc 风格的注释// @off 太严格了
    semi: ["warn", "always", { omitLastInOneLineBlock: true }], // @fixable 结尾必须有分号
    "semi-spacing": ["error", { before: false, after: true }], // @fixable 一行有多个语句时，分号前面禁止有空格，分号后面必须有空格
    "semi-style": ["error", "last"], // @fixable 分号必须写在行尾，禁止在行首出现
    "sort-keys": "off", // 对象字面量的键名必须排好序 // @off 没必要限制
    "sort-vars": "off", // 变量申明必须排好序 // @off 没必要限制
    "space-before-blocks": ["error", "always"], // @fixable if, function 等的大括号之前必须要有空格，比如 if (a) {
    "space-before-function-paren": [
      "error",
      { anonymous: "ignore", named: "never", asyncArrow: "always" },
    ], // @fixable function 的小括号之前必须要有空格
    "space-in-parens": ["error", "never"], // @fixable 小括号内的首尾禁止有空格
    "space-infix-ops": "error", // @fixable 操作符左右必须有空格，比如 let sum = 1 + 2;
    "space-unary-ops": ["error", { words: true, nonwords: false }], // @fixable new, typeof 等后面必须有空格，++, -- 等禁止有空格
    "spaced-comment": [
      "warn",
      "always",
      { block: { exceptions: ["*"], balanced: true } },
    ], // @fixable 注释的斜线或 * 后必须有空格
    "switch-colon-spacing": ["error", { after: true, before: false }], // @fixable case 的冒号前禁止有空格，冒号后必须有空格
    "template-tag-spacing": ["error", "never"], // @fixable 模版字符串的 tag 之后禁止有空格，比如 tag`Hello World`
    "unicode-bom": ["error", "never"], // @fixable 文件开头禁止有 BOM
    "wrap-regex": "off", // @fixable 正则表达式必须有括号包起来// @off 没必要限制

    // ECMAScript 6// 这些规则与 ES6（即通常所说的 ES2015）有关

    "arrow-body-style": "off", // @fixable 箭头函数能够省略 return 的时候，必须省略// @off 箭头函数的返回值，应该允许灵活设置
    "arrow-parens": "off", // @fixable 箭头函数只有一个参数的时候，必须加括号// @off 应该允许灵活设置
    "arrow-spacing": ["error", { before: true, after: true }], // @fixable 箭头函数的箭头前后必须有空格
    "constructor-super": "error", // constructor 中必须有 super
    "generator-star-spacing": ["error", { before: false, after: true }], // @fixable generator 的 * 前面禁止有空格，后面必须有空格
    "no-class-assign": "error", // 禁止对定义过的 class 重新赋值
    "no-confusing-arrow": ["error", { allowParens: true }], // @fixable 禁止出现难以理解的箭头函数，比如 let x = a => 1 ? 2 : 3
    "no-const-assign": "error", // 禁止对使用 const 定义的常量重新赋值
    "no-dupe-class-members": "error", // 禁止重复定义类
    "no-duplicate-imports": "error", // 禁止重复 import 模块
    "no-new-symbol": "error", // 禁止使用 new 来生成 Symbol
    "no-restricted-imports": "off", // 禁止 import 指定的模块 // @off 它用于限制某个具体的模块不能使用
    "no-this-before-super": "error", // 禁止在 super 被调用之前使用 this 或 super
    "no-useless-computed-key": "error", // @fixable 禁止出现没必要的计算键名，比如 let a = { ['0']: 0 };
    "no-useless-constructor": "error", // 禁止出现没必要的 constructor，比如 constructor(value) { super(value) }
    "no-useless-rename": "error", // @fixable 禁止解构时出现同样名字的的重命名，比如 let { foo: foo } = bar;
    "no-var": "error", // @fixable 禁止使用 var
    "object-shorthand": "off", // @fixable 必须使用 a = {b} 而不是 a = {b: b} // @off 没必要强制要求
    "prefer-arrow-callback": "off", // @fixable 必须使用箭头函数作为回调   // @off 没必要强制要求
    "prefer-const": "off", // @fixable 申明后不再被修改的变量必须使用 const 来申明 // @off 没必要强制要求
    "prefer-destructuring": "off", // 必须使用解构 // @off 没必要强制要求
    "prefer-numeric-literals": "off", // @fixable 必须使用 0b11111011 而不是 parseInt('111110111', 2) // @off 没必要强制要求
    "prefer-rest-params": "off", // 必须使用 ...args 而不是 arguments // @off 没必要强制要求
    "prefer-spread": "off", // @fixable 必须使用 ... 而不是 apply，比如 foo(...args) // @off  apply 很常用
    "prefer-template": "off", // @fixable 必须使用模版字符串而不是字符串连接// @off 字符串连接很常用
    "require-yield": "error", // generator 函数内必须有 yield
    "rest-spread-spacing": ["error", "never"], // @fixable ... 的后面禁止有空格
    "sort-imports": "off", // @fixable import 必须按规则排序 // @off 没必要强制要求
    "symbol-description": "error", // 创建 Symbol 时必须传入参数
    "template-curly-spacing": ["error", "never"], // @fixable ${name} 内的首尾禁止有空格
    "yield-star-spacing": ["error", "after"], // @fixable yield* 后面必须要有空格
  },
};
```
