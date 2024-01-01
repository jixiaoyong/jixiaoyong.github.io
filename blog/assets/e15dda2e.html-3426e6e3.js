import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o,c as i,a as n,b as a,d as e,e as c}from"./app-b6af1138.js";const l={},u=c(`<h1 id="compose-屏幕适配" tabindex="-1"><a class="header-anchor" href="#compose-屏幕适配" aria-hidden="true">#</a> Compose 屏幕适配</h1><p>一种<strong>Compose</strong>中屏幕适配的解决方案，灵感参考<em>头条屏幕适配</em>、<em>AndroidAutoSize</em>等，以设计稿宽度和屏幕水平方法大小为准，等比拉伸控件大小。</p><p>后文附有本方案的 Kotlin 语言实现，使用只需要两个步骤即可：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code><span class="token comment">// 1 初始化</span>
<span class="token keyword">class</span> MainApp <span class="token operator">:</span> <span class="token function">Application</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">override</span> <span class="token keyword">fun</span> <span class="token function">onCreate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">onCreate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        SizeEtx<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token number">375</span><span class="token punctuation">)</span> <span class="token comment">// 375 为设计稿宽度</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 2 使用</span>
<span class="token function">size</span><span class="token punctuation">(</span>width <span class="token operator">=</span> <span class="token number">9</span><span class="token punctuation">.</span>composeDp<span class="token punctuation">,</span> height <span class="token operator">=</span> <span class="token number">16</span><span class="token punctuation">.</span>composeDp<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="主要的设计思想" tabindex="-1"><a class="header-anchor" href="#主要的设计思想" aria-hidden="true">#</a> 主要的设计思想</h1><p>假设如下变量：设计稿总宽度<code>dpx</code>，控件在设计稿中的大小<code>n</code>，屏幕的实际水平 dp 大小<code>rdp</code>，以及我们需要求得的控件在设备中的 dp 值<code>m</code>。</p><p>那么我们不难得到以下方程：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code>n <span class="token operator">/</span> dpx <span class="token operator">=</span> m <span class="token operator">/</span> rdp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>也就可以推导出：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code>m <span class="token operator">=</span> n <span class="token operator">*</span> <span class="token punctuation">(</span>rdp <span class="token operator">/</span> dpx<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>上述值中，只有屏幕水平 dp 值<code>rdp</code>还是未知的，又根据**（<code>density</code> 在每个设备上都是固定的，<code>DPI</code> / 160 = <code>density</code>，屏幕的总 px 宽度<code>wpx</code> / <code>density</code> = 屏幕的总 dp 宽度<code>rdp</code>）**可知：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code>rdp <span class="token operator">=</span> wpx <span class="token operator">/</span> density
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>所以，我们可以推导出：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code>m <span class="token operator">=</span> n <span class="token operator">*</span> <span class="token punctuation">(</span>rdp <span class="token operator">/</span> dpx<span class="token punctuation">)</span>
  <span class="token operator">=</span> n <span class="token operator">*</span> <span class="token punctuation">(</span> wpx <span class="token operator">/</span> density <span class="token punctuation">)</span> <span class="token operator">/</span> dpx
  <span class="token operator">=</span> n <span class="token operator">*</span> wpx <span class="token operator">/</span> <span class="token punctuation">(</span>density <span class="token operator">*</span> dpx<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到这里，等式后面的所有数据都为已知或者在 app 运行时可知，由此我们可以计算出设计稿中的控件在 Compose 中对应的 dp 大小。</p><p>下面是以上思路的 kotlin 实现：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code><span class="token keyword">import</span> android<span class="token punctuation">.</span>content<span class="token punctuation">.</span>Context
<span class="token keyword">import</span> android<span class="token punctuation">.</span>content<span class="token punctuation">.</span>res<span class="token punctuation">.</span>Configuration
<span class="token keyword">import</span> android<span class="token punctuation">.</span>content<span class="token punctuation">.</span>res<span class="token punctuation">.</span>Resources
<span class="token keyword">import</span> android<span class="token punctuation">.</span>graphics<span class="token punctuation">.</span>Point
<span class="token keyword">import</span> android<span class="token punctuation">.</span>os<span class="token punctuation">.</span>Build
<span class="token keyword">import</span> android<span class="token punctuation">.</span>view<span class="token punctuation">.</span>WindowManager
<span class="token keyword">import</span> androidx<span class="token punctuation">.</span>compose<span class="token punctuation">.</span>ui<span class="token punctuation">.</span>unit<span class="token punctuation">.</span>Dp

<span class="token comment">/**
 * @author : jixiaoyong
 * @description：Compose 屏幕适配方案
 *
 * 根据设计稿宽度（设计稿宽度对应设备水平方向）和设计稿对应物体大小，计算实际应该填写的 dp
 *
 * 使用：
 * 在 Application onCreate() 方法中执行
 * SizeEtx.init(this, 375)
 * 其中 375 位设计稿屏幕宽度，然后在代码中使用 width(315.composeDp) 作为大小单位即可，
 * 其中 315 为设计稿中的控件大小
 *
 * 计算方式为：
 * wpx 屏幕实际像素宽度
 * dpx 设计稿屏幕宽度
 * n 控件设计稿中的宽度（dp、px 都可，与 dpx 单位保持一致）
 * m 控件在 app 中对应的 dp
 * rpx 控件在屏幕中应该展示的像素大小
 * 已知条件：dp = px / density
 * （density 在每个设备上都是固定的，DPI / 160 = density，屏幕的总 px 宽度 / density = 屏幕的总 dp 宽度）
 *
 * DisplayMetrics#density 就是上述的 density
 * DisplayMetrics#densityDpi 就是上述的 dpi
 *
 * 综上得出如下结论 (以竖屏情况下屏幕宽度为例)：
 * 屏幕宽度总 dp：rdp = wpx / density
 * m / rdp = n / dpx
 * 那么，m = (rdp / dpx) * n
 * 其中 (rdp / dpx) 被我们当做设计稿中控件大小与设备中控件 dp 大小之间的缩放系数：dpWidthScale
 * 所以：m = dpWidthScale * n
 *
 * @email : jixiaoyong1995@gmail.com
 * @date : 2021/8/2
 */</span>
<span class="token keyword">class</span> SizeEtx <span class="token keyword">private</span> <span class="token keyword">constructor</span><span class="token punctuation">(</span>context<span class="token operator">:</span> Context<span class="token punctuation">,</span> dpx<span class="token operator">:</span> Int<span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token keyword">init</span> <span class="token punctuation">{</span>
        <span class="token keyword">val</span> density <span class="token operator">=</span> Resources<span class="token punctuation">.</span><span class="token function">getSystem</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>displayMetrics<span class="token punctuation">.</span>density
        <span class="token keyword">var</span> wpx <span class="token operator">=</span> Resources<span class="token punctuation">.</span><span class="token function">getSystem</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>displayMetrics<span class="token punctuation">.</span>widthPixels
        dpWidthScale <span class="token operator">=</span> wpx<span class="token punctuation">.</span><span class="token function">toFloat</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token punctuation">(</span>dpx <span class="token operator">*</span> density<span class="token punctuation">)</span>
        dpHeightScale <span class="token operator">=</span>
            <span class="token function">getScreenRealHeightPx</span><span class="token punctuation">(</span>context<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toFloat</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token punctuation">(</span>dpx <span class="token operator">*</span> density<span class="token punctuation">)</span>
        pxWidthScale <span class="token operator">=</span> wpx<span class="token punctuation">.</span><span class="token function">toFloat</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> dpx<span class="token punctuation">.</span><span class="token function">toFloat</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token comment">// 以下数据为 Redmi Note 5 的测试数据</span>
<span class="token comment">//        &quot;getScreenRealHeight \${getScreenRealHeightPx(context)}&quot;.logd() // 2160，实际设备高度为 2160</span>
<span class="token comment">//        &quot;Resources.getSystem().displayMetrics.heightPixels \${Resources.getSystem().displayMetrics.heightPixels}&quot;.logd() // 2033，实际设备高度为 2160</span>
<span class="token comment">//        &quot;Resources.getSystem().displayMetrics.density \${Resources.getSystem().displayMetrics.density}&quot;.logd() // 2.7</span>
<span class="token comment">//        &quot;Resources.getSystem().displayMetrics.densityDpi \${Resources.getSystem().displayMetrics.densityDpi}&quot;.logd() // 432</span>
    <span class="token punctuation">}</span>

    <span class="token comment">/**
     * 获得屏幕真实高度（包含底部导航栏）
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">fun</span> <span class="token function">getScreenRealHeightPx</span><span class="token punctuation">(</span>context<span class="token operator">:</span> Context<span class="token punctuation">)</span><span class="token operator">:</span> Int <span class="token punctuation">{</span>
        <span class="token keyword">val</span> windowManager <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token function">getSystemService</span><span class="token punctuation">(</span>Context<span class="token punctuation">.</span>WINDOW_SERVICE<span class="token punctuation">)</span> <span class="token keyword">as</span> WindowManager
        <span class="token keyword">val</span> display <span class="token operator">=</span> windowManager<span class="token punctuation">.</span>defaultDisplay
        <span class="token keyword">val</span> outPoint <span class="token operator">=</span> <span class="token function">Point</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>Build<span class="token punctuation">.</span>VERSION<span class="token punctuation">.</span>SDK_INT <span class="token operator">&gt;=</span> <span class="token number">19</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 可能有虚拟按键的情况</span>
            display<span class="token punctuation">.</span><span class="token function">getRealSize</span><span class="token punctuation">(</span>outPoint<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">// 不可能有虚拟按键</span>
            display<span class="token punctuation">.</span><span class="token function">getSize</span><span class="token punctuation">(</span>outPoint<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 手机屏幕真实高度</span>
        <span class="token keyword">return</span> outPoint<span class="token punctuation">.</span>y
    <span class="token punctuation">}</span>

    <span class="token keyword">companion</span> <span class="token keyword">object</span> <span class="token punctuation">{</span>
        <span class="token comment">/**
         * 初始化大小适配工具类
         * @param context
         * @param dpx 设计稿中的屏幕宽度，例如 375，在使用到本工具的所有地方，都应该以此宽度为准来获取其他控件的大小
         */</span>
        <span class="token keyword">fun</span> <span class="token keyword">init</span><span class="token punctuation">(</span>context<span class="token operator">:</span> Context<span class="token punctuation">,</span> dpx<span class="token operator">:</span> Int<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">SizeEtx</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span> dpx<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">var</span> dpWidthScale <span class="token operator">=</span> <span class="token number">1.0f</span>
        <span class="token keyword">var</span> dpHeightScale <span class="token operator">=</span> <span class="token number">1.0f</span>
        <span class="token keyword">var</span> pxWidthScale <span class="token operator">=</span> <span class="token number">1.0f</span>
        <span class="token keyword">var</span> pxHeightScale <span class="token operator">=</span> <span class="token number">1.0f</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// Compose 屏幕适配方案</span>
<span class="token comment">/**
 * 获取 Compose 中对应的 dp，输入值为设计稿中对应的控件大小
 */</span>
<span class="token keyword">inline</span> <span class="token keyword">val</span> Number<span class="token punctuation">.</span>composeDp<span class="token operator">:</span> Dp
    <span class="token keyword">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">val</span> isPortrait <span class="token operator">=</span> <span class="token function">isPortrait</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token function">Dp</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">toFloat</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>isPortrait<span class="token punctuation">)</span> SizeEtx<span class="token punctuation">.</span>dpWidthScale <span class="token keyword">else</span> SizeEtx<span class="token punctuation">.</span>dpHeightScale<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

<span class="token comment">/**
 * 获取 Compose 中对应的 px，输入值为设计稿中对应的控件大小
 */</span>
<span class="token keyword">inline</span> <span class="token keyword">val</span> Number<span class="token punctuation">.</span>composePx<span class="token operator">:</span> Int
    <span class="token keyword">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">val</span> isPortrait <span class="token operator">=</span> <span class="token function">isPortrait</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">toFloat</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>isPortrait<span class="token punctuation">)</span> SizeEtx<span class="token punctuation">.</span>pxWidthScale <span class="token keyword">else</span> SizeEtx<span class="token punctuation">.</span>pxHeightScale<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toInt</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

<span class="token comment">// 是否竖屏</span>
<span class="token keyword">fun</span> <span class="token function">isPortrait</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span>
    Resources<span class="token punctuation">.</span><span class="token function">getSystem</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>configuration<span class="token punctuation">.</span>orientation <span class="token operator">==</span> Configuration<span class="token punctuation">.</span>ORIENTATION_PORTRAIT
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h1>`,18),d={href:"https://github.com/JessYanCoding/AndroidAutoSize",target:"_blank",rel:"noopener noreferrer"},r={href:"https://mp.weixin.qq.com/s/d9QCoBP6kV9VSWvVldVVwA",target:"_blank",rel:"noopener noreferrer"};function k(v,m){const s=p("ExternalLinkIcon");return o(),i("div",null,[u,n("p",null,[n("a",d,[a("AndroidAutoSize"),e(s)])]),n("p",null,[n("a",r,[a("一种极低成本的 Android 屏幕适配方式"),e(s)])])])}const x=t(l,[["render",k],["__file","e15dda2e.html.vue"]]);export{x as default};
