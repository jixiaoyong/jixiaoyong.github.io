import{_ as i,c as s,o as a,a as n}from"./app-B34IKLrY.js";const e={},t=n(`<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h2><p>本文介绍了数组、链表等数据结构。</p><p>设定所有排序：小 → 大。</p><h2 id="数组" tabindex="-1"><a class="header-anchor" href="#数组"><span>数组</span></a></h2><p>数组（array）是一组具有相同类型元素的集合，用一段连续的内存来保存。使用下标来访问保存的元素，如<code>a[0]</code>。</p><p>数组是一种数据存储结构。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> a[] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>数组大小固定，对指定下标元素读写快 O(1)，但是查找慢 O(N)，删除元素慢 O(N)。</p><h3 id="有序数组" tabindex="-1"><a class="header-anchor" href="#有序数组"><span>有序数组</span></a></h3><p>在每次插入的时候对元素进行排序，就得到有序数组。</p><p>有序数组查找快 O(LogN)，但插入慢 O(N)，删除元素慢 O(N)。</p><p><strong>有序数组插入</strong>：</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> insertSort</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(key: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">Int</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (size </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&gt;=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> sortArr.size) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        return</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (size </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        sortArr[size</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> key</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        return</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> insertIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> ++</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">size </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    while</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> sortArr[insertIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">]) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        sortArr[insertIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> sortArr[insertIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        insertIndex</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">--</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (insertIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">            break</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    sortArr[insertIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> key</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在有序数组要找到某个元素 t 可以使用二分查找，其思想是：</p><ol><li>选取一个中间值 n 将当前数组一分为二。</li><li>如果<code>t==n</code>那么查找结束，如果<code>t&lt;n</code>,那么在右半部分数组查找，否则在左半部分数组查找。</li><li>重复步骤<code>1</code>,<code>2</code>，直到找到 n 或者数组已经不可再分（不存在 n），结束查找。</li></ol><p><strong>二分法查找</strong>：</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> dichotomy</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(array: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">IntArray</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, key: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">Int</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">): </span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">Int</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (array.size </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        return</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> -</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> centerIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> array.size </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> centerKey </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> array[centerIndex]</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> when</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> centerKey </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> centerIndex</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> centerKey </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">-&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> dichotomy</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(array.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">copyOfRange</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, centerIndex), key)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        else</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> -&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> dichotomy</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(array.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">copyOfRange</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(centerIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, array.size), key)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="链表" tabindex="-1"><a class="header-anchor" href="#链表"><span>链表</span></a></h2><p>链表的每个节点除了保存的数据外，还保存着下一个节点的引用<code>next</code>，最后一个元素中该引用为<code>null</code>。</p><p>链表的大小不固定，查找，删除，插入指定节点都需要 O(N)</p><p>链表有以下分类：</p><ul><li><p>单链表 每个节点只有指向下一个节点的引用，链表只保留第一个链节点的引用<code>first</code></p><figure><img src="https://jixiaoyong.github.io/images/20190101132535.png" alt="单链表" tabindex="0" loading="lazy"><figcaption>单链表</figcaption></figure></li><li><p>双向链表 每个节点保存有父节点和子节点的引用。双向链表也可以是双端链表。</p><figure><img src="https://jixiaoyong.github.io/images/20190101132614.png" alt="双向链表" tabindex="0" loading="lazy"><figcaption>双向链表</figcaption></figure></li></ul><p><strong>双端链表</strong> 双端链表保存第一个链节点<code>farst</code>和最后一个链节点<code>last</code>的引用。</p><figure><img src="https://jixiaoyong.github.io/images/20190101132649.png" alt="双端链表" tabindex="0" loading="lazy"><figcaption>双端链表</figcaption></figure><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码"><span>源码</span></a></h2><p><a href="https://github.com/jixiaoyong/Notes-Files/tree/master/AndroidLearningResource/java_note/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E5%AD%A6%E4%B9%A0/link" target="_blank" rel="noopener noreferrer">👉 点这里</a> 查看<code>链表</code>源码</p><h2 id="参考文献" tabindex="-1"><a class="header-anchor" href="#参考文献"><span>参考文献</span></a></h2><p><a href="https://zh.wikipedia.org/wiki/%E6%95%B0%E7%BB%84" target="_blank" rel="noopener noreferrer">数组--维基百科</a></p><p><a href="https://book.douban.com/subject/1144007/" target="_blank" rel="noopener noreferrer">Java 数据结构和算法（第二版）Robert Laforce 计晓云等译</a></p>`,29),l=[t];function h(p,k){return a(),s("div",null,l)}const d=i(e,[["render",h],["__file","9a784fe0.html.vue"]]),g=JSON.parse('{"path":"/posts/9a784fe0.html","title":"数据结构_数组，链表","lang":"zh-CN","frontmatter":{"permalink":"/posts/9a784fe0.html","title":"数据结构_数组，链表","tag":"数据结构","abbrlink":"9a784fe0","date":"2019-01-01T03:19:52.000Z","updated":"2023-12-30T08:17:02.000Z","isOriginal":true,"description":"前言 本文介绍了数组、链表等数据结构。 设定所有排序：小 → 大。 数组 数组（array）是一组具有相同类型元素的集合，用一段连续的内存来保存。使用下标来访问保存的元素，如a[0]。 数组是一种数据存储结构。 数组大小固定，对指定下标元素读写快 O(1)，但是查找慢 O(N)，删除元素慢 O(N)。 有序数组 在每次插入的时候对元素进行排序，就得到有...","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/9a784fe0.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"数据结构_数组，链表"}],["meta",{"property":"og:description","content":"前言 本文介绍了数组、链表等数据结构。 设定所有排序：小 → 大。 数组 数组（array）是一组具有相同类型元素的集合，用一段连续的内存来保存。使用下标来访问保存的元素，如a[0]。 数组是一种数据存储结构。 数组大小固定，对指定下标元素读写快 O(1)，但是查找慢 O(N)，删除元素慢 O(N)。 有序数组 在每次插入的时候对元素进行排序，就得到有..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://jixiaoyong.github.io/images/20190101132535.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-31T16:00:22.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"数据结构"}],["meta",{"property":"article:published_time","content":"2019-01-01T03:19:52.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-31T16:00:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"数据结构_数组，链表\\",\\"image\\":[\\"https://jixiaoyong.github.io/images/20190101132535.png\\",\\"https://jixiaoyong.github.io/images/20190101132614.png\\",\\"https://jixiaoyong.github.io/images/20190101132649.png\\"],\\"datePublished\\":\\"2019-01-01T03:19:52.000Z\\",\\"dateModified\\":\\"2024-05-31T16:00:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"数组","slug":"数组","link":"#数组","children":[{"level":3,"title":"有序数组","slug":"有序数组","link":"#有序数组","children":[]}]},{"level":2,"title":"链表","slug":"链表","link":"#链表","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"参考文献","slug":"参考文献","link":"#参考文献","children":[]}],"git":{"createdTime":1653726847000,"updatedTime":1717171222000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3},{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":2.19,"words":656},"filePathRelative":"_posts/数据结构_数组和链表.md","localizedDate":"2019年1月1日","excerpt":"<h2>前言</h2>\\n<p>本文介绍了数组、链表等数据结构。</p>\\n<p>设定所有排序：小 → 大。</p>\\n<h2>数组</h2>\\n<p>数组（array）是一组具有相同类型元素的集合，用一段连续的内存来保存。使用下标来访问保存的元素，如<code>a[0]</code>。</p>\\n<p>数组是一种数据存储结构。</p>\\n<div class=\\"language-java line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"java\\" data-title=\\"java\\" style=\\"--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes github-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\">int</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\"> a[] </span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#56B6C2\\">=</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\"> new</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\"> int</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\">[</span><span style=\\"--shiki-light:#005CC5;--shiki-dark:#D19A66\\">10</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\">]</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">;</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{d as comp,g as data};