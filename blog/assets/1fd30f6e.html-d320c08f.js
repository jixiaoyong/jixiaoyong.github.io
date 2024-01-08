import{_ as n,o as a,c as s,e as t}from"./app-a4c82ba1.js";const e={},p=t(`<p>今天重新学习类三种排序方法，按照排序速度依次是冒泡排序，选择排序和插入排序。<br> 以下示例皆为从小到大的排序</p><h2 id="_1-冒泡排序" tabindex="-1"><a class="header-anchor" href="#_1-冒泡排序" aria-hidden="true">#</a> 1.冒泡排序</h2><p>每一次比较都可能要交换元素。<br> 冒泡排序的思想是：<br> 每一轮开始的时候，将第一个元素（a）开始与其后的元素（b）依次进行比较，将较大的元素（设为 m）放到后面，并将 m 与其后的另外一个元素继续进行比较，直到最后一个没有排好序的元素。<br> 在接下来一轮的排序中，刚才以及之前选出来的、已经排好顺序的最大值不用参与排序。<br> 依次类推，总共遍历 n-1 轮，即可完成排序。<br> 具体代码如下：</p><pre><code> void bubble(int[] arr){
	int temp;
	for (int i = 0; i &lt; arr.length - 1; i++) {
		for (int j = 0; j &lt; arr.length - i - 1; j++) {
			if (arr[j] &gt; arr[j + 1]) {
				temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
		}
	}

	System.out.println(&quot;\\n--bubble :&quot;);
	for (int i = 0; i &lt; arr.length; i++) {
		System.out.print(arr[i] + &quot; &quot;);
	}
}
</code></pre><h2 id="_2-选择排序" tabindex="-1"><a class="header-anchor" href="#_2-选择排序" aria-hidden="true">#</a> 2.选择排序</h2><p>每次比较的时候不交换<br> 选择排序的思想：<br> 每次比较的时候找到的两个数中的较大值并记下其位置，等到当前一轮的遍历完成之后，将最后一个未排序元素与这一轮遍历找到的最大值交换<br> 最多交换 n-1 次<br> 代码如下：</p><pre><code>   void select(int[] arr){

	for (int i = 0; i &lt; arr.length; i++) {
		int maxIndex = 0;
		int temp = 0;

		for (int j = 1; j &lt; arr.length - i; j++) {
			if (arr[maxIndex] &lt; arr[j]) {
				maxIndex = j;
			}
		}

		temp = arr[maxIndex];
		arr[maxIndex] = arr[arr.length - i - 1];
		arr[arr.length - i - 1] = temp;
	}


	System.out.println(&quot;\\n--select :&quot;);

	for (int i = 0; i &lt; arr.length; i++) {
		System.out.print(arr[i] + &quot; &quot;);
	}
}
</code></pre><h2 id="_3-插入排序法" tabindex="-1"><a class="header-anchor" href="#_3-插入排序法" aria-hidden="true">#</a> 3.插入排序法</h2><p>插入排序法思想：<br> 将待排序的元素分为有序和无序两种，刚开始排序的时候假设只有第一个元素是有序的，其余 n-1 个元素都是无序的；<br> 排序开始的时，将无序部分的一个元素（a）与有序部分的最后一个元素（b）进行比较，如果 a&lt;b，则将 a 与 b 交换，再将 a 与下一个有序元素进行比较；否则，将 a 加到 b 后面，作为有序部分的最后一个元素。<br> 接着再从无序部分取出一个元素与有序部分的元素依次比较，直达所有元素都为有序元素。<br> 遍历 n-1 次<br> 代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token keyword">void</span> <span class="token function">insertSort</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> arr<span class="token punctuation">)</span><span class="token punctuation">{</span>

	<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">int</span> instertValue <span class="token operator">=</span> arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>

		<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> j <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">;</span> j<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
			<span class="token keyword">if</span> <span class="token punctuation">(</span>instertValue <span class="token operator">&lt;</span> arr<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
				arr<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> arr<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span>
				arr<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> instertValue<span class="token punctuation">;</span>
			<span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token punctuation">{</span>
				<span class="token keyword">break</span><span class="token punctuation">;</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>

	<span class="token comment">/* 第二种表示形式
	for (int i = 1; i &lt; arr.length; i++) {
		int instertVal = arr[i];
		int index = i - 1;

		while (index &gt;= 0 &amp;&amp; instertVal &lt; arr[index]) {
			arr[index + 1] = arr[index];
			index--;
		}
		arr[index + 1] = instertVal;
	}
	*/</span>

	<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;\\n--insertSort :&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">print</span><span class="token punctuation">(</span>arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token string">&quot; &quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),i=[p];function o(r,c){return a(),s("div",null,i)}const u=n(e,[["render",o],["__file","1fd30f6e.html.vue"]]);export{u as default};
