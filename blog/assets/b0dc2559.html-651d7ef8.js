import{_ as p,r as o,o as c,c as l,a as n,b as s,d as e,e as t}from"./app-b003f4e2.js";const i={},r=n("h2",{id:"前言",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#前言","aria-hidden":"true"},"#"),s(" 前言")],-1),u=n("p",null,"Messenger 是 Android 中用于 IPC 的方式之一，使用 Handler 发送有序消息队列，底层是通过 AIDL 调用 Binder 实现。",-1),d=n("p",null,"Messenger 只用于服务端和客户端串行的传递消息，如果大量并发或者跨进程调用服务端的方法，就需要考虑 AIDL 而非 Messenger。",-1),k={href:"https://jixiaoyong.github.io/blog/posts/ad4c562c/",target:"_blank",rel:"noopener noreferrer"},v=n("p",null,"主要使用到的文件：",-1),m={href:"http://androidxref.com/9.0.0_r3/xref/frameworks/base/core/java/android/os/IMessenger.aidl",target:"_blank",rel:"noopener noreferrer"},g={href:"http://androidxref.com/9.0.0_r3/xref/frameworks/base/core/java/android/os/Messenger.java",target:"_blank",rel:"noopener noreferrer"},b={href:"http://androidxref.com/9.0.0_r3/xref/frameworks/base/core/java/android/os/Handler.java",target:"_blank",rel:"noopener noreferrer"},h=t(`<h2 id="解析" tabindex="-1"><a class="header-anchor" href="#解析" aria-hidden="true">#</a> 解析</h2><p>一个典型的 Messenger 服务如下所示：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code><span class="token keyword">class</span> MessengerService <span class="token operator">:</span> <span class="token function">Service</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token keyword">val</span> messenger <span class="token operator">=</span> <span class="token function">Messenger</span><span class="token punctuation">(</span><span class="token function">MessengerHandler</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

    <span class="token keyword">override</span> <span class="token keyword">fun</span> <span class="token function">onBind</span><span class="token punctuation">(</span>intent<span class="token operator">:</span> Intent<span class="token operator">?</span><span class="token punctuation">)</span><span class="token operator">:</span> IBinder<span class="token operator">?</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> messenger<span class="token punctuation">.</span>binder
    <span class="token punctuation">}</span>

    <span class="token comment">//可以从客户端的得到的 Messenger 中取出该 Handler，并实现客户端-&gt;服务端通信</span>
    <span class="token keyword">class</span> MessengerHandler <span class="token operator">:</span> <span class="token function">Handler</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">override</span> <span class="token keyword">fun</span> <span class="token function">handleMessage</span><span class="token punctuation">(</span>msg<span class="token operator">:</span> Message<span class="token operator">?</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">handleMessage</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span>
            <span class="token comment">//客户端的 Messenger，用于服务端-&gt;客户端通信，可选</span>
            <span class="token keyword">val</span> client <span class="token operator">=</span> msg<span class="token operator">?</span><span class="token punctuation">.</span>replyTo
            client<span class="token operator">?</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>Message<span class="token punctuation">.</span><span class="token function">obtain</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以看到使用 Handler 创建一个 Messenger，进入到源码看一下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">IMessenger</span> mTarget<span class="token punctuation">;</span>
<span class="token keyword">public</span> <span class="token class-name">Messenger</span><span class="token punctuation">(</span><span class="token class-name">Handler</span> target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    mTarget <span class="token operator">=</span> target<span class="token punctuation">.</span><span class="token function">getIMessenger</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们看到，在这里创建了一个新的与给定的 Handler 绑定在一起的 Messenger，再看看<code>getIMessenger()</code>方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">final</span> <span class="token class-name">IMessenger</span> <span class="token function">getIMessenger</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>mQueue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>mMessenger <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> mMessenger<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        mMessenger <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessengerImpl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> mMessenger<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">class</span> <span class="token class-name">MessengerImpl</span> <span class="token keyword">extends</span> <span class="token class-name">IMessenger<span class="token punctuation">.</span>Stub</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token class-name">Message</span> msg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        msg<span class="token punctuation">.</span>sendingUid <span class="token operator">=</span> <span class="token class-name">Binder</span><span class="token punctuation">.</span><span class="token function">getCallingUid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Handler</span><span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">sendMessage</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//使用 Handler 发送消息</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们可以看到<code>getIMessenger()</code>方法会创建一个 MessengerImpl 对象，而这个对象</p><p>实现了<code>send()</code>方法，也证实了我们之前的一个观点——Messenger 底层是使用 Handler 发送消息。</p><p>同时，看到 MessengerImpl 继承的 IMessenger.Stub 类我们可以联想到这里应该有一个 AIDL 实现：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// /frameworks/base/core/java/android/os/IMessenger.aidl</span>
<span class="token keyword">package</span> <span class="token namespace">android<span class="token punctuation">.</span>os</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">android<span class="token punctuation">.</span>os<span class="token punctuation">.</span></span><span class="token class-name">Message</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** <span class="token keyword">@hide</span> */</span>
oneway <span class="token keyword">interface</span> <span class="token class-name">IMessenger</span> <span class="token punctuation">{</span>
    <span class="token keyword">void</span> <span class="token function">send</span><span class="token punctuation">(</span>in <span class="token class-name">Message</span> msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),f=n("p",null,[n("code",null,"oneway"),s(" 关键字用于修改远程调用的行为。使用该关键字时，远程调用不会阻塞；它只是发送事务数据并立即返回。接口的实现最终接收此调用时，是以正常远程调用形式将其作为来自 "),n("code",null,"Binder"),s(" 线程池的常规调用进行接收。如果 "),n("code",null,"oneway"),s(" 用于本地调用，则不会有任何影响，调用仍是同步调用")],-1),y={href:"https://developer.android.google.cn/guide/components/aidl?hl=zh-cn",target:"_blank",rel:"noopener noreferrer"},M=t(`<p>这也就解释了在服务的<code>onBind(intent: Intent?)</code>方法中，我们可以直接使用<code>messenger.binder</code>获取到 Binder 对象的原因。</p><p>再看看 Messenger 客户端的实现：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code><span class="token keyword">private</span> <span class="token keyword">lateinit</span> <span class="token keyword">var</span> messenger<span class="token operator">:</span> Messenger<span class="token comment">//服务端的 Messenger</span>
<span class="token keyword">private</span> <span class="token keyword">val</span> replyMessenger<span class="token operator">:</span> Messenger <span class="token operator">=</span> <span class="token function">Messenger</span><span class="token punctuation">(</span><span class="token function">ReplyHandler</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token comment">//客户端的 Messenger，用于服务端-&gt;客户端通信，可选</span>
<span class="token keyword">private</span> <span class="token keyword">val</span> mServiceConnection <span class="token operator">=</span> <span class="token keyword">object</span> <span class="token operator">:</span> ServiceConnection <span class="token punctuation">{</span>
    <span class="token keyword">override</span> <span class="token keyword">fun</span> <span class="token function">onServiceDisconnected</span><span class="token punctuation">(</span>name<span class="token operator">:</span> ComponentName<span class="token operator">?</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">override</span> <span class="token keyword">fun</span> <span class="token function">onServiceConnected</span><span class="token punctuation">(</span>name<span class="token operator">:</span> ComponentName<span class="token operator">?</span><span class="token punctuation">,</span> service<span class="token operator">:</span> IBinder<span class="token operator">?</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        messenger <span class="token operator">=</span> <span class="token function">Messenger</span><span class="token punctuation">(</span>service<span class="token punctuation">)</span><span class="token comment">//注意这里的构造方法传入的是 IBinder 对象</span>
        <span class="token keyword">val</span> message <span class="token operator">=</span> Message<span class="token punctuation">.</span><span class="token function">obtain</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span>
        message<span class="token punctuation">.</span>replyTo <span class="token operator">=</span> replyMessenger
        <span class="token keyword">val</span> <span class="token keyword">data</span> <span class="token operator">=</span> <span class="token function">Bundle</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">data</span><span class="token punctuation">.</span><span class="token function">putString</span><span class="token punctuation">(</span><span class="token string-literal singleline"><span class="token string">&quot;msg&quot;</span></span><span class="token punctuation">,</span> <span class="token string-literal singleline"><span class="token string">&quot;Hello World&quot;</span></span><span class="token punctuation">)</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            messenger<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token comment">//使用服务端的 Messenger 向服务端发送消息</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token operator">:</span> Exception<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以注意到在客户端通过<code>Messenger(IBinder target)</code>取得服务端的 Messenger，而这里的 IBinder 对象则是通过服务端的 Messenger 的<code>getBinder()</code>获取的：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">Messenger</span><span class="token punctuation">(</span><span class="token class-name">IBinder</span> target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    mTarget <span class="token operator">=</span> <span class="token class-name">IMessenger<span class="token punctuation">.</span>Stub</span><span class="token punctuation">.</span><span class="token function">asInterface</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),w=n("code",null,"Stub.asInterface()",-1),_={href:"http://jixiaoyong.github.io/blog/posts/88d0bcd1/",target:"_blank",rel:"noopener noreferrer"},I=n("p",null,[s("而通过比较 "),n("code",null,"Messenger(IBinder target)"),s("和"),n("code",null,"Messenger(Handler target)"),s("两个构造方法我们也可以知道，两个方法都只是用来初始化了"),n("code",null,"IMessenger mTarget"),s("对象，这也就解释了在服务端和客户端可以通过两个不同的构造方法获取到有同样功能的 Messenger。")],-1),x=n("h2",{id:"参考资料",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#参考资料","aria-hidden":"true"},"#"),s(" 参考资料")],-1),j=n("p",null,"《Android 开发艺术探索》",-1),B={href:"https://developer.android.google.cn/guide/components/aidl?hl=zh-cn",target:"_blank",rel:"noopener noreferrer"};function H(S,C){const a=o("ExternalLinkIcon");return c(),l("div",null,[r,u,d,n("p",null,[s("Messenger 的使用可以参考"),n("a",k,[s("这篇文章"),e(a)]),s(",本文主要探索一下 Messenger 源码实现。")]),v,n("p",null,[n("a",m,[s("IMessenger.aidl"),e(a)])]),n("p",null,[n("a",g,[s("Messenger.java"),e(a)])]),n("p",null,[n("a",b,[s("Handler.java"),e(a)])]),h,n("blockquote",null,[f,n("p",null,[n("a",y,[s("https://developer.android.google.cn/guide/components/aidl?hl=zh-cn"),e(a)])])]),M,n("p",null,[w,s("方法我们在"),n("a",_,[s("之前的文章"),e(a)]),s("中介绍过，他会根据客户端和服务端是否在同一进程而决定返回 Stub 实例还是 Proxy 类实例以实现跨进程通信。")]),I,x,j,n("p",null,[n("a",B,[s("Android 接口定义语言 (AIDL)"),e(a)])])])}const A=p(i,[["render",H],["__file","b0dc2559.html.vue"]]);export{A as default};