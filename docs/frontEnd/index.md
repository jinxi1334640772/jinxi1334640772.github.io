## Web 简史

在 20 世纪 60 年代末期，美国军方开发了一个名为 ARPANET 的通信网络。这可以认为是 Web 的先驱，因为它基于分组交换进行工作，并且首次实现了 TCP/IP 协议族。这两种技术构成了互联网基础设施的基础。

1980 年，Tim Berners-Lee（通常称之为 TimBL）写了一个叫 ENQUIRE 的笔记本程序，这个程序实现了不同节点之间链接的概念。听起来有点熟悉对吧？

快进到 1989 年，TimBL 在 CERN 撰写了《Information Management: A Proposal》和《HyperText》；这两个出版物共同为 Web 的工作方式做了铺垫。两个出版物获得了极大的关注，这足以说服 TimBL 的上司让他继续前进，并创建一个全球超文本系统。

到 1990 年底，TimBL 创建了运行第一个版本的 Web 所需的所有东西——HTTP、HTML、名为 WorldWideWeb 的第一个 Web 浏览器、一个 HTTP 服务器和一些用于查看的网页。在随后的几年中，随着多个浏览器的发布、数以千计 Web 服务器的建立、上百万网页的生成，Web 爆发式发展。

最后一个值得分享的重要事件发生在 1994 年，TimBL 建立了万维网联盟（W3C），该组织汇集了来自许多不同技术公司的代表，共同制定 Web 技术规范。随后其他的技术像 CSS 和 JavaScript 出现了，Web 开始看起来更像我们现在所了解的 Web。

## Web 标准

Web 标准是我们用来建立网站的技术。这些标准以名为规范的长技术文档的形式存在，这些文档非常详细地说明了技术的工作方式。而有软件工程师来实现这些技术（通常在 Web 浏览器中）。

例如，HTML 现行标准详细地描述了 HTML 的实现方式（所有 HTML 元素及其关联的 API 和其他相关技术）。

Web 标准是由标准机构创建的——这些机构邀请不同技术公司的人员聚集在一起，并就如何以最佳方式实现所有用例达成共识。W3C 是最著名的 Web 标准组织，但还有其他组织，例如 WHATWG（负责 HTML 语言的现行标准）、ECMA（发布 ECMAScript 标准，JavaScript 基于该标准）、Khronos（发布 3D 图形技术，例如 WebGL）等。

## 现代 Web 技术概述

如果你想成为前端 Web 开发人员，要学习多种技术。

1. 浏览器  
   你可能此刻正在 Web 浏览器中阅读这些文字（除非你已将其打印出来，或正在使用辅助技术读给你听，例如屏幕阅读器）。Web 浏览器是人们用来浏览 Web 的软件程序，包括 Firefox、Chrome、Opera、Safari 和 Edge。
2. HTTP  
   超文本传输协议（HTTP）是一个允许 Web 浏览器与 Web 服务器（存储网站的位置）进行通信的消息传输协议。
3. HTML、CSS 和 JavaScript  
   HTML、CSS 和 JavaScript 是你用来建立网站的三种主要技术：

- 超文本标记语言（HTML）是一种标记语言，由可以包装（标记）内容以赋予其含义（语义）和结构的各种元素组成。
- 层叠样式表（CSS）是一种基于规则的语言，用于将样式应用于 HTML，例如，设置文本和背景的颜色、添加边框、设置动画效果或以某种方式对页面进行布局。
- 从动态样式切换到从服务器获取更新，再到复杂的 3D 图形，JavaScript 是我们用来向网站添加交互性的编程语言。

4. 开发工具  
   一旦了解了可用于构建网页的“原始”技术（例如 HTML、CSS 和 JavaScript），你很快就会遇到各种让工作更轻松或更有效的工具。例如：

- 现代浏览器中的开发人员工具可用于调试代码。
- 可用于运行测试以显示你的代码是否按预期运行的测试工具。
- 建立在 JavaScript 之上的库和框架，使你可以更快，更有效地构建特定类型的网站。
- 所谓的“linter”，它包含了一组规则，检查你的代码之后，会突出显示你未正确遵循规则的地方。
- 极简化器（minifier），它将代码文件中的所有空格删除以使其更小，从而可以更快地从服务器下载。

5. 服务器端语言和框架  
   HTML、CSS 和 JavaScript 是前端（或客户端）语言，这意味着浏览器运行它们生成用户可以使用的网站前端。

   还有另一类语言，称为后端（或服务器端）语言，这意味着它们先在服务器上运行，然后再将结果发送到浏览器进行显示。服务器端语言的一种典型用法是从数据库中获取数据并生成包含该数据的 HTML，然后再将 HTML 发送给浏览器并向用户显示。

   服务器端框架的例子包括 ASP.NET（C#）、Django（Python）、Laravel（PHP）和 Next.js（JavaScript）。

## Web 最佳实践

因为你不完全知道用户要用什么，所以你需要进行防御性设计——使你的网站尽可能灵活，以便上述所有用户都可以使用它，即使他们可能得到并不完全相同的体验。简而言之，我们正在努力使所有人都能使用 Web。

- 跨浏览器兼容性（Cross-browser compatibility）是一种确保你的网页能够在尽可能多的设备上运行的实践。这包括使用所有浏览器都支持的技术，为能提供这些功能（渐进增强）的浏览器提供更好的体验，和/或编写在较旧的浏览器中能回退到更简单但仍可用的体验（平稳降级）的代码。它还涉及大量测试，以查看某些浏览器是否有任何故障，然后进行更多工作来修复这些故障。
- 响应式 Web 设计（Responsive Web design）是一种使功能和布局变得灵活的实践，这样它们可以自动适应不同的浏览器。一个明显的例子是在桌面上的宽屏浏览器中以一种方式进行布局、但在手机浏览器中以另一种更紧凑的单列布局的网站。现在请尝试调整浏览器窗口的宽度，然后看看会发生什么。
- 性能（Performance）意味着要尽快加载网站，而且还应使其直观易用，以使用户不会碰壁离开。
- 无障碍（Accessibility）意味着使你的网站可供尽可能多的不同类型的人使用（相关概念是多样性和包容性，以及包容性设计）。这包括视力障碍，听力障碍，认知障碍或肢体障碍的人。它也不仅仅局限于残疾人——也包含年轻人或老年人、来自不同文化的人、使用移动设备的人、或网络连接不可靠或缓慢的人。
- 国际化（Internationalization）意味着使网站可以供来自不同文化背景、讲着不同语言的人使用。这一点可以考虑一些技术手段（例如，更改布局以使其对于从右到左甚至垂直的语言仍然可以正常使用）和人为手段（例如，使用简单的非俚语，以便使以你的语言作为第二或第三语言的人更可能理解你的文字）。
- 隐私与安全（Privacy & Security）这两个概念相关但不同。隐私是指允许人们私下从事其业务，而不是监视他们或收集你绝对不需要的更多数据。安全性是指以安全的方式构建你的网站，以使恶意用户无法从你或你的用户那里窃取信息。