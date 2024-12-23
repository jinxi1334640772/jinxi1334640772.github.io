# 爬虫协议 robots

Robots 协议(也称为爬虫协议、机器人协议等)全称是“网络爬虫排除标准”(Robots Exclusion Protocol)，网站通过 Robots 协议告诉搜索引擎哪些页面可以抓取，哪些页面不能抓取。

**为什么需要 Robots 协议？**

- 保护网站隐私和敏感信息：某些页面可能包含用户个人数据、内部运营数据、未公开的内容等，网站管理员可以通过 Robots 协议阻止搜索引擎或其他爬虫获取这些敏感信息，防止信息泄露。
- 控制爬虫访问频率：爬虫过度频繁地访问网站可能会消耗大量服务器资源，影响网站的正常运行和其他用户的访问体验。Robots 协议可以限制爬虫在一定时间内的访问次数，避免对服务器造成过大压力。
- 引导爬虫抓取重点内容：网站管理员可以通过 Robots 协议明确告诉爬虫哪些页面是对用户有价值且希望被收录和展示的，引导爬虫优先抓取这些页面，提高网站重要内容在搜索引擎结果中的曝光率。

## 简介

Robots 协议是网络爬虫协议，用于告诉搜索引擎哪些页面可以抓取，哪些页面不能抓取。Robots 协议由 Google、Yahoo、Bing 等搜索引擎公司提出，并成为互联网上所有搜索引擎的标准协议。Robots 协议由两段组成，第一段是 robots.txt 文件，第二段是 robots meta 标签。

1. robots.txt 文件是服务器上的一个文件，里面包含着搜索引擎爬虫可以抓取的页面列表。 robots.txt 文件通常位于网站根目录下，例如：www.example.com/robots.txt。 robots.txt 文件可以包含多个规则，每个规则都是一个 URL 地址，用正则表达式表示。例如：

```bash
# 所有搜索引擎
User-agent: *
# 百度的搜索机器人
User-agent: Baiduspider

# 禁止爬寻admin目录下面的目录
Disallow: /admin/
# 禁止抓取网页所有的.jpg格式的图片
Disallow: /.jpg$

# 允许访问以".html"为后缀的URL
Allow: .html$
# 允许爬虫抓取所有页面
Allow: /

User-agent: * 这里的*代表的所有的搜索引擎种类，*是一个通配符
Disallow: /admin/ 这里定义是禁止爬寻admin目录下面的目录
Disallow: /require/ 这里定义是禁止爬寻require目录下面的目录
Disallow: /ABC/ 这里定义是禁止爬寻ABC目录下面的目录
Disallow: /cgi-bin/*.htm 禁止访问/cgi-bin/目录下的所有以".htm"为后缀的URL(包含子目录)。
Disallow: /*?* 禁止访问网站中所有包含问号 (?) 的网址
Disallow: /.jpg$ 禁止抓取网页所有的.jpg格式的图片
Disallow:/ab/adc.html 禁止爬取ab文件夹下面的adc.html文件。
Allow: /cgi-bin/　这里定义是允许爬寻cgi-bin目录下面的目录
Allow: /tmp 这里定义是允许爬寻tmp的整个目录
Allow: .htm$ 仅允许访问以".htm"为后缀的URL。
Allow: .gif$ 允许抓取网页和gif格式图片
Sitemap: 网站地图 告诉爬虫这个页面是网站地图

# 告诉爬虫可以在该地址找到网站地图文件
Sitemap: http://www.example.com/sitemap.xml

# 用来指定robot协议的版本号
Robot-version: Version 2.0

# 在8:00到13:00之间,以每分钟12次的频率进行访问
Request-rate: 12/1m 0800 - 1300

#允许在凌晨1:00到13:00访问
Visit-time: 0100-1300
```

2. Robots.txt 文件主要是限制整个站点或者目录的搜索引擎访问情况，而 Robots Meta 标签则主要是针对一个个具体的页面。和其他的 META 标签（如使用的语言、页面的描述、关键词等）一样，Robots Meta 标签也是放在页面中，专门用来告诉搜索引擎 ROBOTS 如何抓取该页的内容。

Robots Meta 标签中没有大小写之分，name=”Robots”表示所有的搜索引擎，可以针对某个具体搜索引擎写为 name=”BaiduSpider”。content 部分有四个指令选项：index、noindex、follow、nofollow，指令间以“,”分隔。

- index 指令告诉搜索机器人抓取该页面；
- noindex 指令表示搜索机器人不要抓取该页面；
- follow 指令表示搜索机器人可以沿着该页面上的链接继续抓取下去；
- nofollow 指令表示搜索机器人不要沿着该页面上的链接继续抓取下去。
- Robots Meta 标签的缺省值是 index 和 follow
