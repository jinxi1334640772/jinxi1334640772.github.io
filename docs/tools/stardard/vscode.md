## VSCode 简介

::: tip 强烈建议
VSCode IDE，轻量，性能好，占用内存小，广泛用于前端开发中。项目一般都有统一的代码风格，建议团队开发先配置好 eslint、prettier，把配置共享给其他同事，共用相同代码风格配置更利于项目开发、维护。
:::

官网地址：[https://code.visualstudio.com/](https://code.visualstudio.com/)

## VSCode 插件安装

点击左侧导航的扩展图标，进入插件市场，复制粘贴以下插件进行安装（可批量搜索，空格隔开）

- Vue Language Features (Volar) vue3 版本插件
- Auto Close Tag
- Auto Rename Tag
- background-cover
- Bracket Pair Colorizer
- Chinese (Simplified) Language Pack for Visual Studio Code
- Color Info
- CSS Peek
- Debugger for Chrome
- DotENV
- ESLint
- filesize
- GitLens — Git supercharged
- HTML Boilerplate
- HTML CSS Support
- HTML Snippets
- Icon Fonts
- Iconify IntelliSense
- JavaScript (ES6) code snippets
- Jest
- language-postcss
- Less IntelliSense
- markdownlint
- Material Icon Theme
- open in browser
- Path Intellisense
- Prettier - Code formatter
- SCSS IntelliSense
- Tailwind CSS IntelliSense
- vscode-fileheader
- vscode-icons
- bookmarks 代码添加标签，从而快速定位
- path intellisence 自动补全路径名称
- project manager 项目管理，方便项目切换
- Git Graph
- vetur vue2 版本代码高亮代码

## VSCode 配置

> VSCode 配置分为用户配置和项目配置。

- 用户配置被所有项目使用，其配置文件保存在用户目录里。
- 项目配置被单个项目使用，并且优先级更高，其配置文件保存在项目根目录下的.vscode 文件夹下。我的 VSCode 配置如下：

```json
{
  "editor.quickSuggestions": {
    "other": true,
    "comments": true,
    "strings": true
  },
  "files.associations": {
    ".ejs": "html",
    ".js": "html",
    ".vue": "html",
    "*.vue": "vue"
  },
  "editor.mouseWheelZoom": true,
  "workbench.statusBar.visible": true,
  "terminal.integrated.copyOnSelection": true,
  "terminal.integrated.cursorBlinking": true,
  "editor.minimap.enabled": true,
  "terminal.integrated.cursorStyle": "line",
  "vetur.format.options.tabSize": 2,
  "html.format.contentUnformatted": "pre,code,textarea",
  "[jsonc]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[html]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "[vue]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "git.ignoreLimitWarning": true,
  "editor.wordWrapColumn": 180,
  "vetur.format.enable": true,
  "vetur.experimental.templateInterpolationService": true,
  "prettier.printWidth": 180,
  "prettier.jsxSingleQuote": true,
  "prettier.singleQuote": true,
  "prettier.tabWidth": 2,
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": { "wrap_attributes": "auto" },
    "prettyhtml": {
      "printWidth": 180,
      "singleQuote": true,
      "wrapAttributes": false,
      "sortAttributes": false,
      "semi": true,
      "proseWrap": "preserve"
    }
  },
  "prettier.trailingComma": "all",
  "prettier.useEditorConfig": false,
  "editor.scrollBeyondLastLine": false,
  "gulp.autoDetect": "off",
  "grunt.autoDetect": "off",
  "editor.dragAndDrop": false,
  "editor.semanticHighlighting.enabled": true,
  "editor.tabCompletion": "on",
  "editor.quickSuggestionsDelay": 0,
  "workbench.enableExperiments": false,
  "window.autoDetectHighContrast": false,
  "emmet.showSuggestionsAsSnippets": true,
  "emmet.triggerExpansionOnTab": true,
  "jake.autoDetect": "off",
  "php.suggest.basic": false,
  "php.validate.enable": false,
  "scss.validate": false,
  "workbench.startupEditor": "newUntitledFile",
  "workbench.tree.indent": 2,
  "editor.formatOnSave": true,
  "files.autoSave": "onWindowChange",
  "files.trimFinalNewlines": true,
  "debug.inlineValues": true,
  "vetur.validation.interpolation": false,
  "editor.suggestSelection": "first",
  "timeline.excludeSources": [],
  "sync.gist": "126af5b042974075c785d9076035e007",
  "sync.autoDownload": false,
  "sync.autoUpload": false,
  "git.confirmSync": false,
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "explorer.confirmDelete": false,
  "terminal.integrated.tabs.enabled": false,
  "window.zoomLevel": 0,
  "security.workspace.trust.untrustedFiles": "open",
  "html.format.wrapAttributes": "aligned-multiple",
  "editor.bracketPairColorization.enabled": true,
  "prettier.jsxBracketSameLine": true,
  "editor.renderLineHighlight": "all",
  "editor.snippetSuggestions": "top",
  "bracketPairColorizer.depreciation-notice": false
}
```

## 自定义 VSCode 代码片段

> 使用方法：设置-用户代码片段-选择要触发的文件类型-编写 json 模板

- `prefix` 这里是触发代码提示的按键前缀
- `description` 这是代码提示的描述信息
- `body` 要编写的模板内容
  - $1, $2... tab 键时，光标停顿位置
  - $0 最后的光标位置
  - ${1:label}, ${2:another} placeholders 默认值

代码片段配置文件，可以配置多个模板，每个模板是一个键值对组合。如下所示:

```json
{
    "名称不重要，不会显示出来": {
    "prefix": "这里是触发代码提示的按键前缀",
    "body": ["<temp333late>", "$0","这里是要编写的模板内容注意格式，会原样输出" "</temp333late>"],
    "description": "这是代码提示的描述信息：vue基础模板"
  },
  "vue单文件框架代码模板": {
    "prefix": "vue",
    "body": [
      "<template>",
      "$0",
      "</template>",
      "<script>",
      "export default {",
      "  name: 'componentName',",
      "  props: {",
      "    propName:{",
      "       type:String,",
      "       default:''",
      "   }",
      "},",
      "  components: {},",
      "  data () {",
      "   return {",
      "     tableData: [],",
      "     formData: {},",
      "    };",
      "  },",
      "  computed: {},",
      "  methods: {",
      "    handleSearch(){",
      "",
      "       },",
      "    },",
      "  created () {",
      "  },",
      "};",
      "</script> ",
      "<style scoped lang='less'>",
      "",
      "</style>"
    ],
    "description": "vue基础模板，快速生成vue单文件组件的代码模板"
  },
}
```

## .editorconfig 文件

用于在团队中统一代码风格设置，确保不同开发者在不同的编辑器或 IDE 中遵循相同的代码格式标准。许多代码编辑器（如 VSCode、IntelliJ IDEA、Atom）和 IDE 支持 .editorconfig 文件，并在打开项目时自动应用配置规则。只能覆盖基础的代码风格控制，建议与 Prettier、ESLint 等代码格式化工具配合使用，实现更精细的代码规范。

.editorconfig 文件使用键值对语法，包含多个部分：

- 根定义：文件开头常用 root = true 标记是否为顶层配置（即，是否需要递归查找其他 .editorconfig 文件）。
- 节：每个节使用文件匹配模式来定义规则的适用范围（类似 .gitignore 的文件匹配规则）。
- 属性：每节可以设置不同的代码风格属性，如缩进、编码格式等。

```txt
# 指定为顶级配置文件，停止递归查找其他 .editorconfig 文件
root = true

# 文件的匹配模式
[*.{js,jsx,ts,tsx,vue}]
indent_style = space         # 使用空格缩进
indent_size = 4              # 缩进为 4 个空格
end_of_line = lf             # 使用 LF 换行符
charset = utf-8              # 文件编码为 UTF-8
trim_trailing_whitespace = true # 删除行尾多余空格
insert_final_newline = true  # 文件末尾保留空行

# 针对 Python 文件的特殊配置
[*.py]
indent_size = 4

# 针对 Markdown 文件的特殊配置
[*.md]
trim_trailing_whitespace = false # Markdown 文件不删除行尾空格
```
