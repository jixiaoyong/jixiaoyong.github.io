import{_ as p,r as e,o as c,c as o,a as n,b as a,d as t,e as l}from"./app-a6491e1b.js";const i={},u=l(`<h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h2><p>hook 是钩子的意思，hook 的过程是通过反射、代理等改变系统原有的行为以达到自己的目的。</p><p>本文主要是通过 hook android 中的 ActivityManagerService 和 Handler.CallBack，欺骗系统调起 activity 的过程，在调用 startActivity 时将 targetIntent 通过 proxy 伪装为 proxyIntent，等到通过系统验证，正式启动 activity 时，再讲 proxyIntent 恢复为 targetIntent，从而实现调用未在 AndroidManifest.xml 中注册的 activity。</p><blockquote><p>需要注意，本方法只在 Api&lt;26 下有效。具体原因见后面。</p></blockquote><h2 id="具体实现" tabindex="-1"><a class="header-anchor" href="#具体实现" aria-hidden="true">#</a> 具体实现</h2><h3 id="_1-新建-activity-等" tabindex="-1"><a class="header-anchor" href="#_1-新建-activity-等" aria-hidden="true">#</a> 1.新建 Activity 等</h3><p><code>IndexActivity.java</code>用于启动<code>targetIntent</code></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">Button</span><span class="token punctuation">)</span><span class="token function">findViewById</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>btn1<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setOnClickListener</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">View<span class="token punctuation">.</span>OnClickListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onClick</span><span class="token punctuation">(</span><span class="token class-name">View</span> v<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">//启动未在 AndroidManifest.xml 注册的 activity</span>
                mContext<span class="token punctuation">.</span><span class="token function">startActivity</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Intent</span><span class="token punctuation">(</span>mContext<span class="token punctuation">,</span><span class="token class-name">TargetActivity</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>TargetActivity.java</code> 和<code>ProxyActivity.java</code> 分别设置对应页面布局<code>setContentView(R.layout.activity_xxx);</code></p><p><code>HookApplication.java</code> 用于调用 hook 方法</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">HookApplication</span> <span class="token keyword">extends</span> <span class="token class-name">Application</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onCreate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">onCreate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Utils</span><span class="token punctuation">.</span><span class="token function">hookAms</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Utils</span><span class="token punctuation">.</span><span class="token function">hookHandle</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在<code>AndroidManifest.xml</code>中注册<code>IndexActivity</code>和<code>ProxyActivity</code>，Application 使用<code>HookApplication</code>。</p><h3 id="_2-utils-java-实现-hook-具体逻辑" tabindex="-1"><a class="header-anchor" href="#_2-utils-java-实现-hook-具体逻辑" aria-hidden="true">#</a> 2.Utils.java 实现 hook 具体逻辑</h3><p><code>Utils.hookAms()</code> 实现拦截 targetIntent 并发起 proxyIntent，欺骗系统对 activity 是否已注册的验证，其中 proxyIntent 通过<code>proxyIntent.putExtra(TARGET_KEY, targetIntent);</code> 方法携带 targetIntent。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//hookAms() 核心代码</span>
<span class="token class-name">Class</span> hookActivityManagerNative <span class="token operator">=</span> <span class="token class-name">Class</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">&quot;android.app.ActivityManagerNative&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">//在 api&gt;26 时无此变量：gDefault，该方法失效</span>
            <span class="token class-name">Field</span> gDefault <span class="token operator">=</span> hookActivityManagerNative<span class="token punctuation">.</span><span class="token function">getDeclaredField</span><span class="token punctuation">(</span><span class="token string">&quot;gDefault&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            gDefault<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">Object</span> object <span class="token operator">=</span> gDefault<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name">Class</span> hookSingleton <span class="token operator">=</span> <span class="token class-name">Class</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">&quot;android.util.Singleton&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">Field</span> mInstance <span class="token operator">=</span> hookSingleton<span class="token punctuation">.</span><span class="token function">getDeclaredField</span><span class="token punctuation">(</span><span class="token string">&quot;mInstance&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            mInstance<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name">Object</span> oldAms <span class="token operator">=</span> mInstance<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>object<span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token class-name">Class</span> hookIActivityManagerService <span class="token operator">=</span> <span class="token class-name">Class</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">&quot;android.app.IActivityManager&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">Object</span> proxy <span class="token operator">=</span> <span class="token class-name">Proxy</span><span class="token punctuation">.</span><span class="token function">newProxyInstance</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getContextClassLoader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                    <span class="token keyword">new</span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span>hookIActivityManagerService<span class="token punctuation">}</span><span class="token punctuation">,</span>
                    <span class="token keyword">new</span> <span class="token class-name">MAmsInvocationHandler</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span>oldAms<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

			<span class="token comment">//将原有的 ActivityManagerService 替换为我们自定义的</span>
            mInstance<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>object<span class="token punctuation">,</span>proxy<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在<code>MAmsInvocationHandler</code> 里面实现 targetIntent 和 proxy 的转换</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//MAmsInvocationHandler 核心代码</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MAmsInvocationHandler</span> <span class="token keyword">implements</span> <span class="token class-name">InvocationHandler</span><span class="token punctuation">{</span>
  <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">TARGET_KEY</span> <span class="token operator">=</span> <span class="token string">&quot;targetIntent&quot;</span><span class="token punctuation">;</span>
  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
  <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token class-name">Object</span> proxy<span class="token punctuation">,</span> <span class="token class-name">Method</span> method<span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Throwable</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token string">&quot;startActivity&quot;</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>method<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
            <span class="token class-name">Intent</span> targetIntent <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> args<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>args<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">instanceof</span> <span class="token class-name">Intent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    index <span class="token operator">=</span> i<span class="token punctuation">;</span>
                    targetIntent <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Intent</span><span class="token punctuation">)</span> args<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
                    <span class="token keyword">break</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>targetIntent <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">Intent</span> proxyIntent <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Intent</span><span class="token punctuation">(</span>mContext<span class="token punctuation">,</span> <span class="token class-name">ProxyActivity</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                proxyIntent<span class="token punctuation">.</span><span class="token function">putExtra</span><span class="token punctuation">(</span><span class="token constant">TARGET_KEY</span><span class="token punctuation">,</span> targetIntent<span class="token punctuation">)</span><span class="token punctuation">;</span>
                args<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> proxyIntent<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> method<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span>mOldAms<span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至此，已经对 activity.startActivity 做了拦截，所有的 targetIntent 都会被拦截，存储在 proxyIntent 中，以通过系统的检查。</p><p>接下来，通过系统检查后，<code>hookHandle()</code>通过重写 Handler.CallBack，对启动 proxyIntent 事件做拦截，使之启动 targetIntent 对应的 Activity。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//hookHandle() 核心代码</span>
<span class="token class-name">Class</span> activityThreadCls <span class="token operator">=</span> <span class="token class-name">Class</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">&quot;android.app.ActivityThread&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">Method</span> currentActivityThread <span class="token operator">=</span> activityThreadCls<span class="token punctuation">.</span><span class="token function">getDeclaredMethod</span><span class="token punctuation">(</span><span class="token string">&quot;currentActivityThread&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
currentActivityThread<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token class-name">Object</span> activityThread <span class="token operator">=</span> currentActivityThread<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token class-name">Field</span> mH <span class="token operator">=</span> activityThreadCls<span class="token punctuation">.</span><span class="token function">getDeclaredField</span><span class="token punctuation">(</span><span class="token string">&quot;mH&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
mH<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">Handler</span> handler <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Handler</span><span class="token punctuation">)</span> mH<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>activityThread<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">Field</span> callBack <span class="token operator">=</span> <span class="token class-name">Handler</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">.</span><span class="token function">getDeclaredField</span><span class="token punctuation">(</span><span class="token string">&quot;mCallback&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
callBack<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
callBack<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>handler<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">ActivityThreadHandlerCallBack</span><span class="token punctuation">(</span>handler<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中<code>ActivityThreadHandlerCallBack</code> 将返回我们自定义的 CallBack 以替换系统的，实现启动 targetIntent 而非 proxyIntent。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//ActivityThreadHandlerCallBack 核心代码</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ActivityThreadHandlerCallBack</span> <span class="token keyword">implements</span> <span class="token class-name">Handler<span class="token punctuation">.</span>Callback</span><span class="token punctuation">{</span>
   <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">handleMessage</span><span class="token punctuation">(</span><span class="token class-name">Message</span> msg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>msg<span class="token punctuation">.</span>what <span class="token operator">==</span> <span class="token number">100</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">handleLaunchActivity</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        mHandler<span class="token punctuation">.</span><span class="token function">handleMessage</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

  	<span class="token comment">//主要代码，在这里将 proxyIntent 转化为 targetIntent</span>
     <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">handleLaunchActivity</span><span class="token punctuation">(</span><span class="token class-name">Message</span> msg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Object</span> object <span class="token operator">=</span> msg<span class="token punctuation">.</span>obj<span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">Field</span> intent <span class="token operator">=</span> object<span class="token punctuation">.</span><span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getDeclaredField</span><span class="token punctuation">(</span><span class="token string">&quot;intent&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            intent<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">Intent</span> proxyIntent <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Intent</span><span class="token punctuation">)</span> intent<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>object<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">Intent</span> targetIntent <span class="token operator">=</span> proxyIntent<span class="token punctuation">.</span><span class="token function">getParcelableExtra</span><span class="token punctuation">(</span><span class="token class-name">MAmsInvocationHandler</span><span class="token punctuation">.</span><span class="token constant">TARGET_KEY</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>targetIntent <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                proxyIntent<span class="token punctuation">.</span><span class="token function">setComponent</span><span class="token punctuation">(</span>targetIntent<span class="token punctuation">.</span><span class="token function">getComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">NoSuchFieldException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">IllegalAccessException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到这里，就实现了启动通过已经注册了的 ProxyActivity 启动未注册 TargetActivity 的全过程。</p><p>主要思想是找到系统实现该过程的逻辑，在对应地方通过反射获取到对应变量，插入自己的逻辑，从而达到目的。</p><h2 id="附录" tabindex="-1"><a class="header-anchor" href="#附录" aria-hidden="true">#</a> 附录</h2><p>上面涉及到的代码路径：</p>`,26),k={href:"https://github.com/jixiaoyong/AndroidNote/tree/master/code/AndroidHook/20180116",target:"_blank",rel:"noopener noreferrer"},r=n("p",null,"参考了几篇文章，其中较为完整的一篇如下：",-1),d={href:"https://www.jianshu.com/p/69bfbda302df",target:"_blank",rel:"noopener noreferrer"};function v(m,b){const s=e("ExternalLinkIcon");return c(),o("div",null,[u,n("p",null,[n("a",k,[a("github 源代码路径"),t(s)])]),r,n("p",null,[n("a",d,[a("Android 插件化系列第（一）篇---Hook 技术之 Activity 的启动过程拦截"),t(s)])])])}const g=p(i,[["render",v],["__file","26eab50a.html.vue"]]);export{g as default};