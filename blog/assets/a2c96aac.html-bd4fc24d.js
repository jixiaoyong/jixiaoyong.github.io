import{_ as t,r as s,o as l,c as d,a as e,b as i,d as a,e as r}from"./app-4152d5c1.js";const c={},v=r(`<h2 id="自定义的-view" tabindex="-1"><a class="header-anchor" href="#自定义的-view" aria-hidden="true">#</a> 自定义的 view</h2><ul><li>LetterIndex.java extends View</li><li>ContactsListView.java extends RecyclerView #分析</li><li>联系人列表有两个要点 <ul><li>字母导航栏<br> 通过自定义 View 画出 26 个字母，设置滑动监听事件，根据上下滑动的距离判断当前选中的字母，并相应更新界面。</li><li>列表中的字母标题<br> 针对 item 中的联系人姓名首字母对应的 tag 作比较，若与前一个相同则不显示 title，否则显示。</li></ul></li><li>事件联动 <ul><li>当滑动字母导航栏时，除了处理本身的变化外，还要留出接口，以便其他控件获取当前选中的字母。</li><li>联系人列表滑动时，除了处理本身变化外，同样要留出接口以便获取当前置顶的 item 对应的字母</li><li>字母导航栏要留出方法，以便其他控件指定选中的字母，并更新界面</li></ul></li></ul><h2 id="具体代码" tabindex="-1"><a class="header-anchor" href="#具体代码" aria-hidden="true">#</a> 具体代码</h2><p><strong>ContactsListView.java</strong><br> 重写该类主要是为了实现 ItemDecoration 根据不同的 item 变化，同时可以从 xml 布局文件中获取 ItemDecoration 的自定义属性。<br> 主要代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    public ContactsListView(Context context) {
        this(context, null, 0);
    }

    public ContactsListView(Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public ContactsListView(Context context, @Nullable AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        mTypeArray = context.obtainStyledAttributes(attrs, R.styleable.MyRecyclerDecoration);
        mContext = context;
    }

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>故而在其内部自定义了一个继承自 ItemDecoratio 得静态内部类 Decorationn 类：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public Decoration(List&lt;String&gt; data){
//获取要显示的联系人数据对应的英文tag集合
//初始化各种自定义属性
//例如颜色：mColorLetterText = mTypeArray.getColor(R.styleable.MyRecyclerDecoration_color_letter_text, 0xff152648);

}

@Override
        public void onDraw(Canvas c, RecyclerView parent, RecyclerView.State state){
//画出各个导航title
}


@Override
        public void onDrawOver(Canvas c, RecyclerView parent, RecyclerView.State state) {
//画出置顶的导航title
}

 @Override
        public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State
                state) {
//判断是否画出导航title
 super.getItemOffsets(outRect, view, parent, state);
            int position = ((RecyclerView.LayoutParams) (view.getLayoutParams())).getViewAdapterPosition();

            if (position != -1) {
                String text = mDatas.get(position).substring(0, 1).toUpperCase();
                if (position == 0) {
                    outRect.set(0, mTitleHeight, 0, 0);
                } else if (text != null &amp;&amp; !text.equals(mDatas.get(position - 1).substring(0, 1).toUpperCase())) {
                    outRect.set(0, mTitleHeight, 0, 0);
                } else {
                    outRect.set(0, 0, 0, 0);
                }
            }
}

private void drawText(Canvas canvas, float left, float right, View child, String text) {
//画出文字
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>LetterIndex.java</strong><br> 该类用来画出字母导航栏，并且提供方法获取/设置当前选中的字母</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> public interface onIndexClickListener {
        void onIndexClick(int chooseId);
        void onActionUp();
    }

    public void setOnIndexClickListener(onIndexClickListener listener) {
        this.mClickListener = listener;
    }

    public void setChooseId(int chooseId) {
        if (chooseId &gt;= 0 &amp;&amp; chooseId &lt; mIndexTexts.length) {
            mChooseId = chooseId;
            invalidate();
        }
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后重写<code>onTouchEvent(MotionEvent event)</code>方法，在 ACTION_DOWN、ACTION_MOVE、ACTION_UP 时调用对应的方法即可。</p><p>重写 onDraw() 方法，画出对应的界面</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>   @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int height = getHeight() - getPaddingTop() - getPaddingBottom();
        float width = getWidth();
        //childHeight 是每一个字母所在单元的高度
        float childHeight = (float) height / mIndexTexts.length;

        //如果被点击了，就画出背景
        if (isClick) {
            mPaint.setColor(mColorIndexBg);
            canvas.drawRect(0, 0, width, height, mPaint);
        }

        Rect bounds = new Rect();
        mPaint.setTextSize(mSizeText);
        mPaint.setTextAlign(Paint.Align.CENTER);
        for (int i = 0; i &lt; mIndexTexts.length; i++) {
            String text = mIndexTexts[i];
            mPaint.setColor(mColorText);
            //在被选中的字后面画一个圆，并改变字的颜色
            if (i == mChooseId) {
                mPaint.setColor(mColorChooseTextBg);
                canvas.drawCircle(width / 2, childHeight / 2 + i * childHeight,
                        mSizeText / 2 + 2, mPaint);
                mPaint.setColor(mColorChooseText);
            }
            mPaint.getTextBounds(text, 0, text.length(), bounds);
            //bounds里面保存着要画的字的一些属性，如x，y，centerX，centerY等，
            //要注意 canvas.drawText（text,x,y,mpaint）中y并不是text的最低端，而是baseline。
            float x = width / 2;
            float y = -bounds.centerY() + childHeight / 2 + i * childHeight;
            canvas.drawText(text, x, y, mPaint);
        }
    }

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码" aria-hidden="true">#</a> 源码</h2>`,13),o={href:"https://github.com/jixiaoyong/my_application_on_deepin/tree/master/contactsdemo/src/main",target:"_blank",rel:"noopener noreferrer"},u=e("h2",{id:"预览如下",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#预览如下","aria-hidden":"true"},"#"),i(" 预览如下")],-1),m=e("figure",null,[e("img",{src:"http://upload-images.jianshu.io/upload_images/120748-183eea3cad2b42ac.gif?imageMogr2/auto-orient/strip",alt:"预览.gif",tabindex:"0",loading:"lazy"}),e("figcaption",null,"预览.gif")],-1);function b(h,x){const n=s("ExternalLinkIcon");return l(),d("div",null,[v,e("p",null,[i("源代码在我的 Github，"),e("a",o,[i("点这里"),a(n)]),i("可以找到。")]),u,m])}const p=t(c,[["render",b],["__file","a2c96aac.html.vue"]]);export{p as default};
