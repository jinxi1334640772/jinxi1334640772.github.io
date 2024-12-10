## prettier 简介

prettier 插件用来格式化代码，使代码符合 Eslint 规范。使用 VSCode IDE，在插件市场中，安装 prettier 插件，该插件可以使用内置的全局配置，也可以使用项目中`.prettierrc.js`文件中的配置

::: tip 温馨提示  
`prettier` 的中文意思是“漂亮的、机灵的”，是一个代码格式化程序。涉及引号，分号，换行，缩进等。支持目前大部分语言处理，包括 JavaScript，Flow，TypeScript，CSS，SCSS，Less，JSX，Vue，GraphQL，JSON，Markdown。它通过解析代码并使用自己的规则来格式化代码。
:::

## 安装 prettier

```bash
npm install --save-dev prettier
```

## 根目录新建 .prettierrc.js

vscode 读取这种单独配置文件的优先级会高于插件内配置。

参考文档：https://prettier.io/docs/en/

`.prettierrc.js` 中：

```ts
module.exports = {
  // 指定自动换行的行长，默认值为80
  printWidth: 150,
  // 指定每个缩进级别的空格数
  tabWidth: 2,
  // 使用制表符而不是空格缩进行
  useTabs: true,
  // 在语句末尾打印分号
  semi: true,
  // 使用单引号而不是双引号
  singleQuote: true,
  // 何时更改引用对象属性 "<as-needed|consistent|preserve>"
  quoteProps: "as-needed",
  // 在JSX中使用单引号而不是双引号
  jsxSingleQuote: false,
  // 在多行逗号分隔的语法结构中打印尾随逗号 "<none|es5|all>"，默认none
  trailingComma: "es5",
  // 在对象文字中的括号之间打印空格，默认true
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 在单独的箭头函数参数周围包括括号 always：(x) => x \ avoid：x => x
  arrowParens: "always",
  // 格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
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

## 格式化方式

- 命令行执行格式化 ‌：使用命令行工具手动格式化代码。例如，`npx prettier --write .`会格式化项目中的所有文件 ‌
- 编辑器右键：点击 menu 菜单`格式化`选项
- 使用编辑器插件 ‌ 自动格式化：在编辑器中安装 Prettier 插件，设置保存时自动格式化代码 ‌

## 忽略格式化

- 创建`.prettierignore`文件来忽略不想格式化的文件或目录。例如：添加 node_modules 来忽略该目录 ‌

- 使用`prettier-ignore`注释，会忽略下一行代码的格式化

## 解决与 ESLint 的冲突 ‌

安装`eslint-config-prettier`插件来关闭 ESLint 中可能导致冲突的规则，确保 Prettier 和 ESLint 可以兼容使用 ‌。通过合理配置和使用 Prettier，可以有效地提升代码的可读性和一致性。

## commit 前格式化

可以设置在 git 提交之前执行一次格式化( pre-commit hook )，这样我们仓库里的代码就都是格式化好的了。

需要安装 husky 和 lint-staged 这两个依赖才能实现，其中 husky 是帮助添加 git hooks 的工具，而 lint-staged 则是筛选那些 staged 的 git 文件执行 lint。

只需要在 package.json 里面加入一些配置。

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  }
}
```
