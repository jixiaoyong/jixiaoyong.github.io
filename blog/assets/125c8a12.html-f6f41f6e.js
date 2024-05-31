import{_ as e,r as p,o as t,c as o,a as n,b as s,d as c,e as l}from"./app-77b42b64.js";const i={},r=l(`<h2 id="简单排序" tabindex="-1"><a class="header-anchor" href="#简单排序" aria-hidden="true">#</a> 简单排序</h2><p>所有排序顺序为 <code>小 → 大</code>。</p><p>时间负责度都是 O(N<sup>2</sup>)。</p><p>排序速度：<code>插入排序&gt;选择排序&gt;冒泡排序</code></p><h3 id="冒泡排序" tabindex="-1"><a class="header-anchor" href="#冒泡排序" aria-hidden="true">#</a> 冒泡排序</h3><p>时间复杂度：O(N<sup>2</sup>)</p><p>最慢的排序，但是简单</p><p>规则如下：</p><ol><li>从左到右，比较 a 和 b，如果<code>a&gt;b</code>，就交换 a 和 b 的位置</li><li>再将 a，b 中较大的那个与 c 按照 2 的规则比较，直到最后一位</li><li>重复 1，2 直到没有待排序的项目</li></ol><p>其思想是：每次选出当前未排序的元素中最大的元素并放到队尾（每次比较最大元素都会“冒泡”到队尾），这样当连续遍历 n 次后，每个元素都会排好序。</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code><span class="token comment">/**
     * 冒泡排序
     * 1. 每次比较前1~（n-i）个元素（i是排序次数），每次有大的就【移动】，
     * 这样子一轮比赛完毕最大的就在后面了
     * 2. 这样子比较n次就可以完成排序
     */</span>
    <span class="token keyword">fun</span> <span class="token function">bubbleSort</span><span class="token punctuation">(</span>intArray<span class="token operator">:</span> IntArray<span class="token punctuation">)</span><span class="token operator">:</span> IntArray <span class="token punctuation">{</span>
        <span class="token keyword">var</span> result <span class="token operator">=</span> intArray
        <span class="token keyword">var</span> size <span class="token operator">=</span> result<span class="token punctuation">.</span>size
        <span class="token keyword">for</span> <span class="token punctuation">(</span>index <span class="token keyword">in</span> <span class="token number">0</span> until size<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span>x <span class="token keyword">in</span> <span class="token number">0</span> until size <span class="token operator">-</span> index <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>result<span class="token punctuation">[</span>x<span class="token punctuation">]</span> <span class="token operator">&gt;</span> result<span class="token punctuation">[</span>x <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//【注意】冒泡排序，每次比较满足条件就会交换</span>
                    <span class="token keyword">var</span> temp <span class="token operator">=</span> result<span class="token punctuation">[</span>x<span class="token punctuation">]</span>
                    result<span class="token punctuation">[</span>x<span class="token punctuation">]</span> <span class="token operator">=</span> result<span class="token punctuation">[</span>x <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span>
                    result<span class="token punctuation">[</span>x <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> temp
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> result
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="选择排序" tabindex="-1"><a class="header-anchor" href="#选择排序" aria-hidden="true">#</a> 选择排序</h3><p>时间复杂度：O(N<sup>2</sup>)</p><p>因为交换次数少，所以比冒泡快</p><p>规则如下：</p><ol><li>假设第一项值最大，设其坐标为<code>max</code>，从左到右依次比较<code>max</code>和其他元素，如果遇到比<code>max</code>大的，将 max 坐标指向该值</li><li>每轮结束后<code>max</code>就表示这轮比较最大的值坐标，将其与当前未排序的最后一项交换</li><li>这样重复步骤 1，2， <code>n次</code>就可以排序完成</li></ol><p>其思想是：每次比较当前最大的值，记录下其坐标，等当前比较完成就和<code>未比较的最后一位</code>交换，（这样子避免每次比较都要交换）。同样这样子比较 n 次就可以完成排序。</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code><span class="token comment">/**
 * 选择排序
 * 1. 每次比较前1~（n-i）个元素（i是排序次数），如果有大的就记录下位置，一轮比较完毕后交换他和最后一位的位置
 * 2. 这样子比较n次就可以完成排序
 */</span>
<span class="token keyword">fun</span> <span class="token function">selectSort</span><span class="token punctuation">(</span>intArray<span class="token operator">:</span> IntArray<span class="token punctuation">)</span><span class="token operator">:</span> IntArray <span class="token punctuation">{</span>
    <span class="token keyword">var</span> result <span class="token operator">=</span> intArray
    <span class="token keyword">var</span> size <span class="token operator">=</span> result<span class="token punctuation">.</span>size
    <span class="token keyword">for</span> <span class="token punctuation">(</span>index <span class="token keyword">in</span> <span class="token number">0</span> until size<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">var</span> max <span class="token operator">=</span> <span class="token number">0</span><span class="token comment">//假设arr[0]最大</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span>x <span class="token keyword">in</span> <span class="token number">0</span> until size <span class="token operator">-</span> index <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>result<span class="token punctuation">[</span>max<span class="token punctuation">]</span> <span class="token operator">&lt;</span> result<span class="token punctuation">[</span>x <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//将max与每一项比较，注意这里参与比较的是max</span>
                max <span class="token operator">=</span> x <span class="token operator">+</span> <span class="token number">1</span><span class="token comment">//遇到比max大的则记录下其位置 【注意】这里并没有交换</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token comment">//在每轮比较完毕后max就是这轮比较出来的最大值位置，将其放到对应位置</span>
        <span class="token keyword">var</span> temp <span class="token operator">=</span> result<span class="token punctuation">[</span>size <span class="token operator">-</span> index <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
        result<span class="token punctuation">[</span>size <span class="token operator">-</span> index <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> result<span class="token punctuation">[</span>max<span class="token punctuation">]</span>
        result<span class="token punctuation">[</span>max<span class="token punctuation">]</span> <span class="token operator">=</span> temp
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> result
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="插入排序" tabindex="-1"><a class="header-anchor" href="#插入排序" aria-hidden="true">#</a> 插入排序</h3><p>时间复杂度：O(N<sup>2</sup>)</p><p>比冒泡快一倍，比选择排序快一些</p><p>思想：假设一个标记元素的左边全部是有序数组，右边全是无序数组，那么只需要将右边的元素依次拿出来插入到左边的有序数组中即可。刚开始这个标记元素可以为 0 或者 1（假设一个元素就是有序的）。</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code><span class="token comment">/**
 * 插入排序
 * 假设右端数组是有序的，依次从左端数组取出元素比较，插入到右边的有序数组
 */</span>
<span class="token keyword">fun</span> <span class="token function">insertSort</span><span class="token punctuation">(</span>intArray<span class="token operator">:</span> IntArray<span class="token punctuation">)</span><span class="token operator">:</span> IntArray <span class="token punctuation">{</span>

    <span class="token keyword">var</span> result <span class="token operator">=</span> intArray
    <span class="token keyword">var</span> size <span class="token operator">=</span> result<span class="token punctuation">.</span>size

    <span class="token keyword">for</span> <span class="token punctuation">(</span>insertIndex <span class="token keyword">in</span> <span class="token number">1</span> until size <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//假设arr[0]已经是有序的，所以从1开始</span>
        <span class="token keyword">var</span> insertPoint <span class="token operator">=</span> result<span class="token punctuation">[</span>insertIndex<span class="token punctuation">]</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span>index <span class="token keyword">in</span> insertIndex <span class="token operator">-</span> <span class="token number">1</span> downTo  <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>insertPoint <span class="token operator">&lt;</span> result<span class="token punctuation">[</span>index<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">//默认要插入的点是有序的，如果有比插入点大的，则将该点和插入点交换</span>
                result<span class="token punctuation">[</span>index <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> result<span class="token punctuation">[</span>index<span class="token punctuation">]</span>
                result<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> insertPoint
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">//因为左边的数组是有序的，只要有比插入点小的元素，则剩下的肯定都小于该元素，不用再比较了</span>
                <span class="token keyword">break</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> result
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码" aria-hidden="true">#</a> 源码</h2>`,24),u={href:"https://github.com/jixiaoyong/Notes-Files/blob/master/AndroidLearningResource/java_note/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E5%AD%A6%E4%B9%A0/sort/BasicSort.kt",target:"_blank",rel:"noopener noreferrer"};function d(k,v){const a=p("ExternalLinkIcon");return t(),o("div",null,[r,n("p",null,[n("a",u,[s("👉 点这里"),c(a)]),s("查看源码")])])}const b=e(i,[["render",d],["__file","125c8a12.html.vue"]]);export{b as default};
