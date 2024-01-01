import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as i,c,a as n,b as s,d as t,e as p}from"./app-b6af1138.js";const l={},u=n("h1",{id:"简介",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#简介","aria-hidden":"true"},"#"),s(" 简介")],-1),r=n("blockquote",null,[n("p",null,"本文基于 Python2.7")],-1),d=n("a",{href:"www.imooc.com"},"慕课网",-1),k={href:"http://gityuan.com",target:"_blank",rel:"noopener noreferrer"},v=n("p",null,"本文即上述过程整理。",-1),m={href:"https://github.com/jixiaoyong/AndroidNote/tree/master/code/2018-1-26/gityuan_spider",target:"_blank",rel:"noopener noreferrer"},b=p('<h1 id="框架" tabindex="-1"><a class="header-anchor" href="#框架" aria-hidden="true">#</a> 框架</h1><p>爬虫主要活动是：</p><ol><li>爬取目标网页内容</li><li>对获取到的内容进行分析，获取有用数据</li><li>将处理好的数据按格式输出</li></ol><p>此外还需要有一个专门管理爬虫活动的主类，故而文件结构如下：</p><ol><li>spider_main.py 入口类</li><li>url_manager.py 管理要下载的链接</li><li>html_downloader.py 下载网页内容</li><li>html_paeser.py 对获取到的数据进行解析、加工</li><li>html_out.py 输出格式化的数据</li></ol>',5),_={href:"http://gityuan.com",target:"_blank",rel:"noopener noreferrer"},f=p(`<h1 id="关键代码" tabindex="-1"><a class="header-anchor" href="#关键代码" aria-hidden="true">#</a> 关键代码</h1><p><strong>spider_main.py</strong></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token comment">#导入用到的各个类</span>
<span class="token keyword">import</span> html_downloader
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>

<span class="token comment">#定义入口类</span>
<span class="token keyword">class</span> <span class="token class-name">SpiderMain</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
  <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>

    <span class="token comment">#初始化各个变量 downloader、parser、output...</span>
    self<span class="token punctuation">.</span>downloader <span class="token operator">=</span> html_downloader<span class="token punctuation">.</span>HtmlDownloader<span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token comment">#略</span>
   <span class="token keyword">def</span> <span class="token function">craw</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span>root_url<span class="token punctuation">)</span><span class="token punctuation">:</span>

    html_cont <span class="token operator">=</span> self<span class="token punctuation">.</span>downloader<span class="token punctuation">.</span>download<span class="token punctuation">(</span>root_url<span class="token punctuation">)</span>

    new_data <span class="token operator">=</span> self<span class="token punctuation">.</span>parser<span class="token punctuation">.</span>parse<span class="token punctuation">(</span>html_cont<span class="token punctuation">)</span>

    self<span class="token punctuation">.</span>output<span class="token punctuation">.</span>collect_data<span class="token punctuation">(</span>new_data<span class="token punctuation">)</span>

    self<span class="token punctuation">.</span>output<span class="token punctuation">.</span>output_json<span class="token punctuation">(</span><span class="token punctuation">)</span>

root_url <span class="token operator">=</span> <span class="token string">&#39;http://www.gityuan.com/&#39;</span>
sp <span class="token operator">=</span> SpiderMain<span class="token punctuation">(</span><span class="token punctuation">)</span>
sp<span class="token punctuation">.</span>craw<span class="token punctuation">(</span>root_url<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>在<code>__init__()</code> 方法初始化各个变量；</li><li>在<code>craw()</code>中分别实现下载、解析网页内容、输出加工数据</li></ul><p><strong>html_download.py</strong></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">import</span> urllib2

<span class="token keyword">class</span> <span class="token class-name">HtmlDownLoader</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>

  <span class="token keyword">def</span> <span class="token function">download</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span>url<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> url <span class="token keyword">is</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
      <span class="token keyword">return</span> <span class="token boolean">None</span>

    respone <span class="token operator">=</span> urllib2<span class="token punctuation">.</span>urlopen<span class="token punctuation">(</span>url<span class="token punctuation">,</span>timeout<span class="token operator">=</span><span class="token number">300</span><span class="token punctuation">)</span>

    <span class="token keyword">if</span> respone<span class="token punctuation">.</span>getcode<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">200</span><span class="token punctuation">:</span>
      <span class="token keyword">return</span> <span class="token boolean">None</span>

    <span class="token keyword">return</span> respone<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下载并返回网页内容，比较简单</p><p><strong>html_parser.py</strong></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">import</span> urlparse
<span class="token keyword">from</span> bs4 <span class="token keyword">import</span> BeautifulSoup <span class="token comment">#第三方包，需要单独下载</span>
<span class="token keyword">import</span> re

<span class="token keyword">class</span> <span class="token class-name">HtmlParser</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>

  <span class="token keyword">def</span> <span class="token function">parse</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span>html_cont<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> html_cont <span class="token keyword">is</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
      <span class="token keyword">return</span>

    <span class="token comment">#用 BeautifulSoup 解析文档内容</span>
    soup <span class="token operator">=</span> BeautifulSoup<span class="token punctuation">(</span>html_cont<span class="token punctuation">,</span><span class="token string">&#39;html.parser&#39;</span><span class="token punctuation">)</span>

    res_data <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token comment">#数组</span>

    <span class="token comment">#获取所有的文章节点 nodes</span>
    post_div_nodes <span class="token operator">=</span> soup<span class="token punctuation">.</span>find_all<span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span>class_<span class="token operator">=</span><span class="token string">&#39;post-preview&#39;</span><span class="token punctuation">)</span>

    <span class="token comment">#遍历 nodes，读取每一项内容并保存</span>
    <span class="token keyword">for</span> post_div_node <span class="token keyword">in</span> post_div_nodes<span class="token punctuation">:</span>
      post_div_soup <span class="token operator">=</span> BeautifulSoup<span class="token punctuation">(</span><span class="token builtin">str</span><span class="token punctuation">(</span>post_div_node<span class="token punctuation">)</span><span class="token punctuation">)</span>

      post_info <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">#字典 dict</span>

      <span class="token comment">#判断 URL 是否是完整</span>
      url_ <span class="token operator">=</span> post_div_soup<span class="token punctuation">.</span>a<span class="token punctuation">[</span><span class="token string">&#39;href&#39;</span><span class="token punctuation">]</span>
      <span class="token keyword">if</span> <span class="token string">&#39;http://&#39;</span> <span class="token keyword">not</span> <span class="token keyword">in</span> url_<span class="token punctuation">:</span>
        url_ <span class="token operator">=</span> <span class="token string">&quot;http://gityuan.com&quot;</span> <span class="token operator">+</span> url_

      <span class="token comment">#保存数据</span>
      post_info<span class="token punctuation">[</span><span class="token string">&#39;url&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> url_
      post_info<span class="token punctuation">[</span><span class="token string">&#39;title&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> post_div_soup<span class="token punctuation">.</span>find<span class="token punctuation">(</span><span class="token string">&#39;h2&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>get_text<span class="token punctuation">(</span><span class="token punctuation">)</span>
      post_info<span class="token punctuation">[</span><span class="token string">&#39;summary&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> post_div_soup<span class="token punctuation">.</span>find<span class="token punctuation">(</span><span class="token string">&#39;div&#39;</span><span class="token punctuation">,</span>class_<span class="token operator">=</span><span class="token string">&#39;post-content-preview&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>get_text<span class="token punctuation">(</span><span class="token punctuation">)</span>

      res_data<span class="token punctuation">.</span>append<span class="token punctuation">(</span>post_info<span class="token punctuation">)</span>

     <span class="token keyword">return</span> res_data

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是爬虫功能的重点之一：对网页数据进行解析，由此数据才变为可用数据</p><p>主要是通过第三方插件<code>BeautifulSoup</code>解析数据，并保存到数组<code>res_data</code>中，具体见代码中实现</p><p><strong>html_output.py</strong></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">import</span> sys
<span class="token comment">#下面两行代码解决编码问题，强制使用 utf-8，而非默认的 unicode 编码</span>
<span class="token builtin">reload</span><span class="token punctuation">(</span>sys<span class="token punctuation">)</span>
sys<span class="token punctuation">.</span>setdefaultencoding<span class="token punctuation">(</span><span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span>

<span class="token keyword">class</span> <span class="token class-name">JsonOutput</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
  <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
    self<span class="token punctuation">.</span>datas <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

  <span class="token keyword">def</span> <span class="token function">collect_data</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span>new_data<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> new_data <span class="token keyword">is</span> <span class="token keyword">not</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
      self<span class="token punctuation">.</span>datas<span class="token punctuation">.</span>append<span class="token punctuation">(</span>new_data<span class="token punctuation">)</span>

  <span class="token keyword">def</span> <span class="token function">output_json</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment">#打开文件，并以 json 格式输出</span>
    fout <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">&#39;output.json&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;w&#39;</span><span class="token punctuation">)</span>

    fout<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">&#39;{&#39;</span><span class="token punctuation">)</span>
    fout<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">r&#39;&quot;data&quot;:[&#39;</span><span class="token punctuation">)</span>

    <span class="token keyword">for</span> data <span class="token keyword">in</span> self<span class="token punctuation">.</span>datas<span class="token punctuation">:</span>
      <span class="token keyword">for</span> post_info <span class="token keyword">in</span> data<span class="token punctuation">:</span>

        fout<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">&#39;{&#39;</span><span class="token punctuation">)</span>
        fout<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">&#39;&quot;url&quot;:&quot;%&quot;,&#39;</span> <span class="token operator">%</span> post_info<span class="token punctuation">[</span><span class="token string">&#39;url&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        fout<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">&#39;&quot;title&quot;:&quot;%&quot;,&#39;</span> <span class="token operator">%</span> post_info<span class="token punctuation">[</span><span class="token string">&#39;title&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        fout<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">&#39;&quot;summary&quot;:&quot;%&quot;,&#39;</span> <span class="token operator">%</span> post_info<span class="token punctuation">[</span><span class="token string">&#39;summary&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        fout<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">&#39;},&#39;</span><span class="token punctuation">)</span>
    <span class="token comment">#为了符合 json 规范，最后一个输入空数据，无末尾逗号</span>
    fout<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">r&#39;{}&#39;</span><span class="token punctuation">)</span>

    fout<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">&#39;]}&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本类也很重要，主要是数据存取，以及将解析好的数据格式化输出</p><h1 id="说明" tabindex="-1"><a class="header-anchor" href="#说明" aria-hidden="true">#</a> 说明</h1><p>本文中代码经二次处理，不一定与源代码一致，但思路如此，以供参考。</p>`,16);function y(h,w){const a=o("ExternalLinkIcon");return i(),c("div",null,[u,r,n("p",null,[s("这篇文章基于我在"),d,s("上面学习 Python 简单爬虫写的内容，教程内容是爬取 1000 条百度百科的数据，但是教程中爬虫截止 2018-01-27 已经失效，刚好看到大神 "),n("a",k,[s("gityuan.com"),t(a)]),s(" 的内容，于是用 Python 实现爬取其网页内容并生成 json 数据。")]),v,n("p",null,[s("本文涉及源代码已上传 github（"),n("a",m,[s("点这里查看"),t(a)]),s("）。")]),b,n("p",null,[s("目前只实现了爬取 "),n("a",_,[s("gityuan.com"),t(a)]),s(" 第一页内容并输出 json，所以暂时不需要实现 url_manager.py")]),f])}const x=e(l,[["render",y],["__file","9c0ccf0d.html.vue"]]);export{x as default};
