const t=JSON.parse('{"key":"v-abac79b0","path":"/posts/adf541c0.html","title":"Flutter 动画分析之 CustomPaint","lang":"zh-CN","frontmatter":{"permalink":"/posts/adf541c0.html","title":"Flutter 动画分析之 CustomPaint","date":"2022-08-29T12:57:16.000Z","updated":"2023-12-30T08:17:02.000Z","abbrlink":"adf541c0","tag":"flutter","description":"本文讨论的 Flutter 动画主要限定在：随着每一帧的变化，修改 Flutter Widget 的大小、颜色、位置等属性，使之看起来从一种状态渐变为另外一种状态 这一范围。 根据之前的分析，关于 Flutter 中的 Widget 动画，大体可以分为三大类： 隐式动画，以 ImplicitlyAnimatedWidget 及其子类为代表。特点是当涉及到的属性变化后，这些 Widget 会 自动渐变到新的属性，使用者只能设置动画的 Duration、Tween、Curve 等，而无法主动终止、反向执行动画。 涉及到的类主要有 TweenAnimationBuilder 以及一系列以 AnimatedFoo 命名的类。 显式动画，以 AnimatedWidget 及其子类为代表，需要配合 AnimationController 使用。特点是 当 AnimationController 的值变化时，Widget 中对应的属性也会随之变化。 涉及到的类主要有 AnimationBuilder/AnimatedWidget 以及一系列 FooTransition 命名的类。 自定义动画，如果上述两种方式还无法满足需求，则可以使用 CustomPaint + CustomPainter + Listenable（比如 AnimationController）实现动画，特点是实现方式灵活，但同时也比上述两者难度高一些。","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/adf541c0.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Flutter 动画分析之 CustomPaint"}],["meta",{"property":"og:description","content":"本文讨论的 Flutter 动画主要限定在：随着每一帧的变化，修改 Flutter Widget 的大小、颜色、位置等属性，使之看起来从一种状态渐变为另外一种状态 这一范围。 根据之前的分析，关于 Flutter 中的 Widget 动画，大体可以分为三大类： 隐式动画，以 ImplicitlyAnimatedWidget 及其子类为代表。特点是当涉及到的属性变化后，这些 Widget 会 自动渐变到新的属性，使用者只能设置动画的 Duration、Tween、Curve 等，而无法主动终止、反向执行动画。 涉及到的类主要有 TweenAnimationBuilder 以及一系列以 AnimatedFoo 命名的类。 显式动画，以 AnimatedWidget 及其子类为代表，需要配合 AnimationController 使用。特点是 当 AnimationController 的值变化时，Widget 中对应的属性也会随之变化。 涉及到的类主要有 AnimationBuilder/AnimatedWidget 以及一系列 FooTransition 命名的类。 自定义动画，如果上述两种方式还无法满足需求，则可以使用 CustomPaint + CustomPainter + Listenable（比如 AnimationController）实现动画，特点是实现方式灵活，但同时也比上述两者难度高一些。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-01-01T00:13:21.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"flutter"}],["meta",{"property":"article:published_time","content":"2022-08-29T12:57:16.000Z"}],["meta",{"property":"article:modified_time","content":"2024-01-01T00:13:21.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Flutter 动画分析之 CustomPaint\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-08-29T12:57:16.000Z\\",\\"dateModified\\":\\"2024-01-01T00:13:21.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"CustomPaint","slug":"custompaint","link":"#custompaint","children":[]},{"level":2,"title":"RenderCustomPaint","slug":"rendercustompaint","link":"#rendercustompaint","children":[]},{"level":2,"title":"CustomPainter","slug":"custompainter","link":"#custompainter","children":[]},{"level":2,"title":"Canvas","slug":"canvas","link":"#canvas","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]}],"git":{"createdTime":1704068001000,"updatedTime":1704068001000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":8.74,"words":2621},"filePathRelative":"_posts/Flutter动画分析之CustomPaint.md","localizedDate":"2022年8月29日","excerpt":"<blockquote>\\n<p>本文讨论的 Flutter 动画主要限定在：<em>随着每一帧的变化，修改 Flutter Widget 的大小、颜色、位置等属性，使之看起来从一种状态渐变为另外一种状态</em> 这一范围。</p>\\n</blockquote>\\n<p>根据之前的分析，关于 Flutter 中的 Widget 动画，大体可以分为三大类：</p>\\n<ul>\\n<li>\\n<p><strong>隐式动画</strong>，以 ImplicitlyAnimatedWidget 及其子类为代表。特点是当涉及到的属性变化后，这些 Widget 会 <em>自动渐变到新的属性</em>，使用者只能设置动画的 Duration、Tween、Curve 等，而无法主动终止、反向执行动画。</p>\\n<p>涉及到的类主要有 TweenAnimationBuilder 以及一系列以 AnimatedFoo 命名的类。</p>\\n</li>\\n<li>\\n<p><strong>显式动画</strong>，以 AnimatedWidget 及其子类为代表，需要配合 AnimationController 使用。特点是 <em>当 AnimationController 的值变化时，Widget 中对应的属性也会随之变化</em>。</p>\\n<p>涉及到的类主要有 AnimationBuilder/AnimatedWidget 以及一系列 FooTransition 命名的类。</p>\\n</li>\\n<li>\\n<p><strong>自定义动画</strong>，如果上述两种方式还无法满足需求，则可以使用 CustomPaint + CustomPainter + Listenable（比如 AnimationController）实现动画，特点是实现方式灵活，但同时也比上述两者难度高一些。</p>\\n</li>\\n</ul>","autoDesc":true}');export{t as data};