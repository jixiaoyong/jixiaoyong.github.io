import{_ as i,c as s,o as a,a as n}from"./app-B34IKLrY.js";const e={},t=n(`<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h2><p>最近在项目里面遇到了屏幕适配的问题，UI 要求 APP 在不同手机上展示效果和设计稿保持“像素级”同步，在对比了几种屏幕适配方案之后，选择了基于今日头条的<a href="https://github.com/JessYanCoding/AndroidAutoSize" target="_blank" rel="noopener noreferrer">AndroidAutoSize</a>适配方案。</p><p>本文主要简单分析其适配原理，以及在实际使用中遇到的一个问题，需要更深入了解原理可以阅读文末参考文献。</p><h2 id="正文" tabindex="-1"><a class="header-anchor" href="#正文"><span>正文</span></a></h2><p>UI 给的设计稿一般都是以像素 px 为单位，而在 Android 开发中官方推荐的使用的单位是 dp。</p><blockquote><p>dp 是一个虚拟像素单位，1 dp 约等于中密度屏幕（160dpi；“基准”密度）上的 1 像素。对于其他每个密度，Android 会将此值转换为相应的实际像素数。</p><p>—— Android Developer</p></blockquote><p>根据 Android 官方的定义，dp 在屏幕上实际对应的像素 px 计算方式如下：</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">px </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> dp </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (dpi </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 160</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>其中 dpi 表示：<strong>屏幕每平方英寸有多少像素</strong>，可以通过屏幕对角线的像素数 px/屏幕尺寸 inch 计算。</p><p>而<code>DisplayMetrics.density</code> 字段表示根据当前像素密度指定将 <code>dp</code> 单位转换为像素时所必须使用的缩放系数，即上述方程等价于：</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">px </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> dp </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (dpi </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 160</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">   =</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> dp </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> getResources</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">getDisplayMetrics</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">().density</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，在 dpi 为 160 的屏幕上 1dp 占 1px，在 dpi 为 320 的屏幕上占 2px，那么就能保证同一 dp 的在不同 dpi 上占得像素是等比例变化的。</p><p>但是，在现实生活中面对千变万化的 Android 屏幕，根据 Jessyan 的文章可知由于每种屏幕宽/高对应的总 dp 数不一定都是相同的，所以即使使用了 dp 作为单位，还是会出现同一 dp 在有些屏幕上刚好占满全屏，在有的屏幕上会无法占满全屏或超出屏幕范围。</p><blockquote><p><strong>density</strong> 在每个设备上都是固定的，<strong>DPI / 160 = density</strong>，<strong>屏幕的总 px 宽度 / density = 屏幕的总 dp 宽度</strong></p><ul><li>设备 1，屏幕宽度为 <strong>1080px</strong>，<strong>480DPI</strong>，屏幕总 <strong>dp</strong> 宽度为 <strong>1080 / (480 / 160) = 360dp</strong></li><li>设备 2，屏幕宽度为 <strong>1440px</strong>，<strong>560DPI</strong>，屏幕总 <strong>dp</strong> 宽度为 <strong>1440 / (560 / 160) = 411dp</strong></li></ul><p>——Jessyan</p></blockquote><p>那么该怎么适配呢，再看一眼上述的公式：</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">屏幕的总 px 宽度 </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> density </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> 屏幕的总 dp 宽度</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>以适配<strong>屏幕宽度</strong>为例，要使得 dp 在不同屏幕上对应的像素等比例变化，就要<strong>保证屏幕的总 dp 宽度一致</strong>，而屏幕的总 px 宽度是物理条件无法更改，那么就只能<strong>更改 density</strong>。</p><p>以我们使用的设计稿宽度为 375dp 为例：</p><p>在分辨率为 2160*1080、尺寸为 5.99 英寸的屏幕上：</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">density </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> 1080px </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> 375dp </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2.88</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>而在分辨率为 2400*1176、尺寸为 6.53 英寸的屏幕上：</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">density </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> 1176px </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> 375dp </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 3.136</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这样就保证了，不管在什么样的屏幕上，375dp 始终都能够占满屏幕宽度，保证了布局在不同大小的屏幕上，在屏幕宽度上的比例一致性，也就解决屏幕适配的问题。</p><h2 id="获取状态栏高度的问题" tabindex="-1"><a class="header-anchor" href="#获取状态栏高度的问题"><span>获取状态栏高度的问题</span></a></h2><p>上述的屏幕适配方案使用简单，且侵入小，在使用到项目中之后，除了部分字体等显示需要微调外，其余内容基本上都完美还原了设计稿的内容。</p><p>但是在后续使用到状态栏相关代码的时候发现<strong>获取到的状态栏高度和实际高度不一致</strong>，导致显示异常，而使用<a href="http://blankj.com" target="_blank" rel="noopener noreferrer">Blankj</a>的工具类 <code>BarUtils.getStatusBarHeight()</code>却可以获取到正确的高度。</p><p>对比两种代码发现获取状态栏高度的代码逻辑几乎一样：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> getStatusBarHeight</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">Resources</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> resources) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    int</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> resourceId </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> resources</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">getIdentifier</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;status_bar_height&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;dimen&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;android&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> resources</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">getDimensionPixelSize</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(resourceId);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不同的是，两种方法使用到的 resources 一个是 APP 的，一个是系统的</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">// 1. 我使用到的 resources，从当前 activity 获取</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">resources.displayMetrics.density</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">// 2. Blankj 使用的 resources，从系统获取</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">Resources.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">getSystem</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">().displayMetrics.density</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过分别打印这两种 resources 可以发现，二者的 density 值不一样（以 2160*1080、尺寸为 5.99 英寸的屏幕为例）：</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">context.resources.DisplayMetrics: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">DisplayMetrics</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">{density</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2.88</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, width</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1080</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, height</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2033</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, scaledDensity</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2.88</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, xdpi</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">403.411</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, ydpi</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">403.411</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">Resources.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">getSystem</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">().DisplayMetrics: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">DisplayMetrics</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">{density</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2.7</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, width</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1080</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, height</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2033</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, scaledDensity</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2.7</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, xdpi</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">403.411</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, ydpi</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">403.411</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是由于使用了<a href="https://github.com/JessYanCoding/AndroidAutoSize" target="_blank" rel="noopener noreferrer">AndroidAutoSize</a>适配方案后，APP 内部的 density 已经被改成了 2.88，而系统实际的 density 是 2.7。</p><p>又知道 android 中将像素和 dp 等单位转化的方法如下：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">// android.util.TypedValue</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> float</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> applyDimension</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> unit</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> float</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> value</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">                                       DisplayMetrics</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> metrics)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">    {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        switch</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> (unit) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        case</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> COMPLEX_UNIT_PX</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">            return</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> value</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        case</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> COMPLEX_UNIT_DIP</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">            return</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> value </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> metrics</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">density</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        case</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> COMPLEX_UNIT_SP</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">            return</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> value </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> metrics</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">scaledDensity</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        case</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> COMPLEX_UNIT_PT</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">            return</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> value </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> metrics</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">xdpi</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1.0f</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">72</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">)</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        case</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> COMPLEX_UNIT_IN</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">            return</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> value </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> metrics</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">xdpi</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        case</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> COMPLEX_UNIT_MM</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">            return</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> value </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> metrics</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">xdpi</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1.0f</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">25.4f</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">)</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">        }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        return</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分析可知，通过 getStatusBarHeight() 获取到的状态栏是系统的状态栏 69px（即 25dp），但当使用 APP 内部的 density=2.88 计算时就会只有 24dp，和实际的状态栏高度不一致，所以使用状态栏高度来控制布局的时候就会展示异常。</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><p><a href="http://jessyan.me/autosize-introduce/" target="_blank" rel="noopener noreferrer">骚年你的屏幕适配方式该升级了!-今日头条适配方案——jessyan</a></p><p><a href="https://mp.weixin.qq.com/s/d9QCoBP6kV9VSWvVldVVwA" target="_blank" rel="noopener noreferrer">一种极低成本的 Android 屏幕适配方式——字节跳动</a></p><p><a href="https://developer.android.google.cn/training/multiscreen/screendensities#top_of_page" target="_blank" rel="noopener noreferrer">支持不同的像素密度——Android Developers</a></p><p><a href="https://mp.weixin.qq.com/s/X-aL2vb4uEhqnLzU5wjc4Q" target="_blank" rel="noopener noreferrer">Android 目前稳定高效的 UI 适配方案——拉丁吴</a></p><p><a href="https://github.com/JessYanCoding/AndroidAutoSize" target="_blank" rel="noopener noreferrer">AndroidAutoSize</a></p><p><a href="https://github.com/gyf-dev/ImmersionBar/issues/298" target="_blank" rel="noopener noreferrer">请问两种获取屏幕密度的方式有什么区别，望解答多谢</a></p>`,43),h=[t];function l(k,p){return a(),s("div",null,h)}const d=i(e,[["render",l],["__file","76d69fc6.html.vue"]]),g=JSON.parse('{"path":"/posts/76d69fc6.html","title":"Android 今日头条屏幕适配方案的原理梳理","lang":"zh-CN","frontmatter":{"permalink":"/posts/76d69fc6.html","title":"Android 今日头条屏幕适配方案的原理梳理","tag":"android","abbrlink":"76d69fc6","date":"2020-10-13T03:13:18.000Z","updated":"2023-12-30T08:17:02.000Z","isOriginal":true,"description":"前言 最近在项目里面遇到了屏幕适配的问题，UI 要求 APP 在不同手机上展示效果和设计稿保持“像素级”同步，在对比了几种屏幕适配方案之后，选择了基于今日头条的AndroidAutoSize适配方案。 本文主要简单分析其适配原理，以及在实际使用中遇到的一个问题，需要更深入了解原理可以阅读文末参考文献。 正文 UI 给的设计稿一般都是以像素 px 为单位...","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/76d69fc6.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Android 今日头条屏幕适配方案的原理梳理"}],["meta",{"property":"og:description","content":"前言 最近在项目里面遇到了屏幕适配的问题，UI 要求 APP 在不同手机上展示效果和设计稿保持“像素级”同步，在对比了几种屏幕适配方案之后，选择了基于今日头条的AndroidAutoSize适配方案。 本文主要简单分析其适配原理，以及在实际使用中遇到的一个问题，需要更深入了解原理可以阅读文末参考文献。 正文 UI 给的设计稿一般都是以像素 px 为单位..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-04T03:36:59.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"android"}],["meta",{"property":"article:published_time","content":"2020-10-13T03:13:18.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-04T03:36:59.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Android 今日头条屏幕适配方案的原理梳理\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2020-10-13T03:13:18.000Z\\",\\"dateModified\\":\\"2024-06-04T03:36:59.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"正文","slug":"正文","link":"#正文","children":[]},{"level":2,"title":"获取状态栏高度的问题","slug":"获取状态栏高度的问题","link":"#获取状态栏高度的问题","children":[]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"createdTime":1653726847000,"updatedTime":1717472219000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3},{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":2}]},"readingTime":{"minutes":4.74,"words":1423},"filePathRelative":"_posts/Android今日头条屏幕适配方案的原理梳理.md","localizedDate":"2020年10月13日","excerpt":"<h2>前言</h2>\\n<p>最近在项目里面遇到了屏幕适配的问题，UI 要求 APP 在不同手机上展示效果和设计稿保持“像素级”同步，在对比了几种屏幕适配方案之后，选择了基于今日头条的<a href=\\"https://github.com/JessYanCoding/AndroidAutoSize\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">AndroidAutoSize</a>适配方案。</p>\\n<p>本文主要简单分析其适配原理，以及在实际使用中遇到的一个问题，需要更深入了解原理可以阅读文末参考文献。</p>\\n<h2>正文</h2>\\n<p>UI 给的设计稿一般都是以像素 px 为单位，而在 Android 开发中官方推荐的使用的单位是 dp。</p>","autoDesc":true}');export{d as comp,g as data};