import{_ as e,c as p,a3 as a,j as s,o as l}from"./js/framework-ohJJpums.js";const o=JSON.parse('{"title":"📊 Mermaid 使用手册","description":"","frontmatter":{},"headers":[],"relativePath":"tools/package/mermaid.md","filePath":"tools/package/mermaid.md","lastUpdated":1752224422000}'),i={name:"tools/package/mermaid.md"};function r(c,n,t,d,m,b){return l(),p("div",null,n[0]||(n[0]=[a(`<h1>📊 Mermaid 使用手册</h1><blockquote><p>💡 <strong>简介</strong>: Mermaid 是一个基于 JavaScript 的图表和流程图生成库，可以用简单的文本语法创建复杂的图表。本手册提供所有图表类型的完整示例。</p></blockquote><h2 id="-" tabindex="-1">📋 目录 <a class="header-anchor" href="#-" aria-label="Permalink to &quot;📋 目录&quot;">​</a></h2><ul><li><a href="#1-流程图-flowchart">1. 流程图 (Flowchart)</a></li><li><a href="#2-序列图-sequence-diagram">2. 序列图 (Sequence Diagram)</a></li><li><a href="#3-饼图-pie-chart">3. 饼图 (Pie Chart)</a></li><li><a href="#4-甘特图-gantt-chart">4. 甘特图 (Gantt Chart)</a></li><li><a href="#5-用户旅程图-user-journey">5. 用户旅程图 (User Journey)</a></li><li><a href="#6-git-图-git-graph">6. Git 图 (Git Graph)</a></li><li><a href="#7-实体关系图-entity-relationship-diagram">7. 实体关系图 (Entity Relationship Diagram)</a></li><li><a href="#8-状态图-state-diagram">8. 状态图 (State Diagram)</a></li><li><a href="#9-类图-class-diagram">9. 类图 (Class Diagram)</a></li><li><a href="#10-时间线图-timeline">10. 时间线图 (Timeline)</a></li><li><a href="#11-思维导图-mind-map">11. 思维导图 (Mind Map)</a></li><li><a href="#12-象限图-quadrant-chart">12. 象限图 (Quadrant Chart)</a></li><li><a href="#13-需求图-requirement-diagram">13. 需求图 (Requirement Diagram)</a></li><li><a href="#14-c4-图-c4-diagram">14. C4 图 (C4 Diagram)</a></li></ul><hr><h2 id="1-flowchart-" tabindex="-1">1. 流程图 (Flowchart) <a class="header-anchor" href="#1-flowchart-" aria-label="Permalink to &quot;1. 流程图 (Flowchart)&quot;">​</a></h2><h3 id="1-1-" tabindex="-1">1.1 基础流程图 <a class="header-anchor" href="#1-1-" aria-label="Permalink to &quot;1.1 基础流程图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>flowchart TD</span></span>
<span class="line"><span>    A[开始] --&gt; B{是否登录?}</span></span>
<span class="line"><span>    B --&gt;|是| C[进入首页]</span></span>
<span class="line"><span>    B --&gt;|否| D[跳转登录页]</span></span>
<span class="line"><span>    D --&gt; E[输入用户名密码]</span></span>
<span class="line"><span>    E --&gt; F{验证通过?}</span></span>
<span class="line"><span>    F --&gt;|是| C</span></span>
<span class="line"><span>    F --&gt;|否| G[提示错误信息]</span></span>
<span class="line"><span>    G --&gt; E</span></span>
<span class="line"><span>    C --&gt; H[结束]</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p><strong>渲染效果：</strong></p>`,10),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-ef99a580f4bb642b00a09c7f527b21db.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<h3 id="1-2-" tabindex="-1">1.2 复杂流程图 <a class="header-anchor" href="#1-2-" aria-label="Permalink to &quot;1.2 复杂流程图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>flowchart LR</span></span>
<span class="line"><span>    A[🚀 项目启动] --&gt; B{需求分析}</span></span>
<span class="line"><span>    B --&gt;|需求明确| C[📋 制定计划]</span></span>
<span class="line"><span>    B --&gt;|需求不明确| D[🔍 深入调研]</span></span>
<span class="line"><span>    D --&gt; B</span></span>
<span class="line"><span>    C --&gt; E[👥 团队分工]</span></span>
<span class="line"><span>    E --&gt; F[💻 开发阶段]</span></span>
<span class="line"><span>    F --&gt; G{代码审查}</span></span>
<span class="line"><span>    G --&gt;|通过| H[🧪 测试阶段]</span></span>
<span class="line"><span>    G --&gt;|不通过| I[🔧 修复问题]</span></span>
<span class="line"><span>    I --&gt; F</span></span>
<span class="line"><span>    H --&gt; J{测试结果}</span></span>
<span class="line"><span>    J --&gt;|通过| K[🚀 部署上线]</span></span>
<span class="line"><span>    J --&gt;|不通过| L[🐛 修复 Bug]</span></span>
<span class="line"><span>    L --&gt; H</span></span>
<span class="line"><span>    K --&gt; M[📊 项目完成]</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p><strong>渲染效果：</strong></p>`,4),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-5ebb6b5207a6beefd9bebab28829f434.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<h3 id="1-3-" tabindex="-1">1.3 节点形状 <a class="header-anchor" href="#1-3-" aria-label="Permalink to &quot;1.3 节点形状&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>flowchart TD</span></span>
<span class="line"><span>    A[矩形] --&gt; B(圆角矩形)</span></span>
<span class="line"><span>    B --&gt; C([椭圆])</span></span>
<span class="line"><span>    C --&gt; D[[子程序]]</span></span>
<span class="line"><span>    D --&gt; E[(数据库)]</span></span>
<span class="line"><span>    E --&gt; F{{六边形}}</span></span>
<span class="line"><span>    F --&gt; G[/平行四边形/]</span></span>
<span class="line"><span>    G --&gt; H[\\反向平行四边形\\]</span></span>
<span class="line"><span>    H --&gt; I{菱形}</span></span>
<span class="line"><span>    I --&gt; J&gt;旗帜形]</span></span>
<span class="line"><span>    J --&gt; K((圆形))</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p><strong>渲染效果：</strong></p>`,4),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-79552b85b49cdd359a3c5dcd748e971e.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="2-sequence-diagram-" tabindex="-1">2. 序列图 (Sequence Diagram) <a class="header-anchor" href="#2-sequence-diagram-" aria-label="Permalink to &quot;2. 序列图 (Sequence Diagram)&quot;">​</a></h2><h3 id="2-1-" tabindex="-1">2.1 基础序列图 <a class="header-anchor" href="#2-1-" aria-label="Permalink to &quot;2.1 基础序列图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>sequenceDiagram</span></span>
<span class="line"><span>    participant U as 👤 用户</span></span>
<span class="line"><span>    participant F as 🌐 前端</span></span>
<span class="line"><span>    participant B as ⚙️ 后端</span></span>
<span class="line"><span>    participant D as 🗄️ 数据库</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    U-&gt;&gt;F: 发送请求</span></span>
<span class="line"><span>    F-&gt;&gt;B: 转发请求</span></span>
<span class="line"><span>    B-&gt;&gt;D: 查询数据</span></span>
<span class="line"><span>    D--&gt;&gt;B: 返回结果</span></span>
<span class="line"><span>    B--&gt;&gt;F: 处理响应</span></span>
<span class="line"><span>    F--&gt;&gt;U: 展示结果</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-8a8e14c11da5a6a2f7520911f079e0dd.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<h3 id="2-2-" tabindex="-1">2.2 复杂序列图 <a class="header-anchor" href="#2-2-" aria-label="Permalink to &quot;2.2 复杂序列图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>sequenceDiagram</span></span>
<span class="line"><span>    participant C as 👤 客户端</span></span>
<span class="line"><span>    participant G as 🚪 API网关</span></span>
<span class="line"><span>    participant A as 🔐 认证服务</span></span>
<span class="line"><span>    participant O as 📋 订单服务</span></span>
<span class="line"><span>    participant P as 💳 支付服务</span></span>
<span class="line"><span>    participant N as 📨 通知服务</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    C-&gt;&gt;G: 创建订单请求</span></span>
<span class="line"><span>    G-&gt;&gt;A: 验证用户身份</span></span>
<span class="line"><span>    A--&gt;&gt;G: 身份验证通过</span></span>
<span class="line"><span>    G-&gt;&gt;O: 创建订单</span></span>
<span class="line"><span>    O-&gt;&gt;O: 生成订单号</span></span>
<span class="line"><span>    O-&gt;&gt;P: 发起支付</span></span>
<span class="line"><span>    P--&gt;&gt;O: 支付成功</span></span>
<span class="line"><span>    O-&gt;&gt;N: 发送通知</span></span>
<span class="line"><span>    N--&gt;&gt;C: 订单创建成功</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Note over C,N: 订单创建流程完成</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    alt 支付失败</span></span>
<span class="line"><span>        P--&gt;&gt;O: 支付失败</span></span>
<span class="line"><span>        O-&gt;&gt;N: 发送失败通知</span></span>
<span class="line"><span>        N--&gt;&gt;C: 订单创建失败</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><p><strong>渲染效果：</strong></p>`,4),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-2510cc9a8e77eb9388b491b0ef886845.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="3-pie-chart-" tabindex="-1">3. 饼图 (Pie Chart) <a class="header-anchor" href="#3-pie-chart-" aria-label="Permalink to &quot;3. 饼图 (Pie Chart)&quot;">​</a></h2><h3 id="3-1-" tabindex="-1">3.1 基础饼图 <a class="header-anchor" href="#3-1-" aria-label="Permalink to &quot;3.1 基础饼图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>pie title 前端技术栈分布</span></span>
<span class="line"><span>    &quot;Vue.js&quot; : 35</span></span>
<span class="line"><span>    &quot;React&quot; : 25</span></span>
<span class="line"><span>    &quot;Angular&quot; : 15</span></span>
<span class="line"><span>    &quot;Node.js&quot; : 20</span></span>
<span class="line"><span>    &quot;其他&quot; : 5</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-28d8117688f5c051e89869beb930b00c.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a('<h3 id="3-2-" tabindex="-1">3.2 项目进度饼图 <a class="header-anchor" href="#3-2-" aria-label="Permalink to &quot;3.2 项目进度饼图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>```mermaid</span></span>\n<span class="line"><span>pie title 项目完成度统计</span></span>\n<span class="line"><span>    &quot;已完成&quot; : 65</span></span>\n<span class="line"><span>    &quot;进行中&quot; : 25</span></span>\n<span class="line"><span>    &quot;待开始&quot; : 10</span></span>\n<span class="line"><span>```</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p><strong>渲染效果：</strong></p>',4),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-609adb8f9d96d4df976fd3df5df50425.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="4-gantt-chart-" tabindex="-1">4. 甘特图 (Gantt Chart) <a class="header-anchor" href="#4-gantt-chart-" aria-label="Permalink to &quot;4. 甘特图 (Gantt Chart)&quot;">​</a></h2><h3 id="4-1-" tabindex="-1">4.1 项目甘特图 <a class="header-anchor" href="#4-1-" aria-label="Permalink to &quot;4.1 项目甘特图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>gantt</span></span>
<span class="line"><span>    title 🚀 前端项目开发计划</span></span>
<span class="line"><span>    dateFormat  YYYY-MM-DD</span></span>
<span class="line"><span>    section 📋 需求分析</span></span>
<span class="line"><span>    需求调研           :done,    des1, 2024-01-01,2024-01-05</span></span>
<span class="line"><span>    需求文档           :done,    des2, 2024-01-06,2024-01-10</span></span>
<span class="line"><span>    section 🎨 设计阶段</span></span>
<span class="line"><span>    UI设计             :active,  des3, 2024-01-11,2024-01-20</span></span>
<span class="line"><span>    交互设计           :         des4, 2024-01-15,2024-01-25</span></span>
<span class="line"><span>    section 💻 开发阶段</span></span>
<span class="line"><span>    前端开发           :         dev1, 2024-01-26,2024-02-20</span></span>
<span class="line"><span>    后端开发           :         dev2, 2024-01-26,2024-02-15</span></span>
<span class="line"><span>    section 🧪 测试阶段</span></span>
<span class="line"><span>    单元测试           :         test1, 2024-02-16,2024-02-25</span></span>
<span class="line"><span>    集成测试           :         test2, 2024-02-21,2024-02-28</span></span>
<span class="line"><span>    section 🚀 部署上线</span></span>
<span class="line"><span>    部署准备           :         deploy1, 2024-03-01,2024-03-05</span></span>
<span class="line"><span>    正式上线           :         deploy2, 2024-03-06,2024-03-07</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-65784cb3824e0f3b23a8597e5d80aa73.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="5-user-journey-" tabindex="-1">5. 用户旅程图 (User Journey) <a class="header-anchor" href="#5-user-journey-" aria-label="Permalink to &quot;5. 用户旅程图 (User Journey)&quot;">​</a></h2><h3 id="5-1-" tabindex="-1">5.1 用户购物旅程 <a class="header-anchor" href="#5-1-" aria-label="Permalink to &quot;5.1 用户购物旅程&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>journey</span></span>
<span class="line"><span>    title 👤 用户购物旅程</span></span>
<span class="line"><span>    section 🔍 发现阶段</span></span>
<span class="line"><span>      浏览商品页面: 5: 用户</span></span>
<span class="line"><span>      查看商品详情: 4: 用户</span></span>
<span class="line"><span>      对比商品信息: 3: 用户</span></span>
<span class="line"><span>    section 🛒 购买阶段</span></span>
<span class="line"><span>      添加到购物车: 4: 用户</span></span>
<span class="line"><span>      填写收货信息: 3: 用户</span></span>
<span class="line"><span>      选择支付方式: 4: 用户</span></span>
<span class="line"><span>      完成支付: 5: 用户</span></span>
<span class="line"><span>    section 📦 售后阶段</span></span>
<span class="line"><span>      等待发货: 3: 用户</span></span>
<span class="line"><span>      收到商品: 5: 用户</span></span>
<span class="line"><span>      商品评价: 4: 用户</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-465750f744eaf9688b41b8fa52d96826.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="6-git-git-graph-" tabindex="-1">6. Git 图 (Git Graph) <a class="header-anchor" href="#6-git-git-graph-" aria-label="Permalink to &quot;6. Git 图 (Git Graph)&quot;">​</a></h2><h3 id="6-1-git-" tabindex="-1">6.1 Git 分支流程 <a class="header-anchor" href="#6-1-git-" aria-label="Permalink to &quot;6.1 Git 分支流程&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>gitgraph</span></span>
<span class="line"><span>    commit id: &quot;Initial commit&quot;</span></span>
<span class="line"><span>    branch develop</span></span>
<span class="line"><span>    checkout develop</span></span>
<span class="line"><span>    commit id: &quot;Add basic feature&quot;</span></span>
<span class="line"><span>    commit id: &quot;Improve UI&quot;</span></span>
<span class="line"><span>    branch feature/login</span></span>
<span class="line"><span>    checkout feature/login</span></span>
<span class="line"><span>    commit id: &quot;Implement login&quot;</span></span>
<span class="line"><span>    commit id: &quot;Add password validation&quot;</span></span>
<span class="line"><span>    checkout develop</span></span>
<span class="line"><span>    merge feature/login</span></span>
<span class="line"><span>    commit id: &quot;Fix login bug&quot;</span></span>
<span class="line"><span>    checkout main</span></span>
<span class="line"><span>    merge develop</span></span>
<span class="line"><span>    commit id: &quot;Release v1.0.0&quot;</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-f950e5ec27db13477a1eba0d09fac896.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="7-entity-relationship-diagram-" tabindex="-1">7. 实体关系图 (Entity Relationship Diagram) <a class="header-anchor" href="#7-entity-relationship-diagram-" aria-label="Permalink to &quot;7. 实体关系图 (Entity Relationship Diagram)&quot;">​</a></h2><h3 id="7-1-er-" tabindex="-1">7.1 数据库ER图 <a class="header-anchor" href="#7-1-er-" aria-label="Permalink to &quot;7.1 数据库ER图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>erDiagram</span></span>
<span class="line"><span>    CUSTOMER {</span></span>
<span class="line"><span>        int id PK</span></span>
<span class="line"><span>        string name</span></span>
<span class="line"><span>        string email</span></span>
<span class="line"><span>        string phone</span></span>
<span class="line"><span>        date created_at</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ORDER {</span></span>
<span class="line"><span>        int id PK</span></span>
<span class="line"><span>        int customer_id FK</span></span>
<span class="line"><span>        decimal total_amount</span></span>
<span class="line"><span>        string status</span></span>
<span class="line"><span>        date order_date</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    PRODUCT {</span></span>
<span class="line"><span>        int id PK</span></span>
<span class="line"><span>        string name</span></span>
<span class="line"><span>        decimal price</span></span>
<span class="line"><span>        int stock_quantity</span></span>
<span class="line"><span>        string description</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ORDER_ITEM {</span></span>
<span class="line"><span>        int id PK</span></span>
<span class="line"><span>        int order_id FK</span></span>
<span class="line"><span>        int product_id FK</span></span>
<span class="line"><span>        int quantity</span></span>
<span class="line"><span>        decimal unit_price</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    CUSTOMER ||--o{ ORDER : places</span></span>
<span class="line"><span>    ORDER ||--o{ ORDER_ITEM : contains</span></span>
<span class="line"><span>    PRODUCT ||--o{ ORDER_ITEM : includes</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-a7e91d7e4bf40e527167d3340e0f4e7b.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="8-state-diagram-" tabindex="-1">8. 状态图 (State Diagram) <a class="header-anchor" href="#8-state-diagram-" aria-label="Permalink to &quot;8. 状态图 (State Diagram)&quot;">​</a></h2><h3 id="8-1-" tabindex="-1">8.1 订单状态流转 <a class="header-anchor" href="#8-1-" aria-label="Permalink to &quot;8.1 订单状态流转&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>stateDiagram-v2</span></span>
<span class="line"><span>    [*] --&gt; 待支付</span></span>
<span class="line"><span>    待支付 --&gt; 已支付: 支付成功</span></span>
<span class="line"><span>    待支付 --&gt; 已取消: 支付超时</span></span>
<span class="line"><span>    已支付 --&gt; 待发货: 确认订单</span></span>
<span class="line"><span>    待发货 --&gt; 已发货: 商品出库</span></span>
<span class="line"><span>    已发货 --&gt; 已签收: 用户确认收货</span></span>
<span class="line"><span>    已签收 --&gt; 已完成: 确认无问题</span></span>
<span class="line"><span>    已签收 --&gt; 退款中: 申请退款</span></span>
<span class="line"><span>    退款中 --&gt; 已退款: 退款完成</span></span>
<span class="line"><span>    退款中 --&gt; 已签收: 退款失败</span></span>
<span class="line"><span>    已取消 --&gt; [*]</span></span>
<span class="line"><span>    已完成 --&gt; [*]</span></span>
<span class="line"><span>    已退款 --&gt; [*]</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-303e8411735038b96c78285a787fc382.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="9-class-diagram-" tabindex="-1">9. 类图 (Class Diagram) <a class="header-anchor" href="#9-class-diagram-" aria-label="Permalink to &quot;9. 类图 (Class Diagram)&quot;">​</a></h2><h3 id="9-1-" tabindex="-1">9.1 前端组件类图 <a class="header-anchor" href="#9-1-" aria-label="Permalink to &quot;9.1 前端组件类图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>classDiagram</span></span>
<span class="line"><span>    class Component {</span></span>
<span class="line"><span>        +String name</span></span>
<span class="line"><span>        +Object props</span></span>
<span class="line"><span>        +Object state</span></span>
<span class="line"><span>        +render()</span></span>
<span class="line"><span>        +componentDidMount()</span></span>
<span class="line"><span>        +componentWillUnmount()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    class Button {</span></span>
<span class="line"><span>        +String text</span></span>
<span class="line"><span>        +String type</span></span>
<span class="line"><span>        +Boolean disabled</span></span>
<span class="line"><span>        +onClick()</span></span>
<span class="line"><span>        +render()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    class Input {</span></span>
<span class="line"><span>        +String value</span></span>
<span class="line"><span>        +String placeholder</span></span>
<span class="line"><span>        +String type</span></span>
<span class="line"><span>        +onChange()</span></span>
<span class="line"><span>        +onFocus()</span></span>
<span class="line"><span>        +onBlur()</span></span>
<span class="line"><span>        +render()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    class Form {</span></span>
<span class="line"><span>        +Object data</span></span>
<span class="line"><span>        +Object rules</span></span>
<span class="line"><span>        +validate()</span></span>
<span class="line"><span>        +submit()</span></span>
<span class="line"><span>        +reset()</span></span>
<span class="line"><span>        +render()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Component &lt;|-- Button</span></span>
<span class="line"><span>    Component &lt;|-- Input</span></span>
<span class="line"><span>    Component &lt;|-- Form</span></span>
<span class="line"><span>    Form *-- Button</span></span>
<span class="line"><span>    Form *-- Input</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-e4cfbb523f6d904b37dfe0a1564c0d80.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="10-timeline-" tabindex="-1">10. 时间线图 (Timeline) <a class="header-anchor" href="#10-timeline-" aria-label="Permalink to &quot;10. 时间线图 (Timeline)&quot;">​</a></h2><h3 id="10-1-" tabindex="-1">10.1 项目发展时间线 <a class="header-anchor" href="#10-1-" aria-label="Permalink to &quot;10.1 项目发展时间线&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>timeline</span></span>
<span class="line"><span>    title 🚀 项目发展历程</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    section 2023年</span></span>
<span class="line"><span>        Q1 : 项目启动</span></span>
<span class="line"><span>           : 需求分析</span></span>
<span class="line"><span>           : 技术选型</span></span>
<span class="line"><span>        Q2 : 原型开发</span></span>
<span class="line"><span>           : UI设计</span></span>
<span class="line"><span>           : 核心功能开发</span></span>
<span class="line"><span>        Q3 : 测试阶段</span></span>
<span class="line"><span>           : Bug修复</span></span>
<span class="line"><span>           : 性能优化</span></span>
<span class="line"><span>        Q4 : 上线发布</span></span>
<span class="line"><span>           : 用户反馈</span></span>
<span class="line"><span>           : 功能迭代</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    section 2024年</span></span>
<span class="line"><span>        Q1 : 版本升级</span></span>
<span class="line"><span>           : 新功能开发</span></span>
<span class="line"><span>           : 用户增长</span></span>
<span class="line"><span>        Q2 : 平台扩展</span></span>
<span class="line"><span>           : 移动端适配</span></span>
<span class="line"><span>           : API优化</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-e47b4bafa5d535febede00659c95c8a1.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="11-mind-map-" tabindex="-1">11. 思维导图 (Mind Map) <a class="header-anchor" href="#11-mind-map-" aria-label="Permalink to &quot;11. 思维导图 (Mind Map)&quot;">​</a></h2><h3 id="11-1-" tabindex="-1">11.1 前端技术思维导图 <a class="header-anchor" href="#11-1-" aria-label="Permalink to &quot;11.1 前端技术思维导图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>mindmap</span></span>
<span class="line"><span>  root((前端技术栈))</span></span>
<span class="line"><span>    HTML</span></span>
<span class="line"><span>      HTML5</span></span>
<span class="line"><span>      语义化</span></span>
<span class="line"><span>      表单</span></span>
<span class="line"><span>    CSS</span></span>
<span class="line"><span>      CSS3</span></span>
<span class="line"><span>      Flexbox</span></span>
<span class="line"><span>      Grid</span></span>
<span class="line"><span>      预处理器</span></span>
<span class="line"><span>        Sass</span></span>
<span class="line"><span>        Less</span></span>
<span class="line"><span>    JavaScript</span></span>
<span class="line"><span>      ES6+</span></span>
<span class="line"><span>      异步编程</span></span>
<span class="line"><span>      DOM操作</span></span>
<span class="line"><span>      事件处理</span></span>
<span class="line"><span>    框架</span></span>
<span class="line"><span>      Vue.js</span></span>
<span class="line"><span>        Vue Router</span></span>
<span class="line"><span>        Vuex</span></span>
<span class="line"><span>      React</span></span>
<span class="line"><span>        React Router</span></span>
<span class="line"><span>        Redux</span></span>
<span class="line"><span>      Angular</span></span>
<span class="line"><span>    工具</span></span>
<span class="line"><span>      Webpack</span></span>
<span class="line"><span>      Vite</span></span>
<span class="line"><span>      Git</span></span>
<span class="line"><span>      npm</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-da1a13f215ffcbf392ceccc8f2a679f0.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="12-quadrant-chart-" tabindex="-1">12. 象限图 (Quadrant Chart) <a class="header-anchor" href="#12-quadrant-chart-" aria-label="Permalink to &quot;12. 象限图 (Quadrant Chart)&quot;">​</a></h2><h3 id="12-1-" tabindex="-1">12.1 技术学习优先级 <a class="header-anchor" href="#12-1-" aria-label="Permalink to &quot;12.1 技术学习优先级&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>quadrantChart</span></span>
<span class="line"><span>    title 技术学习优先级矩阵</span></span>
<span class="line"><span>    x-axis 学习难度低 --&gt; 学习难度高</span></span>
<span class="line"><span>    y-axis 重要性低 --&gt; 重要性高</span></span>
<span class="line"><span>    quadrant-1 应该掌握</span></span>
<span class="line"><span>    quadrant-2 优先学习</span></span>
<span class="line"><span>    quadrant-3 可以了解</span></span>
<span class="line"><span>    quadrant-4 暂时忽略</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    HTML/CSS: [0.2, 0.8]</span></span>
<span class="line"><span>    JavaScript: [0.3, 0.9]</span></span>
<span class="line"><span>    Vue.js: [0.4, 0.8]</span></span>
<span class="line"><span>    React: [0.5, 0.8]</span></span>
<span class="line"><span>    Node.js: [0.6, 0.7]</span></span>
<span class="line"><span>    TypeScript: [0.7, 0.6]</span></span>
<span class="line"><span>    Docker: [0.8, 0.5]</span></span>
<span class="line"><span>    Kubernetes: [0.9, 0.4]</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-67307eb9cf741bc654a0495147046132.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="13-requirement-diagram-" tabindex="-1">13. 需求图 (Requirement Diagram) <a class="header-anchor" href="#13-requirement-diagram-" aria-label="Permalink to &quot;13. 需求图 (Requirement Diagram)&quot;">​</a></h2><h3 id="13-1-" tabindex="-1">13.1 系统需求图 <a class="header-anchor" href="#13-1-" aria-label="Permalink to &quot;13.1 系统需求图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>requirementDiagram</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    requirement user_auth {</span></span>
<span class="line"><span>        id: 1</span></span>
<span class="line"><span>        text: 用户认证系统</span></span>
<span class="line"><span>        risk: high</span></span>
<span class="line"><span>        verifymethod: test</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    requirement data_storage {</span></span>
<span class="line"><span>        id: 2</span></span>
<span class="line"><span>        text: 数据存储</span></span>
<span class="line"><span>        risk: medium</span></span>
<span class="line"><span>        verifymethod: inspection</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    requirement api_gateway {</span></span>
<span class="line"><span>        id: 3</span></span>
<span class="line"><span>        text: API网关</span></span>
<span class="line"><span>        risk: low</span></span>
<span class="line"><span>        verifymethod: demonstration</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    functionalRequirement login {</span></span>
<span class="line"><span>        id: 1.1</span></span>
<span class="line"><span>        text: 用户登录功能</span></span>
<span class="line"><span>        risk: high</span></span>
<span class="line"><span>        verifymethod: test</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    functionalRequirement register {</span></span>
<span class="line"><span>        id: 1.2</span></span>
<span class="line"><span>        text: 用户注册功能</span></span>
<span class="line"><span>        risk: medium</span></span>
<span class="line"><span>        verifymethod: test</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    performanceRequirement response_time {</span></span>
<span class="line"><span>        id: 3.1</span></span>
<span class="line"><span>        text: 响应时间 &lt; 2秒</span></span>
<span class="line"><span>        risk: medium</span></span>
<span class="line"><span>        verifymethod: test</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    user_auth - contains -&gt; login</span></span>
<span class="line"><span>    user_auth - contains -&gt; register</span></span>
<span class="line"><span>    api_gateway - contains -&gt; response_time</span></span>
<span class="line"><span>    login - satisfies -&gt; user_auth</span></span>
<span class="line"><span>    register - satisfies -&gt; user_auth</span></span>
<span class="line"><span>    response_time - satisfies -&gt; api_gateway</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-ce6a7f05f1b754c6e2782bc58f5aa6ab.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="14-c4-c4-diagram-" tabindex="-1">14. C4 图 (C4 Diagram) <a class="header-anchor" href="#14-c4-c4-diagram-" aria-label="Permalink to &quot;14. C4 图 (C4 Diagram)&quot;">​</a></h2><h3 id="14-1-" tabindex="-1">14.1 系统架构图 <a class="header-anchor" href="#14-1-" aria-label="Permalink to &quot;14.1 系统架构图&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>C4Context</span></span>
<span class="line"><span>    title 电商系统架构图</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Person(user, &quot;用户&quot;, &quot;购买商品的用户&quot;)</span></span>
<span class="line"><span>    Person(admin, &quot;管理员&quot;, &quot;管理系统的管理员&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    System(ecommerce, &quot;电商平台&quot;, &quot;提供商品购买服务&quot;)</span></span>
<span class="line"><span>    System_Ext(payment, &quot;支付系统&quot;, &quot;处理支付业务&quot;)</span></span>
<span class="line"><span>    System_Ext(logistics, &quot;物流系统&quot;, &quot;处理物流配送&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Rel(user, ecommerce, &quot;浏览商品、下单购买&quot;)</span></span>
<span class="line"><span>    Rel(admin, ecommerce, &quot;管理商品、查看订单&quot;)</span></span>
<span class="line"><span>    Rel(ecommerce, payment, &quot;调用支付接口&quot;)</span></span>
<span class="line"><span>    Rel(ecommerce, logistics, &quot;调用物流接口&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    UpdateRelStyle(user, ecommerce, $offsetY=&quot;60&quot;, $offsetX=&quot;90&quot;)</span></span>
<span class="line"><span>    UpdateRelStyle(admin, ecommerce, $offsetY=&quot;-40&quot;, $offsetX=&quot;-90&quot;)</span></span>
<span class="line"><span>    UpdateRelStyle(ecommerce, payment, $offsetY=&quot;-40&quot;)</span></span>
<span class="line"><span>    UpdateRelStyle(ecommerce, logistics, $offsetY=&quot;40&quot;)</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div><p><strong>渲染效果：</strong></p>`,6),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-ac7a9227e0a13d78bc9a988ae94b9ad7.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<hr><h2 id="--1" tabindex="-1">📝 语法速查表 <a class="header-anchor" href="#--1" aria-label="Permalink to &quot;📝 语法速查表&quot;">​</a></h2><h3 id="--2" tabindex="-1">基本语法 <a class="header-anchor" href="#--2" aria-label="Permalink to &quot;基本语法&quot;">​</a></h3><table tabindex="0"><thead><tr><th>图表类型</th><th>语法关键字</th><th>说明</th></tr></thead><tbody><tr><td>流程图</td><td><code>flowchart</code></td><td>描述业务流程</td></tr><tr><td>序列图</td><td><code>sequenceDiagram</code></td><td>描述时序交互</td></tr><tr><td>饼图</td><td><code>pie</code></td><td>显示数据占比</td></tr><tr><td>甘特图</td><td><code>gantt</code></td><td>项目进度管理</td></tr><tr><td>用户旅程图</td><td><code>journey</code></td><td>用户体验流程</td></tr><tr><td>Git图</td><td><code>gitgraph</code></td><td>版本控制流程</td></tr><tr><td>实体关系图</td><td><code>erDiagram</code></td><td>数据库设计</td></tr><tr><td>状态图</td><td><code>stateDiagram</code></td><td>状态流转</td></tr><tr><td>类图</td><td><code>classDiagram</code></td><td>面向对象设计</td></tr><tr><td>时间线图</td><td><code>timeline</code></td><td>时间轴展示</td></tr><tr><td>思维导图</td><td><code>mindmap</code></td><td>知识结构</td></tr><tr><td>象限图</td><td><code>quadrantChart</code></td><td>四象限分析</td></tr><tr><td>需求图</td><td><code>requirementDiagram</code></td><td>需求分析</td></tr><tr><td>C4图</td><td><code>C4Context</code></td><td>架构设计</td></tr></tbody></table><h3 id="--3" tabindex="-1">方向控制 <a class="header-anchor" href="#--3" aria-label="Permalink to &quot;方向控制&quot;">​</a></h3><table tabindex="0"><thead><tr><th>方向</th><th>说明</th></tr></thead><tbody><tr><td><code>TD</code> / <code>TB</code></td><td>从上到下</td></tr><tr><td><code>BT</code></td><td>从下到上</td></tr><tr><td><code>LR</code></td><td>从左到右</td></tr><tr><td><code>RL</code></td><td>从右到左</td></tr></tbody></table><h3 id="--4" tabindex="-1">连接线类型 <a class="header-anchor" href="#--4" aria-label="Permalink to &quot;连接线类型&quot;">​</a></h3><table tabindex="0"><thead><tr><th>连接线</th><th>说明</th></tr></thead><tbody><tr><td><code>--&gt;</code></td><td>实线箭头</td></tr><tr><td><code>---</code></td><td>实线</td></tr><tr><td><code>-.-&gt;</code></td><td>虚线箭头</td></tr><tr><td><code>-.-</code></td><td>虚线</td></tr><tr><td><code>==&gt;</code></td><td>粗实线箭头</td></tr><tr><td><code>===</code></td><td>粗实线</td></tr></tbody></table><hr><h2 id="--5" tabindex="-1">🔧 高级技巧 <a class="header-anchor" href="#--5" aria-label="Permalink to &quot;🔧 高级技巧&quot;">​</a></h2><h3 id="1-subgraph-" tabindex="-1">1. 子图 (Subgraph) <a class="header-anchor" href="#1-subgraph-" aria-label="Permalink to &quot;1. 子图 (Subgraph)&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>flowchart TD</span></span>
<span class="line"><span>    subgraph 前端系统</span></span>
<span class="line"><span>        A[Vue.js] --&gt; B[Router]</span></span>
<span class="line"><span>        B --&gt; C[Vuex]</span></span>
<span class="line"><span>        C --&gt; D[Components]</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    subgraph 后端系统</span></span>
<span class="line"><span>        E[Node.js] --&gt; F[Express]</span></span>
<span class="line"><span>        F --&gt; G[中间件]</span></span>
<span class="line"><span>        G --&gt; H[API]</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    subgraph 数据库</span></span>
<span class="line"><span>        I[MySQL] --&gt; J[数据表]</span></span>
<span class="line"><span>        J --&gt; K[索引]</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    前端系统 --&gt; 后端系统</span></span>
<span class="line"><span>    后端系统 --&gt; 数据库</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p><strong>渲染效果：</strong></p>`,14),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-84f7ddaa8d2b3faa3335d1ef3ee8d465.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a(`<h3 id="2-" tabindex="-1">2. 样式定制 <a class="header-anchor" href="#2-" aria-label="Permalink to &quot;2. 样式定制&quot;">​</a></h3><p><strong>代码示例：</strong></p><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`\`\`mermaid</span></span>
<span class="line"><span>flowchart LR</span></span>
<span class="line"><span>    A[开始] --&gt; B[处理中]</span></span>
<span class="line"><span>    B --&gt; C[完成]</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    classDef startClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px</span></span>
<span class="line"><span>    classDef processClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px</span></span>
<span class="line"><span>    classDef endClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    class A startClass</span></span>
<span class="line"><span>    class B processClass</span></span>
<span class="line"><span>    class C endClass</span></span>
<span class="line"><span>\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p><strong>渲染效果：</strong></p>`,4),s("figure",{class:"vpd-diagram vpd-diagram--mermaid",onclick:`
        const figure = this;
        const isFullscreen = figure.classList.contains('vpd-diagram--fullscreen');
        
        document.querySelectorAll('.vpd-diagram').forEach(diagram => {
          diagram.classList.remove('vpd-diagram--fullscreen');
        });

        if (!isFullscreen) {
          figure.classList.add('vpd-diagram--fullscreen');
        }
      `},[s("img",{src:"/diagrams/mermaid-a6d066e6e1f087295be32fd7290a448f.svg",alt:"mermaid Diagram",class:"vpd-diagram-image"})],-1),a('<hr><h2 id="--6" tabindex="-1">📚 最佳实践 <a class="header-anchor" href="#--6" aria-label="Permalink to &quot;📚 最佳实践&quot;">​</a></h2><h3 id="1-" tabindex="-1">1. 命名规范 <a class="header-anchor" href="#1-" aria-label="Permalink to &quot;1. 命名规范&quot;">​</a></h3><ul><li>使用有意义的节点名称</li><li>避免过长的标签文本</li><li>使用表情符号增强可读性</li></ul><h3 id="2--1" tabindex="-1">2. 布局优化 <a class="header-anchor" href="#2--1" aria-label="Permalink to &quot;2. 布局优化&quot;">​</a></h3><ul><li>合理选择图表方向</li><li>避免过于复杂的关系</li><li>使用子图组织相关内容</li></ul><h3 id="3-" tabindex="-1">3. 性能考虑 <a class="header-anchor" href="#3-" aria-label="Permalink to &quot;3. 性能考虑&quot;">​</a></h3><ul><li>限制节点数量（建议不超过30个）</li><li>避免过深的嵌套关系</li><li>使用简化的语法</li></ul><h3 id="4-" tabindex="-1">4. 可维护性 <a class="header-anchor" href="#4-" aria-label="Permalink to &quot;4. 可维护性&quot;">​</a></h3><ul><li>添加适当的注释</li><li>使用一致的风格</li><li>定期更新图表内容</li></ul><hr><h2 id="--7" tabindex="-1">🛠️ 工具推荐 <a class="header-anchor" href="#--7" aria-label="Permalink to &quot;🛠️ 工具推荐&quot;">​</a></h2><h3 id="--8" tabindex="-1">在线编辑器 <a class="header-anchor" href="#--8" aria-label="Permalink to &quot;在线编辑器&quot;">​</a></h3><ul><li><a href="https://mermaid.live/" target="_blank" rel="noreferrer">Mermaid Live Editor</a> - 官方在线编辑器</li><li><a href="https://www.mermaidchart.com/" target="_blank" rel="noreferrer">Mermaid Chart</a> - 专业图表工具</li></ul><h3 id="ide-" tabindex="-1">IDE 插件 <a class="header-anchor" href="#ide-" aria-label="Permalink to &quot;IDE 插件&quot;">​</a></h3><ul><li><strong>VS Code</strong>: Mermaid Markdown Syntax Highlighting</li><li><strong>IntelliJ IDEA</strong>: Mermaid Plugin</li><li><strong>Vim</strong>: vim-mermaid</li></ul><h3 id="--9" tabindex="-1">集成工具 <a class="header-anchor" href="#--9" aria-label="Permalink to &quot;集成工具&quot;">​</a></h3><ul><li><strong>GitLab</strong>: 原生支持</li><li><strong>GitHub</strong>: 原生支持</li><li><strong>Notion</strong>: 通过代码块支持</li><li><strong>Confluence</strong>: 通过插件支持</li></ul><hr><h2 id="--10" tabindex="-1">📖 参考资料 <a class="header-anchor" href="#--10" aria-label="Permalink to &quot;📖 参考资料&quot;">​</a></h2><ul><li><a href="https://mermaid.js.org/" target="_blank" rel="noreferrer">Mermaid 官方文档</a></li><li><a href="https://vitepress.dev/guide/markdown#mermaid" target="_blank" rel="noreferrer">VitePress Mermaid 支持</a></li><li><a href="https://github.com/mermaid-js/mermaid/tree/develop/docs/syntax" target="_blank" rel="noreferrer">Mermaid 示例库</a></li><li><a href="https://github.com/mermaid-js/mermaid/discussions" target="_blank" rel="noreferrer">社区示例</a></li></ul><hr><blockquote><p>💡 <strong>提示</strong>: 本手册涵盖了 Mermaid 的所有主要图表类型，每种图表都提供了完整的代码示例和渲染效果。建议根据实际需求选择合适的图表类型，并结合具体场景进行定制。</p></blockquote>',23)]))}const g=e(i,[["render",r]]);export{o as __pageData,g as default};
