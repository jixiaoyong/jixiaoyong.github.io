import{_ as e,c as t,o as a,a as o}from"./app-B34IKLrY.js";const i={},l=o('<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h2><p>Java 多线程编码中，保证线程安全的实质是保证对数据操作的原子性，即一个线程对数据的操作能够及时的更新到其他使用该数据的线程中，这样就可以避免多个线程因为操作的数据值不一致而产生错误。</p><figure><img src="https://jixiaoyong.github.io/images/20190112144856.png" alt="线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机" tabindex="0" loading="lazy"><figcaption>线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机</figcaption></figure><p>由于 Java 内存模型（JMM）规定，所有线程公用的数据保存在主内存中，而线程在使用时先从主内存中取到线程私有的工作内存中，之后再在使用完毕后同步到主内存中，在这过程中，如果其他线程也用到了该数据则可能会出现问题，因此在线程操作数据时需要考虑线程并发时操作数据的同步问题。</p><p><code>volatile</code>和<code>synchronize</code>因此而生。</p><h2 id="volatile" tabindex="-1"><a class="header-anchor" href="#volatile"><span>volatile</span></a></h2><p><code>volatile</code>修饰的变量有两个特性：</p><ul><li>变量对所有线程可见 普通变量则需要等线程操作完毕，将结果从工作内存写入到主内存中才可以被其他线程可见，volatile 修饰的变量会在修改后通知其他线程该变量已经被更改，从而让其他线程再去主内存中读取最新的值</li><li>禁止指令重排优化</li></ul><p><code>volatile</code>修饰的变量执行效率和普通变量差别不大，其写操作因为要插入内存屏障，所以会稍微慢一些</p><p>需要注意的是：</p><ul><li><p>由于 Java 运算的具体实现并非原子性的，故而虽然<code>volatile</code>修饰的变量在所有线程可见，但是并发下并不线程安全。</p><blockquote><p>Java 代码编译成 class 文件后可以看到，类似<code>c = c + 1</code>这样的语句，会被分为：读取<code>c</code>的值；计算<code>c+1</code>的值；将结果赋予<code>c</code>这几步来完成。所以在此期间如果有其他的线程访问这段代码，就会发生冲突。</p></blockquote></li><li><p>Java 会通过<strong>指令重排</strong>来优化代码</p><blockquote><p>指令重排 指对于变量的赋值会在定义该变量和使用该变量的值之间的任意位置执行，不一定和代码中的顺序一致</p></blockquote><p><code>volatile</code>修饰的变量则会插入<em>内存屏障</em>，从而实现屏蔽指令重排的效果</p></li></ul><h2 id="synchronize" tabindex="-1"><a class="header-anchor" href="#synchronize"><span>synchronize</span></a></h2><p><code>synchronize</code>实现的原理是<strong>锁定指定的对象</strong>（如果没有指定则锁定对应的类对象或 class 对象），然后阻塞其他线程进入（获取到该锁的线程可以多次重入）。</p><p>由于 Java 的线程实现是映射到系统线程的，阻塞和唤醒需要由系统内核完成，会消耗大量的时间，因此<code>synchronize</code>是<strong>重量级操作</strong>。</p><h2 id="jmm-与三个特征" tabindex="-1"><a class="header-anchor" href="#jmm-与三个特征"><span>JMM 与三个特征</span></a></h2><p>JMM 的设计是围绕着<strong>原子性、可见性、有序性</strong>三个特征进行的。</p><ul><li><p><strong>原子性</strong> JVM 中的<code>read,load,assign,use,store,write</code>操作和<code>synchronize</code></p></li><li><p><strong>可见性</strong> 一个线程更改了共享变量的值时，其余线程能够立即得知这个更改。通过<code>synchronize</code>，<code>final</code>和<code>volatile</code>保证。</p><p><code>final</code>要保证可见性的前提是要被<strong>安全的构建出来</strong>，避免**“this 引用逃逸”**</p><blockquote><p><strong>this 引用逃逸</strong> 对象还没有被构造完成，他的<code>this引用</code>就已经被发布出去了。</p><p>在构造函数中生成内部类，由于内部类自动持有外部类的<code>this引用</code>，如果有对象在内部类语句之后构造，则就有可能发生“内部类访问这个对象时，该对象还没有构造完毕”的情况。</p></blockquote></li><li><p><strong>有序性</strong> 通过<code>synchronize</code>,<code>volatile</code>保证。</p></li></ul><p>线程从内部观察时有序（线程内是串行的语义），线程外部观察是无序（由指令重排、工作内存与主内存同步延迟导致）</p><h2 id="实现线程安全" tabindex="-1"><a class="header-anchor" href="#实现线程安全"><span>实现线程安全</span></a></h2><p>实现线程安全有以下几种方法：</p><h3 id="互斥同步-阻塞同步" tabindex="-1"><a class="header-anchor" href="#互斥同步-阻塞同步"><span>互斥同步（阻塞同步）</span></a></h3><p>互斥同步的思想是：多个线程使用同一个共享数据时，保证同一时刻只能被一个线程使用</p><p>有两种途径：</p><ul><li><code>synchronize</code> （原生语法层），优先使用</li><li><code>ReentrantLock</code> 重入锁（API 层），功能有：1.等待可中断（可以放弃等待）2.公平锁 多个线程申请锁时必须按照申请时间顺序获得锁 3.锁绑定多个条件</li></ul><h3 id="非阻塞同步" tabindex="-1"><a class="header-anchor" href="#非阻塞同步"><span>非阻塞同步</span></a></h3><p>减少了阻塞/唤醒的耗时，在操作时进行 CAS（比较并交换），在冲突发生的时候不断尝试执行所需操作，直到执行成功。</p><p>但是有一个逻辑漏洞：如果在第一次操作失败到第二次再次尝试操作之间，<em>其他线程对齐进行了操作但是该数据最终没有被变化</em>，当第二次再次尝试时，其实已经被其他线程访问过了。</p><h3 id="无同步方案" tabindex="-1"><a class="header-anchor" href="#无同步方案"><span>无同步方案</span></a></h3><p>保证线程安全，不一定需要同步，当线程操作的数据不是共享数据时，即使不同步也是线程安全的。</p><ul><li><strong>可重入代码</strong> 指在代码执行的过程中，如果中断其运行并运行其他的线程，当再次返回继续执行该代码时不会影响到其执行结果的代码。这种代码一般没有用到堆中的公用资源。</li><li><strong>线程本地存储</strong> 共享数据值存在于同一个线程中，如每个线程的 ThreadLocal 对象</li></ul><h2 id="锁优化" tabindex="-1"><a class="header-anchor" href="#锁优化"><span>锁优化</span></a></h2><p>JDK1.6 以后，在 HotSpot 虚拟机上实现了许多锁优化技术：</p><ul><li><p>自旋锁</p><p>实现阻塞同步时，阻塞和唤醒会很耗时，为了避免这种情况，可以先对其进行<em>忙循环</em>，如果还不行再去执行阻塞操作</p><p><em>自适应自旋</em> 由 JVM 智能决定自旋次数</p></li><li><p>锁消除</p><p>JVM 会自动取出不必要的锁</p></li><li><p>锁粗化</p><p>如果一段代码中有连续的锁，则 JVM 会将这些锁合并为一个大锁</p></li><li><p>轻量级锁</p><p>轻量级锁消耗比传统锁机制小，会优先尝试使用轻量级锁，如果不行，在升级为互斥锁</p><p>大多数情况下会减少消耗，但如果存在锁竞争，则除了互斥锁的开销外，还有轻量级锁的开销</p></li><li><p>偏向锁</p><p>在无竞争的情况下消除同步</p></li><li><p>乐观锁</p><p>读取数据时默认该对象不会被其他对象更改而不加锁，每次写数据时对比当前值与持有值是否一致，一致时才去更新数据</p></li></ul><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><p>《深入理解 Java 虚拟机——JVM 高级特性与最佳实践》周志明</p><p><a href="https://blog.csdn.net/u010571316/article/details/77993309" target="_blank" rel="noopener noreferrer">this 引用逃逸——蜡笔小勋</a></p>',36),n=[l];function p(c,r){return a(),t("div",null,n)}const d=e(i,[["render",p],["__file","24967ad4.html.vue"]]),h=JSON.parse('{"path":"/posts/24967ad4.html","title":"Java 线程安全与 volatile 和 synchronize","lang":"zh-CN","frontmatter":{"permalink":"/posts/24967ad4.html","title":"Java 线程安全与 volatile 和 synchronize","tag":"jvm","abbrlink":"24967ad4","date":"2019-01-12T07:54:46.000Z","updated":"2023-12-30T08:17:02.000Z","isOriginal":true,"description":"前言 Java 多线程编码中，保证线程安全的实质是保证对数据操作的原子性，即一个线程对数据的操作能够及时的更新到其他使用该数据的线程中，这样就可以避免多个线程因为操作的数据值不一致而产生错误。 线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机 由于 Java 内存模型（JM...","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/24967ad4.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Java 线程安全与 volatile 和 synchronize"}],["meta",{"property":"og:description","content":"前言 Java 多线程编码中，保证线程安全的实质是保证对数据操作的原子性，即一个线程对数据的操作能够及时的更新到其他使用该数据的线程中，这样就可以避免多个线程因为操作的数据值不一致而产生错误。 线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机 由于 Java 内存模型（JM..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://jixiaoyong.github.io/images/20190112144856.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-31T16:00:22.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"jvm"}],["meta",{"property":"article:published_time","content":"2019-01-12T07:54:46.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-31T16:00:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java 线程安全与 volatile 和 synchronize\\",\\"image\\":[\\"https://jixiaoyong.github.io/images/20190112144856.png\\"],\\"datePublished\\":\\"2019-01-12T07:54:46.000Z\\",\\"dateModified\\":\\"2024-05-31T16:00:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"volatile","slug":"volatile","link":"#volatile","children":[]},{"level":2,"title":"synchronize","slug":"synchronize","link":"#synchronize","children":[]},{"level":2,"title":"JMM 与三个特征","slug":"jmm-与三个特征","link":"#jmm-与三个特征","children":[]},{"level":2,"title":"实现线程安全","slug":"实现线程安全","link":"#实现线程安全","children":[{"level":3,"title":"互斥同步（阻塞同步）","slug":"互斥同步-阻塞同步","link":"#互斥同步-阻塞同步","children":[]},{"level":3,"title":"非阻塞同步","slug":"非阻塞同步","link":"#非阻塞同步","children":[]},{"level":3,"title":"无同步方案","slug":"无同步方案","link":"#无同步方案","children":[]}]},{"level":2,"title":"锁优化","slug":"锁优化","link":"#锁优化","children":[]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"createdTime":1653726847000,"updatedTime":1717171222000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3},{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":5.79,"words":1738},"filePathRelative":"_posts/Java线程安全之volatile和synchronize.md","localizedDate":"2019年1月12日","excerpt":"<h2>前言</h2>\\n<p>Java 多线程编码中，保证线程安全的实质是保证对数据操作的原子性，即一个线程对数据的操作能够及时的更新到其他使用该数据的线程中，这样就可以避免多个线程因为操作的数据值不一致而产生错误。</p>\\n<figure><img src=\\"https://jixiaoyong.github.io/images/20190112144856.png\\" alt=\\"线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption>线程、主内存、工作内存三者交互关系——深入理解 JAVA 虚拟机</figcaption></figure>","autoDesc":true}');export{d as comp,h as data};