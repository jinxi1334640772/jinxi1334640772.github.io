---
title: 🌍 Vue I18n 国际化完全指南
description: Vue I18n 国际化插件的完整使用指南，包含配置、API、最佳实践等，助力构建多语言应用
outline: deep
---

# 🌍 Vue I18n 国际化完全指南

> Vue I18n 是一个 Vue.js 的国际化插件，它提供了一种简单的方式来处理应用中的多语言支持。通过这个插件，我们可以轻松地在应用中切换语言，支持多种语言的翻译，并且可以处理日期、数字等多种类型的格式化。

## 📦 安装配置

### 🔧 基础配置

```javascript
import { createI18n } from "vue-i18n";

// 初始化 i18n
export default const i18n = createI18n({
  legacy: false, // 解决 Not available in legacy mode 报错
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: "zhCn", // 默认当前语言为中文
  
  // 语言没有匹配到时的回退 string|Array|Object
  fallbackLocale: ["en", "zhCn"],
  formatFallbackMessages: true,
  
  // 自定义变量修饰符
  modifiers: {
    snakeCase: (str) => str.split(' ').join('_')
  },
  
  // 自定义日期时间格式化
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      },
      long: {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        weekday: 'short', 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true
      }
    },
  },
  
  // 自定义多元化规则
  pluralizationRules: {
    en: (choice, choicesLength, orgRule) => number
  },
  
  // 自定义数字格式化
  numberFormats: {
    en: {
      currency: {
        style: 'currency', 
        currency: 'USD', 
        notation: 'standard'
      },
      decimal: {
        style: 'decimal', 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent', 
        useGrouping: false
      }
    }
  },
  
  // 语言包配置
  messages: {
    en: {
      app: {
        title: '{0} world', // 插值
        hello: '%{msg} <br> world', // 变量
        address: "{account}{'@'}{domain}", // 多个变量，@ 为常量
        linked: '@:app.dio @:app.hello', // 使用前面的变量
        homeAddress: 'Home address',
        
        // 修饰符语法：@.modifier:key
        toLowerHomeAddress: '@.lower:app.homeAddress',
        custom_modifier: "@.snakeCase:{'app.homeAddress'}",
        
        // 多元化支持
        car: 'car | cars',
        apple: 'no apples | one apple | {count} apples'
      },
    },
    zhCn: {
      app: { 
        title: '精彩案例' 
      }
    },
  }
});

// 更改语言
export function initLangListener(lang) {
  // legacy: false 时，此时 locale 是个 ref，需要加 value
  i18n.global.locale.value = lang;
  
  // legacy: true 时
  // i18n.global.locale = lang;
}
```

::: tip 💡 配置说明
- **legacy**: 设置为 `false` 启用 Composition API 模式
- **globalInjection**: 全局注入，可在组件中直接使用 `$t`
- **fallbackLocale**: 语言回退机制，支持多级回退
- **modifiers**: 自定义修饰符，用于格式化翻译内容
:::

## 🚀 注册 i18n

```javascript
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  // Vue I18n 配置选项
});

const app = createApp({
  // Vue 应用配置
});

app.use(i18n);
app.mount("#app");
```

## 📝 基础使用

### 🔤 文本翻译

```vue
<template>
  <div>
    <!-- 基础插值 -->
    <p>{{ $t('app.title', ['hello']) }}</p>
    
    <!-- 变量插值 -->
    <p>{{ $t('app.hello', { msg: 'hello' }) }}</p>
    
    <!-- 多变量插值 -->
    <p>{{ $t('app.address', { account: 'foo', domain: 'domain.com' }) }}</p>
    
    <!-- 链接翻译 -->
    <p>{{ $t('app.linked') }}</p>
    
    <!-- 通过指令使用 -->
    <p v-t="'app.hello'">通过指令使用 i18n 定义的数据</p>
    <p v-t="path">通过指令也可以使用组件内定义的 data</p>
    
    <!-- 复杂指令用法 -->
    <p v-t="{ path: 'message.hi', args: { name: 'kazupon' } }"></p>
    <p v-t="{ path: byePath, locale: 'en' }"></p>
    <p v-t="{ path: 'message.apple', plural: appleCount }"></p>
  </div>
</template>
```

### 🔢 多元化支持

```vue
<template>
  <div>
    <!-- 单复数自动切换 -->
    <p>{{ $t('app.car', 1) }}</p>  <!-- 输出: car -->
    <p>{{ $t('app.car', 2) }}</p>  <!-- 输出: cars -->
    
    <!-- 复杂多元化 -->
    <p>{{ $t('app.apple', 0) }}</p>  <!-- 输出: no apples -->
    <p>{{ $t('app.apple', 1) }}</p>  <!-- 输出: one apple -->
    <p>{{ $t('app.apple', 10, { count: 'too many' }) }}</p>  <!-- 输出: too many apples -->
  </div>
</template>
```

## 📅 日期时间格式化

### 🕐 基础日期格式化

```vue
<template>
  <div>
    <!-- 简单日期格式化 -->
    <p>{{ $d(new Date(), 'short') }}</p>  <!-- 输出: Apr 19, 2017 -->
    
    <!-- 组件方式 -->
    <i18n-d tag="p" :value="new Date()" locale="en"></i18n-d>
    <i18n-d tag="p" :value="new Date()" format="long"></i18n-d>
    
    <!-- 自定义格式 -->
    <i18n-d 
      tag="span" 
      :value="new Date()" 
      locale="ja-JP-u-ca-japanese" 
      :format="{ key: 'long', era: 'narrow' }"
    >
      <template #era="props">
        <span style="color: green">{{ props.era }}</span>
      </template>
      <template #literal="props">
        <span style="color: green">{{ props.literal }}</span>
      </template>
    </i18n-d>
  </div>
</template>
```

## 💰 数字格式化

### 🔢 基础数字格式化

```vue
<template>
  <div>
    <!-- 货币格式化 -->
    <p>{{ $n(987654321, 'currency', { notation: 'compact' }) }}</p>  <!-- 输出: $988M -->
    
    <!-- 百分比格式化 -->
    <p>{{ $n(0.99123, 'percent') }}</p>  <!-- 输出: 99% -->
    <p>{{ $n(0.99123, 'percent', { minimumFractionDigits: 2 }) }}</p>  <!-- 输出: 99.12% -->
    
    <!-- 小数格式化 -->
    <p>{{ $n(12.11612345, 'decimal') }}</p>  <!-- 输出: 12.12 -->
    
    <!-- 组件方式 -->
    <i18n-n tag="span" :value="100"></i18n-n>  <!-- 输出: 100 -->
    <i18n-n tag="span" :value="100" format="currency"></i18n-n>  <!-- 输出: $100.00 -->
    <i18n-n tag="span" :value="100" format="currency" locale="ja-JP"></i18n-n>  <!-- 输出: ￥100 -->
    
    <!-- 自定义格式 -->
    <i18n-n 
      tag="span" 
      :value="1234" 
      :format="{ key: 'currency', currency: 'EUR' }"
    >
      <template #currency="slotProps">
        <span style="color: green">{{ slotProps.currency }}</span>
      </template>
      <template #integer="slotProps">
        <span style="font-weight: bold">{{ slotProps.integer }}</span>
      </template>
      <template #group="slotProps">
        <span style="font-weight: bold">{{ slotProps.group }}</span>
      </template>
      <template #fraction="slotProps">
        <span style="font-size: small">{{ slotProps.fraction }}</span>
      </template>
    </i18n-n>
  </div>
</template>
```

## 🎯 高级特性

### 🔧 修饰符使用

| 修饰符 | 功能 | 示例 |
|--------|------|------|
| `@.lower` | 转换为小写 | `@.lower:app.homeAddress` |
| `@.upper` | 转换为大写 | `@.upper:app.homeAddress` |
| `@.capitalize` | 首字母大写 | `@.capitalize:app.homeAddress` |
| 自定义修饰符 | 自定义格式化 | `@.snakeCase:app.homeAddress` |

### 🔗 链接翻译

```javascript
// 在语言包中使用 @: 语法引用其他翻译
const messages = {
  en: {
    app: {
      hello: 'Hello',
      world: 'World',
      greeting: '@:app.hello @:app.world'  // 输出: Hello World
    }
  }
}
```

## 🎨 最佳实践

### 📁 文件结构建议

```
src/
├── locales/
│   ├── en/
│   │   ├── common.js
│   │   ├── pages.js
│   │   └── index.js
│   ├── zh-CN/
│   │   ├── common.js
│   │   ├── pages.js
│   │   └── index.js
│   └── index.js
└── i18n.js
```

### 🔧 模块化配置

```javascript
// locales/en/index.js
import common from './common'
import pages from './pages'

export default {
  common,
  pages
}

// locales/index.js
import en from './en'
import zhCN from './zh-CN'

export default {
  en,
  'zh-CN': zhCN
}
```

### 🚀 性能优化

::: tip 🎯 优化建议
1. **懒加载语言包**: 只加载当前需要的语言
2. **分模块管理**: 按页面或功能模块分割语言包
3. **缓存机制**: 利用浏览器缓存减少重复加载
4. **压缩优化**: 生产环境压缩语言包文件
:::

### 🔍 调试技巧

```javascript
// 开发环境显示缺失的翻译
const i18n = createI18n({
  // ...其他配置
  silentTranslationWarn: false,
  silentFallbackWarn: false,
  missing: (locale, key) => {
    console.warn(`Missing translation: ${locale}.${key}`)
  }
})
```

## 🌟 总结

Vue I18n 提供了完整的国际化解决方案，支持：

- ✅ **多语言切换**: 动态语言切换
- ✅ **格式化支持**: 日期、数字、货币格式化
- ✅ **多元化处理**: 智能单复数处理
- ✅ **模块化管理**: 灵活的语言包组织
- ✅ **性能优化**: 懒加载和缓存机制
- ✅ **开发友好**: 丰富的调试和错误处理

通过合理的配置和使用，Vue I18n 能够帮助构建出色的多语言应用。
