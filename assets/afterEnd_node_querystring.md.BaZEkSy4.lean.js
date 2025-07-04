import{_ as i,c as a,o as n,a3 as p}from"./chunks/framework.DqsPtFs4.js";const y=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"afterEnd/node/querystring.md","filePath":"afterEnd/node/querystring.md","lastUpdated":1732620682000}'),e={name:"afterEnd/node/querystring.md"};function l(t,s,h,k,r,d){return n(),a("div",null,s[0]||(s[0]=[p(`<h2 id="querystring-模块" tabindex="-1">querystring 模块 <a class="header-anchor" href="#querystring-模块" aria-label="Permalink to &quot;querystring 模块&quot;">​</a></h2><p>提供了用于解析和格式化网址查询字符串的实用工具。 querystring 比 <code>&lt;URLSearchParams&gt;</code> 性能更高，但不是标准化的 API。当性能不重要或需要与浏览器代码兼容时使用 <code>&lt;URLSearchParams</code>&gt;。</p><p>querystring.decode() 函数是 querystring.parse() 的别名。</p><blockquote><p>querystring.parse() 方法返回的对象不是原型继承自 JavaScript Object。这意味着 obj.toString()、obj.hasOwnProperty() 等典型的 Object 方法没有定义，将不起 ​​ 作用。</p></blockquote><p>querystring.encode() 函数是 querystring.stringify() 的别名。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@str</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 要解析的网址查询字符串</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@sep</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 用于在查询字符串中分隔键值对的子字符串。默认值：&#39;&amp;&#39;。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@eq</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 用于分隔查询字符串中的键和值的子字符串。默认值：&#39;=&#39;。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@options</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  decodeURIComponent 当对查询字符串中的百分比编码字符进行解码时使用的函数。默认值：querystring.unescape()。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  maxKeys 指定要解析的最大键数，默认值100</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@return</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">querystring.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">parse</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(str[, sep[, eq[, options]]])</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">querystring.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">parse</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &#39;w=%D6%D0%CE%C4&amp;foo=bar&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  { decodeURIComponent: gbkDecodeURIComponent });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@obj</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@sep</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@eq</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@options</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  encodeURIComponent 当将网址不安全的字符转换为查询字符串中的百分比编码时使用的函数。默认值：querystring.escape()。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">querystring.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stringify</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(obj[, sep[, eq[, options]]])</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 在给定的 str 上执行网址百分比编码字符的编码。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">querystring.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">escape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(str)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 在给定的 str 上执行网址百分比编码字符的解码。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">querystring.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">unescape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(str)</span></span></code></pre></div>`,6)]))}const c=i(e,[["render",l]]);export{y as __pageData,c as default};
