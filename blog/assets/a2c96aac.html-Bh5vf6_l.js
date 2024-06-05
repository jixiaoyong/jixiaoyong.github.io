import{_ as n,c as s,o as a,a as e}from"./app-Bz_HPgZ1.js";const i={},l=e(`<h2 id="自定义的-view" tabindex="-1"><a class="header-anchor" href="#自定义的-view"><span>自定义的 view</span></a></h2><ul><li>LetterIndex.java extends View</li><li>ContactsListView.java extends RecyclerView #分析</li><li>联系人列表有两个要点 <ul><li>字母导航栏<br> 通过自定义 View 画出 26 个字母，设置滑动监听事件，根据上下滑动的距离判断当前选中的字母，并相应更新界面。</li><li>列表中的字母标题<br> 针对 item 中的联系人姓名首字母对应的 tag 作比较，若与前一个相同则不显示 title，否则显示。</li></ul></li><li>事件联动 <ul><li>当滑动字母导航栏时，除了处理本身的变化外，还要留出接口，以便其他控件获取当前选中的字母。</li><li>联系人列表滑动时，除了处理本身变化外，同样要留出接口以便获取当前置顶的 item 对应的字母</li><li>字母导航栏要留出方法，以便其他控件指定选中的字母，并更新界面</li></ul></li></ul><h2 id="具体代码" tabindex="-1"><a class="header-anchor" href="#具体代码"><span>具体代码</span></a></h2><p><strong>ContactsListView.java</strong><br> 重写该类主要是为了实现 ItemDecoration 根据不同的 item 变化，同时可以从 xml 布局文件中获取 ItemDecoration 的自定义属性。<br> 主要代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>    public ContactsListView(Context context) {</span></span>
<span class="line"><span>        this(context, null, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ContactsListView(Context context, @Nullable AttributeSet attrs) {</span></span>
<span class="line"><span>        this(context, attrs, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ContactsListView(Context context, @Nullable AttributeSet attrs, int defStyle) {</span></span>
<span class="line"><span>        super(context, attrs, defStyle);</span></span>
<span class="line"><span>        mTypeArray = context.obtainStyledAttributes(attrs, R.styleable.MyRecyclerDecoration);</span></span>
<span class="line"><span>        mContext = context;</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>故而在其内部自定义了一个继承自 ItemDecoratio 得静态内部类 Decorationn 类：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>public Decoration(List&lt;String&gt; data){</span></span>
<span class="line"><span>//获取要显示的联系人数据对应的英文tag集合</span></span>
<span class="line"><span>//初始化各种自定义属性</span></span>
<span class="line"><span>//例如颜色：mColorLetterText = mTypeArray.getColor(R.styleable.MyRecyclerDecoration_color_letter_text, 0xff152648);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>        public void onDraw(Canvas c, RecyclerView parent, RecyclerView.State state){</span></span>
<span class="line"><span>//画出各个导航title</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>        public void onDrawOver(Canvas c, RecyclerView parent, RecyclerView.State state) {</span></span>
<span class="line"><span>//画出置顶的导航title</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span> @Override</span></span>
<span class="line"><span>        public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State</span></span>
<span class="line"><span>                state) {</span></span>
<span class="line"><span>//判断是否画出导航title</span></span>
<span class="line"><span> super.getItemOffsets(outRect, view, parent, state);</span></span>
<span class="line"><span>            int position = ((RecyclerView.LayoutParams) (view.getLayoutParams())).getViewAdapterPosition();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (position != -1) {</span></span>
<span class="line"><span>                String text = mDatas.get(position).substring(0, 1).toUpperCase();</span></span>
<span class="line"><span>                if (position == 0) {</span></span>
<span class="line"><span>                    outRect.set(0, mTitleHeight, 0, 0);</span></span>
<span class="line"><span>                } else if (text != null &amp;&amp; !text.equals(mDatas.get(position - 1).substring(0, 1).toUpperCase())) {</span></span>
<span class="line"><span>                    outRect.set(0, mTitleHeight, 0, 0);</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    outRect.set(0, 0, 0, 0);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void drawText(Canvas canvas, float left, float right, View child, String text) {</span></span>
<span class="line"><span>//画出文字</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>LetterIndex.java</strong><br> 该类用来画出字母导航栏，并且提供方法获取/设置当前选中的字母</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span> public interface onIndexClickListener {</span></span>
<span class="line"><span>        void onIndexClick(int chooseId);</span></span>
<span class="line"><span>        void onActionUp();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setOnIndexClickListener(onIndexClickListener listener) {</span></span>
<span class="line"><span>        this.mClickListener = listener;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setChooseId(int chooseId) {</span></span>
<span class="line"><span>        if (chooseId &gt;= 0 &amp;&amp; chooseId &lt; mIndexTexts.length) {</span></span>
<span class="line"><span>            mChooseId = chooseId;</span></span>
<span class="line"><span>            invalidate();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后重写<code>onTouchEvent(MotionEvent event)</code>方法，在 ACTION_DOWN、ACTION_MOVE、ACTION_UP 时调用对应的方法即可。</p><p>重写 onDraw() 方法，画出对应的界面</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>   @Override</span></span>
<span class="line"><span>    protected void onDraw(Canvas canvas) {</span></span>
<span class="line"><span>        super.onDraw(canvas);</span></span>
<span class="line"><span>        int height = getHeight() - getPaddingTop() - getPaddingBottom();</span></span>
<span class="line"><span>        float width = getWidth();</span></span>
<span class="line"><span>        //childHeight 是每一个字母所在单元的高度</span></span>
<span class="line"><span>        float childHeight = (float) height / mIndexTexts.length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //如果被点击了，就画出背景</span></span>
<span class="line"><span>        if (isClick) {</span></span>
<span class="line"><span>            mPaint.setColor(mColorIndexBg);</span></span>
<span class="line"><span>            canvas.drawRect(0, 0, width, height, mPaint);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Rect bounds = new Rect();</span></span>
<span class="line"><span>        mPaint.setTextSize(mSizeText);</span></span>
<span class="line"><span>        mPaint.setTextAlign(Paint.Align.CENTER);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mIndexTexts.length; i++) {</span></span>
<span class="line"><span>            String text = mIndexTexts[i];</span></span>
<span class="line"><span>            mPaint.setColor(mColorText);</span></span>
<span class="line"><span>            //在被选中的字后面画一个圆，并改变字的颜色</span></span>
<span class="line"><span>            if (i == mChooseId) {</span></span>
<span class="line"><span>                mPaint.setColor(mColorChooseTextBg);</span></span>
<span class="line"><span>                canvas.drawCircle(width / 2, childHeight / 2 + i * childHeight,</span></span>
<span class="line"><span>                        mSizeText / 2 + 2, mPaint);</span></span>
<span class="line"><span>                mPaint.setColor(mColorChooseText);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            mPaint.getTextBounds(text, 0, text.length(), bounds);</span></span>
<span class="line"><span>            //bounds里面保存着要画的字的一些属性，如x，y，centerX，centerY等，</span></span>
<span class="line"><span>            //要注意 canvas.drawText（text,x,y,mpaint）中y并不是text的最低端，而是baseline。</span></span>
<span class="line"><span>            float x = width / 2;</span></span>
<span class="line"><span>            float y = -bounds.centerY() + childHeight / 2 + i * childHeight;</span></span>
<span class="line"><span>            canvas.drawText(text, x, y, mPaint);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码"><span>源码</span></a></h2><p>源代码在我的 Github，<a href="https://github.com/jixiaoyong/my_application_on_deepin/tree/master/contactsdemo/src/main" target="_blank" rel="noopener noreferrer">点这里</a>可以找到。</p><h2 id="预览如下" tabindex="-1"><a class="header-anchor" href="#预览如下"><span>预览如下</span></a></h2><figure><img src="http://upload-images.jianshu.io/upload_images/120748-183eea3cad2b42ac.gif?imageMogr2/auto-orient/strip" alt="预览.gif" tabindex="0" loading="lazy"><figcaption>预览.gif</figcaption></figure>`,16),t=[l];function p(c,d){return a(),s("div",null,t)}const o=n(i,[["render",p],["__file","a2c96aac.html.vue"]]),v=JSON.parse('{"path":"/posts/a2c96aac.html","title":"Android 自定义 View 实现联系人列表","lang":"zh-CN","frontmatter":{"permalink":"/posts/a2c96aac.html","title":"Android 自定义 View 实现联系人列表","abbrlink":"a2c96aac","date":"2017-09-03T15:25:05.000Z","updated":"2023-12-30T08:17:02.000Z","isOriginal":true,"description":"自定义的 view LetterIndex.java extends View ContactsListView.java extends RecyclerView #分析 联系人列表有两个要点 字母导航栏 通过自定义 View 画出 26 个字母，设置滑动监听事件，根据上下滑动的距离判断当前选中的字母，并相应更新界面。 列表中的字母标题 针对 ite...","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/a2c96aac.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Android 自定义 View 实现联系人列表"}],["meta",{"property":"og:description","content":"自定义的 view LetterIndex.java extends View ContactsListView.java extends RecyclerView #分析 联系人列表有两个要点 字母导航栏 通过自定义 View 画出 26 个字母，设置滑动监听事件，根据上下滑动的距离判断当前选中的字母，并相应更新界面。 列表中的字母标题 针对 ite..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"http://upload-images.jianshu.io/upload_images/120748-183eea3cad2b42ac.gif?imageMogr2/auto-orient/strip"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-31T16:00:22.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:published_time","content":"2017-09-03T15:25:05.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-31T16:00:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Android 自定义 View 实现联系人列表\\",\\"image\\":[\\"http://upload-images.jianshu.io/upload_images/120748-183eea3cad2b42ac.gif?imageMogr2/auto-orient/strip\\"],\\"datePublished\\":\\"2017-09-03T15:25:05.000Z\\",\\"dateModified\\":\\"2024-05-31T16:00:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"自定义的 view","slug":"自定义的-view","link":"#自定义的-view","children":[]},{"level":2,"title":"具体代码","slug":"具体代码","link":"#具体代码","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"预览如下","slug":"预览如下","link":"#预览如下","children":[]}],"git":{"createdTime":1653726847000,"updatedTime":1717171222000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3},{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":2.86,"words":857},"filePathRelative":"_posts/Android自定义View实现联系人列表.md","localizedDate":"2017年9月3日","excerpt":"<h2>自定义的 view</h2>\\n<ul>\\n<li>LetterIndex.java extends View</li>\\n<li>ContactsListView.java extends RecyclerView #分析</li>\\n<li>联系人列表有两个要点\\n<ul>\\n<li>字母导航栏<br>\\n通过自定义 View 画出 26 个字母，设置滑动监听事件，根据上下滑动的距离判断当前选中的字母，并相应更新界面。</li>\\n<li>列表中的字母标题<br>\\n针对 item 中的联系人姓名首字母对应的 tag 作比较，若与前一个相同则不显示 title，否则显示。</li>\\n</ul>\\n</li>\\n<li>事件联动\\n<ul>\\n<li>当滑动字母导航栏时，除了处理本身的变化外，还要留出接口，以便其他控件获取当前选中的字母。</li>\\n<li>联系人列表滑动时，除了处理本身变化外，同样要留出接口以便获取当前置顶的 item 对应的字母</li>\\n<li>字母导航栏要留出方法，以便其他控件指定选中的字母，并更新界面</li>\\n</ul>\\n</li>\\n</ul>","autoDesc":true}');export{o as comp,v as data};
