import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o as r,c as d,a as e,b as i,d as a,e as o}from"./app-df744fe4.js";const p={},s=o('<h1 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h1><blockquote><p>环境 linux(deepin)</p><p>python 2.7</p></blockquote><p>这是一个Python脚本，用于实现hexo文章创建、生成网页并预览、发布到对应xxx.github.io博客的全过程。</p><h1 id="使用方法" tabindex="-1"><a class="header-anchor" href="#使用方法" aria-hidden="true">#</a> 使用方法</h1><h2 id="使用时需要根据自己的项目更新main-py的一下变量" tabindex="-1"><a class="header-anchor" href="#使用时需要根据自己的项目更新main-py的一下变量" aria-hidden="true">#</a> 使用时需要根据自己的项目更新main.py的一下变量：</h2>',5),h=o("<li><p>hexo_url = &#39;your_path/hexo/blog&#39;</p><p>【必需】本地hexo博客路径</p></li><li><p>hexo_public_dir = &#39;your_path/hexo/blog/public&#39;</p><p>【必需】本地hexo博客输出路径</p></li><li><p>hexo_post_dir = &#39;your_path/hexo/blog/source/_posts&#39;</p><p>【可选】本地hexo博客文章源文件路径</p></li><li><p>git_dir = &#39;your_path/xxx.github.io&#39;</p><p>【必需】博客要同步的git工程路径</p></li><li><p>git_backup_dir = &#39;your_path/xxx.github.io/blog/backup/sources/_posts&#39;</p><p>【可选】本路径用于备份post源文件到github</p></li>",5),c={href:"http://hexo.py",target:"_blank",rel:"noopener noreferrer"},u=e("code",null,"post()",-1),x=e("code",null,"webbrowser.open('http://jixiaoyong.github.io/blog/')",-1),_=e("code",null,"post()",-1),b=e("code",null,"main.py",-1),m=o(`<h2 id="运行main-py文件" tabindex="-1"><a class="header-anchor" href="#运行main-py文件" aria-hidden="true">#</a> 运行<code>main.py</code>文件</h2><ul><li>在Linux命令行输入如下命令，并回车，根据提示操作即可。</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>python main.py
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>​ Windows下可以运行<code>start.cmd</code>脚本（待实现）</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//start.cmd脚本内容
python main.py
cmd
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>操作过程提示及说明如下：（渣英语请忽略...）</p><ul><li><p>input yout file name 输入要发布的文章名称xxx（当前版本暂不支持中文）</p><p>输入回车会自动创建xxx.md文件并打开（需要系统支持该格式）</p></li><li><p>are you finish your post 输入y或n，选择是否用hexo编译文章</p><p>y:编译文章 n:不编译文章，退出命令行</p></li><li><p>post or not 输入y或n，选择是否发布文章到网站,可以在打开的页面预览后做决定</p><p>y:发布文章 n:不发布文章，退出命令行</p></li><li><p>update post 《xxx》 提示开始发布文章，自动打开网页，并保存源文件</p></li></ul></li></ul><h1 id="源代码" tabindex="-1"><a class="header-anchor" href="#源代码" aria-hidden="true">#</a> 源代码</h1>`,7),y={href:"https://github.com/jixiaoyong/AndroidNote/tree/master/code/2018-1-31/python%E8%87%AA%E5%8A%A8%E5%8C%96%E9%83%A8%E7%BD%B2%E6%96%87%E7%AB%A0",target:"_blank",rel:"noopener noreferrer"},g=e("h1",{id:"后期计划",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#后期计划","aria-hidden":"true"},"#"),i(" 后期计划")],-1),f=e("ul",null,[e("li",null,"增加文件名中文支持"),e("li",null,[e("s",null,"增加图片自动上传、替换为github链接"),i("(2018/2/2已实现)")])],-1);function v(k,E){const t=l("ExternalLinkIcon");return r(),d("div",null,[s,e("ul",null,[h,e("li",null,[e("p",null,[e("a",c,[i("hexo.py"),a(t)]),i(" 中的"),u,i("方法中"),x,i("中的博客地址，发布完后默认打开该网页。（后期也可以改为"),_,i("参数传入，这样只需要更改"),b,i("就行）")])])]),m,e("p",null,[i("源代码已经上传"),e("a",y,[i("github"),a(t)])]),g,f])}const N=n(p,[["render",v],["__file","d9a2e1ba.html.vue"]]);export{N as default};