const e=JSON.parse('{"key":"v-62867451","path":"/posts/1912667a.html","title":"Flutter图片加载方案分析之Image","lang":"zh-CN","frontmatter":{"permalink":"/posts/1912667a.html","title":"Flutter图片加载方案分析之Image","date":"2022-07-27T15:31:03.000Z","abbrlink":"1912667a","tag":"flutter","description":"Flutter 默认提供了Image用于从网络、文件等加载图片，并且使用ImageCache统一管理图片缓存，但有时候并不能满足使用需求（比如网络图片没有磁盘缓存，导致每次 ImageCache 清除缓存之后又要从网络下载），所以又出现了flutter_cached_network_image、extended_image等基于 Flutter 原生的解决方案，以及power_image等基于混合开发的解决方案。","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/1912667a.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Flutter图片加载方案分析之Image"}],["meta",{"property":"og:description","content":"Flutter 默认提供了Image用于从网络、文件等加载图片，并且使用ImageCache统一管理图片缓存，但有时候并不能满足使用需求（比如网络图片没有磁盘缓存，导致每次 ImageCache 清除缓存之后又要从网络下载），所以又出现了flutter_cached_network_image、extended_image等基于 Flutter 原生的解决方案，以及power_image等基于混合开发的解决方案。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-12-28T04:15:46.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"flutter"}],["meta",{"property":"article:published_time","content":"2022-07-27T15:31:03.000Z"}],["meta",{"property":"article:modified_time","content":"2023-12-28T04:15:46.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Flutter图片加载方案分析之Image\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-07-27T15:31:03.000Z\\",\\"dateModified\\":\\"2023-12-28T04:15:46.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"Image","slug":"image","link":"#image","children":[]},{"level":2,"title":"_ImageState","slug":"imagestate","link":"#imagestate","children":[{"level":3,"title":"_resolveImage","slug":"resolveimage","link":"#resolveimage","children":[]},{"level":3,"title":"_updateSourceStream","slug":"updatesourcestream","link":"#updatesourcestream","children":[]},{"level":3,"title":"_handleImageFrame","slug":"handleimageframe","link":"#handleimageframe","children":[]},{"level":3,"title":"build","slug":"build","link":"#build","children":[]}]},{"level":2,"title":"RawImage","slug":"rawimage","link":"#rawimage","children":[]},{"level":2,"title":"RenderImage","slug":"renderimage","link":"#renderimage","children":[]},{"level":2,"title":"ImageProvider","slug":"imageprovider","link":"#imageprovider","children":[]},{"level":2,"title":"ImageCache","slug":"imagecache","link":"#imagecache","children":[{"level":3,"title":"putIfAbsent","slug":"putifabsent","link":"#putifabsent","children":[]}]}],"git":{"createdTime":1703736946000,"updatedTime":1703736946000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":13.14,"words":3942},"filePathRelative":"_posts/Flutter图片加载方案分析之Image.md","localizedDate":"2022年7月27日","excerpt":"<p>Flutter 默认提供了<strong>Image</strong>用于从网络、文件等加载图片，并且使用<strong>ImageCache</strong>统一管理图片缓存，但有时候并不能满足使用需求（比如网络图片没有磁盘缓存，导致每次 ImageCache 清除缓存之后又要从网络下载），所以又出现了<a href=\\"https://github.com/Baseflow/flutter_cached_network_image\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">flutter_cached_network_image</a>、<a href=\\"https://github.com/fluttercandies/extended_image\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">extended_image</a>等基于 Flutter 原生的解决方案，以及<a href=\\"https://github.com/alibaba/power_image\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">power_image</a>等基于混合开发的解决方案。</p>","autoDesc":true}');export{e as data};