const e=JSON.parse('{"key":"v-21050536","path":"/posts/d3bdcb53.html","title":"Flutter滑动分析之SingleChildScrollView","lang":"zh-CN","frontmatter":{"permalink":"/posts/d3bdcb53.html","title":"Flutter滑动分析之SingleChildScrollView","date":"2022-07-15T18:36:54.000Z","abbrlink":"d3bdcb53","tag":"flutter","description":"Flutter中的scrollable widget根据实现方式的不同，可以分为两大类： 基于RenderBox的box protocol实现的，主要基于Size实现布局。常见的有SingleChildScrollView。 基于RenderSliver的sliver protocol实现的，主要基于SliverGeometry实现布局。比如CustomScrollView及其子类ListView、GridView等继承自ScrollView的Widget，以及基于CustomScrollView的NestedScrollView、基于Viewport等的PageView、TabBarView等直接对SliverFillViewport等进行封装的Widget。","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/d3bdcb53.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Flutter滑动分析之SingleChildScrollView"}],["meta",{"property":"og:description","content":"Flutter中的scrollable widget根据实现方式的不同，可以分为两大类： 基于RenderBox的box protocol实现的，主要基于Size实现布局。常见的有SingleChildScrollView。 基于RenderSliver的sliver protocol实现的，主要基于SliverGeometry实现布局。比如CustomScrollView及其子类ListView、GridView等继承自ScrollView的Widget，以及基于CustomScrollView的NestedScrollView、基于Viewport等的PageView、TabBarView等直接对SliverFillViewport等进行封装的Widget。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-10-11T09:43:43.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"flutter"}],["meta",{"property":"article:published_time","content":"2022-07-15T18:36:54.000Z"}],["meta",{"property":"article:modified_time","content":"2023-10-11T09:43:43.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Flutter滑动分析之SingleChildScrollView\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-07-15T18:36:54.000Z\\",\\"dateModified\\":\\"2023-10-11T09:43:43.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"SingleChildScrollView","slug":"singlechildscrollview","link":"#singlechildscrollview","children":[]},{"level":2,"title":"_SingleChildViewport","slug":"singlechildviewport","link":"#singlechildviewport","children":[]},{"level":2,"title":"_RenderSingleChildViewport","slug":"rendersinglechildviewport","link":"#rendersinglechildviewport","children":[{"level":3,"title":"layout","slug":"layout","link":"#layout","children":[]},{"level":3,"title":"paint","slug":"paint","link":"#paint","children":[]},{"level":3,"title":"hitTest","slug":"hittest","link":"#hittest","children":[]}]},{"level":2,"title":"为Column的children安全应用spacedAround，center等效果","slug":"为column的children安全应用spacedaround-center等效果","link":"#为column的children安全应用spacedaround-center等效果","children":[]},{"level":2,"title":"为Column的children安全应用Expanded、Space等效果","slug":"为column的children安全应用expanded、space等效果","link":"#为column的children安全应用expanded、space等效果","children":[]}],"git":{"createdTime":1697017423000,"updatedTime":1697017423000,"contributors":[{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":12.92,"words":3875},"filePathRelative":"_posts/Flutter滑动分析之SingleChildScrollView.md","localizedDate":"2022年7月16日","excerpt":"<p>Flutter中的scrollable widget根据实现方式的不同，可以分为两大类：</p>\\n<ul>\\n<li>基于RenderBox的box protocol实现的，主要基于Size实现布局。常见的有SingleChildScrollView。</li>\\n<li>基于RenderSliver的sliver protocol实现的，主要基于SliverGeometry实现布局。比如CustomScrollView及其子类ListView、GridView等继承自ScrollView的Widget，以及基于CustomScrollView的NestedScrollView、基于Viewport等的PageView、TabBarView等直接对SliverFillViewport等进行封装的Widget。</li>\\n</ul>","autoDesc":true}');export{e as data};