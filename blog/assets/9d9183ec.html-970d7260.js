const e=JSON.parse('{"key":"v-49ff4288","path":"/posts/9d9183ec.html","title":"Java笔记之序列化与反序列化：Serializable、Externalizable和Parcelable","lang":"zh-CN","frontmatter":{"permalink":"/posts/9d9183ec.html","title":"Java笔记之序列化与反序列化：Serializable、Externalizable和Parcelable","tag":"java","abbrlink":"9d9183ec","date":"2019-12-24T09:38:59.000Z","description":"Photo by **[Pixabay ](https://www.pexels.com/@pixabay?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels)**from **[Pexels](https://www.pexels.com/photo/close-up-of-telephone-booth-257736/?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels)**","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/9d9183ec.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Java笔记之序列化与反序列化：Serializable、Externalizable和Parcelable"}],["meta",{"property":"og:description","content":"Photo by **[Pixabay ](https://www.pexels.com/@pixabay?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels)**from **[Pexels](https://www.pexels.com/photo/close-up-of-telephone-booth-257736/?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels)**"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-04-07T15:44:26.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"java"}],["meta",{"property":"article:published_time","content":"2019-12-24T09:38:59.000Z"}],["meta",{"property":"article:modified_time","content":"2023-04-07T15:44:26.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java笔记之序列化与反序列化：Serializable、Externalizable和Parcelable\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2019-12-24T09:38:59.000Z\\",\\"dateModified\\":\\"2023-04-07T15:44:26.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"serialVersionUID","slug":"serialversionuid","link":"#serialversionuid","children":[]},{"level":2,"title":"readResolve()","slug":"readresolve","link":"#readresolve","children":[]},{"level":2,"title":"自定义序列化过程","slug":"自定义序列化过程","link":"#自定义序列化过程","children":[]},{"level":2,"title":"父类未继承Serializable的类的序列化","slug":"父类未继承serializable的类的序列化","link":"#父类未继承serializable的类的序列化","children":[]},{"level":2,"title":"实现","slug":"实现","link":"#实现","children":[]},{"level":2,"title":"多次序列化同一个对象","slug":"多次序列化同一个对象","link":"#多次序列化同一个对象","children":[]},{"level":2,"title":"优缺点","slug":"优缺点","link":"#优缺点","children":[]},{"level":2,"title":"实现","slug":"实现-1","link":"#实现-1","children":[]},{"level":2,"title":"原理","slug":"原理","link":"#原理","children":[]},{"level":2,"title":"优缺点","slug":"优缺点-1","link":"#优缺点-1","children":[]},{"level":2,"title":"实现","slug":"实现-2","link":"#实现-2","children":[]},{"level":2,"title":"原理","slug":"原理-1","link":"#原理-1","children":[]},{"level":2,"title":"优缺点","slug":"优缺点-2","link":"#优缺点-2","children":[]}],"git":{"createdTime":1680882266000,"updatedTime":1680882266000,"contributors":[{"name":"Ji Xiaoyong","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":11.87,"words":3560},"filePathRelative":"_posts/Java笔记之序列化与反序列化.md","localizedDate":"2019年12月24日","excerpt":"<img src=\\"https://images.pexels.com/photos/2881229/pexels-photo-2881229.jpeg?cs=srgb&amp;dl=white-and-blue-cables-2881229.jpg&amp;fm=jpg\\" class=\\"full-image\\">\\nPhoto by **[Pixabay ](https://www.pexels.com/@pixabay?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels)**from **[Pexels](https://www.pexels.com/photo/close-up-of-telephone-booth-257736/?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels)**\\n","autoDesc":true}');export{e as data};