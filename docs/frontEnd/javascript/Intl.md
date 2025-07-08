---
title: JavaScript 国际化 - Intl 对象
description: 详细介绍 JavaScript 中的 Intl 国际化 API，包括字符串比较、数字格式化、日期时间格式化、列表格式化等功能
outline: deep
---

# JavaScript 国际化 - Intl 对象

Intl 对象是 ECMAScript 国际化 API 的命名空间，提供了语言敏感的字符串比较、数字格式化、日期时间格式化等功能。

## 概述

Intl 对象提供了以下国际化功能：

| 功能 | 构造函数 | 用途 |
|------|----------|------|
| 字符串比较 | `Intl.Collator` | 语言敏感的字符串排序和比较 |
| 数字格式化 | `Intl.NumberFormat` | 数字、货币、百分比格式化 |
| 日期时间格式化 | `Intl.DateTimeFormat` | 日期和时间的本地化显示 |
| 持续时间格式化 | `Intl.DurationFormat` | 时间段的格式化显示 |
| 相对时间格式化 | `Intl.RelativeTimeFormat` | 相对当前时间的格式化 |
| 列表格式化 | `Intl.ListFormat` | 列表数据的本地化连接 |
| 复数规则 | `Intl.PluralRules` | 复数敏感的格式化 |
| 显示名称 | `Intl.DisplayNames` | 语言、地区、货币等的本地化名称 |
| 文本分割 | `Intl.Segmenter` | 语言敏感的文本分割 |
| 区域标识 | `Intl.Locale` | Unicode 区域标识符 |

::: info 国际化的重要性
在全球化的今天，应用程序需要支持多种语言和地区。Intl API 提供了标准化的国际化功能，让开发者能够轻松创建适应不同文化和语言的应用程序。
:::

## Intl.Collator - 字符串比较

`Intl.Collator` 用于语言敏感的字符串比较和排序，能够正确处理不同语言的排序规则。

### 构造函数

```javascript
/**
 * @param {string|string[]} locales - 语言代码字符串或数组
 * @param {Object} options - 配置选项
 */
new Intl.Collator(locales?, options?)
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `localeMatcher` | string | `"best fit"` | 区域匹配算法 |
| `usage` | string | `"sort"` | 用途：`"sort"` 或 `"search"` |
| `sensitivity` | string | `"variant"` | 敏感度级别 |
| `ignorePunctuation` | boolean | `false` | 是否忽略标点符号 |
| `numeric` | boolean | `false` | 是否使用数字排序 |
| `caseFirst` | string | `"false"` | 大小写优先级 |

### 使用示例

```javascript
// 基本比较
const collator = new Intl.Collator();
console.log(collator.compare("a", "c")); // -1
console.log(collator.compare("c", "a")); // 1
console.log(collator.compare("a", "a")); // 0

// 语言特定排序
console.log(new Intl.Collator("de").compare("ä", "z")); // -1
console.log(new Intl.Collator("sv").compare("ä", "z")); // 1

// 数字排序
const items = ['item20', 'item19', 'item100', 'item9', 'item1'];
console.log(items.sort(new Intl.Collator(undefined, { numeric: true }).compare));
// ['item1', 'item9', 'item19', 'item20', 'item100']
```

## Intl.DateTimeFormat - 日期时间格式化

`Intl.DateTimeFormat` 用于在特定语言环境下格式化日期和时间。

### 构造函数

```javascript
/**
 * @param {string|string[]} locales - 语言代码
 * @param {Object} options - 格式化选项
 */
new Intl.DateTimeFormat(locales?, options?)
```

### 配置选项

| 选项 | 类型 | 描述 |
|------|------|------|
| `calendar` | string | 日历类型：`"chinese"`, `"gregory"`, `"persian"` |
| `numberingSystem` | string | 数字系统：`"arab"`, `"hans"`, `"latn"` |
| `hour12` | boolean | 是否使用 12 小时制 |
| `timeZone` | string | 时区：`"UTC"`, `"Asia/Shanghai"` |
| `weekday` | string | 星期格式：`"long"`, `"short"`, `"narrow"` |
| `year` | string | 年份格式：`"numeric"`, `"2-digit"` |
| `month` | string | 月份格式：`"numeric"`, `"2-digit"`, `"long"`, `"short"` |
| `day` | string | 日期格式：`"numeric"`, `"2-digit"` |

### 使用示例

```javascript
const date = new Date(2023, 11, 25, 15, 30, 0);

// 不同语言的日期格式
console.log(new Intl.DateTimeFormat('en-US').format(date));
// "12/25/2023"

console.log(new Intl.DateTimeFormat('zh-CN').format(date));
// "2023/12/25"

console.log(new Intl.DateTimeFormat('de-DE').format(date));
// "25.12.2023"

// 详细格式
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};

console.log(new Intl.DateTimeFormat('en-US', options).format(date));
// "Monday, December 25, 2023 at 03:30 PM"

console.log(new Intl.DateTimeFormat('zh-CN', options).format(date));
// "2023年12月25日星期一 15:30"
```

### 格式化部分

```javascript
const formatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const parts = formatter.formatToParts(date);
console.log(parts);
// [
//   { type: 'weekday', value: 'Monday' },
//   { type: 'literal', value: ', ' },
//   { type: 'month', value: 'December' },
//   { type: 'literal', value: ' ' },
//   { type: 'day', value: '25' },
//   { type: 'literal', value: ', ' },
//   { type: 'year', value: '2023' }
// ]
```

## Intl.NumberFormat - 数字格式化

`Intl.NumberFormat` 用于在特定语言环境下格式化数字、货币和百分比。

### 构造函数

```javascript
/**
 * @param {string|string[]} locales - 语言代码
 * @param {Object} options - 格式化选项
 */
new Intl.NumberFormat(locales?, options?)
```

### 配置选项

| 选项 | 类型 | 描述 |
|------|------|------|
| `style` | string | 格式化样式：`"decimal"`, `"currency"`, `"percent"`, `"unit"` |
| `currency` | string | 货币代码：`"USD"`, `"EUR"`, `"CNY"` |
| `currencyDisplay` | string | 货币显示：`"code"`, `"symbol"`, `"name"` |
| `minimumFractionDigits` | number | 最小小数位数 |
| `maximumFractionDigits` | number | 最大小数位数 |
| `minimumSignificantDigits` | number | 最小有效数字 |
| `maximumSignificantDigits` | number | 最大有效数字 |

### 使用示例

```javascript
const number = 123456.789;

// 基本数字格式化
console.log(new Intl.NumberFormat('en-US').format(number));
// "123,456.789"

console.log(new Intl.NumberFormat('de-DE').format(number));
// "123.456,789"

console.log(new Intl.NumberFormat('zh-CN').format(number));
// "123,456.789"

// 货币格式化
console.log(new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(number));
// "$123,456.79"

console.log(new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
}).format(number));
// "123.456,79 €"

console.log(new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY'
}).format(number));
// "¥123,456.79"

// 百分比格式化
console.log(new Intl.NumberFormat('en-US', {
  style: 'percent'
}).format(0.75));
// "75%"

// 单位格式化
console.log(new Intl.NumberFormat('en-US', {
  style: 'unit',
  unit: 'kilometer-per-hour'
}).format(120));
// "120 km/h"
```

## Intl.ListFormat - 列表格式化

`Intl.ListFormat` 用于格式化列表数据，根据不同语言的习惯连接列表项。

### 构造函数

```javascript
/**
 * @param {string|string[]} locales - 语言代码
 * @param {Object} options - 格式化选项
 */
new Intl.ListFormat(locales?, options?)
```

### 配置选项

| 选项 | 类型 | 描述 |
|------|------|------|
| `style` | string | 样式：`"long"`, `"short"`, `"narrow"` |
| `type` | string | 类型：`"conjunction"`, `"disjunction"`, `"unit"` |

### 使用示例

```javascript
const vehicles = ['Motorcycle', 'Bus', 'Car'];

// 连接列表（and）
console.log(new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction'
}).format(vehicles));
// "Motorcycle, Bus, and Car"

// 选择列表（or）
console.log(new Intl.ListFormat('en', {
  style: 'long',
  type: 'disjunction'
}).format(vehicles));
// "Motorcycle, Bus, or Car"

// 单位列表
console.log(new Intl.ListFormat('en', {
  style: 'narrow',
  type: 'unit'
}).format(vehicles));
// "Motorcycle Bus Car"

// 中文列表
console.log(new Intl.ListFormat('zh-CN', {
  style: 'long',
  type: 'conjunction'
}).format(vehicles));
// "Motorcycle、Bus和Car"
```

## Intl.RelativeTimeFormat - 相对时间格式化

`Intl.RelativeTimeFormat` 用于格式化相对于当前时间的时间表达。

### 构造函数

```javascript
/**
 * @param {string|string[]} locales - 语言代码
 * @param {Object} options - 格式化选项
 */
new Intl.RelativeTimeFormat(locales?, options?)
```

### 配置选项

| 选项 | 类型 | 描述 |
|------|------|------|
| `style` | string | 样式：`"long"`, `"short"`, `"narrow"` |
| `numeric` | string | 数字显示：`"always"`, `"auto"` |

### 使用示例

```javascript
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

// 过去时间
console.log(rtf.format(-1, 'day'));    // "yesterday"
console.log(rtf.format(-2, 'day'));    // "2 days ago"
console.log(rtf.format(-1, 'week'));   // "last week"
console.log(rtf.format(-1, 'month'));  // "last month"

// 未来时间
console.log(rtf.format(1, 'day'));     // "tomorrow"
console.log(rtf.format(2, 'day'));     // "in 2 days"
console.log(rtf.format(1, 'week'));    // "next week"
console.log(rtf.format(1, 'month'));   // "next month"

// 中文相对时间
const rtfCN = new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' });
console.log(rtfCN.format(-1, 'day'));  // "昨天"
console.log(rtfCN.format(1, 'day'));   // "明天"
console.log(rtfCN.format(-1, 'week')); // "上周"
```

## Intl.PluralRules - 复数规则

`Intl.PluralRules` 用于确定数字的复数类别，支持不同语言的复数规则。

### 使用示例

```javascript
const pr = new Intl.PluralRules('en');

console.log(pr.select(0));   // "other"
console.log(pr.select(1));   // "one"
console.log(pr.select(2));   // "other"

// 阿拉伯语复数规则
const prAR = new Intl.PluralRules('ar');
console.log(prAR.select(0));   // "zero"
console.log(prAR.select(1));   // "one"
console.log(prAR.select(2));   // "two"
console.log(prAR.select(3));   // "few"
console.log(prAR.select(11));  // "many"
```

## Intl.DisplayNames - 显示名称

`Intl.DisplayNames` 用于获取语言、地区、货币等的本地化名称。

### 使用示例

```javascript
// 地区名称
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
console.log(regionNames.of('US'));  // "United States"
console.log(regionNames.of('CN'));  // "China"
console.log(regionNames.of('DE'));  // "Germany"

// 中文地区名称
const regionNamesCN = new Intl.DisplayNames(['zh-CN'], { type: 'region' });
console.log(regionNamesCN.of('US')); // "美国"
console.log(regionNamesCN.of('CN')); // "中国"
console.log(regionNamesCN.of('DE')); // "德国"

// 语言名称
const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
console.log(languageNames.of('en')); // "English"
console.log(languageNames.of('zh')); // "Chinese"
console.log(languageNames.of('de')); // "German"

// 货币名称
const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });
console.log(currencyNames.of('USD')); // "US Dollar"
console.log(currencyNames.of('EUR')); // "Euro"
console.log(currencyNames.of('CNY')); // "Chinese Yuan"
```

## Intl.Locale - 区域标识符

`Intl.Locale` 用于表示和操作 Unicode 区域标识符。

### 使用示例

```javascript
// 创建区域标识符
const locale = new Intl.Locale('zh-CN', {
  calendar: 'chinese',
  numberingSystem: 'hans'
});

console.log(locale.language);        // "zh"
console.log(locale.region);          // "CN"
console.log(locale.calendar);        // "chinese"
console.log(locale.numberingSystem); // "hans"

// 获取区域信息
console.log(locale.getCalendars());     // ["gregory", "chinese"]
console.log(locale.getNumberingSystems()); // ["latn", "hans", "hansfin"]
console.log(locale.getTimeZones());     // ["Asia/Shanghai", "Asia/Urumqi"]
```

## Intl.Segmenter - 文本分割

`Intl.Segmenter` 用于语言敏感的文本分割，将文本分割成有意义的片段。

### 使用示例

```javascript
// 按词分割
const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
const segments = segmenter.segment('Hello world, how are you?');

for (const segment of segments) {
  console.log(segment);
}
// { segment: 'Hello', index: 0, input: 'Hello world, how are you?', isWordLike: true }
// { segment: ' ', index: 5, input: 'Hello world, how are you?', isWordLike: false }
// { segment: 'world', index: 6, input: 'Hello world, how are you?', isWordLike: true }
// ...

// 按句分割
const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
const sentences = sentenceSegmenter.segment('Hello world. How are you? Fine, thank you.');

for (const sentence of sentences) {
  console.log(sentence.segment);
}
// "Hello world. "
// "How are you? "
// "Fine, thank you."
```

## 实际应用场景

### 1. 多语言电商网站

```javascript
// 价格格式化
function formatPrice(price, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(price);
}

console.log(formatPrice(1234.56, 'en-US', 'USD')); // "$1,234.56"
console.log(formatPrice(1234.56, 'zh-CN', 'CNY')); // "¥1,234.56"
console.log(formatPrice(1234.56, 'de-DE', 'EUR')); // "1.234,56 €"

// 产品列表格式化
function formatProductList(products, locale) {
  return new Intl.ListFormat(locale, {
    style: 'long',
    type: 'conjunction'
  }).format(products);
}

console.log(formatProductList(['iPhone', 'iPad', 'MacBook'], 'en-US'));
// "iPhone, iPad, and MacBook"
```

### 2. 国际化日程应用

```javascript
// 事件时间格式化
function formatEventTime(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

const eventDate = new Date(2023, 11, 25, 14, 30);
console.log(formatEventTime(eventDate, 'en-US'));
// "Monday, December 25, 2023 at 02:30 PM"
console.log(formatEventTime(eventDate, 'zh-CN'));
// "2023年12月25日星期一 14:30"

// 相对时间提醒
function formatRelativeTime(value, unit, locale) {
  return new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto'
  }).format(value, unit);
}

console.log(formatRelativeTime(-1, 'day', 'en-US'));  // "yesterday"
console.log(formatRelativeTime(1, 'hour', 'zh-CN'));  // "1小时后"
```

### 3. 搜索和排序功能

```javascript
// 多语言搜索排序
function createSearchSorter(locale) {
  return new Intl.Collator(locale, {
    sensitivity: 'base',
    numeric: true,
    ignorePunctuation: true
  });
}

const names = ['张三', '李四', '王五', 'Alice', 'Bob', 'Charlie'];
const sorter = createSearchSorter('zh-CN');

console.log(names.sort(sorter.compare));
// 根据中文排序规则排序
```

### 4. 表单验证国际化

```javascript
// 数字验证
function validateNumber(input, locale) {
  const formatter = new Intl.NumberFormat(locale);
  const parts = formatter.formatToParts(12345.67);
  
  // 获取千位分隔符和小数点
  const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';
  const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
  
  // 验证输入格式
  const regex = new RegExp(`^\\d{1,3}(\\${groupSeparator}\\d{3})*(\\.\\d+)?$`);
  return regex.test(input);
}

console.log(validateNumber('1,234.56', 'en-US')); // true
console.log(validateNumber('1.234,56', 'de-DE')); // true
```

## 性能优化

### 1. 重用格式化器

```javascript
// ❌ 每次都创建新的格式化器
function formatCurrency(amount, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// ✅ 缓存格式化器
const formatters = new Map();

function getFormatter(locale, currency) {
  const key = `${locale}-${currency}`;
  if (!formatters.has(key)) {
    formatters.set(key, new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }));
  }
  return formatters.get(key);
}

function formatCurrencyOptimized(amount, locale, currency) {
  return getFormatter(locale, currency).format(amount);
}
```

### 2. 批量处理

```javascript
// 批量格式化日期
function formatDates(dates, locale) {
  const formatter = new Intl.DateTimeFormat(locale);
  return dates.map(date => formatter.format(date));
}

const dates = [
  new Date(2023, 0, 1),
  new Date(2023, 1, 1),
  new Date(2023, 2, 1)
];

console.log(formatDates(dates, 'en-US'));
// ["1/1/2023", "2/1/2023", "3/1/2023"]
```

## 浏览器兼容性

::: warning 兼容性注意事项
- **Intl.Segmenter** 是较新的 API，支持度有限
- **Intl.DurationFormat** 仍在提案阶段
- 某些选项在不同浏览器中可能有差异
:::

```javascript
// 功能检测
function checkIntlSupport() {
  const support = {
    Collator: typeof Intl.Collator !== 'undefined',
    DateTimeFormat: typeof Intl.DateTimeFormat !== 'undefined',
    NumberFormat: typeof Intl.NumberFormat !== 'undefined',
    ListFormat: typeof Intl.ListFormat !== 'undefined',
    RelativeTimeFormat: typeof Intl.RelativeTimeFormat !== 'undefined',
    PluralRules: typeof Intl.PluralRules !== 'undefined',
    DisplayNames: typeof Intl.DisplayNames !== 'undefined',
    Locale: typeof Intl.Locale !== 'undefined',
    Segmenter: typeof Intl.Segmenter !== 'undefined'
  };
  
  return support;
}

console.log(checkIntlSupport());
```

## 总结

JavaScript 的 Intl API 为国际化提供了强大的支持：

- **字符串处理** - 支持多语言的排序和比较
- **数字格式化** - 适应不同地区的数字、货币显示习惯
- **日期时间** - 本地化的日期时间格式
- **文本处理** - 智能的文本分割和列表格式化
- **用户体验** - 提供符合用户文化习惯的界面

合理使用 Intl API 可以让应用程序更好地适应全球用户的需求，提供更好的国际化体验。在实际开发中，应该根据目标用户群体选择合适的国际化策略，并注意性能优化和浏览器兼容性。 