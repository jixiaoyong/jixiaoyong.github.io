const e=JSON.parse('{"key":"v-e05d7056","path":"/posts/db62c118.html","title":"Dart event loop","lang":"zh-CN","frontmatter":{"permalink":"/posts/db62c118.html","title":"Dart event loop","date":"2022-06-11T10:25:29.000Z","updated":"2023-12-30T08:17:02.000Z","abbrlink":"db62c118","tag":"dart","description":"本文基于 Dart 2.17 Dart App 中所有的代码都在一个 isolate 中运行（各个 isolate 之间的代码运行时是隔离的），一个 isolate 有自己的 heap，维持有一个消息队列 event_loop，处理两种消息： event queue 执行用户点击、屏幕刷新、绘制，一般的 Future、IO、Stream 流等，每次执行完毕都会先检查执行 micro task queue 中的任务，直到其为空再执行下一个 event queue microTask queue 优先执行，一般执行跑完即弃的小任务，如 Dart 内部的微任务","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/db62c118.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Dart event loop"}],["meta",{"property":"og:description","content":"本文基于 Dart 2.17 Dart App 中所有的代码都在一个 isolate 中运行（各个 isolate 之间的代码运行时是隔离的），一个 isolate 有自己的 heap，维持有一个消息队列 event_loop，处理两种消息： event queue 执行用户点击、屏幕刷新、绘制，一般的 Future、IO、Stream 流等，每次执行完毕都会先检查执行 micro task queue 中的任务，直到其为空再执行下一个 event queue microTask queue 优先执行，一般执行跑完即弃的小任务，如 Dart 内部的微任务"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-01-01T00:13:21.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"dart"}],["meta",{"property":"article:published_time","content":"2022-06-11T10:25:29.000Z"}],["meta",{"property":"article:modified_time","content":"2024-01-01T00:13:21.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Dart event loop\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-06-11T10:25:29.000Z\\",\\"dateModified\\":\\"2024-01-01T00:13:21.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"代码分析","slug":"代码分析","link":"#代码分析","children":[{"level":3,"title":"_RootZone._scheduleAsyncCallback","slug":"rootzone-scheduleasynccallback","link":"#rootzone-scheduleasynccallback","children":[]},{"level":3,"title":"_RootZone._startMicrotaskLoop","slug":"rootzone-startmicrotaskloop","link":"#rootzone-startmicrotaskloop","children":[]},{"level":3,"title":"_AsyncRun._scheduleImmediate","slug":"asyncrun-scheduleimmediate","link":"#asyncrun-scheduleimmediate","children":[]},{"level":3,"title":"_ScheduleImmediateClosure","slug":"scheduleimmediateclosure","link":"#scheduleimmediateclosure","children":[]},{"level":3,"title":"_pendingImmediateCallback","slug":"pendingimmediatecallback","link":"#pendingimmediatecallback","children":[]}]},{"level":2,"title":"代码分析","slug":"代码分析-1","link":"#代码分析-1","children":[{"level":3,"title":"Future.then","slug":"future-then","link":"#future-then","children":[]}]},{"level":2,"title":"Timer","slug":"timer","link":"#timer","children":[{"level":3,"title":"创建 Timer","slug":"创建-timer","link":"#创建-timer","children":[]},{"level":3,"title":"timer._enqueue","slug":"timer-enqueue","link":"#timer-enqueue","children":[]}]}],"git":{"createdTime":1704068001000,"updatedTime":1704068001000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":18.6,"words":5579},"filePathRelative":"_posts/DartEventLoop.md","localizedDate":"2022年6月11日","excerpt":"<blockquote>\\n<p>本文基于 Dart 2.17</p>\\n</blockquote>\\n<br>\\n<p>Dart App 中所有的代码都在一个 isolate 中运行（各个 isolate 之间的代码运行时是隔离的），一个 isolate 有自己的 heap，维持有一个消息队列 event_loop，处理两种消息：</p>\\n<ol>\\n<li><code>event queue</code> 执行用户点击、屏幕刷新、绘制，一般的 Future、IO、Stream 流等，每次执行完毕都会先检查执行 micro task queue 中的任务，直到其为空再执行下一个 event queue</li>\\n<li><code>microTask queue</code> 优先执行，一般执行跑完即弃的小任务，如 Dart 内部的微任务</li>\\n</ol>","autoDesc":true}');export{e as data};