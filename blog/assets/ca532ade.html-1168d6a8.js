import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as d,e as i}from"./app-df744fe4.js";const n={},t=i(`<h1 id="下载-jdk-并解压" tabindex="-1"><a class="header-anchor" href="#下载-jdk-并解压" aria-hidden="true">#</a> 下载 JDK 并解压</h1><ul><li>到官网下载 jdk</li><li>下载到的 JDK 文件解压</li></ul><h1 id="设置环境变量" tabindex="-1"><a class="header-anchor" href="#设置环境变量" aria-hidden="true">#</a> 设置环境变量</h1><p>管理员权限进入 etc/environment 写入以下代码</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA_HOME=&quot;JDK主目录的绝对路径&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="配置-alternatives" tabindex="-1"><a class="header-anchor" href="#配置-alternatives" aria-hidden="true">#</a> 配置 alternatives</h1><p>打开终端执行以下命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo update-alternatives --install  /usr/bin/java java  JDK主目录的绝对路径/bin/java 300

sudo update-alternatives --install  /usr/bin/javac javac  JDK主目录的绝对路径/bin/javac 300
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到这里 JDK 的环境就配置好了</p><h1 id="运行-android-studio" tabindex="-1"><a class="header-anchor" href="#运行-android-studio" aria-hidden="true">#</a> 运行 Android Studio</h1><p>进入 android studio/bin 目录下，打开终端，</p><p>输入 <code>./studio.sh</code></p><p>到这里，就可以正常运行 android studio 了</p>`,13),r=[t];function s(l,c){return a(),d("div",null,r)}const h=e(n,[["render",s],["__file","ca532ade.html.vue"]]);export{h as default};