import{_ as p}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as l,c as i,a as n,b as a,d as t,e}from"./app-43e1fc60.js";const c={},u=e(`<p>国内 Android 应用常常要分发到多个应用商店，使用 Android Studio 正确配置 build.gradle 与 AndroidManifest.xml 文件可以<strong>一步打包多个渠道</strong>。</p><p>本文实现的多渠道打包可实现不同渠道：</p><ul><li>有不同的项目 id（applicationId）</li><li>不同 App 名称（android:label）</li><li>不同 App 图标（android:icon）</li><li>等等</li></ul><h1 id="_1-友盟配置" tabindex="-1"><a class="header-anchor" href="#_1-友盟配置" aria-hidden="true">#</a> 1.友盟配置</h1><p>*具体配置请参考 UMeng 官方文档。</p><p>作为第三方统计平台，国内很多软件都使用的是 Umeng 的产品，故而大多数软件多渠道打包配置如下：</p><ul><li>添加依赖</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token punctuation">.</span><span class="token punctuation">.</span>/app<span class="token operator">/</span>build<span class="token punctuation">.</span>gradle
dependencies <span class="token punctuation">{</span>
<span class="token comment">//友盟sdk</span>
compile &#39;com<span class="token punctuation">.</span>umeng<span class="token punctuation">.</span>sdk<span class="token operator">:</span>common<span class="token operator">:</span>latest<span class="token punctuation">.</span>integration&#39;
compile &#39;com<span class="token punctuation">.</span>umeng<span class="token punctuation">.</span>sdk<span class="token operator">:</span>analytics<span class="token operator">:</span>latest<span class="token punctuation">.</span>integration&#39;
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>修改 AndroidManifest.xml</li></ul><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>application</span><span class="token punctuation">&gt;</span></span>
	...
	<span class="token comment">&lt;!--友盟初始化appkey和channel--&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta-data</span> <span class="token attr-name"><span class="token namespace">android:</span>value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>\${APP_KEY}<span class="token punctuation">&quot;</span></span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>UMENG_APPKEY<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta-data</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>UMENG_CHANNEL<span class="token punctuation">&quot;</span></span> <span class="token attr-name"><span class="token namespace">android:</span>value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>\${UMENG_CHANNEL_VALUE}<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>application</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>修改 build.gradle</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>android <span class="token punctuation">{</span>

 productFlavors <span class="token punctuation">{</span>
        beta <span class="token punctuation">{</span><span class="token punctuation">}</span>
        baidu <span class="token punctuation">{</span><span class="token punctuation">}</span>
        zhushou91  <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">//不能以数字开头</span>
        anzhi <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    productFlavors<span class="token punctuation">.</span>all <span class="token punctuation">{</span>

        flavor <span class="token operator">-&gt;</span> flavor<span class="token punctuation">.</span>manifestPlaceholders <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token constant">UMENG_CHANNEL_VALUE</span><span class="token operator">:</span> name
                                                 <span class="token punctuation">,</span><span class="token constant">APP_KEY</span><span class="token operator">:</span>umenInfo<span class="token punctuation">[</span>&#39;<span class="token constant">APP_KEY</span>&#39;<span class="token punctuation">]</span><span class="token punctuation">]</span>
            <span class="token comment">//这里有一个知识点，用build.gradle读取properties文件信息，用于将部分信息统一放置在本地配置文件中，避免泄漏，若无此类要求可直接使用 APP_KEY:&#39;da15d26d1a&#39;等</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//解决flavor Dimensions问题  http://blog.csdn.net/syif88/article/details/75009663</span>
    flavorDimensions <span class="token string">&quot;versionCode&quot;</span>
<span class="token punctuation">}</span>
<span class="token comment">//其他umeng要求的配置</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样编译完之后，通过通过 build&gt;Generate Signed APK...便可以打包不同渠道的 apk，在友盟统计平台上统计各个渠道的 App 信息了。</p><h1 id="_2-android-studio-实现多渠道打包" tabindex="-1"><a class="header-anchor" href="#_2-android-studio-实现多渠道打包" aria-hidden="true">#</a> 2.Android Studio 实现多渠道打包</h1><p>方法 1 要求依赖 umeng 模块，使用场景难免有些受限，其实我们也可以自己实现多渠道打包，方法 1 使用的应该也是此原理。</p><ul><li>AndroidManifest.xml</li></ul><p>在需要根据渠道不同而变化的地方使用<code>\${KEY}</code>形式替换掉原先的值。</p><p>例如：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>application</span>
<span class="token attr-name"><span class="token namespace">android:</span>label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>\${APP_NAME}<span class="token punctuation">&quot;</span></span>
<span class="token attr-name">...</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta-data</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>APP_TEXT<span class="token punctuation">&quot;</span></span> <span class="token attr-name"><span class="token namespace">android:</span>value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>\${APP_TEXT}<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>//可以在java文件中获取到
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>app/build.gradle</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    productFlavors <span class="token punctuation">{</span>
        beta <span class="token punctuation">{</span>applicationId <span class="token operator">=</span> <span class="token string">&quot;cf.android666.mykotlin.beta&quot;</span><span class="token comment">//每个渠道有不同的包名</span>
            manifestPlaceholders <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token constant">APP_NAME</span> <span class="token operator">:</span> name <span class="token punctuation">,</span><span class="token constant">APP_TEXT</span><span class="token operator">:</span><span class="token char">&#39;beta&#39;</span><span class="token punctuation">]</span>
            <span class="token punctuation">}</span>
        baidu <span class="token punctuation">{</span>applicationId <span class="token operator">=</span> <span class="token string">&quot;cf.android666.mykotlin.baidu&quot;</span>
            manifestPlaceholders <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token constant">APP_NAME</span><span class="token operator">:</span><span class="token char">&#39;A APP&#39;</span><span class="token punctuation">,</span><span class="token constant">APP_TEXT</span><span class="token operator">:</span><span class="token char">&#39;baidu&#39;</span><span class="token punctuation">]</span>
          <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>在 java 中获取<code>meta-data</code>（非必须）</li></ul>`,22),d={href:"https://blog.csdn.net/zhang31jian/article/details/29868235",target:"_blank",rel:"noopener noreferrer"},r=e(`<div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code><span class="token comment">//application中的meta-data</span>
<span class="token keyword">var</span> appInfo <span class="token operator">=</span> context<span class="token punctuation">.</span>packageManager<span class="token punctuation">.</span><span class="token function">getApplicationInfo</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span>packageName<span class="token punctuation">,</span>
        PackageManager<span class="token punctuation">.</span>GET_META_DATA<span class="token punctuation">)</span>
<span class="token comment">//service、receiver中的meta-data</span>
<span class="token keyword">var</span> appInfo <span class="token operator">=</span> context<span class="token punctuation">.</span>packageManager<span class="token punctuation">.</span><span class="token function">getServiceInfo</span><span class="token punctuation">(</span><span class="token function">ComponentName</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span>MService<span class="token operator">::</span><span class="token keyword">class</span><span class="token punctuation">.</span>java<span class="token punctuation">)</span><span class="token punctuation">,</span>
                PackageManager<span class="token punctuation">.</span>GET_META_DATA<span class="token punctuation">)</span>
<span class="token keyword">var</span> appName <span class="token operator">=</span> appInfo<span class="token punctuation">.</span>metaData<span class="token punctuation">.</span><span class="token function">getString</span><span class="token punctuation">(</span><span class="token string-literal singleline"><span class="token string">&quot;APP_NAME&quot;</span></span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="_3-生成多个渠道文件夹" tabindex="-1"><a class="header-anchor" href="#_3-生成多个渠道文件夹" aria-hidden="true">#</a> 3.生成多个渠道文件夹</h1><p>还有一种方法，通过在项目中生成多个渠道的文件夹，在里面替换对应的资源文件，从而实现多渠道打包不同项目名，不同 icon 等等</p><ul><li><p>在../app/src/目录下新建对应渠道文件夹，和 main 同级</p></li><li><p>在该渠道目录下新建对应的资源目录，在打包时自动替换对应资源</p><p>​</p><p>目录树如下</p></li></ul><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>src

--baidu

----res/drawable

--beta

--main

----res/drawable

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="_4-more" tabindex="-1"><a class="header-anchor" href="#_4-more" aria-hidden="true">#</a> 4.More</h1><p>此外还有美团的多渠道打包技术等</p>`,7),k={href:"https://tech.meituan.com/mt-apk-packaging.html",target:"_blank",rel:"noopener noreferrer"};function v(m,b){const s=o("ExternalLinkIcon");return l(),i("div",null,[u,n("blockquote",null,[n("p",null,[a("《Android 获取 Manifest 中<meta-data>元素的值》 - CSDN 博客 "),n("a",d,[a("https://blog.csdn.net/zhang31jian/article/details/29868235"),t(s)])])]),r,n("p",null,[a("具体可参考文章："),n("a",k,[a("美团 Android 自动化之旅—生成渠道包"),t(s)])])])}const _=p(c,[["render",v],["__file","a3a3dc4c.html.vue"]]);export{_ as default};