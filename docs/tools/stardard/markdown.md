---
title: Markdown 使用指南
description: 全面介绍 Markdown 语法、扩展特性、VitePress 增强功能和最佳实践，帮助你编写优秀的技术文档。
outline: deep
---

# 📝 Markdown 使用指南

Markdown 是一种轻量级标记语言，由 John Gruber 在 2004 年创建。它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的 HTML 文档。Markdown 已成为技术文档、博客、README 文件的事实标准。

::: tip 📚 本章内容
- Markdown 基础语法（标题、段落、强调、列表等）
- 高级语法（表格、代码块、链接、图片等）
- GFM（GitHub Flavored Markdown）扩展
- VitePress 增强特性（容器、Emoji、目录等）
- 最佳实践和使用技巧
:::

---

## 1. 基础语法

### 1.1 标题 (Headings)

Markdown 支持两种标题语法：

#### Setext 风格（仅支持一级和二级标题）

```markdown
一级标题
========

二级标题
--------
```

#### Atx 风格（推荐，支持 1-6 级标题）

```markdown
# 一级标题 (H1)
## 二级标题 (H2)
### 三级标题 (H3)
#### 四级标题 (H4)
##### 五级标题 (H5)
###### 六级标题 (H6)
```

**效果展示**：

# 一级标题 (H1)
## 二级标题 (H2)
### 三级标题 (H3)
#### 四级标题 (H4)
##### 五级标题 (H5)
###### 六级标题 (H6)

::: tip 💡 最佳实践
- 一个文档只使用一个 H1 标题（通常是文档标题）
- 标题层级不要跳跃（如从 H2 直接到 H4）
- 标题前后建议空一行，增加可读性
- 标题后的 `#` 号是可选的，但建议保持一致
:::

---

### 1.2 段落和换行 (Paragraphs and Line Breaks)

#### 段落

段落之间用**空行**分隔：

```markdown
这是第一个段落。

这是第二个段落。
```

**效果**：

这是第一个段落。

这是第二个段落。

#### 换行

在行尾添加**两个或多个空格**，然后按回车键：

```markdown
这是第一行。  
这是第二行。
```

**效果**：

这是第一行。  
这是第二行。

::: tip 💡 推荐方式
使用 `<br>` 标签实现换行更加明确：
```markdown
这是第一行。<br>
这是第二行。
```
:::

---

### 1.3 强调 (Emphasis)

#### 斜体 (Italic)

使用 `*` 或 `_` 包裹文本：

```markdown
*斜体文本*
_斜体文本_
```

**效果**：*斜体文本* 或 _斜体文本_

#### 粗体 (Bold)

使用 `**` 或 `__` 包裹文本：

```markdown
**粗体文本**
__粗体文本__
```

**效果**：**粗体文本** 或 __粗体文本__

#### 粗斜体 (Bold Italic)

使用 `***` 或 `___` 包裹文本：

```markdown
***粗斜体文本***
___粗斜体文本___
```

**效果**：***粗斜体文本*** 或 ___粗斜体文本___

#### 删除线 (Strikethrough)

使用 `~~` 包裹文本（GFM 扩展）：

```markdown
~~删除的文本~~
```

**效果**：~~删除的文本~~

::: warning ⚠️ 注意
- 强调符号与文本之间不要有空格
- 中文和英文混排时，建议在英文前后加空格
:::

---

### 1.4 列表 (Lists)

#### 无序列表 (Unordered List)

使用 `*`、`+` 或 `-` 作为列表标记：

```markdown
* 项目一
* 项目二
* 项目三

+ 项目一
+ 项目二
+ 项目三

- 项目一
- 项目二
- 项目三
```

**效果**：

- 项目一
- 项目二
- 项目三

#### 有序列表 (Ordered List)

使用数字加 `.` 作为列表标记：

```markdown
1. 第一项
2. 第二项
3. 第三项
```

**效果**：

1. 第一项
2. 第二项
3. 第三项

::: tip 💡 自动编号
Markdown 会自动处理数字，以下写法效果相同：
```markdown
1. 第一项
1. 第二项
1. 第三项
```
:::

#### 嵌套列表

使用缩进（2 或 4 个空格）创建嵌套列表：

```markdown
- 项目一
  - 子项目 1.1
  - 子项目 1.2
    - 子项目 1.2.1
- 项目二
  1. 有序子项 2.1
  2. 有序子项 2.2
```

**效果**：

- 项目一
  - 子项目 1.1
  - 子项目 1.2
    - 子项目 1.2.1
- 项目二
  1. 有序子项 2.1
  2. 有序子项 2.2

#### 任务列表 (Task List)

使用 `- [ ]` 和 `- [x]` 创建任务列表（GFM 扩展）：

```markdown
- [x] 已完成任务
- [ ] 未完成任务
- [ ] 待处理任务
```

**效果**：

- [x] 已完成任务
- [ ] 未完成任务
- [ ] 待处理任务

---

### 1.5 引用 (Blockquotes)

使用 `>` 符号创建引用：

```markdown
> 这是一个引用块。
> 可以包含多行文本。

> 引用可以嵌套。
>> 这是嵌套的引用。
>>> 这是第三层引用。
```

**效果**：

> 这是一个引用块。
> 可以包含多行文本。

> 引用可以嵌套。
>> 这是嵌套的引用。
>>> 这是第三层引用。

::: tip 💡 高级用法
引用块内可以包含其他 Markdown 元素：
```markdown
> ### 引用中的标题
> 
> - 列表项一
> - 列表项二
> 
> **粗体文本** 和 *斜体文本*
```
:::

---

### 1.6 代码 (Code)

#### 行内代码 (Inline Code)

使用反引号 `` ` `` 包裹代码：

```markdown
这是 `行内代码` 示例。
```

**效果**：这是 `行内代码` 示例。

#### 代码块 (Code Block)

使用三个反引号 ``` 或缩进 4 个空格：

**方式一：围栏式代码块（推荐）**

````markdown
```javascript
function hello() {
  console.log('Hello, Markdown!');
}
```
````

**方式二：缩进式代码块**

```markdown
    function hello() {
      console.log('Hello, Markdown!');
    }
```

**效果**：

```javascript
function hello() {
  console.log('Hello, Markdown!');
}
```

#### 语法高亮

在代码块的开始标记后指定语言：

````markdown
```python
def greet(name):
    print(f"Hello, {name}!")
```

```typescript
interface User {
  name: string;
  age: number;
}
```

```bash
npm install vitepress
pnpm dev
```
````

**效果**：

```python
def greet(name):
    print(f"Hello, {name}!")
```

```typescript
interface User {
  name: string;
  age: number;
}
```

```bash
npm install vitepress
pnpm dev
```

::: tip 💡 支持的语言
常用语言标识符：`javascript`、`typescript`、`python`、`java`、`cpp`、`csharp`、`php`、`ruby`、`go`、`rust`、`html`、`css`、`scss`、`json`、`yaml`、`xml`、`sql`、`bash`、`shell`、`markdown` 等。
:::

---

### 1.7 分隔线 (Horizontal Rules)

使用三个或更多的 `*`、`-` 或 `_` 创建分隔线：

```markdown
***

---

___
```

**效果**：

---

::: tip 💡 注意事项
- 分隔线前后建议空一行
- 三种符号效果完全相同
- 推荐使用 `---`，视觉上更清晰
:::

---

## 2. 高级语法

### 2.1 链接 (Links)

#### 行内式链接

```markdown
[链接文字](URL "可选的标题")

[百度](https://www.baidu.com)
[Google](https://www.google.com "Google 搜索")
```

**效果**：

[百度](https://www.baidu.com)  
[Google](https://www.google.com "Google 搜索")

#### 参考式链接

```markdown
这是一个 [参考式链接][ref]。

[ref]: https://www.example.com "Example 网站"
```

**效果**：

这是一个 [参考式链接][ref]。

[ref]: https://www.example.com "Example 网站"

#### 自动链接

```markdown
<https://www.example.com>
<email@example.com>
```

**效果**：

<https://www.example.com>  
<email@example.com>

#### 内部链接

```markdown
[跳转到标题](#21-链接-links)
[相对路径](/tools/stardard/git)
```

**效果**：

[跳转到标题](#21-链接-links)  
[相对路径](/tools/stardard/git)

---

### 2.2 图片 (Images)

#### 行内式图片

```markdown
![替代文字](图片URL "可选的标题")

![Logo](./image.png)
![Avatar](https://example.com/avatar.jpg "用户头像")
```

#### 参考式图片

```markdown
![Logo][logo]

[logo]: ./image.png "网站 Logo"
```

#### 图片尺寸控制

使用 HTML 标签：

```markdown
<img src="./image.png" alt="Logo" width="200" height="100">
```

#### 图片链接

```markdown
[![Logo](./image.png)](https://www.example.com)
```

::: tip 💡 VitePress 图片增强
在 VitePress 中，可以使用自定义属性：
```markdown
![Logo](./image.png){data-fancybox="gallery"}
```
:::

---

### 2.3 表格 (Tables)

使用 `|` 和 `-` 创建表格（GFM 扩展）：

```markdown
| 表头一 | 表头二 | 表头三 |
|-------|-------|-------|
| 内容1  | 内容2  | 内容3  |
| 内容4  | 内容5  | 内容6  |
```

**效果**：

| 表头一 | 表头二 | 表头三 |
|-------|-------|-------|
| 内容1  | 内容2  | 内容3  |
| 内容4  | 内容5  | 内容6  |

#### 对齐方式

使用 `:` 控制对齐：

```markdown
| 左对齐 | 居中对齐 | 右对齐 |
|:------|:-------:|------:|
| 左1   | 中1     | 右1   |
| 左2   | 中2     | 右2   |
```

**效果**：

| 左对齐 | 居中对齐 | 右对齐 |
|:------|:-------:|------:|
| 左1   | 中1     | 右1   |
| 左2   | 中2     | 右2   |

::: tip 💡 表格技巧
- 表格前后建议空一行
- 列宽会自动调整，不需要手动对齐
- 表格内可以使用行内代码、链接、强调等
- 复杂表格建议使用在线工具生成
:::

---

### 2.4 脚注 (Footnotes)

```markdown
这是一个脚注示例[^1]。

这是另一个脚注[^note]。

[^1]: 这是第一个脚注的内容。
[^note]: 这是第二个脚注的内容，支持多行。
    可以使用缩进继续编写。
```

**效果**：

这是一个脚注示例[^1]。

这是另一个脚注[^note]。

[^1]: 这是第一个脚注的内容。
[^note]: 这是第二个脚注的内容，支持多行。

---

### 2.5 定义列表 (Definition Lists)

```markdown
术语一
: 定义一

术语二
: 定义二A
: 定义二B
```

::: warning ⚠️ 兼容性
定义列表不是所有 Markdown 解析器都支持，VitePress 支持需要额外配置。
:::

---

### 2.6 缩写 (Abbreviations)

```markdown
HTML 是一种标记语言。

*[HTML]: Hyper Text Markup Language
```

**效果**：鼠标悬停在 HTML 上会显示完整名称。

---

### 2.7 转义字符 (Escaping)

使用反斜杠 `\` 转义 Markdown 特殊字符：

```markdown
\* 这不是强调 \*
\[ 这不是链接 \]
\` 这不是代码 \`
```

**效果**：

\* 这不是强调 \*  
\[ 这不是链接 \]  
\` 这不是代码 \`

**可转义的字符**：

```
\   反斜杠
`   反引号
*   星号
_   下划线
{}  大括号
[]  中括号
()  小括号
#   井号
+   加号
-   减号
.   句点
!   感叹号
|   竖线
```

---

## 3. GFM 扩展特性

### 3.1 自动链接

URL 和邮箱地址会自动转换为链接：

```markdown
https://www.github.com
user@example.com
```

**效果**：

https://www.github.com  
user@example.com

---

### 3.2 表情符号 (Emoji)

使用 `:emoji_name:` 语法：

```markdown
:smile: :heart: :thumbsup: :rocket: :star:
```

**效果**：

:smile: :heart: :thumbsup: :rocket: :star:

**常用 Emoji**：

```markdown
😀 :smile:          📚 :books:         🚀 :rocket:
❤️ :heart:          💡 :bulb:          ⚡ :zap:
👍 :thumbsup:       🔧 :wrench:        🎯 :dart:
⭐ :star:          🌟 :sparkles:      ✅ :white_check_mark:
❌ :x:             ⚠️ :warning:       📝 :memo:
```

::: tip 💡 Emoji 资源
完整 Emoji 列表：[https://www.webfx.com/tools/emoji-cheat-sheet/](https://www.webfx.com/tools/emoji-cheat-sheet/)
:::

---

### 3.3 语法高亮

GFM 支持代码块语法高亮（见 1.6 节）。

---

### 3.4 表格支持

GFM 原生支持表格（见 2.3 节）。

---

### 3.5 任务列表

GFM 支持任务列表（见 1.4 节）。

---

## 4. VitePress 增强特性

### 4.1 自定义容器 (Custom Containers)

VitePress 提供了多种自定义容器：

```markdown
::: info 信息提示
这是一个信息提示框。
:::

::: tip 💡 提示
这是一个提示框。
:::

::: warning ⚠️ 警告
这是一个警告框。
:::

::: danger ❌ 危险
这是一个危险警告框。
:::

::: details 点击查看详情
这是一个可折叠的详情框。
:::
```

**效果**：

::: info 信息提示
这是一个信息提示框。
:::

::: tip 💡 提示
这是一个提示框。
:::

::: warning ⚠️ 警告
这是一个警告框。
:::

::: danger ❌ 危险
这是一个危险警告框。
:::

::: details 点击查看详情
这是一个可折叠的详情框。
:::

---

### 4.2 代码块增强

#### 行高亮

```markdown
```javascript {2,4-6}
function example() {
  const a = 1; // 高亮
  const b = 2;
  const c = 3; // 高亮
  const d = 4; // 高亮
  const e = 5; // 高亮
}
```
```

#### 行号

```markdown
```javascript:line-numbers
function example() {
  console.log('带行号的代码块');
}
```
```

#### 聚焦行

```markdown
```javascript
function example() {
  const a = 1; // [!code focus]
  const b = 2;
}
```
```

#### 差异对比

```markdown
```javascript
function example() {
  const a = 1; // [!code --]
  const a = 2; // [!code ++]
}
```
```

---

### 4.3 导入代码片段

```markdown
<<< @/filepath
<<< @/filepath{highlightLines}
```

---

### 4.4 数学公式 (Math)

#### 行内公式

```markdown
这是一个行内公式：$E = mc^2$
```

**效果**：这是一个行内公式：$E = mc^2$

#### 块级公式

```markdown
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

**效果**：

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

::: warning ⚠️ 注意
需要安装 `markdown-it-katex` 插件才能使用数学公式。
:::

---

### 4.5 目录 (Table of Contents)

使用 `[[toc]]` 自动生成目录：

```markdown
[[toc]]
```

---

### 4.6 Badge 徽章

```markdown
<Badge type="info" text="默认" />
<Badge type="tip" text="提示" />
<Badge type="warning" text="警告" />
<Badge type="danger" text="危险" />
```

**效果**：

<Badge type="info" text="默认" />
<Badge type="tip" text="提示" />
<Badge type="warning" text="警告" />
<Badge type="danger" text="危险" />

---

### 4.7 团队成员 (Team Members)

```vue
<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/yyx990803.png',
    name: 'Evan You',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/yyx990803' }
    ]
  }
]
</script>

<VPTeamMembers size="small" :members="members" />
```

---

## 5. 最佳实践

### 5.1 文档结构

```markdown
---
title: 文档标题
description: 文档描述
outline: deep
---

# 📚 文档标题

简要介绍（1-2 段）

::: tip 📚 本章内容
学习目标和内容概要
:::

## 1. 第一部分

### 1.1 子章节

内容...

### 1.2 子章节

内容...

## 2. 第二部分

### 2.1 子章节

内容...

---

## 参考资料

- [资源一](链接)
- [资源二](链接)
```

---

### 5.2 命名规范

```markdown
✅ 推荐：
- 文件名使用 kebab-case：markdown-guide.md
- 图片名使用描述性名称：user-avatar.png
- 链接锚点使用小写和连字符：#getting-started

❌ 避免：
- 使用空格：markdown guide.md
- 使用中文文件名：Markdown指南.md
- 使用特殊字符：markdown_guide!.md
```

---

### 5.3 代码块规范

```markdown
✅ 推荐：
- 始终指定语言类型
- 添加注释说明
- 提供完整可运行的示例

❌ 避免：
- 不指定语言类型
- 代码缺少上下文
- 示例不完整或有错误
```

---

### 5.4 图片规范

```markdown
✅ 推荐：
- 提供有意义的 alt 文本
- 图片放在文档同目录
- 使用相对路径引用
- 压缩图片以提高加载速度

❌ 避免：
- alt 文本为空或无意义
- 使用绝对路径
- 图片过大影响加载
```

---

### 5.5 链接规范

```markdown
✅ 推荐：
- 内部链接使用相对路径
- 链接文字具有描述性
- 定期检查外部链接有效性

❌ 避免：
- 使用"点击这里"等无意义链接文字
- 外部链接失效
- 滥用自动链接
```

---

### 5.6 可读性优化

```markdown
✅ 推荐：
- 段落之间空一行
- 列表项前后空一行
- 代码块前后空一行
- 使用标题组织内容
- 合理使用 Emoji 增强可读性

❌ 避免：
- 大段文字没有分段
- 标题层级混乱
- 过度使用 Emoji
```

---

## 6. 常用技巧

### 6.1 快速创建表格

使用在线工具：

- [Tables Generator](https://www.tablesgenerator.com/markdown_tables)
- [Markdown Tables](https://jakebathman.github.io/Markdown-Table-Generator/)

---

### 6.2 Markdown 编辑器

**桌面应用**：
- Typora（付费）
- Mark Text（免费开源）
- VS Code + Markdown Preview Enhanced

**在线编辑器**：
- [StackEdit](https://stackedit.io/)
- [Dillinger](https://dillinger.io/)
- [Editor.md](https://pandao.github.io/editor.md/)

---

### 6.3 Markdown 预览

**VS Code 快捷键**：
- `Ctrl/Cmd + Shift + V`：打开预览
- `Ctrl/Cmd + K V`：侧边栏预览

**浏览器预览**：
- 安装 Markdown Preview Plus 扩展
- 本地使用 VitePress 预览

---

### 6.4 格式化工具

**Prettier 配置**：

```json
{
  "proseWrap": "always",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

**Markdownlint 规则**：

```json
{
  "MD013": false,
  "MD033": false,
  "MD041": false
}
```

---

### 6.5 转换工具

**Markdown → HTML**：
- [marked](https://marked.js.org/)
- [markdown-it](https://markdown-it.github.io/)

**Markdown → PDF**：
- [Pandoc](https://pandoc.org/)
- [md-to-pdf](https://github.com/simonhaenisch/md-to-pdf)

**其他格式**：
- Word → Markdown：[Writage](http://www.writage.com/)
- HTML → Markdown：[Turndown](https://github.com/domchristie/turndown)

---

## 7. 常见问题

### 7.1 中文排版

**问题**：中英文混排时没有空格，可读性差。

**解决**：
```markdown
❌ 使用Markdown编写文档
✅ 使用 Markdown 编写文档

❌ VitePress是一个静态站点生成器
✅ VitePress 是一个静态站点生成器
```

---

### 7.2 特殊字符显示

**问题**：某些特殊字符无法正常显示。

**解决**：使用 HTML 实体或转义：
```markdown
&lt; &gt; &amp; &quot; &#39;
\< \> \& \" \'
```

---

### 7.3 表格宽度

**问题**：表格内容过长导致布局错乱。

**解决**：
```markdown
1. 使用简洁的内容
2. 将长文本拆分为多列
3. 使用 HTML 表格并设置样式
```

---

### 7.4 代码块溢出

**问题**：代码行过长导致水平滚动。

**解决**：
```markdown
1. 适当换行
2. 使用更短的变量名
3. 提取部分代码到其他文件
```

---

### 7.5 图片加载失败

**问题**：图片路径不正确或图片不存在。

**解决**：
```markdown
1. 检查图片路径是否正确
2. 确认图片文件存在
3. 使用相对路径而非绝对路径
4. 检查图片格式是否支持
```

---

## 8. 参考资源

### 8.1 官方文档

- [Markdown 官方教程](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [VitePress 官方文档](https://vitepress.dev/)
- [CommonMark 规范](https://commonmark.org/)

---

### 8.2 学习资源

- [Markdown 语法速查表](https://www.markdownguide.org/cheat-sheet/)
- [Markdown 在线教程](https://commonmark.org/help/tutorial/)
- [Mastering Markdown](https://guides.github.com/features/mastering-markdown/)

---

### 8.3 相关工具

- [Markdown 解析器对比](https://johnmacfarlane.net/babelmark2/)
- [Markdown Lint](https://github.com/DavidAnson/markdownlint)
- [Prettier](https://prettier.io/)
- [Pandoc](https://pandoc.org/)

---

### 8.4 社区资源

- [Markdown 中文社区](https://markdown.com.cn/)
- [Stack Overflow - Markdown 标签](https://stackoverflow.com/questions/tagged/markdown)
- [Reddit - r/Markdown](https://www.reddit.com/r/Markdown/)

---

## 9. 小结

Markdown 是一种简单而强大的标记语言，掌握以下核心要点：

### ✅ 核心语法

- **标题**：使用 `#` 号，6 个级别
- **强调**：`*斜体*`、`**粗体**`、`~~删除线~~`
- **列表**：`-` 无序、`1.` 有序、`- [ ]` 任务
- **链接**：`[文字](URL)`
- **图片**：`![alt](URL)`
- **代码**：`` `行内` `` 和 ``` ```块级``` ```
- **表格**：使用 `|` 和 `-` 分隔

### ✅ 最佳实践

- 保持文档结构清晰
- 使用一致的格式规范
- 提供完整可运行的代码示例
- 优化图片大小和加载速度
- 定期检查链接有效性
- 使用工具辅助编写和预览

### ✅ 进阶技巧

- 掌握 GFM 扩展特性
- 利用 VitePress 增强功能
- 使用自定义容器提升体验
- 合理使用 Emoji 和 Badge
- 善用编辑器和格式化工具

---

::: tip 🚀 继续学习
- [VitePress 使用指南](/frontEnd/web/VitePress) - 深入学习 VitePress 特性
- [Git 使用指南](/tools/stardard/git) - 学习版本控制
- [ESLint 配置指南](/tools/stardard/eslint) - 代码规范工具
:::

---

**最后更新**: 2025年  
**作者**: zhangjinxi  
**许可**: MIT License

