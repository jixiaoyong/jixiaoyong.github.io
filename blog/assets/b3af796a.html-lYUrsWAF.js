import{_ as n,c as l,o as t,b as s,d as i,a}from"./app-CnRe2vo3.js";const e={},h=s("h2",{id:"前言",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#前言"},[s("span",null,"前言")])],-1),p=s("p",null,[i("堆是一种特殊的二叉树，用他实现的优先级队列插入和删除时间复杂度都是"),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"L"),s("mi",null,"o"),s("mi",null,"g"),s("mi",null,"N"),s("mo",{stretchy:"false"},")")]),s("annotation",{encoding:"application/x-tex"},"O(LogN)")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),s("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"O"),s("span",{class:"mopen"},"("),s("span",{class:"mord mathnormal"},"L"),s("span",{class:"mord mathnormal"},"o"),s("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"g"),s("span",{class:"mord mathnormal",style:{"margin-right":"0.10903em"}},"N"),s("span",{class:"mclose"},")")])])]),i(" 。")],-1),k=a('<h2 id="特征" tabindex="-1"><a class="header-anchor" href="#特征"><span>特征</span></a></h2><ol><li>堆是完全二叉树<a href="#%E5%AE%8C%E5%85%A8%E4%BA%8C%E5%8F%89%E6%A0%91">*</a></li><li>常用数组实现</li><li>每个堆的节点都满足堆的条件，即堆的每个节点关键字都大于（或等于）子节点的关键字</li></ol><p><code>特征3</code>保证了根节点是堆中最大的值，以及顺着某一个节点一直到遇到叶节点的路径上的节点关键字是依次递减的，但是没法保证这个值是这个堆中的最小值，这是因为堆中每个节点的左右子节点的位置和大小无关，两条这样的路径之前的值的大小没有一定的关系。</p><h2 id="操作" tabindex="-1"><a class="header-anchor" href="#操作"><span>操作</span></a></h2>',4),r=s("p",null,[i("堆可以进行插入、移除，遍历等操作，时间复杂度都是"),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"L"),s("mi",null,"o"),s("mi",null,"g"),s("mi",null,"N"),s("mo",{stretchy:"false"},")")]),s("annotation",{encoding:"application/x-tex"},"O(LogN)")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),s("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"O"),s("span",{class:"mopen"},"("),s("span",{class:"mord mathnormal"},"L"),s("span",{class:"mord mathnormal"},"o"),s("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"g"),s("span",{class:"mord mathnormal",style:{"margin-right":"0.10903em"}},"N"),s("span",{class:"mclose"},")")])])]),i("。初次之外，利用堆根节点关键值最大这个属性，还可以进行堆排序,时间复杂度为"),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"N"),s("mo",null,"∗"),s("mi",null,"L"),s("mi",null,"o"),s("mi",null,"g"),s("mi",null,"N"),s("mo",{stretchy:"false"},")")]),s("annotation",{encoding:"application/x-tex"},"O(N*LogN)")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),s("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"O"),s("span",{class:"mopen"},"("),s("span",{class:"mord mathnormal",style:{"margin-right":"0.10903em"}},"N"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),s("span",{class:"mbin"},"∗"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),s("span",{class:"base"},[s("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),s("span",{class:"mord mathnormal"},"L"),s("span",{class:"mord mathnormal"},"o"),s("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"g"),s("span",{class:"mord mathnormal",style:{"margin-right":"0.10903em"}},"N"),s("span",{class:"mclose"},")")])])]),i("。")],-1),d=a(`<p>对于在数组中保存的堆，设元素下标为<code>x</code>，则各个相关元素下标如下：</p><ul><li>父节点<code> (x-1)/2</code></li><li>左子节点 <code>2*x+1</code></li><li>右子节点 <code>2*x+2</code></li></ul><p>在插入，移除的时候为了保证满足堆的条件，需要对堆进行向上或向下的遍历，将修改的值移动到对应的位置，在这过程中涉及到复制和交换。如果每次比较都需要交换数据的话会复制很多次，而如果将最终要移动值保存在临时变量中，用一个值专门记录要移动到的下标，在每次符合条件时只复制参与对比的值，在最后再将要临时保存的值复制到目的下标，就会减少复制的次数。</p><p>如下图就将复制次数从 9 次减少到了 5 次。</p><figure><img src="https://jixiaoyong.github.io/images/20181225213813.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="插入" tabindex="-1"><a class="header-anchor" href="#插入"><span>插入</span></a></h3><p>插入操作思路是，将元素插入到数组最后一位，然后依次向元素父节点遍历，将不满足的元素下沉，直到找到满足<code>堆特征3</code>（父节点关键字大于该点，并且子节点关键字小于该点）的下标，或者指向了根目录，将该元素插入该处。</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     * 从下向上遍历</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     * 如果父节点比插入值小，就将父节点移动到插入值的位置，将toIndex指向空出的地方</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     * 依次查找，直到查找到父节点比插入值大，子节点比插入值小的地方，或者指向了根节点</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">     */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    private</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> checkUp</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(index: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">Int</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> bottom </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> headArray[index]</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//headArray是保存堆元素的数组</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> index</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> father </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        while</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> &amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> bottom</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!!</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> headArray[father]</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!!</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.key) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">            headArray[toIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> headArray[father]</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//将父节点下沉</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">            toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> father</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">            father </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        headArray[toIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> bottom</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//将该值插入到对应下标</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="移除" tabindex="-1"><a class="header-anchor" href="#移除"><span>移除</span></a></h3><p>移除指的是将根节点推出堆中。</p><p>基本思路是将根节点推出，再将数组最后一个节点（同时也是堆的最后一个节点）移动到根节点空出的位置，再依次向下遍历，直到将该节点放到符合堆条件的位置或者到达叶子节点。</p><p>和插入相比，移除时要移动的节点要比较的稍微多些。</p><ul><li>该节点是叶节点 直接插入 ✅</li><li>有两个子节点 和两个叶子节点中最大的比较，如果小于则交换，并再和新的子节点比较</li><li>只有左节点 如果左节点大于本节点则交换，否则就是该位置</li></ul><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> * 从上向下遍历</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> * 如果遇到比当前值top大的就将其复制到当前位置toIndex，并记录下空出的位置为toIndex</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> * 再以toIndex为起点向下比较，直到遇到top比父节点小，比子节点大的位置，或者叶子节点</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> * 将top移动到该位置</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">private</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> checkDown</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(index: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">Int</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> index</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> top </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> headArray[size </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!!</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">    while</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> size </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//非叶子节点</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> leftIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        var</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> rightIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (headArray[rightIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//只有左节点</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">            if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (headArray[leftIndex]</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!!</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> top.key) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                headArray[toIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> headArray[leftIndex]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> leftIndex</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">            } </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">                break</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        } </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">else</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (headArray[leftIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> &amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> headArray[rightIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">            if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (headArray[leftIndex]</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!!</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&gt;=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> headArray[rightIndex]</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!!</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.key) {</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//如果左节点比较大</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">                if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (headArray[leftIndex]</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!!</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> top.key) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                    headArray[toIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> headArray[leftIndex]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                    toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> leftIndex</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                } </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">                    break</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">            } </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//如果右节点比较大</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">                if</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (headArray[rightIndex]</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">!!</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.key </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> top.key) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                    headArray[toIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> headArray[rightIndex]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                    toIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> rightIndex</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                } </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">                    break</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    headArray[toIndex] </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> top</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//将该节点移动到找到的下标处</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="堆排序" tabindex="-1"><a class="header-anchor" href="#堆排序"><span>堆排序</span></a></h3><p>利用堆<code>根节点关键值最大</code>这一特性，可以进行堆排序。</p><p>只需要将待排序的数组依次插入堆中，然后再依次移除即可。</p><p>这样需要有两倍与待排序数组大小的空间。如果每次插入时候只保存数据，不进行向上遍历，在每次移除数据时进行向下遍历，将当前剩余数据最大值选出来（其余数据仍然无序）从堆中移除根元素时都会在数组末尾空出一个位置，将该值存储在该位置即可，这样等完全插入、移除后就得到一个有序数组【从数组末尾开始依次减小】</p><p>堆排序和快速排序时间复杂度都是 <code>O(N*LogN)</code> ，但是由于向上、向下遍历耗时，实际上要比快速排序稍慢一些。但是堆排序堆数据初始分布不敏感一直都是 <code>O(N*LogN)</code> ，快速排序在某些情况下时间复杂度可达到 <code>O(N^2)</code> 。</p><h2 id="附录" tabindex="-1"><a class="header-anchor" href="#附录"><span>附录</span></a></h2><h3 id="满二叉树" tabindex="-1"><a class="header-anchor" href="#满二叉树"><span>满二叉树</span></a></h3><p>满二叉树指除最后一层无任何子节点外，每一层上的所有结点都有两个子结点二叉树。</p>`,22),g=s("p",null,[i("如果一个二叉树的层数为 K，且节点总数是 "),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mo",{stretchy:"false"},"("),s("msup",null,[s("mn",null,"2"),s("mi",null,"k")]),s("mo",{stretchy:"false"},")"),s("mo",null,"−"),s("mn",null,"1")]),s("annotation",{encoding:"application/x-tex"},"(2^k) -1")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"1.0991em","vertical-align":"-0.25em"}}),s("span",{class:"mopen"},"("),s("span",{class:"mord"},[s("span",{class:"mord"},"2"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8491em"}},[s("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mathnormal mtight",style:{"margin-right":"0.03148em"}},"k")])])])])])])]),s("span",{class:"mclose"},")"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),s("span",{class:"mbin"},"−"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.6444em"}}),s("span",{class:"mord"},"1")])])]),i(" ，则它就是满二叉树。")],-1),o=a('<figure><img src="https://jixiaoyong.github.io/images/20181225210750.png" alt="满二叉树" tabindex="0" loading="lazy"><figcaption>满二叉树</figcaption></figure><h3 id="完全二叉树" tabindex="-1"><a class="header-anchor" href="#完全二叉树"><span>完全二叉树</span></a></h3><p>完全二叉树 如果将二叉树每层从左到右遍历，那么完全二叉树只有最后一层的右边会出现没有叶子节点的情况，即在前 1~n 之间没有“洞”。</p><p>如下图就是一个完全二叉树：</p><figure><img src="https://jixiaoyong.github.io/images/20181225211304.png" alt="完全二叉树" tabindex="0" loading="lazy"><figcaption>完全二叉树</figcaption></figure><p>但下图不是完全二叉树：</p><figure><img src="https://jixiaoyong.github.io/images/20181223211217.png" alt="不是完全二叉树" tabindex="0" loading="lazy"><figcaption>不是完全二叉树</figcaption></figure><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码"><span>源码</span></a></h2><p><a href="https://github.com/jixiaoyong/Notes-Files/blob/master/AndroidLearningResource/java_note/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E5%AD%A6%E4%B9%A0/tree/HeadClazz.kt" target="_blank" rel="noopener noreferrer">👉 点这里</a> 查看源码</p><h2 id="参考链接" tabindex="-1"><a class="header-anchor" href="#参考链接"><span>参考链接</span></a></h2><p><a href="https://baike.baidu.com/item/%E6%BB%A1%E4%BA%8C%E5%8F%89%E6%A0%91" target="_blank" rel="noopener noreferrer">满二叉树——百度百科</a></p><p><a href="https://blog.csdn.net/u013812939/article/details/46798743" target="_blank" rel="noopener noreferrer">完全二叉树与满二叉树的区别</a></p><p>《Java 数据结构和算法 （第二版）》 Robert Lafore 陈维宁</p>',13),c=[h,p,k,r,d,g,o];function m(y,B){return t(),l("div",null,c)}const u=n(e,[["render",m],["__file","b3af796a.html.vue"]]),D=JSON.parse('{"path":"/posts/b3af796a.html","title":"数据结构_堆","lang":"zh-CN","frontmatter":{"permalink":"/posts/b3af796a.html","title":"数据结构_堆","tag":"数据结构","abbrlink":"b3af796a","date":"2018-12-25T12:51:36.000Z","updated":"2023-12-30T08:17:02.000Z","isOriginal":true,"description":"前言 堆是一种特殊的二叉树，用他实现的优先级队列插入和删除时间复杂度都是O(LogN) 。 特征 堆是完全二叉树* 常用数组实现 每个堆的节点都满足堆的条件，即堆的每个节点关键字都大于（或等于）子节点的关键字 特征3保证了根节点是堆中最大的值，以及顺着某一个节点一直到遇到叶节点的路径上的节点关键字是依次递减的，但是没法保证这个值是这个堆中的最小值，这是...","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/b3af796a.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"数据结构_堆"}],["meta",{"property":"og:description","content":"前言 堆是一种特殊的二叉树，用他实现的优先级队列插入和删除时间复杂度都是O(LogN) 。 特征 堆是完全二叉树* 常用数组实现 每个堆的节点都满足堆的条件，即堆的每个节点关键字都大于（或等于）子节点的关键字 特征3保证了根节点是堆中最大的值，以及顺着某一个节点一直到遇到叶节点的路径上的节点关键字是依次递减的，但是没法保证这个值是这个堆中的最小值，这是..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://jixiaoyong.github.io/images/20181225213813.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-31T16:00:22.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:tag","content":"数据结构"}],["meta",{"property":"article:published_time","content":"2018-12-25T12:51:36.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-31T16:00:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"数据结构_堆\\",\\"image\\":[\\"https://jixiaoyong.github.io/images/20181225213813.png\\",\\"https://jixiaoyong.github.io/images/20181225210750.png\\",\\"https://jixiaoyong.github.io/images/20181225211304.png\\",\\"https://jixiaoyong.github.io/images/20181223211217.png\\"],\\"datePublished\\":\\"2018-12-25T12:51:36.000Z\\",\\"dateModified\\":\\"2024-05-31T16:00:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"特征","slug":"特征","link":"#特征","children":[]},{"level":2,"title":"操作","slug":"操作","link":"#操作","children":[{"level":3,"title":"插入","slug":"插入","link":"#插入","children":[]},{"level":3,"title":"移除","slug":"移除","link":"#移除","children":[]},{"level":3,"title":"堆排序","slug":"堆排序","link":"#堆排序","children":[]}]},{"level":2,"title":"附录","slug":"附录","link":"#附录","children":[{"level":3,"title":"满二叉树","slug":"满二叉树","link":"#满二叉树","children":[]},{"level":3,"title":"完全二叉树","slug":"完全二叉树","link":"#完全二叉树","children":[]}]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"参考链接","slug":"参考链接","link":"#参考链接","children":[]}],"git":{"createdTime":1653726847000,"updatedTime":1717171222000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3},{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":5.67,"words":1700},"filePathRelative":"_posts/数据结构_堆.md","localizedDate":"2018年12月25日","excerpt":"<h2>前言</h2>\\n<p>堆是一种特殊的二叉树，用他实现的优先级队列插入和删除时间复杂度都是<span v-pre=\\"\\" class=\\"katex\\"><span class=\\"katex-mathml\\"><math xmlns=\\"http://www.w3.org/1998/Math/MathML\\"><semantics><mrow><mi>O</mi><mo stretchy=\\"false\\">(</mo><mi>L</mi><mi>o</mi><mi>g</mi><mi>N</mi><mo stretchy=\\"false\\">)</mo></mrow><annotation encoding=\\"application/x-tex\\">O(LogN)</annotation></semantics></math></span><span class=\\"katex-html\\" aria-hidden=\\"true\\"><span class=\\"base\\"><span class=\\"strut\\" style=\\"height:1em;vertical-align:-0.25em;\\"></span><span class=\\"mord mathnormal\\" style=\\"margin-right:0.02778em;\\">O</span><span class=\\"mopen\\">(</span><span class=\\"mord mathnormal\\">L</span><span class=\\"mord mathnormal\\">o</span><span class=\\"mord mathnormal\\" style=\\"margin-right:0.03588em;\\">g</span><span class=\\"mord mathnormal\\" style=\\"margin-right:0.10903em;\\">N</span><span class=\\"mclose\\">)</span></span></span></span> 。</p>","autoDesc":true}');export{u as comp,D as data};