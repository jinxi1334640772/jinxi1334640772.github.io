
# 在 Markdown 使用 Vue

在 VitePress 中，每个 Markdown 文件都被编译成 HTML，而且将其作为 Vue 单文件组件处理。这意味着可以在 Markdown 中使用任何 Vue 功能，包括动态模板、使用 Vue 组件或通过添加 `<script>` 标签为页面的 Vue 组件添加逻辑。

值得注意的是，VitePress 利用 Vue 的编译器自动检测和优化 Markdown 内容的纯静态部分。静态内容被优化为单个占位符节点，并从页面的 JavaScript 负载中删除以供初始访问。在客户端激活期间也会跳过它们。简而言之，只需注意任何给定页面上的动态部分。

## 变量、指令、模板

```html
---
hello: world
---

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

## Markdown Content

The count is: {{ count }}

<button :class="$style.button" @click="count++">Increment</button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>
```
避免在 Markdown 中使用 `<style scoped>`

在 Markdown 中使用时，`<style scoped>` 需要为当前页面的每个元素添加特殊属性，这将显著增加页面的大小。当我们需要局部范围的样式时 `<style module>` 是首选。

还可以访问 VitePress 的运行时 API，例如 useData 辅助函数，它提供了当前页面的元数据：

```md
<script setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<pre>{{ page }}</pre>
```
输出为：

<script setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<pre>{{ page }}</pre>

## 使用组件
可以直接在 Markdown 文件中导入和使用 Vue 组件。
### 在 Markdown 中导入组件
>如果一个组件只被几个页面使用，建议在使用它们的地方显式导入它们。这使它们可以正确地进行代码拆分，并且仅在显示相关页面时才加载：

```md
<script setup>
import CustomComponent from '../../components/CustomComponent.vue'
</script>

# Docs

This is a .md using a custom component

<CustomComponent />

## More docs

```

### 注册全局组件
如果一个组件要在大多数页面上使用，可以通过自定义 Vue 实例来全局注册它们。
> 确保自定义组件的名称包含连字符或采用 PascalCase。否则，它将被视为内联元素并包裹在 `<p>` 标签内，这将导致激活不匹配，因为 `<p>` 不允许将块元素放置在其中。

## 使用css预处理器
VitePress 内置支持 CSS 预处理器：.scss、.sass、.less、.styl 和 .
stylus 文件。无需为它们安装 Vite 专用插件，但必须安装相应的预处理器
```css
<style lang="sass">
.title
  font-size: 20px
</style>
```
## 使用 teleport 传递组件内容
VitePress 目前只有使用 teleport 传送到 body 的 SSG 支持。对于其他地方，可以将它们包裹在内置的 `<ClientOnly>` 组件中，或者通过 postRender 钩子将 teleport 标签注入到最终页面 HTML 中的正确位置。
```js
<ClientOnly>
  <Teleport to="#modal">
    <div>
      // ...
    </div>
  </Teleport>
</ClientOnly>
```
## 国际化
参考：https://vitejs.cn/vitepress/guide/i18n
