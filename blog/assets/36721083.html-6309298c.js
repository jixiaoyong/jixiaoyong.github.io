const n=JSON.parse('{"key":"v-379dd82c","path":"/posts/36721083.html","title":"Java 创建线程安全的单例 Singleton","lang":"zh-CN","frontmatter":{"permalink":"/posts/36721083.html","title":"Java 创建线程安全的单例 Singleton","tags":"java","abbrlink":"36721083","date":"2018-02-14T10:34:16.000Z","updated":"2023-12-30T08:17:02.000Z","description":"简介 在编码中常常会用到单例，来确保类有一个唯一的对象，一般情况下将构造方法私有化既可以实现，但当考虑到多线程时事情会变得有些复杂，本文讨论的正是几种多线程的情况下实现单例的方法。 1.普通单例 私有化构造方法，对外提供一个公有、静态的方法，在其内部判断类对象是否已经存在，否的话生成类对象再返回。 class ASingleton{ \\tprivate static ASingleton as; \\tprivate void ASinleton() { \\t\\tSystem.out.print(\\"ASingleton init!\\\\n\\"); \\t} \\tpublic static ASingleton getInstance() { \\t\\tif(as == null) { //tag1 \\t\\t\\tas = new ASingleton(); //tag2 \\t\\t} \\t\\treturn as; \\t} }","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/36721083.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Java 创建线程安全的单例 Singleton"}],["meta",{"property":"og:description","content":"简介 在编码中常常会用到单例，来确保类有一个唯一的对象，一般情况下将构造方法私有化既可以实现，但当考虑到多线程时事情会变得有些复杂，本文讨论的正是几种多线程的情况下实现单例的方法。 1.普通单例 私有化构造方法，对外提供一个公有、静态的方法，在其内部判断类对象是否已经存在，否的话生成类对象再返回。 class ASingleton{ \\tprivate static ASingleton as; \\tprivate void ASinleton() { \\t\\tSystem.out.print(\\"ASingleton init!\\\\n\\"); \\t} \\tpublic static ASingleton getInstance() { \\t\\tif(as == null) { //tag1 \\t\\t\\tas = new ASingleton(); //tag2 \\t\\t} \\t\\treturn as; \\t} }"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-01-01T15:46:34.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:published_time","content":"2018-02-14T10:34:16.000Z"}],["meta",{"property":"article:modified_time","content":"2024-01-01T15:46:34.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java 创建线程安全的单例 Singleton\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2018-02-14T10:34:16.000Z\\",\\"dateModified\\":\\"2024-01-01T15:46:34.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"简介","slug":"简介","link":"#简介","children":[]},{"level":2,"title":"1.普通单例","slug":"_1-普通单例","link":"#_1-普通单例","children":[]},{"level":2,"title":"2.同步锁","slug":"_2-同步锁","link":"#_2-同步锁","children":[]},{"level":2,"title":"3.双重检查锁定","slug":"_3-双重检查锁定","link":"#_3-双重检查锁定","children":[]},{"level":2,"title":"4.饿汉模式实现单例","slug":"_4-饿汉模式实现单例","link":"#_4-饿汉模式实现单例","children":[]},{"level":2,"title":"5.懒汉模式实现单例","slug":"_5-懒汉模式实现单例","link":"#_5-懒汉模式实现单例","children":[]},{"level":2,"title":"6.enmu 实现单例","slug":"_6-enmu-实现单例","link":"#_6-enmu-实现单例","children":[]}],"git":{"createdTime":1680852645000,"updatedTime":1704123994000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3}]},"readingTime":{"minutes":4.06,"words":1218},"filePathRelative":"_posts/Java创建线程安全的单例Singleton.md","localizedDate":"2018年2月14日","excerpt":"<h2> 简介</h2>\\n<p>在编码中常常会用到单例，来确保类有一个唯一的对象，一般情况下将构造方法私有化既可以实现，但当考虑到多线程时事情会变得有些复杂，本文讨论的正是几种多线程的情况下实现单例的方法。</p>\\n<h2> 1.普通单例</h2>\\n<p>私有化构造方法，对外提供一个公有、静态的方法，在其内部判断类对象是否已经存在，否的话生成类对象再返回。</p>\\n<div class=\\"language-java line-numbers-mode\\" data-ext=\\"java\\"><pre class=\\"language-java\\"><code><span class=\\"token keyword\\">class</span> <span class=\\"token class-name\\">ASingleton</span><span class=\\"token punctuation\\">{</span>\\n\\n\\t<span class=\\"token keyword\\">private</span> <span class=\\"token keyword\\">static</span> <span class=\\"token class-name\\">ASingleton</span> as<span class=\\"token punctuation\\">;</span>\\n\\n\\t<span class=\\"token keyword\\">private</span> <span class=\\"token keyword\\">void</span> <span class=\\"token class-name\\">ASinleton</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n\\t\\t<span class=\\"token class-name\\">System</span><span class=\\"token punctuation\\">.</span>out<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">print</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"ASingleton init!\\\\n\\"</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n\\t<span class=\\"token punctuation\\">}</span>\\n\\n\\t<span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">static</span> <span class=\\"token class-name\\">ASingleton</span> <span class=\\"token function\\">getInstance</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n\\t\\t<span class=\\"token keyword\\">if</span><span class=\\"token punctuation\\">(</span>as <span class=\\"token operator\\">==</span> <span class=\\"token keyword\\">null</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>              <span class=\\"token comment\\">//tag1</span>\\n\\t\\t\\tas <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">ASingleton</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>    <span class=\\"token comment\\">//tag2</span>\\n\\t\\t<span class=\\"token punctuation\\">}</span>\\n\\t\\t<span class=\\"token keyword\\">return</span> as<span class=\\"token punctuation\\">;</span>\\n\\t<span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{n as data};