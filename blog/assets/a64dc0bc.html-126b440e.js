import{_ as p,r as t,o,c,a as n,b as a,d as e,e as l}from"./app-a6491e1b.js";const i={},r=l(`<p>二叉树的遍历根据根节点与左右子节点的遍历顺序的不同分为三种：</p><ul><li><p>前序遍历</p><p>根左右：先遍历根节点，再左子树，再右子树（先从根节点开始，记录左节点直到没有）</p><p>第一个为根节点</p></li><li><p>中序遍历</p><p>左根右：先左子树，再根子树，再右子树（从树的最左边的节点开始遍历）</p></li><li><p>后序遍历</p><p>左右根：先左子树，后右子树，再根节点</p><p>最后一个为根节点</p></li></ul><p>在遍历的时候，当父节点只有一个子节点时，依然要遵循以上三种遍历的先后顺序（没有该子节点则不写内容），以保证某一侧的子树（“左边的子树”或“右边的子树”）所有节点都被完全遍历，之后才可以根据遍历的规则切换到下一子树。</p><p>如如下子树：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>      G
   /     \\
  D       M
 / \\     / \\
A   F   H   Z
   /
  E
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>前序遍历：GDAFEMHZ</p><p>中序遍历：ADEFGHMZ</p><p>后续遍历：AEFDHZMG</p><h2 id="常见应用" tabindex="-1"><a class="header-anchor" href="#常见应用" aria-hidden="true">#</a> 常见应用</h2><p>一般都是给定中序排序，再加上一个前序排序、后续排序来逆向生成二叉树。</p><p>根据之前的知识，此类题的解答思路一般为：</p><p>先根据前序排序、后续排序的特点，找到根节点，之后再根据找到的根节点将中序排序分为左、右子树两个部分。这样循环直到整个树的每个节点都被遍历完毕，完整的二叉树也会被建立起来。</p><p>我们以下面这个二叉树为例：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    1
   / \\
  2   3
     / \\
    4   5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用代码表示如下：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code><span class="token keyword">fun</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token keyword">val</span> preorder <span class="token operator">=</span> <span class="token function">intArrayOf</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">4</span><span class="token punctuation">,</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token comment">//前序遍历</span>
    <span class="token keyword">val</span> inorder  <span class="token operator">=</span> <span class="token function">intArrayOf</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">4</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token comment">//中序遍历</span>
    <span class="token keyword">val</span> tree <span class="token operator">=</span> <span class="token function">buildTree</span><span class="token punctuation">(</span>preorder<span class="token punctuation">,</span> inorder<span class="token punctuation">)</span>
    <span class="token function">print</span><span class="token punctuation">(</span>tree<span class="token punctuation">)</span>

<span class="token punctuation">}</span>

<span class="token keyword">fun</span> <span class="token function">buildTree</span><span class="token punctuation">(</span>preorder<span class="token operator">:</span> IntArray<span class="token punctuation">,</span> inorder<span class="token operator">:</span> IntArray<span class="token punctuation">)</span><span class="token operator">:</span> TreeNode<span class="token operator">?</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> tree <span class="token operator">:</span> TreeNode<span class="token operator">?</span> <span class="token operator">=</span> <span class="token keyword">null</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>preorder<span class="token punctuation">.</span><span class="token function">isNotEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">val</span> root <span class="token operator">=</span> preorder<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token comment">//获取根节点</span>
        <span class="token keyword">val</span> indexOfRoot <span class="token operator">=</span> inorder<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token comment">//获取中序排序中根节点的坐标</span>
        tree <span class="token operator">=</span> <span class="token function">TreeNode</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span>
        <span class="token comment">//根据根节点坐标，将二叉树分为左、右两个子树</span>
        <span class="token keyword">val</span> leftTree <span class="token operator">=</span> inorder<span class="token punctuation">.</span><span class="token function">copyOfRange</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> indexOfRoot<span class="token punctuation">)</span>
        <span class="token keyword">val</span> rightTree <span class="token operator">=</span> inorder<span class="token punctuation">.</span><span class="token function">copyOfRange</span><span class="token punctuation">(</span>indexOfRoot <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> inorder<span class="token punctuation">.</span>size<span class="token punctuation">)</span>
        <span class="token comment">//将前序排序也分为左右两个子树的前序排序</span>
        <span class="token keyword">val</span> leftPreOrder <span class="token operator">=</span> preorder<span class="token punctuation">.</span><span class="token function">copyOfRange</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> preorder<span class="token punctuation">.</span>size<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">filter</span> <span class="token punctuation">{</span> leftTree<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>it<span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token function">toIntArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">val</span> rightPreOrder <span class="token operator">=</span> preorder<span class="token punctuation">.</span><span class="token function">copyOfRange</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> preorder<span class="token punctuation">.</span>size<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">filter</span> <span class="token punctuation">{</span> rightTree<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>it<span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token function">toIntArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token comment">//再次分别循环分析左右两个子树的结构</span>
        tree<span class="token punctuation">.</span>left <span class="token operator">=</span> <span class="token function">buildTree</span><span class="token punctuation">(</span>leftPreOrder<span class="token punctuation">,</span> leftTree<span class="token punctuation">)</span>
        tree<span class="token punctuation">.</span>right <span class="token operator">=</span> <span class="token function">buildTree</span><span class="token punctuation">(</span>rightPreOrder<span class="token punctuation">,</span> rightTree<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> tree
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token function">TreeNode</span><span class="token punctuation">(</span><span class="token keyword">var</span> \`<span class="token keyword">val</span>\`<span class="token operator">:</span> Int<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> left<span class="token operator">:</span> TreeNode<span class="token operator">?</span> <span class="token operator">=</span> <span class="token keyword">null</span>
    <span class="token keyword">var</span> right<span class="token operator">:</span> TreeNode<span class="token operator">?</span> <span class="token operator">=</span> <span class="token keyword">null</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h2>`,17),u={href:"https://www.jianshu.com/p/9e8922486154",target:"_blank",rel:"noopener noreferrer"},k={href:"https://charlesliuyx.github.io/2018/10/22/%5B%E7%9B%B4%E8%A7%82%E7%AE%97%E6%B3%95%5D%E6%A0%91%E7%9A%84%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/",target:"_blank",rel:"noopener noreferrer"},d={href:"https://jingyan.baidu.com/album/cdddd41cb8d79753ca00e144.html?picindex=1",target:"_blank",rel:"noopener noreferrer"},v={href:"https://leetcode-cn.com/problems/zhong-jian-er-cha-shu-lcof/",target:"_blank",rel:"noopener noreferrer"};function m(b,f){const s=t("ExternalLinkIcon");return o(),c("div",null,[r,n("p",null,[n("a",u,[a("https://www.jianshu.com/p/9e8922486154"),e(s)])]),n("p",null,[n("a",k,[a("【直观算法】二叉树遍历算法总结"),e(s)])]),n("p",null,[n("a",d,[a("知道中序和后序遍历，画二叉树和写出前序遍历 "),e(s)])]),n("p",null,[n("a",v,[a("leetcode-重建二叉树"),e(s)])])])}const y=p(i,[["render",m],["__file","a64dc0bc.html.vue"]]);export{y as default};