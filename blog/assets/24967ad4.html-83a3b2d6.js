const t=JSON.parse('{"key":"v-acbc2d2a","path":"/posts/24967ad4.html","title":"Java 线程安全与 volatile 和 synchronize","lang":"zh-CN","frontmatter":{"permalink":"/posts/24967ad4.html","title":"Java 线程安全与 volatile 和 synchronize","tag":"jvm","abbrlink":"24967ad4","date":"2019-01-12T07:54:46.000Z","updated":"2023-12-30T08:17:02.000Z","description":"前言 Java 多线程编码中，保证线程安全的实质是保证对数据操作的原子性，即一个线程对数据的操作能够及时的更新到其他使用该数据的线程中，这样就可以避免多个线程因为操作的数据值不一致而产生错误。 线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/24967ad4.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Java 线程安全与 volatile 和 synchronize"}],["meta",{"property":"og:description","content":"前言 Java 多线程编码中，保证线程安全的实质是保证对数据操作的原子性，即一个线程对数据的操作能够及时的更新到其他使用该数据的线程中，这样就可以避免多个线程因为操作的数据值不一致而产生错误。 线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-01-01T00:13:21.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"jvm"}],["meta",{"property":"article:published_time","content":"2019-01-12T07:54:46.000Z"}],["meta",{"property":"article:modified_time","content":"2024-01-01T00:13:21.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java 线程安全与 volatile 和 synchronize\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2019-01-12T07:54:46.000Z\\",\\"dateModified\\":\\"2024-01-01T00:13:21.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"互斥同步（阻塞同步）","slug":"互斥同步-阻塞同步","link":"#互斥同步-阻塞同步","children":[]},{"level":2,"title":"非阻塞同步","slug":"非阻塞同步","link":"#非阻塞同步","children":[]},{"level":2,"title":"无同步方案","slug":"无同步方案","link":"#无同步方案","children":[]}],"git":{"createdTime":1704068001000,"updatedTime":1704068001000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":5.79,"words":1736},"filePathRelative":"_posts/Java线程安全之volatile和synchronize.md","localizedDate":"2019年1月12日","excerpt":"<h1> 前言</h1>\\n<p>Java 多线程编码中，保证线程安全的实质是保证对数据操作的原子性，即一个线程对数据的操作能够及时的更新到其他使用该数据的线程中，这样就可以避免多个线程因为操作的数据值不一致而产生错误。</p>\\n<figure><img src=\\"https://jixiaoyong.github.io/images/20190112144856.png\\" alt=\\"线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption>线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机</figcaption></figure>","autoDesc":true}');export{t as data};