const e=JSON.parse('{"key":"v-5c35a44c","path":"/posts/2270057c.html","title":"Android 中 AIDL 相关知识","lang":"zh-CN","frontmatter":{"permalink":"/posts/2270057c.html","title":"Android 中 AIDL 相关知识","abbrlink":"2270057c","date":"2019-03-20T11:37:40.000Z","updated":"2023-12-30T08:17:02.000Z","description":"前言 AIDL是 Android 中用于 IPC 的语言，具体使用可以参见这篇文章，这篇文章主要想总结一下AIDL具体为我们做了什么工作，主要参考书目《Android 开发艺术探索》。 在 Android 中，除了Socket、Intent中使用Bundle、本地文件共享，ContentProvider等等之外，还有一个独有的 IPC 方式即Binder。在日常编程中使用Binder的主要有AIDL和Messenger两种方式，而Messenger也是用AIDL来实现的。","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/2270057c.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Android 中 AIDL 相关知识"}],["meta",{"property":"og:description","content":"前言 AIDL是 Android 中用于 IPC 的语言，具体使用可以参见这篇文章，这篇文章主要想总结一下AIDL具体为我们做了什么工作，主要参考书目《Android 开发艺术探索》。 在 Android 中，除了Socket、Intent中使用Bundle、本地文件共享，ContentProvider等等之外，还有一个独有的 IPC 方式即Binder。在日常编程中使用Binder的主要有AIDL和Messenger两种方式，而Messenger也是用AIDL来实现的。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-01-01T15:53:49.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:published_time","content":"2019-03-20T11:37:40.000Z"}],["meta",{"property":"article:modified_time","content":"2024-01-01T15:53:49.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Android 中 AIDL 相关知识\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2019-03-20T11:37:40.000Z\\",\\"dateModified\\":\\"2024-01-01T15:53:49.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"准备","slug":"准备","link":"#准备","children":[]},{"level":2,"title":"分析","slug":"分析","link":"#分析","children":[]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"createdTime":1704124429000,"updatedTime":1704124429000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":3.07,"words":921},"filePathRelative":"_posts/Android中AIDL相关知识.md","localizedDate":"2019年3月20日","excerpt":"<h2> 前言</h2>\\n<p><code>AIDL</code>是 Android 中用于 IPC 的语言，具体使用可以参见<a href=\\"https://jixiaoyong.github.io/blog/posts/f931e8ae/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">这篇文章</a>，这篇文章主要想总结一下<code>AIDL</code>具体为我们做了什么工作，主要参考书目《Android 开发艺术探索》。</p>\\n<p>在 Android 中，除了<code>Socket</code>、<code>Intent</code>中使用<code>Bundle</code>、本地文件共享，<code>ContentProvider</code>等等之外，还有一个独有的 IPC 方式即<code>Binder</code>。在日常编程中使用<code>Binder</code>的主要有<code>AIDL</code>和<code>Messenger</code>两种方式，而<code>Messenger</code>也是用<code>AIDL</code>来实现的。</p>","autoDesc":true}');export{e as data};