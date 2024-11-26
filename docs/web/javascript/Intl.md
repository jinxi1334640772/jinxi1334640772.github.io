# Intl 国际化

Intl 对象是 ECMAScript 国际化 API ，提供了精确的字符串对比、数字格式化、日期时间格式化。Collator，NumberFormat 和 DateTimeFormat 对象的构造函数是 Intl 对象的属性。

## Intl.Collator

用于语言敏感的字符串比较。

```js
/**
 * @locales 缩写语言代码的字符串，或字符串数组
 * @options
 * localeMatcher 区域匹配算法。"lookup" 和 "best fit"默认值。
 * usage 用于排序还是用于搜索。默认值为 "sort" 和 "search"
 * sensitivity 字符串中的哪些差异应导致结果值为非零。可能的值为：
 *  base 只有字母不同的字符串比较不相等。例如：a ≠ b、a = á、a = A。
 *  accent 只有不同的基本字母或重音符号和其他变音符号的字符串比较为不相等。例如：a ≠ b、a ≠ á、a = A。
 *  case 只有不同的基本字母或大小写的字符串比较不相等。例如：a ≠ b、a = á、a ≠ A。
 *  variant 字符串的字母、重音和其他变音符号，或不同大小写比较不相等。也可以考虑其他差异。例如：a ≠ b、a ≠ á、a ≠ A。
 * ignorePunctuation 是否应忽略标点。默认false
 * numeric 是否应使用数字对照，使得“1”<“2”<“10”。默认值 false
 * caseFirst 是否优先根据大小写排序。可能的值为 "upper"、"lower" 和 "false"（使用区域的默认设置）
 * collation 一些区域的变体
 */
new Intl.Collator()
new Intl.Collator(locales)
new Intl.Collator(locales?, options?)

Intl.Collator()
Intl.Collator(locales)
Intl.Collator(locales, options)
```

静态属性和方法：

- `supportedLocalesOf()` 支持区域的数组

```js
const locales1 = ["ban", "id-u-co-pinyin", "de-ID"];
const options1 = { localeMatcher: "lookup" };

console.log(Intl.Collator.supportedLocalesOf(locales1, options1));
// ["id-u-co-pinyin", "de-ID"]
```

实例属性和方法：

- `compare()` 根据配置选项，来比较两个字符串。

```js
console.log(new Intl.Collator().compare("a", "c")); // -1，或一些其他的负值
console.log(new Intl.Collator().compare("c", "a")); // 1，或一些其他的正值
console.log(new Intl.Collator().compare("a", "a")); // 0

// 德语中，ä 使用 a 的排序
console.log(new Intl.Collator("de").compare("ä", "z"));
// -1，或一些其他的负值

// 在瑞典语中，ä 排在 z 之后
console.log(new Intl.Collator("sv").compare("ä", "z"));
// 1，或一些其他的正值

// 德语中，ä 使用 a 作为基本字母
console.log(new Intl.Collator("de", { sensitivity: "base" }).compare("ä", "a"));
// 0

// 瑞典语中，ä 和 a 是单独的基本字母
console.log(new Intl.Collator("sv", { sensitivity: "base" }).compare("ä", "a"));
// 1，或一些其他的正值
```

- `resolvedOptions()` 获取配置参数

## Intl.DataTimeFormat()

日期和时间在特定的语言环境下格式化

```js
/**
 * @locales
 * @options
 * localeMatcher
 * calender 使用的日历： "chinese", "gregory", "persian",
 * numberingSystem 数字系统："arab", "hans", "mathsans",
 * hour12 是否使用12小时制，还有24小时制
 * hourCycle 小时循环： "h11", "h12", "h23", and "h24".
 * timeZone 时区： "UTC", "Asia/Shanghai", "Asia/Kolkata"
 */
new Intl.DateTimeFormat();
new Intl.DateTimeFormat(locales);
new Intl.DateTimeFormat(locales, options);

Intl.DateTimeFormat();
Intl.DateTimeFormat(locales);
Intl.DateTimeFormat(locales, options);
```

静态方法：

- `supportedLocalesOf()` 返回支持的语言数组

实例方法：

- `format()`根据配置选项格式化日期时间

```js
const options1 = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const date1 = new Date(2012, 5);

const dateTimeFormat1 = new Intl.DateTimeFormat("sr-RS", options1);
console.log(dateTimeFormat1.format(date1));
// Expected output: "петак, 1. јун 2012."

const dateTimeFormat2 = new Intl.DateTimeFormat("en-GB", options1);
console.log(dateTimeFormat2.format(date1));
// Expected output: "Friday, 1 June 2012"

const dateTimeFormat3 = new Intl.DateTimeFormat("en-US", options1);
console.log(dateTimeFormat3.format(date1));
// Expected output: "Friday, June 1, 2012"
```

- `formatToParts()` 返回代表日期时间各个部分的对象数组

```js
const date = new Date(2012, 5);
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);

const parts = dateTimeFormat.formatToParts(date);
console.log(parts);
/**
 * [
    {
        "type": "weekday",
        "value": "Friday"
    },
    {
        "type": "literal",
        "value": ", "
    },
    {
        "type": "month",
        "value": "June"
    },
    {
        "type": "literal",
        "value": " "
    },
    {
        "type": "day",
        "value": "1"
    },
    {
        "type": "literal",
        "value": ", "
    },
    {
        "type": "year",
        "value": "2012"
    }
]
 */
```

- `resolvedOptions()` 返回配置对象

```js
const region1 = new Intl.DateTimeFormat("zh-CN", { timeZone: "UTC" });
const options1 = region1.resolvedOptions();

console.log(options1.locale);
// Expected output: "zh-CN"

console.log(options1.calendar);
// Expected output: "gregory"

console.log(options1.numberingSystem);
// Expected output: "latn"
```

- `formatRange()`根据配置对象，格式化范围

```js
const options1 = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const options2 = { year: "2-digit", month: "numeric", day: "numeric" };

const startDate = new Date(Date.UTC(2007, 0, 10, 10, 0, 0));
const endDate = new Date(Date.UTC(2008, 0, 10, 11, 0, 0));

const dateTimeFormat = new Intl.DateTimeFormat("en", options1);
console.log(dateTimeFormat.formatRange(startDate, endDate));
// Expected output: "Wednesday, January 10, 2007 – Thursday, January 10, 2008"

const dateTimeFormat2 = new Intl.DateTimeFormat("en", options2);
console.log(dateTimeFormat2.formatRange(startDate, endDate));
// Expected output: "1/10/07 – 1/10/08"
```

- `formatRangeToParts()`表示格式化范围的对象数组

```js
const date1 = new Date(Date.UTC(1906, 0, 10, 10, 0, 0)); // Wed, 10 Jan 1906 10:00:00 GMT
const date2 = new Date(Date.UTC(1906, 0, 10, 11, 0, 0)); // Wed, 10 Jan 1906 11:00:00 GMT

const fmt = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "numeric",
});

console.log(fmt.formatRange(date1, date2)); // '10:00 – 11:00 AM'

fmt.formatRangeToParts(date1, date2);
// [
//   { type: 'hour',      value: '10',  source: "startRange" },
//   { type: 'literal',   value: ':',   source: "startRange" },
//   { type: 'minute',    value: '00',  source: "startRange" },
//   { type: 'literal',   value: ' – ', source: "shared"     },
//   { type: 'hour',      value: '11',  source: "endRange"   },
//   { type: 'literal',   value: ':',   source: "endRange"   },
//   { type: 'minute',    value: '00',  source: "endRange"   },
//   { type: 'literal',   value: ' ',   source: "shared"     },
//   { type: 'dayPeriod', value: 'AM',  source: "shared"     }
// ]
```

## Intl.NumberFormat()

特定的语言环境下，数字的格式化。

```js
/**
 * @locales
 * @options
 *  localeMatcher
 *  numberingSystem
 *  style
 *    decimal 格式化数字
 *    currency 格式化货币
 *    percent  格式化百分比
 *    unit  格式化单元
 *  currency 要格式的货币Code，例如：USD EUR CNY
 *  currencyDisplay 如何展示货币
 *    code Use the ISO currency code.
 *    symbol 本地化货币符号。例如€ ￥
 *    narrowSymbol 狭窄格式符号。"$100" rather than "US$100"
 *    name 本地货币名称。dollar
 *  currencySign 货币如何换行。可选standard默认，或者accounting
 *  unit  The unit to use in unit formatting,
 *  unitDisplay
 *    short 默认值。16 l.
 *    narrow 161
 *    long `16 litres`
 * digit options:
 *  minimumIntegerDigits
 *  minimumFractionDigits
 *  maximumFractionDigits
 *  minimumSignificantDigits
 *  ...
 * trailingZeroDisplay
 * ...
 */
new Intl.NumberFormat();
new Intl.NumberFormat(locales);
new Intl.NumberFormat(locales, options);

Intl.NumberFormat();
Intl.NumberFormat(locales);
Intl.NumberFormat(locales, options);

const number = 123456.789;

console.log(
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    number
  )
);
// Expected output: "123.456,79 €"

console.log(
  new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(
    number
  )
);
// Expected output: "￥123,457"

// 限制三位有效数字
console.log(
  new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(number)
);
// Expected output: "1,23,000"
```

实例方法：

- `format()` 根据配置对象格式化数字

```js
const amount = 654321.987;

const options1 = { style: "currency", currency: "RUB" };
const numberFormat1 = new Intl.NumberFormat("ru-RU", options1);

console.log(numberFormat1.format(amount));
// Expected output: "654 321,99 ₽"

const options2 = { style: "currency", currency: "USD" };
const numberFormat2 = new Intl.NumberFormat("en-US", options2);

console.log(numberFormat2.format(amount));
// Expected output: "$654,321.99"
```

- `formatToParts()` 返回代表数字各部分的对象数组

```js
const amount = 654321.987;
const options = { style: "currency", currency: "USD" };
const numberFormat = new Intl.NumberFormat("en-US", options);

const parts = numberFormat.formatToParts(amount);

console.log(parts);

[
  {
    type: "currency",
    value: "$",
  },
  {
    type: "integer",
    value: "654",
  },
  {
    type: "group",
    value: ",",
  },
  {
    type: "integer",
    value: "321",
  },
  {
    type: "decimal",
    value: ".",
  },
  {
    type: "fraction",
    value: "99",
  },
];
```

- `formatRange()` 根据配置对象格式化数字范围

```js
const nf = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

console.log(nf.formatRange(3, 5)); // "$3 – $5"

console.log(nf.formatRange(2.9, 3.1)); // "~$3"

const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

console.log(formatter.formatRange(3500, 9500));
// "3.500,00–9.500,00 €"
```

- `formatRangeToParts()` 代表范围各个部分的对象数组

```js
const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});
console.log(formatter.formatRangeToParts(startRange, endRange));

// return value:
[
  { type: "integer", value: "3", source: "startRange" },
  { type: "group", value: ".", source: "startRange" },
  { type: "integer", value: "500", source: "startRange" },
  { type: "decimal", value: ",", source: "startRange" },
  { type: "fraction", value: "00", source: "startRange" },
  { type: "literal", value: "–", source: "shared" },
  { type: "integer", value: "9", source: "endRange" },
  { type: "group", value: ".", source: "endRange" },
  { type: "integer", value: "500", source: "endRange" },
  { type: "decimal", value: ",", source: "endRange" },
  { type: "fraction", value: "00", source: "endRange" },
  { type: "literal", value: " ", source: "shared" },
  { type: "currency", value: "€", source: "shared" },
];
```

- `resolvedOptions()` 返回配置对象

```js
const numberFormat1 = new Intl.NumberFormat('de-DE');
const options1 = numberFormat1.resolvedOptions();

console.log(options1);
{
    "locale": "de-DE",
    "numberingSystem": "latn",
    "style": "decimal",
    "minimumIntegerDigits": 1,
    "minimumFractionDigits": 0,
    "maximumFractionDigits": 3,
    "useGrouping": "auto",
    "notation": "standard",
    "signDisplay": "auto",
    "roundingIncrement": 1,
    "roundingMode": "halfExpand",
    "roundingPriority": "auto",
    "trailingZeroDisplay": "auto"
}
```

## Intl.ListFormat()

列表数据格式化

```js
new Intl.ListFormat([locales[, options]])

// 创建一个列表格式化器
const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});
const vehicles = ['Motorcycle', 'Bus', 'Car'];

console.log(formatter.format(vehicles));
// Expected output: "Motorcycle, Bus, and Car"

const formatter2 = new Intl.ListFormat('de', {
  style: 'short',
  type: 'disjunction',
});
console.log(formatter2.format(vehicles));
// Expected output: "Motorcycle, Bus oder Car"

const formatter3 = new Intl.ListFormat('en', { style: 'narrow', type: 'unit' });
console.log(formatter3.format(vehicles));
// Expected output: "Motorcycle Bus Car"

// 创建一个返回被格式化部分的列表格式化器
console.log(
  new Intl.ListFormat("en-GB", {
    style: "long",
    type: "conjunction",
  }).formatToParts(vehicles),
);

[
  { "type": "element", "value": "Motorcycle" },
   { "type": "literal", "value": ", " },
    { "type": "element", "value": "Bus" },
     { "type": "literal", "value": ", and " },
     { "type": "element", "value": "Car" }
     ];
```

## Intl.PluralRules

用于复数敏感的格式化

```js
/**
 * @locales
 * @options
 *  localeMatcher
 *  type
 *    cardinal: For cardinal numbers
 *    ordinal:For ordinal number
 */
new Intl.PluralRules();
new Intl.PluralRules(locales);
new Intl.PluralRules(locales, options);
```

实例方法：

- `select(number)` 区域敏感的格式化的复数类别

```js
console.log(new Intl.PluralRules("ar-EG").select(0));
// Expected output: "zero"

console.log(new Intl.PluralRules("ar-EG").select(5));
// Expected output: "few"

console.log(new Intl.PluralRules("ar-EG").select(55));
// Expected output: "many"

console.log(new Intl.PluralRules("en").select(0));
// Expected output: "other"
```

- `selectRange(startRange,endRange)` 区域敏感的格式化的复数类别。

```js
new Intl.PluralRules("sl").selectRange(102, 201); // 'few'

new Intl.PluralRules("pt").selectRange(102, 102); // 'other'
```

## Intl.RelativeTimeFormat()

相对当前的时间格式化。

```js
/**
 * @locales
 * @options
 *  localeMathcher
 *  numberingStystem
 *    arab
 *    hans
 *    mathsans
 *    ...
 *  style
 *    long : E.g., "in 1 month"
 *    short : E.g., "in 1 mo."
 *    narrow:E.g., "in 1 mo." 比short更短
 *  numeric 是否应用数字再输出中。
 *    always 默认值。
 *    auto： 使用更多的惯用短语。例如："yesterday" instead of "1 day ago".
 */
new Intl.RelativeTimeFormat();
new Intl.RelativeTimeFormat(locales);
new Intl.RelativeTimeFormat(locales, options);

const rtf1 = new Intl.RelativeTimeFormat("en", { style: "short" });

console.log(rtf1.format(-1, "day"));
// Expected output: "1 day ago"

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

rtf.formatToParts(-1, "day");
// [{ type: "literal", value: "yesterday"}]

rtf.formatToParts(100, "day");
// [
//   { type: "literal", value: "in " },
//   { type: "integer", value: "100", unit: "day" },
//   { type: "literal", value: " days" }
// ]
```

实例方法：

- `format(value, unit)` 根据 value 和 unit 格式化相对当前的时间
- `formatToParts(value, unit)` 各个部分的对象数组

## Intl.DisplayNames()

根据国家 code 码，支持语言、区域和脚本等，显示名称的一致翻译

```js
/**
 * @locales
 * @options
 *  localeMatcher
 *  style：long/short/narrow
 *  type:language/region/script/currency/calender/dateTimeField
 *  fallback:code/none
 *  languageDisplay:dialect/standerd
 */
new Intl.DisplayNames([locales[, options]])

const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });
console.log(regionNamesInEnglish.of('US'));
// Expected output: "United States"

const regionNamesInTraditionalChinese = new Intl.DisplayNames(['zh-Hant'], {
  type: 'region',
});
console.log(regionNamesInTraditionalChinese.of('US'));
// Expected output: "美國"

const displayNames = new Intl.DisplayNames(["de-DE"], { type: "region" });

const usedOptions = displayNames.resolvedOptions();
console.log(usedOptions.locale); // "de-DE"
console.log(usedOptions.style); // "long"
console.log(usedOptions.type); // "region"
console.log(usedOptions.fallback); // "code"
```

## Intl.DurationFormat()

语言敏感的持续时间格式化

实例方法：

- `format(duration)`
- `formatToParts(duration)`

```js
const duration = {
  hours: 1,
  minutes: 46,
  seconds: 40,
};

// With style set to "short" and locale "en"
new Intl.DurationFormat("en", { style: "short" }).format(duration);
// "1 hr, 46 min and 40 sec"

const duration = {
  hours: 7,
  minutes: 8,
  seconds: 9,
  milliseconds: 123,
  microseconds: 456,
  nanoseconds: 789,
};

new Intl.DurationFormat("en", { style: "long" }).formatToParts(duration);

// Returned value:
[
  { type: "integer", value: "7", unit: "hour" },
  { type: "literal", value: " ", unit: "hour" },
  { type: "unit", value: "hours", unit: "hour" },
  { type: "literal", value: ", " },
  { type: "integer", value: "8", unit: "minute" },
  { type: "literal", value: " ", unit: "minute" },
  { type: "unit", value: "minutes", unit: "minute" },
  { type: "literal", value: ", " },
  { type: "integer", value: "9", unit: "second" },
  { type: "literal", value: " ", unit: "second" },
  { type: "unit", value: "seconds", unit: "second" },
  { type: "literal", value: ", " },
  { type: "integer", value: "123", unit: "millisecond" },
  { type: "literal", value: " ", unit: "millisecond" },
  { type: "unit", value: "milliseconds", unit: "millisecond" },
  { type: "literal", value: ", " },
  { type: "integer", value: "456", unit: "microsecond" },
  { type: "literal", value: " ", unit: "microsecond" },
  { type: "unit", value: "microseconds", unit: "microsecond" },
  { type: "literal", value: " and " },
  { type: "integer", value: "789", unit: "nanosecond" },
  { type: "literal", value: " ", unit: "nanosecond" },
  { type: "unit", value: "nanoseconds", unit: "nanosecond" },
];
```

## Intl.Locale

用于表示 Unicode 区域标识。区域标识符由语言标识符和扩展标记组成。语言标识符是区域 (locale) 的核心，包含了语言、脚本和地域子标记 (region subtags)。

```js
/**
 * @tag 地区标识符字符串
 * @options 配置本地化对象，可覆盖本地默认配置。实例属性和方法中获取配置对象
 *  language
 *  script
 *  region 区域
 *  calender 日历类型
 *  collation 排序规则
 *  numberingSystem 计数系统
 *  caseFirst
 *  hourCycle
 *  numeric
 */
new Intl.Locale(tag);
new Intl.Locale(tag, options);

const korean = new Intl.Locale("ko", {
  script: "Kore",
  region: "KR",
  hourCycle: "h23",
  calendar: "gregory",
});

const japanese = new Intl.Locale("ja-Jpan-JP-u-ca-japanese-hc-h12");

console.log(korean.baseName, japanese.baseName);
// Expected output: "ko-Kore-KR" "ja-Jpan-JP"

console.log(korean.hourCycle, japanese.hourCycle);
// Expected output: "h23" "h12"

// 获取中国大陆的日历
console.log(new Intl.Locale("zh-CN").getCalendars());
["gregory", "chinese"];
```

实例属性和方法：

- Intl.Locale.prototype.baseName 当地简称
- Intl.Locale.prototype.calender：当地支持的日历
- Intl.Locale.prototype.caseFirst：大小写优先
- Intl.Locale.prototype.collation ：当地支持的排序类型
- Intl.Locale.prototype.hourCycle：时间周期
- Intl.Locale.prototype.language
- Intl.Locale.prototype.numberingSystem
- Intl.Locale.prototype.numeric
- Intl.Locale.prototype.region
- Intl.Locale.prototype.script
- Intl.Locale.prototype.getCalenders()
- Intl.Locale.prototype.getCollations()
- Intl.Locale.prototype.getNumberingSystems()
- Intl.Locale.prototype.getTextInfo()
- Intl.Locale.prototype.getTimeZones()
- Intl.Locale.prototype.getWeekInfo()
- Intl.Locale.prototype.maximize()
- Intl.Locale.prototype.minimize()
- Intl.Locale.prototype.toString()

## Intl.Segmenter

支持语言敏感的文本分割，将字符串分割成有意义的片段（字、词、句）。

```js
/**
 * @locales
 * @options
 *  localeMatcher
 *  granularity
 *    grapheme:默认值，按字划分边界
 *    word：按词划分边界。
 *    sentence：按句划分边界。
 */
new Intl.Segmenter();
new Intl.Segmenter(locales);
new Intl.Segmenter(locales, options);

const segmenter = new Intl.Segmenter("en", { granularity: "word" });

// 返回 Segments 实例，可迭代对象
const Segments = segmenter.segment("hello world");
console.log(Array.from(Segments));
[
  {
    segment: "hello",
    index: 0,
    input: "hello world",
    isWordLike: true,
  },
  {
    segment: " ",
    index: 5,
    input: "hello world",
    isWordLike: false,
  },
  {
    segment: "world",
    index: 6,
    input: "hello world",
    isWordLike: true,
  },
];
```
