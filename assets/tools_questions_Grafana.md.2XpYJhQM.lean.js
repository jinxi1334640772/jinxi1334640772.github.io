import{_ as a,c as i,o as n,a3 as t}from"./chunks/framework.DqsPtFs4.js";const l="/assets/image-48.QkMJ4Zlz.png",g=JSON.parse('{"title":"Grafana 数据监控","description":"","frontmatter":{},"headers":[],"relativePath":"tools/questions/Grafana.md","filePath":"tools/questions/Grafana.md"}'),p={name:"tools/questions/Grafana.md"};function e(h,s,k,r,F,d){return n(),i("div",null,s[0]||(s[0]=[t('<h1 id="grafana-数据监控" tabindex="-1">Grafana 数据监控 <a class="header-anchor" href="#grafana-数据监控" aria-label="Permalink to &quot;Grafana 数据监控&quot;">​</a></h1><p>Grafana是一个开源的数据可视化和监控平台，可以帮助用户通过创建仪表盘和图表来实时监控和分析数据。Grafana支持多种数据源，包括Prometheus、InfluxDB、Elasticsearch等。它提供了丰富的可视化选项和插件，用户可以根据自己的需求自定义仪表盘和图表。Grafana还具有强大的告警功能，可以及时通知用户关键指标的变化。无论是个人用户还是企业用户，都可以通过Grafana轻松地构建自己的监控系统。</p><p><img src="'+l+`" alt="alt text"></p><p>为何选择 Grafana?</p><ul><li>统一数据，而非数据库:Grafana 不要求将数据导入后端数据仓库或供应商数据库。相反，Grafana 采用独特的方法提供单一数据面板，无论现有数据位于何处，都可以将其统一。可以从 Kubernetes 集群、Raspberry Pi、不同的云服务、甚至是 Google Sheets 获取任何现有数据，并在单个数据面板中按照自己的需求可视化。</li><li>可供所有人查看的数据:Grafana 的构建原则是让组织中的每个人都可以访问数据，而不仅仅是单个运营人员。有助于打破数据孤岛并赋予团队更强的能力。</li><li>可供任何人使用的数据面板:可以将从众多来源收集到的数据变成有意义的图表，还可以与其他团队成员共享创建的数据面板，共同探索数据。任何人都可以创建和共享动态数据面板，增进协作和透明度。</li><li>灵活性和多功能性：与其他工具不同，在 Grafana 将任何数据翻译，转换并创建灵活且多功能的专属数据面板。借助高级查询和转换功能，以自定义面板，创建真正有帮助的可视化内容。</li></ul><p>参考：<a href="https://grafana.com/zh-cn/grafana/?tab=revenue" target="_blank" rel="noreferrer">https://grafana.com/zh-cn/grafana/?tab=revenue</a></p><h2 id="lucene-查询语法" tabindex="-1">Lucene 查询语法 <a class="header-anchor" href="#lucene-查询语法" aria-label="Permalink to &quot;Lucene 查询语法&quot;">​</a></h2><p>Lucene 提供了丰富的 API 来组合定制你所需要的查询器，同时也可以利用 Query Parser 提供的强大的查询语法解析来构造你想要的查询器</p><ul><li><p>Terms：一个查询将分解为若干 Term 以及操作符，有两种 Term，其一是单一 Term，其二为短语。单一 Term 是经过分析器分词后的最小单元，他就是一个简单 的词，例如“Test”和“Hello”。短语则是一组被双引号括起来的一组词，例如：“Hello dolly”，多个 Term 可以通过布尔操作合并在一个更加复杂的查询器中。</p></li><li><p>Fields：Lucene 支持在查询中指定字段，以实现对文档中特定字段的查询，例如：title:hello。也可以使用默认的字段，默认字段在查询语法中可以不需要显式指定</p></li></ul><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 标题title包含“The Right Way”同时默认文本字段text中包含“go”</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">title:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;The Right Way&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> AND</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> go</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 相等</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">title:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;The Right Way&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> AND</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> text:go</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 通配符</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 匹配单一字符使用符号“?”，匹配多个字符使用符号“*”。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:te?t</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:test*</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:te*t</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 模糊查询</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 与“roam”拼写相近的词,类似“foam”和“roams”</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:roam~</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 搜索“apache”和“jakarta”距离10个字符以内</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;jakarta apache&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">~10</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 范围搜索：范围查询允许你指定某个字段最大值和最小，字典顺序来排序</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># mode_date字段在大于等于20020101，小于等于20030101范围的所有文档</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mod_date:[20020101</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TO</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 20030101]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 标题在Aida和Carmen之间但不包含Aida和Carmen的文档</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">title:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">{Aida</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TO</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Carmen}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 优先级:将“^”放于查询词的尾部，同时跟上权重值，权重因子越大，该词越重要。默认权重为1</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># “jakarta”在查询时中更加重要</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:jakarta^4</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> apache</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 含有Jakarta的文档具有更高的相关性</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;jakarta apache&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">^4</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;jakarta lucene&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Terms操作符</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 同时含有“jakarta apache”和“jakarta lucene”</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;jakarta apache&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> AND</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jakarta</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># OR 默认操作符，含有“jakarta apache”或者“jakarta”</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;jakarta apache&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> OR</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jakarta</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;jakarta apache&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jakarta</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 含有“jakarta apache”同时不能含有“Jakarta lucene”时</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;jakarta apache&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> NOT</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jakarta</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 必须包含“jakarta”</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:+jakarta</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> apache</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 搜索“Jakarta apache”但不包含“Jakarta lucene”时</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;jakarta apache&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;jakarta lucene&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 分组：使用圆括号来将查询表达式分组</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 必须含有“website”，另外必须含有“jakarta”和“apache”之一</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">text:(jakarta</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> OR</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> apache</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) AND website</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 含有“return”和“pink ranther”时</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">title:(+return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> +&quot;pink panther&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 转义：支持转义查询中的特殊字符，以下是Lucene的特殊字符清单：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># + - &amp;&amp; || ! ( ) { } [ ] ^ &quot; ~ * ? : \\</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 搜索(1+1):2</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">num:1\\+1\\:2</span></span></code></pre></div>`,10)]))}const y=a(p,[["render",e]]);export{g as __pageData,y as default};
