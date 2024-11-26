# prettier 代码格式化工具

::: tip 温馨提示
prettier 插件用来格式化代码，使代码符合 Eslint 规范。使用 VSCode IDE，在插件市场中，安装 prettier 插件，该插件可以使用内置的全局配置，也可以使用项目中`.prettierrc.js`文件中的配置

`prettier` 的中文意思是“漂亮的、机灵的”，是一个有主见的代码格式化程序。用来批量处理旧代码的统一,涉及引号，分号，换行，缩进。支持目前大部分语言处理，包括 JavaScript，Flow，TypeScript，CSS，SCSS，Less，JSX，Vue，GraphQL，JSON，Markdown。它通过解析您的代码并使用自己的规则来重新打印出格式规范的代码。
:::

## 安装对应的 prettier 依赖

```bash
npm install --save-dev prettier
```

## 根目录新建 .prettierrc.js

参考文档：https://prettier.io/docs/en/

复制粘贴以下内容到 `.prettierrc.js` 中：

```ts
module.exports = {
  // 一行最多多少个字符
  printWidth: 150,
  // 指定每个缩进级别的空格数
  tabWidth: 2,
  // 使用制表符而不是空格缩进行
  useTabs: true,
  // 在语句末尾打印分号
  semi: true,
  // 使用单引号而不是双引号
  singleQuote: true,
  // 更改引用对象属性的时间 可选值"<as-needed|consistent|preserve>"
  quoteProps: "as-needed",
  // 在JSX中使用单引号而不是双引号
  jsxSingleQuote: false,
  // 多行时尽可能打印尾随逗号。（例如，单行数组永远不会出现逗号结尾。）
  // 可选值"<none|es5|all>"，默认none
  trailingComma: "es5",
  // 在对象文字中的括号之间打印空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 在单独的箭头函数参数周围包括括号 always：(x) => x \ avoid：x => x
  arrowParens: "always",
  // 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
  rangeStart: 0,
  rangeEnd: Infinity,
  // 指定要使用的解析器，不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准 always\never\preserve
  proseWrap: "preserve",
  // 指定HTML文件的全局空格敏感度 css\strict\ignore
  htmlWhitespaceSensitivity: "css",
  // Vue文件脚本和样式标签缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
  endOfLine: "lf",
};
```
