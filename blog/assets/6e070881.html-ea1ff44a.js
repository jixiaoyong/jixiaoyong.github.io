import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o,c as l,a as n,b as s,d as t,e as i}from"./app-979c3f18.js";const c={},u=i(`<h1 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h1><p>更新内容：</p><ul><li>爬取gityuan.com网站所有文章列表并输出json</li><li>汇总信息输出config.json为后面的客户端做准备</li></ul><p>更新文件：</p><ul><li>spider_main.py</li><li>html_output.py</li><li><strong>gityuan_urls.py</strong></li><li><strong>html_downloader.py</strong></li></ul><h1 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h1><ul><li><strong>spider_main.py</strong></li></ul><p>作为入口类，主要增加了初始化所有URL，以及便利这些URL的功能。</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>sp <span class="token operator">=</span> SpiderMain<span class="token punctuation">(</span><span class="token punctuation">)</span>

gityuan <span class="token operator">=</span> gityuan_urls<span class="token punctuation">.</span>GitYuanUrls<span class="token punctuation">(</span><span class="token punctuation">)</span>

gityuan_urls <span class="token operator">=</span> gityuan<span class="token punctuation">.</span>get_urls<span class="token punctuation">(</span><span class="token number">17</span><span class="token punctuation">)</span>


file_name <span class="token operator">=</span> <span class="token string">&#39;gityuan_page_&#39;</span>

sp<span class="token punctuation">.</span>craw<span class="token punctuation">(</span>gityuan_urls<span class="token punctuation">,</span>file_name<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其<code>craw()</code>方法修改如下：</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> time <span class="token keyword">import</span> sleep

<span class="token keyword">def</span> <span class="token function">craw</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root_urls<span class="token punctuation">,</span> file_name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        
        <span class="token comment">#将所有有效链接全部加入</span>
        self<span class="token punctuation">.</span>urls<span class="token punctuation">.</span>add_new_urls<span class="token punctuation">(</span>root_urls<span class="token punctuation">)</span>

        i <span class="token operator">=</span> <span class="token number">0</span>

        <span class="token comment">#循环遍历这些链接</span>
        <span class="token keyword">while</span> self<span class="token punctuation">.</span>urls<span class="token punctuation">.</span>has_next<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>

            i <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span>

            new_url <span class="token operator">=</span> self<span class="token punctuation">.</span>urls<span class="token punctuation">.</span>get_new_url<span class="token punctuation">(</span><span class="token punctuation">)</span>

            html_cont <span class="token operator">=</span> self<span class="token punctuation">.</span>downloader<span class="token punctuation">.</span>download<span class="token punctuation">(</span>new_url<span class="token punctuation">)</span>

            new_url<span class="token punctuation">,</span> new_data <span class="token operator">=</span> self<span class="token punctuation">.</span>parser<span class="token punctuation">.</span>parse<span class="token punctuation">(</span>new_url<span class="token punctuation">,</span> html_cont<span class="token punctuation">)</span>

            self<span class="token punctuation">.</span>output<span class="token punctuation">.</span>collect_data<span class="token punctuation">(</span>new_data<span class="token punctuation">)</span>

            new_file_name <span class="token operator">=</span> file_name <span class="token operator">+</span> <span class="token punctuation">(</span><span class="token string">&#39;%d.json&#39;</span><span class="token operator">%</span>i<span class="token punctuation">)</span>

            self<span class="token punctuation">.</span>output<span class="token punctuation">.</span>output_html<span class="token punctuation">(</span>new_file_name<span class="token punctuation">)</span>
            
            <span class="token comment">#等待3s，防止太频繁访问被识别</span>
            sleep<span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span>

        <span class="token comment">#结束遍历，输出汇总信息</span>
        self<span class="token punctuation">.</span>output<span class="token punctuation">.</span>end<span class="token punctuation">(</span>file_name<span class="token punctuation">,</span>root_urls<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>i<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>html_output.py</strong></li></ul><p>主要改动如下：</p><ol><li><code>output_html(self,file_name)</code>方法增加一个<code>file_name</code>的参数，并在内部调用<code>self.mkdir()</code>方法生成output目录，方便同时输出多个文档</li><li><code>mkdir()</code>方法，创建文件</li><li><code>end(self,file_name_start, url, num)</code>方法，输出汇总文档，代码如下</li></ol><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>
    <span class="token keyword">def</span> <span class="token function">end</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span>file_name_start<span class="token punctuation">,</span> url<span class="token punctuation">,</span> num<span class="token punctuation">)</span><span class="token punctuation">:</span>

        self<span class="token punctuation">.</span>mkdir<span class="token punctuation">(</span><span class="token punctuation">)</span>

        file_name <span class="token operator">=</span> self<span class="token punctuation">.</span>output_dir <span class="token operator">+</span> <span class="token string">&#39;config.json&#39;</span>

        file_out <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span>file_name<span class="token punctuation">,</span><span class="token string">&#39;w&#39;</span><span class="token punctuation">)</span>
        
        current_time <span class="token operator">=</span> time<span class="token punctuation">.</span>time<span class="token punctuation">(</span><span class="token punctuation">)</span>

        config_str <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token string">&#39;{&quot;url&quot;:&quot;%s&quot;,&quot;total&quot;:&quot;%d&quot;,&quot;update_time&quot;:&quot;%d&quot;,&quot;file_name&quot;:&quot;%s&quot;}&#39;</span> <span class="token operator">%</span> <span class="token punctuation">(</span>url<span class="token punctuation">,</span>num<span class="token punctuation">,</span>current_time<span class="token punctuation">,</span>file_name_start<span class="token punctuation">)</span><span class="token punctuation">)</span>

        file_out<span class="token punctuation">.</span>write<span class="token punctuation">(</span>config_str<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>gityuan_urls.py</strong></li></ul><p>主要代码如下，通过循环遍历获取所有文章列表信息</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">GitYuanUrls</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
	<span class="token triple-quoted-string string">&quot;&quot;&quot;docstring for GitYuanUrls&quot;&quot;&quot;</span>
	<span class="token keyword">def</span> <span class="token function">get_urls</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> num<span class="token punctuation">)</span><span class="token punctuation">:</span>

		urls <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

		urls<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">&#39;http://www.gityuan.com&#39;</span><span class="token punctuation">)</span>

		<span class="token keyword">for</span> x <span class="token keyword">in</span> <span class="token builtin">xrange</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span>num<span class="token punctuation">)</span><span class="token punctuation">:</span>
			url_ <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token string">&#39;http://www.gityuan.com/page%d/&#39;</span><span class="token operator">%</span>x<span class="token punctuation">)</span>
			urls<span class="token punctuation">.</span>append<span class="token punctuation">(</span>url_<span class="token punctuation">)</span>

		<span class="token keyword">return</span> urls
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>html_downloader.py</strong></li></ul><p>就在本文编辑的过程中，爬虫被识别，并且限制访问文件数量，所以对下载功能做了简单的伪装、增加超时处理。</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">download2</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> url<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token comment">#升级版</span>

        <span class="token keyword">if</span> url <span class="token keyword">is</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">None</span>

        <span class="token comment">#伪装为浏览器</span>
        req_header <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">&#39;User-Agent&#39;</span><span class="token punctuation">:</span><span class="token string">&#39;Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36&#39;</span><span class="token punctuation">}</span>

        <span class="token keyword">try</span><span class="token punctuation">:</span>
            request <span class="token operator">=</span> urllib2<span class="token punctuation">.</span>Request<span class="token punctuation">(</span>url<span class="token punctuation">,</span><span class="token boolean">None</span><span class="token punctuation">,</span>req_header<span class="token punctuation">)</span>

            response <span class="token operator">=</span> urllib2<span class="token punctuation">.</span>urlopen<span class="token punctuation">(</span>request<span class="token punctuation">,</span><span class="token boolean">None</span><span class="token punctuation">,</span><span class="token number">300</span><span class="token punctuation">)</span>

            <span class="token keyword">return</span> response<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">except</span> socket<span class="token punctuation">.</span>timeout <span class="token keyword">as</span> e<span class="token punctuation">:</span>
            <span class="token comment">#超时处理</span>
            <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token builtin">type</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">)</span>
        
        <span class="token keyword">return</span> <span class="token boolean">None</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="结语" tabindex="-1"><a class="header-anchor" href="#结语" aria-hidden="true">#</a> 结语</h1><p>当前爬虫主体功能以及实现，可以爬取gityuan.com所有有效文章列表，可以满足客户端需求。但仍然存在以下问题：</p><ol><li>没有伪装，爬虫<strong>很容易</strong>被识别并被拒绝服务（<s>就在刚刚写下这句话的时候，就发生了被限制访问，真*乌鸦嘴</s>）。</li><li>由于原网站特性，其置顶文章每页都有，会导致部分数据重复。</li><li>未爬取具体文章内容。</li></ol>`,24),r=n("p",null,[n("strong",null,"说明")],-1),d={href:"http://gityuan.com/",target:"_blank",rel:"noopener noreferrer"},k=n("h1",{id:"源码",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#源码","aria-hidden":"true"},"#"),s(" 源码")],-1),v={href:"https://github.com/jixiaoyong/AndroidNote/tree/master/code/2018-1-26/gityuan_spider",target:"_blank",rel:"noopener noreferrer"},m=n("p",null,[n("code",null,"tag"),s("为"),n("code",null,"gityuan_spider1.5")],-1);function b(_,g){const a=p("ExternalLinkIcon");return o(),l("div",null,[u,n("blockquote",null,[r,n("p",null,[s("本文只为学术研究，其中涉及到的第三方网站及其所有资源均属原主所有。向gityuan大神致敬，欢迎访问其"),n("a",d,[s("blog"),t(a)]),s("。")])]),k,n("p",null,[n("a",v,[s("github链接"),t(a)])]),m])}const y=e(c,[["render",b],["__file","6e070881.html.vue"]]);export{y as default};
