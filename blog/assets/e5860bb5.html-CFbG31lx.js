import{_ as i,c as s,o as t,a as e}from"./app-CHaeU_ce.js";const a={},n=e(`<p>Android 中绘制文字的方法如下：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     * Draw the text, with origin at (x,y), using the specified paint. The origin is interpreted</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     * based on the Align setting in the paint.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@param</span><span style="--shiki-light:#E36209;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> text</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> The text to be drawn</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@param</span><span style="--shiki-light:#E36209;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> x</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> The x-coordinate of the origin of the text being drawn</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@param</span><span style="--shiki-light:#E36209;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> y</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> The y-coordinate of the baseline of the text being drawn</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@param</span><span style="--shiki-light:#E36209;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> paint</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> The paint used for the text (e.g. color, size, style)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> drawText</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#E5C07B;">NonNull</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> String</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> text</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> float</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> x</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> float</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> y</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> @</span><span style="--shiki-light:#D73A49;--shiki-dark:#E5C07B;">NonNull</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> Paint</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> paint) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#E5C07B;">        super</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">drawText</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(text, x, y, paint);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中<code>y</code>是<strong>文字 baseline 的 y 坐标</strong>。</p><p>下图表示<code>Paint.FontMetrics</code>中存储的文字的各种信息（来源：<a href="https://www.jianshu.com/p/c1575636741e" target="_blank" rel="noopener noreferrer">简书</a>）：<br><img src="https://jixiaoyong.github.io/images/20200407220410.png" alt="" loading="lazy"></p><p>我们没法直接获取到<code>baseline的坐标</code>，所以只能从另外一个角度考虑：<br> 因为在绘制文字时，文字的上下中心（即上图中的<code>center</code>）是确定的，我们只要计算出<code>center</code>到<code>baseline</code>之间的偏移量，就可以计算出<code>baseline的y坐标</code>。</p><p>又根据这个<a href="http://www.imooc.com/article/277490?block_id=tuijian_wz" target="_blank" rel="noopener noreferrer">文章</a>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>基线到中线的距离 = (descent + ascent) / 2 - descent = (ascent - descent) / 2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><blockquote><p><code>(descent + ascent) / 2</code>是中线 center 的值，而根据上图可知<code>(descent + ascent) / 2 - descent</code>的值就是 baseline 到 center 的距离。</p></blockquote><p>所以</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>baseline的y坐标 = 文字的上下高度中心 + baseline的竖坐标和文字上下实际中心的偏移量</span></span>
<span class="line"><span>                = center.y + 基线到中线的距离</span></span>
<span class="line"><span>                = center.y + (ascent - descent) / 2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>这个<code>center.y</code>根据场景不同可以是一行的行中心（文字在一行居中显示），或者控件的上下中心（文字在控件上下居中）</p></blockquote><p>得出结论：</p><p>由于 android 绘制文字时，<strong>并不是从文字高度的中间开始绘制，而是从 baseline 开始绘制</strong>。所以在绘制文字时，为了使文字高度居中（在所指定的空间内居中，比如某一行，就在该行限定的高度内居中显示；某一控件，则整个控件的上下中间显示），需要在计算出来的<strong>文字上下中心的 y 坐标基础上加上 baseline 到文字中线的偏移量</strong>。</p><p>除此之外，也可以类比得到：<code>baseline.y = center.y + (bottom.y - top.y) / 2 - bottom.y</code></p><blockquote><p>基线（baeseline），坡顶（ascenter）,坡底（descenter）</p><p>上坡度（ascent），下坡度（descent）</p><p>行间距（leading）：坡底到下一行坡顶的距离</p><p>字体的高度＝上坡度＋下坡度＋行间距</p><p><a href="https://blog.csdn.net/hanyongbai/article/details/84418369" target="_blank" rel="noopener noreferrer">https://blog.csdn.net/hanyongbai/article/details/84418369</a></p></blockquote><p>参考文章：<br><a href="https://www.jianshu.com/p/c1575636741e" target="_blank" rel="noopener noreferrer">https://www.jianshu.com/p/c1575636741e</a><br><a href="https://blog.csdn.net/hanyongbai/article/details/84418369" target="_blank" rel="noopener noreferrer">https://blog.csdn.net/hanyongbai/article/details/84418369</a><br><a href="http://www.imooc.com/article/277490?block_id=tuijian_wz" target="_blank" rel="noopener noreferrer">http://www.imooc.com/article/277490?block_id=tuijian_wz</a><br><a href="https://blog.csdn.net/xuxingxing002/article/details/50971606" target="_blank" rel="noopener noreferrer">https://blog.csdn.net/xuxingxing002/article/details/50971606</a></p>`,16),l=[n];function h(r,k){return t(),s("div",null,l)}const d=i(a,[["render",h],["__file","e5860bb5.html.vue"]]),o=JSON.parse('{"path":"/posts/e5860bb5.html","title":"Android paint 绘制 text","lang":"zh-CN","frontmatter":{"permalink":"/posts/e5860bb5.html","title":"Android paint 绘制 text","abbrlink":"e5860bb5","date":"2020-04-07T14:05:20.000Z","updated":"2023-12-30T08:17:02.000Z","isOriginal":true,"description":"Android 中绘制文字的方法如下： 其中y是文字 baseline 的 y 坐标。 下图表示Paint.FontMetrics中存储的文字的各种信息（来源：简书）： 我们没法直接获取到baseline的坐标，所以只能从另外一个角度考虑： 因为在绘制文字时，文字的上下中心（即上图中的center）是确定的，我们只要计算出center到baseline...","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/e5860bb5.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Android paint 绘制 text"}],["meta",{"property":"og:description","content":"Android 中绘制文字的方法如下： 其中y是文字 baseline 的 y 坐标。 下图表示Paint.FontMetrics中存储的文字的各种信息（来源：简书）： 我们没法直接获取到baseline的坐标，所以只能从另外一个角度考虑： 因为在绘制文字时，文字的上下中心（即上图中的center）是确定的，我们只要计算出center到baseline..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://jixiaoyong.github.io/images/20200407220410.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-31T16:00:22.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:published_time","content":"2020-04-07T14:05:20.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-31T16:00:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Android paint 绘制 text\\",\\"image\\":[\\"https://jixiaoyong.github.io/images/20200407220410.png\\"],\\"datePublished\\":\\"2020-04-07T14:05:20.000Z\\",\\"dateModified\\":\\"2024-05-31T16:00:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[],"git":{"createdTime":1653726847000,"updatedTime":1717171222000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":2},{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":2.01,"words":603},"filePathRelative":"_posts/AndroidPaint绘制Text.md","localizedDate":"2020年4月7日","excerpt":"<p>Android 中绘制文字的方法如下：</p>\\n<div class=\\"language-java line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"java\\" data-title=\\"java\\" style=\\"--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes github-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">    /**</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">     * Draw the text, with origin at (x,y), using the specified paint. The origin is interpreted</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">     * based on the Align setting in the paint.</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">     *</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">     * </span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">@param</span><span style=\\"--shiki-light:#E36209;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\"> text</span><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\"> The text to be drawn</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">     * </span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">@param</span><span style=\\"--shiki-light:#E36209;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\"> x</span><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\"> The x-coordinate of the origin of the text being drawn</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">     * </span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">@param</span><span style=\\"--shiki-light:#E36209;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\"> y</span><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\"> The y-coordinate of the baseline of the text being drawn</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">     * </span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">@param</span><span style=\\"--shiki-light:#E36209;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\"> paint</span><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\"> The paint used for the text (e.g. color, size, style)</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">     */</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\">    public</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\"> void</span><span style=\\"--shiki-light:#6F42C1;--shiki-dark:#61AFEF\\"> drawText</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\">(</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">@</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#E5C07B\\">NonNull</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E5C07B\\"> String</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\"> text</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">,</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\"> float</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\"> x</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">,</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\"> float</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\"> y</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">,</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\"> @</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#E5C07B\\">NonNull</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E5C07B\\"> Paint</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\"> paint) {</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#005CC5;--shiki-dark:#E5C07B\\">        super</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">.</span><span style=\\"--shiki-light:#6F42C1;--shiki-dark:#61AFEF\\">drawText</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">(text, x, y, paint);</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\">    }</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{d as comp,o as data};