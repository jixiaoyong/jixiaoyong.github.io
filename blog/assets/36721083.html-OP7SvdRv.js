import{_ as s,c as i,o as a,a as n}from"./app-BhWMVeaj.js";const l={},t=n(`<h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h2><p>在编码中常常会用到单例，来确保类有一个唯一的对象，一般情况下将构造方法私有化既可以实现，但当考虑到多线程时事情会变得有些复杂，本文讨论的正是几种多线程的情况下实现单例的方法。</p><h2 id="_1-普通单例" tabindex="-1"><a class="header-anchor" href="#_1-普通单例"><span>1.普通单例</span></a></h2><p>私有化构造方法，对外提供一个公有、静态的方法，在其内部判断类对象是否已经存在，否的话生成类对象再返回。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	private</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	private</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASinleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">		System</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;ASingleton init!</span><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> getInstance</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(as </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {              </span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//tag1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">			as </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">();    </span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//tag2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">		}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		return</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> as;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是，在考虑多线程时，由于 java 代码是一行行进行的，假设有两个线程 t1、t2，当 as 为 null 的时候 t1 执行到 tag1 位置，判断为 true，于是准备执行 tag2，就在此时，cup 调度 t2 开始执行 tag1，此时 t1 尚未执行 tag2，所以在 t2 中 tag1 判断为 true,t2 也开始执行 tag2 生成一个新对象,这样当 t1 再次执行 tag2 时就会再生成一个新对象，这样就同时存在多个类的对象。</p><h2 id="_2-同步锁" tabindex="-1"><a class="header-anchor" href="#_2-同步锁"><span>2.同步锁</span></a></h2><p>对上面的代码稍作优化,可以看到使用了 synchronized，对判断是否需要初始化进行了同步锁，这样当线程 t1 访问时，语句被锁定，t2 运行到这里时，只能等 t1 运行完这段语句并释放之后，才能继续访问，此时 as 已经被赋予了对象，所以不会再继续新建，这样就保证了单例。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	private</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	private</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASinleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">		System</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;ASingleton init!</span><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> getInstance</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		synchronized</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">			if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (as </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">				as </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">			}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">		}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		return</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> as;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是这样也存在一个问题，每个线程每次获取单例都要进入同步锁，这样累计下来必然影响效率。</p><h2 id="_3-双重检查锁定" tabindex="-1"><a class="header-anchor" href="#_3-双重检查锁定"><span>3.双重检查锁定</span></a></h2><p>那么在判断 as 为 null 后，对 as 的初始化进行同步锁呢？</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> getInstance</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">() {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		if</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> (as </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">			synchronized</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">				if</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> (as </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">) {           </span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//tag1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">					as </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  //tag2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">				}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">			}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">		}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		return</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">	}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样子，当判断 as 为 null 时，才会进行初始化，同时由于初始化过程加锁，所以 t1 和 t2 无法同时访问初始化语句 tag2，也保证了只能创建一个单例。</p><p>看起来很完美，但是由于 java 语言的特性，在该段代码编译为汇编语言时，上述方法会被编译为类似下面的过程：</p><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" data-title="c" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">判断as是否为null</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">令as </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> //注意此时只是为as分配了内存，并未执行ASingleton的构造方法</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">3.</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">开始执行ASingleton构造方法，as有了初始化的值</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">4.</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">返回as</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么，当 t1 执行到语句 2，而 t2 开始执行语句 1 时，此时由于 as 已经分配了内存不为 null，所以 t2 直接执行语句 4，此时 t2 获取到的是一个没有执行构造方法的 ASingleton 对象，显然这样十分危险。在线程复杂的情况下很容易出现问题。</p><p>下面提供了两个结局思路，为简便起见，将其简单分为“饿汉模式”和“懒汉模式”（其实上述方法也可分为这两个模式，but，who cares...）。</p><h2 id="_4-饿汉模式实现单例" tabindex="-1"><a class="header-anchor" href="#_4-饿汉模式实现单例"><span>4.饿汉模式实现单例</span></a></h2><p>饿汉模式，即在声明的时候就将对象初始化。</p><p>这样实现单例的原理是类的静态变量全局唯一。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	private</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> as </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	private</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASinleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">		System</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;ASingleton init!</span><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> getInstance</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		return</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> as;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是这样仍然有个问题，可能在用到 ASingleton 类的时候，并不需要立即获取到其单例，在这种情况下，饿汉模式仍然有浪费资源的嫌疑。</p><h2 id="_5-懒汉模式实现单例" tabindex="-1"><a class="header-anchor" href="#_5-懒汉模式实现单例"><span>5.懒汉模式实现单例</span></a></h2><p>懒汉模式，只有要用到该实例时，才获取该单例。</p><p>这次我们用到的时静态内部类，静态内部类与类的静态变量不同，只有明确调用静态内部类的时候才会初始化静态内部类。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> ASingletonFactory</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	static</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> as </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		private</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> ASinleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">			System</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;ASingleton init!</span><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">		}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> getInstance</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">		return</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> ASingleton</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">as</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>嗯，至此已经完成了 java 实现单例的绝大部分方法，但其实还有一张更加简洁的方法，那就是用 enmu 实现。</p><h2 id="_6-enmu-实现单例" tabindex="-1"><a class="header-anchor" href="#_6-enmu-实现单例"><span>6.enmu 实现单例</span></a></h2><p>由于枚举类型的对象是唯一的，所以是实现单例的较优选择。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">enum</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> SingletonEnum</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">	INSTANCE</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">	public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> dosth</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(){</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是，android 开发者要注意，枚举占用的内存是普通单例的两倍多，所以，并不推荐在 android 中使用。</p><p>关于枚举的更详细资料，参阅(深入理解 Java 枚举类型(enum))[<a href="http://blog.csdn.net/javazejian/article/details/71333103#t7" target="_blank" rel="noopener noreferrer">http://blog.csdn.net/javazejian/article/details/71333103#t7</a>]</p>`,33),e=[t];function h(k,p){return a(),i("div",null,e)}const r=s(l,[["render",h],["__file","36721083.html.vue"]]),g=JSON.parse('{"path":"/posts/36721083.html","title":"Java 创建线程安全的单例 Singleton","lang":"zh-CN","frontmatter":{"permalink":"/posts/36721083.html","title":"Java 创建线程安全的单例 Singleton","tag":"java","abbrlink":"36721083","date":"2018-02-14T10:34:16.000Z","updated":"2023-12-30T08:17:02.000Z","isOriginal":true,"description":"简介 在编码中常常会用到单例，来确保类有一个唯一的对象，一般情况下将构造方法私有化既可以实现，但当考虑到多线程时事情会变得有些复杂，本文讨论的正是几种多线程的情况下实现单例的方法。 1.普通单例 私有化构造方法，对外提供一个公有、静态的方法，在其内部判断类对象是否已经存在，否的话生成类对象再返回。 但是，在考虑多线程时，由于 java 代码是一行行进行...","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/36721083.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Java 创建线程安全的单例 Singleton"}],["meta",{"property":"og:description","content":"简介 在编码中常常会用到单例，来确保类有一个唯一的对象，一般情况下将构造方法私有化既可以实现，但当考虑到多线程时事情会变得有些复杂，本文讨论的正是几种多线程的情况下实现单例的方法。 1.普通单例 私有化构造方法，对外提供一个公有、静态的方法，在其内部判断类对象是否已经存在，否的话生成类对象再返回。 但是，在考虑多线程时，由于 java 代码是一行行进行..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-04T03:36:59.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"java"}],["meta",{"property":"article:published_time","content":"2018-02-14T10:34:16.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-04T03:36:59.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java 创建线程安全的单例 Singleton\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2018-02-14T10:34:16.000Z\\",\\"dateModified\\":\\"2024-06-04T03:36:59.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"简介","slug":"简介","link":"#简介","children":[]},{"level":2,"title":"1.普通单例","slug":"_1-普通单例","link":"#_1-普通单例","children":[]},{"level":2,"title":"2.同步锁","slug":"_2-同步锁","link":"#_2-同步锁","children":[]},{"level":2,"title":"3.双重检查锁定","slug":"_3-双重检查锁定","link":"#_3-双重检查锁定","children":[]},{"level":2,"title":"4.饿汉模式实现单例","slug":"_4-饿汉模式实现单例","link":"#_4-饿汉模式实现单例","children":[]},{"level":2,"title":"5.懒汉模式实现单例","slug":"_5-懒汉模式实现单例","link":"#_5-懒汉模式实现单例","children":[]},{"level":2,"title":"6.enmu 实现单例","slug":"_6-enmu-实现单例","link":"#_6-enmu-实现单例","children":[]}],"git":{"createdTime":1653726847000,"updatedTime":1717472219000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3},{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":2}]},"readingTime":{"minutes":4.07,"words":1220},"filePathRelative":"_posts/Java创建线程安全的单例Singleton.md","localizedDate":"2018年2月14日","excerpt":"<h2>简介</h2>\\n<p>在编码中常常会用到单例，来确保类有一个唯一的对象，一般情况下将构造方法私有化既可以实现，但当考虑到多线程时事情会变得有些复杂，本文讨论的正是几种多线程的情况下实现单例的方法。</p>\\n<h2>1.普通单例</h2>\\n<p>私有化构造方法，对外提供一个公有、静态的方法，在其内部判断类对象是否已经存在，否的话生成类对象再返回。</p>\\n<div class=\\"language-java line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"java\\" data-title=\\"java\\" style=\\"--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes github-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\">class</span><span style=\\"--shiki-light:#6F42C1;--shiki-dark:#E5C07B\\"> ASingleton</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">{</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\">\\tprivate</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\"> static</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E5C07B\\"> ASingleton</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E06C75\\"> as</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">;</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\">\\tprivate</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\"> void</span><span style=\\"--shiki-light:#6F42C1;--shiki-dark:#61AFEF\\"> ASinleton</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">()</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\"> {</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#24292E;--shiki-dark:#E5C07B\\">\\t\\tSystem</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">.</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E5C07B\\">out</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">.</span><span style=\\"--shiki-light:#6F42C1;--shiki-dark:#61AFEF\\">print</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">(</span><span style=\\"--shiki-light:#032F62;--shiki-dark:#98C379\\">\\"ASingleton init!</span><span style=\\"--shiki-light:#005CC5;--shiki-dark:#56B6C2\\">\\\\n</span><span style=\\"--shiki-light:#032F62;--shiki-dark:#98C379\\">\\"</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">);</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">\\t}</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\">\\tpublic</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\"> static</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#E5C07B\\"> ASingleton</span><span style=\\"--shiki-light:#6F42C1;--shiki-dark:#61AFEF\\"> getInstance</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">()</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\"> {</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\">\\t\\tif</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">(as </span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#56B6C2\\">==</span><span style=\\"--shiki-light:#005CC5;--shiki-dark:#D19A66\\"> null</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">) {              </span><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">//tag1</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">\\t\\t\\tas </span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#56B6C2\\">=</span><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\"> new</span><span style=\\"--shiki-light:#6F42C1;--shiki-dark:#61AFEF\\"> ASingleton</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">();    </span><span style=\\"--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic\\">//tag2</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">\\t\\t}</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#D73A49;--shiki-dark:#C678DD\\">\\t\\treturn</span><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\"> as;</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">\\t}</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#24292E;--shiki-dark:#ABB2BF\\">}</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{r as comp,g as data};