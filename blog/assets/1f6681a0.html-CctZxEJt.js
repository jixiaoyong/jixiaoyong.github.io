import{_ as i,c as s,o as a,a as e}from"./app-CHaeU_ce.js";const t={},n=e(`<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h2><p>Hash 表是一种可以快速插入和查找的数据结构，将数据保存在通过 hash 函数计算得到的下标中。</p><p>插入和删除 所需时间为 O(1)。在确定容量、无需遍历时效果最好。</p><p>当其大小接近容量时，效率会变得很差。</p><h2 id="存储方式" tabindex="-1"><a class="header-anchor" href="#存储方式"><span>存储方式</span></a></h2><p>Hash 表有两种存储方式</p><ol><li><p>开放地址法</p><p>开放地址法，直接将数据存储在数组中。</p><p>当 hash 算出的地址已经被占用时，则走过一定的步长找到另外一个空位（在填充质数很大时就会很耗时）并保存数据。</p></li><li><p>链地址法</p><p>链地址法，创建保存数据的数组，该数组中不直接保存数据，而是保存一个用来存储这些数据的链表，将数据项直接存储的链表中。</p><p>当 hash 算法计算出的地址时，遍历数组中对应的链表找到空位并保存。</p></li></ol><p>其中，开放地址法又分为 3 种实现：</p><ul><li><p>线性探测</p><p>每次前进的步长为 1</p><p>即查找的位置依次是<code>x + 1,2,3,4,5,……</code></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>存储达到容量 2/3 以上时候读写性能会很差</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>二次探测</p><p>每次前进的步长为当前查找次数的平方</p><p>即查找的位置依次是<code>x + 1,4,9,……</code></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>当前几次找不到之后就会很恐慌，步长越来越大到后面无法继续下去</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>再哈希法</p><p>每次前进的步长是根据另外一个 hash 算法计算出来的值</p><p>这个算法要求如下：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> 与第一次 hash 输出不同</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> 不能输出 </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>已经有一个公认的比较好的二次 hash 算法：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">stepSize </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> constant </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> (key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">%</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> constant)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">如：stepSize </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 5</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> -</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> (key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">%</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 5</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> constant 是小于数组容量的质数</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="比较" tabindex="-1"><a class="header-anchor" href="#比较"><span>比较</span></a></h2><p><strong>再哈希法 VS 二次探测法</strong></p><p>在小型哈希表中，再哈希法比二次探测好；</p><p>但如果容量充足，并且容量大小不再变化时，二次探测效果好，在装填因子小于 0.5 时几乎没有性能损失</p><p><strong>开放地址法 VS 链地址法</strong></p><p>hash 表容器大小未知时，用链地址法比较好</p><p>当装填因子变得很大时，开放地址法性能下降很快，但链地址法只是线性下降。</p><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码"><span>源码</span></a></h2><p><a href="https://github.com/jixiaoyong/Notes-Files/blob/master/AndroidLearningResource/java_note/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E5%AD%A6%E4%B9%A0/tree/Hash.kt" target="_blank" rel="noopener noreferrer">👉 点这里</a>查看源码</p>`,18),h=[n];function l(p,r){return a(),s("div",null,h)}const o=i(t,[["render",l],["__file","1f6681a0.html.vue"]]),c=JSON.parse('{"path":"/posts/1f6681a0.html","title":"数据结构_Hash 表","lang":"zh-CN","frontmatter":{"permalink":"/posts/1f6681a0.html","title":"数据结构_Hash 表","tag":"数据结构","abbrlink":"1f6681a0","date":"2018-12-23T09:35:36.000Z","updated":"2023-12-30T08:17:02.000Z","isOriginal":true,"description":"前言 Hash 表是一种可以快速插入和查找的数据结构，将数据保存在通过 hash 函数计算得到的下标中。 插入和删除 所需时间为 O(1)。在确定容量、无需遍历时效果最好。 当其大小接近容量时，效率会变得很差。 存储方式 Hash 表有两种存储方式 开放地址法 开放地址法，直接将数据存储在数组中。 当 hash 算出的地址已经被占用时，则走过一定的步长...","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/1f6681a0.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"数据结构_Hash 表"}],["meta",{"property":"og:description","content":"前言 Hash 表是一种可以快速插入和查找的数据结构，将数据保存在通过 hash 函数计算得到的下标中。 插入和删除 所需时间为 O(1)。在确定容量、无需遍历时效果最好。 当其大小接近容量时，效率会变得很差。 存储方式 Hash 表有两种存储方式 开放地址法 开放地址法，直接将数据存储在数组中。 当 hash 算出的地址已经被占用时，则走过一定的步长..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-31T16:00:22.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"数据结构"}],["meta",{"property":"article:published_time","content":"2018-12-23T09:35:36.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-31T16:00:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"数据结构_Hash 表\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2018-12-23T09:35:36.000Z\\",\\"dateModified\\":\\"2024-05-31T16:00:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"存储方式","slug":"存储方式","link":"#存储方式","children":[]},{"level":2,"title":"比较","slug":"比较","link":"#比较","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]}],"git":{"createdTime":1653726847000,"updatedTime":1717171222000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3},{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":2.18,"words":655},"filePathRelative":"_posts/数据结构_Hash表.md","localizedDate":"2018年12月23日","excerpt":"<h2>前言</h2>\\n<p>Hash 表是一种可以快速插入和查找的数据结构，将数据保存在通过 hash 函数计算得到的下标中。</p>\\n<p>插入和删除 所需时间为 O(1)。在确定容量、无需遍历时效果最好。</p>\\n<p>当其大小接近容量时，效率会变得很差。</p>\\n<h2>存储方式</h2>\\n<p>Hash 表有两种存储方式</p>\\n<ol>\\n<li>\\n<p>开放地址法</p>\\n<p>开放地址法，直接将数据存储在数组中。</p>\\n<p>当 hash 算出的地址已经被占用时，则走过一定的步长找到另外一个空位（在填充质数很大时就会很耗时）并保存数据。</p>\\n</li>\\n<li>\\n<p>链地址法</p>\\n<p>链地址法，创建保存数据的数组，该数组中不直接保存数据，而是保存一个用来存储这些数据的链表，将数据项直接存储的链表中。</p>\\n<p>当 hash 算法计算出的地址时，遍历数组中对应的链表找到空位并保存。</p>\\n</li>\\n</ol>","autoDesc":true}');export{o as comp,c as data};