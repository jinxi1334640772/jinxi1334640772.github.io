# 路由配置

## 基于文件的路由

VitePress 使用基于文件的路由，这意味着生成的 HTML 页面是从源 Markdown 文件的目录结构映射而来的。例如，给定以下目录结构：

```ts
.
├─ guide
│  ├─ getting-started.md
│  └─ index.md
├─ index.md
└─ prologue.md
```
生成的HTML页面：
```
index.md                  -->  /index.html (可以通过 / 访问)
prologue.md               -->  /prologue.html
guide/index.md            -->  /guide/index.html (可以通过 /guide/ 访问)
guide/getting-started.md  -->  /guide/getting-started.html
```
生成的 HTML 可以托管在任何支持静态文件的 Web 服务器上。

## 根目录

当从命令行运行 vitepress dev 或 vitepress build 时，VitePress 将使用当前工作目录作为项目根目录。要将子目录指定为根目录，需要将相对路径传递给命令。例如，如果 VitePress 项目位于 ./docs，应该运行 vitepress dev docs：

```ts
.
├─ docs                    # 项目根目录
│  ├─ .vitepress           # 配置目录
│  ├─ getting-started.md
│  └─ index.md
└─ ...
```
这将导致以下源代码到 HTML 的映射：
```
docs/index.md            -->  /index.html (可以通过 / 访问)
docs/getting-started.md  -->  /getting-started.html
```

## 源目录

源目录是 Markdown 源文件所在的位置。默认情况下，它与项目根目录相同。但是，可以通过 srcDir 配置选项对其进行配置。

srcDir 选项是相对于项目根目录解析的。例如，对于 srcDir: 'src'，文件结构将如下所示：
```
.                          # 项目根目录
├─ .vitepress              # 配置目录
└─ src                     # 源目录
   ├─ getting-started.md
   └─ index.md
```
生成的源代码到 HTML 的映射：

```
src/index.md            -->  /index.html (可以通过 / 访问)
src/getting-started.md  -->  /getting-started.html
```
## 页面链接

在页面之间链接时，可以使用绝对路径和相对路径。请注意，虽然 .md 和 .html 扩展名都可以使用，但最佳做法是省略文件扩展名，以便 VitePress 可以根据配置生成最终的 URL。

```md
<!-- Do -->
[Getting Started](./getting-started)
[Getting Started](../guide/getting-started)

<!-- Don't -->
[Getting Started](./getting-started.md)
[Getting Started](./getting-started.html)
```

## 链接到非 VitePress 页面

如果想链接到站点中不是由 VitePress 生成的页面，需要使用完整的 URL（在新选项卡中打开）或明确指定 target：

```md
[Link to pure.html](http://baidu.com){target="_self"}
```

## 动态路由

可以使用单个 Markdown 文件和动态数据生成许多页面。例如，可以创建一个 packages/[pkg].md 文件，为项目中的每个包生成相应的页面。这里，[pkg] 段是一个路由参数，用于区分每个页面。

## 动态生成路经

- 一般情况下，我们添加菜单时，代码都是在编译中（cnpm run dev）。所以我们先新增文件夹，后再添加代码到 [/@/router/route.ts](https://gitee.com/lyt-top/vue-next-admin/blob/master/src/router/route.ts) 文件中，防止需要重新再运行项目。`/@/views` 下新增 `personal` 文件夹

## 访问页面中的参数

可以使用参数将附加数据传递到每个页面。Markdown 路由文件可以通过 $params 全局属性访问 Vue 表达式中的当前页面参数：

```md
- package name: {{ $params.pkg }}
- version: {{ $params.version }}
```

还可以通过 useData 运行时 API 访问当前页面的参数。这在 Markdown 文件和 Vue 组件中都可用：

```vue
<script setup>
import { useData } from 'vitepress'

// params 是一个 Vue ref
const { params } = useData()

console.log(params.value)
</script>
```

## 渲染原始内容

传递给页面的参数将在客户端 JavaScript payload 中序列化，因此应该避免在参数中传递大量数据，例如从远程 CMS 获取的原始 Markdown 或 HTML 内容。

相反，可以使用每个路径对象上的 content 属性将此类内容传递到每个页面：
```js
export default {
  async paths() {
    const posts = await (await fetch('https://my-cms.com/blog-posts')).json()

    return posts.map((post) => {
      return {
        params: { id: post.id },
        content: post.content // 原始 Markdown 或 HTML
      }
    })
  }
}
```

然后，使用以下特殊语法将内容呈现为 Markdown 文件本身的一部分：

```js
<!-- @content -->
```

