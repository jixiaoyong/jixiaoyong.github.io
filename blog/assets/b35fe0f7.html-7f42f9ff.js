const e=JSON.parse('{"key":"v-05d142e6","path":"/posts/b35fe0f7.html","title":"Android中WebView使用的一些问题","lang":"zh-CN","frontmatter":{"permalink":"/posts/b35fe0f7.html","title":"Android中WebView使用的一些问题","abbrlink":"b35fe0f7","date":"2018-02-08T00:11:13.000Z","tag":"android","description":"问题描述：WebView在fragment中不显示 解决代码如下： //kotlin 代码 webView.webViewClient = object : WebViewClient() { override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean { view!!.loadUrl(url) return true } }","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/b35fe0f7.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Android中WebView使用的一些问题"}],["meta",{"property":"og:description","content":"问题描述：WebView在fragment中不显示 解决代码如下： //kotlin 代码 webView.webViewClient = object : WebViewClient() { override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean { view!!.loadUrl(url) return true } }"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-10-11T09:53:08.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"android"}],["meta",{"property":"article:published_time","content":"2018-02-08T00:11:13.000Z"}],["meta",{"property":"article:modified_time","content":"2023-10-11T09:53:08.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Android中WebView使用的一些问题\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2018-02-08T00:11:13.000Z\\",\\"dateModified\\":\\"2023-10-11T09:53:08.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[],"git":{"createdTime":1697017988000,"updatedTime":1697017988000,"contributors":[{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":0.25,"words":76},"filePathRelative":"_posts/Android中WebView使用的一些问题.md","localizedDate":"2018年2月8日","excerpt":"<h1> 问题描述：WebView在fragment中不显示</h1>\\n<p>解决代码如下：</p>\\n<div class=\\"language-kotlin line-numbers-mode\\" data-ext=\\"kt\\"><pre class=\\"language-kotlin\\"><code><span class=\\"token comment\\">//kotlin 代码</span>\\nwebView<span class=\\"token punctuation\\">.</span>webViewClient <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">object</span> <span class=\\"token operator\\">:</span> <span class=\\"token function\\">WebViewClient</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n            <span class=\\"token keyword\\">override</span> <span class=\\"token keyword\\">fun</span> <span class=\\"token function\\">shouldOverrideUrlLoading</span><span class=\\"token punctuation\\">(</span>view<span class=\\"token operator\\">:</span> WebView<span class=\\"token operator\\">?</span><span class=\\"token punctuation\\">,</span> url<span class=\\"token operator\\">:</span> String<span class=\\"token operator\\">?</span><span class=\\"token punctuation\\">)</span><span class=\\"token operator\\">:</span> Boolean <span class=\\"token punctuation\\">{</span>\\n                view<span class=\\"token operator\\">!!</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">loadUrl</span><span class=\\"token punctuation\\">(</span>url<span class=\\"token punctuation\\">)</span>\\n                <span class=\\"token keyword\\">return</span> <span class=\\"token boolean\\">true</span>\\n            <span class=\\"token punctuation\\">}</span>\\n        <span class=\\"token punctuation\\">}</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{e as data};