const e=JSON.parse('{"key":"v-defabfdc","path":"/posts/a2863875.html","title":"Android 运行时权限","lang":"zh-CN","frontmatter":{"permalink":"/posts/a2863875.html","title":"Android 运行时权限","tags":"android","abbrlink":"a2863875","date":"2018-11-25T05:10:08.000Z","updated":"2023-12-30T08:17:02.000Z","description":"简介 本文介绍了 Android 运行时权限的一些处理流程。 Android 运行时权限是 Android6 之后出现的处理权限的新方式，此前开发者只需要应用需要的权限在 AndroidManifest.xml 文件中声明即可，现在则需要在使用到对应权限时检测是否有该权限并作出相应处理。 正文 一般流程 在AndroidManifest.xml中声明所需权限 在使用之前检查是否有该权限checkSelfPermission(),如果有则继续相应操作 如果没有权限则检测是否需要向用户解释为什么需要该权限ActivityCompat.shouldShowRequestPermissionRationale()，再决定如何申请权限requestPermissions()","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/a2863875.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Android 运行时权限"}],["meta",{"property":"og:description","content":"简介 本文介绍了 Android 运行时权限的一些处理流程。 Android 运行时权限是 Android6 之后出现的处理权限的新方式，此前开发者只需要应用需要的权限在 AndroidManifest.xml 文件中声明即可，现在则需要在使用到对应权限时检测是否有该权限并作出相应处理。 正文 一般流程 在AndroidManifest.xml中声明所需权限 在使用之前检查是否有该权限checkSelfPermission(),如果有则继续相应操作 如果没有权限则检测是否需要向用户解释为什么需要该权限ActivityCompat.shouldShowRequestPermissionRationale()，再决定如何申请权限requestPermissions()"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-01-01T15:46:34.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:published_time","content":"2018-11-25T05:10:08.000Z"}],["meta",{"property":"article:modified_time","content":"2024-01-01T15:46:34.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Android 运行时权限\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2018-11-25T05:10:08.000Z\\",\\"dateModified\\":\\"2024-01-01T15:46:34.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"简介","slug":"简介","link":"#简介","children":[]},{"level":2,"title":"正文","slug":"正文","link":"#正文","children":[{"level":3,"title":"一般流程","slug":"一般流程","link":"#一般流程","children":[]},{"level":3,"title":"代码","slug":"代码","link":"#代码","children":[]}]},{"level":2,"title":"附录","slug":"附录","link":"#附录","children":[]}],"git":{"createdTime":1680852645000,"updatedTime":1704123994000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3}]},"readingTime":{"minutes":2.52,"words":756},"filePathRelative":"_posts/Android运行时权限.md","localizedDate":"2018年11月25日","excerpt":"<h2> 简介</h2>\\n<p>本文介绍了 Android 运行时权限的一些处理流程。</p>\\n<p>Android 运行时权限是 Android6 之后出现的处理权限的新方式，此前开发者只需要应用需要的权限在 AndroidManifest.xml 文件中声明即可，现在则需要在使用到对应权限时检测是否有该权限并作出相应处理。</p>\\n<h2> 正文</h2>\\n<h3> 一般流程</h3>\\n<ol>\\n<li>\\n<p>在<code>AndroidManifest.xml</code>中声明所需权限</p>\\n</li>\\n<li>\\n<p>在使用之前检查是否有该权限<code>checkSelfPermission()</code>,如果有则继续相应操作</p>\\n</li>\\n<li>\\n<p>如果没有权限则检测是否需要向用户解释为什么需要该权限<code>ActivityCompat.shouldShowRequestPermissionRationale()</code>，再决定如何申请权限<code>requestPermissions()</code></p>\\n</li>\\n</ol>","autoDesc":true}');export{e as data};