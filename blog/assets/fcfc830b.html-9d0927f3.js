import{_ as n,o as e,c as t,e as i}from"./app-c00d03e9.js";const a={},s=i(`<p>这几天学习 AppWidget，很简单的组件却花费了不少功夫，今天对 PendingIntent 的用法做了一些简单的整理。</p><p><strong>PendingIntent</strong></p><blockquote><p>PandingIntent 就像是一个设计好的处理预案，当达到某个特定条件时，便会调用该 Intent 所指定动作（打开服务，Activity 或者发送广播）。</p><p>这里使用该方法在 AppWidget 里面为按钮添加监听事件，当按钮被点击的时候触发相应的动作</p></blockquote><p>AppWidget 和应用程序不再同一个进程当中，而是在 HomeScreen 上面执行，所以不能直接为 AppWidget 中的 Button 添加监听事件，需要用 <code>remoteViews.setPendingIntent(R.id.widget_button,pendingIntent);</code>意思是当按下按钮的时候 pendingIntent 中的 Intent 就会执行</p><p>PendingIntent 当某个事件出现之后才会执行</p><p>RemoteViews 对象 代表了一系列的 View 对象，和主程序不在同一个进程为 AppWidget 控件绑定处理器</p><p><strong>流程概述：</strong></p><ul><li><p>添加 appwidget_provider_info.xml 在 res/xml 下新建 appwidget_provider_info.xml</p><ul><li>描述 AppWidget 的基本信息如最小高度、宽度等，还有就是该挂件的布局文件</li></ul></li><li><p>在 res/layout 下面为该挂件设置具体的布局样式</p><ul><li>向 AppWidget 的布局文件中添加一个 Button</li><li>向 AppWidget 的布局文件中添加一个 TextView</li></ul></li><li><p>新建 MyAppWidget.java 继承自 AppWidgetProvider</p><p>在该类的 onUpdate() 方法中为 Button 设置、添加监听事件</p><ul><li>建立一个 Intent 对象</li><li>用该 Intent 对象创建一个 PendingIntent 对象</li><li>创建一个 RemoteViews 对象</li><li>用该 RemoveViews 对象为 按钮绑定事件处理器</li><li>更新按钮</li></ul></li><li><p>注册事件</p></li><li><p>备注：要是为 AppWidget 中的 Button 设置的事件是打开一个 TargetActivity，还需要添加一个 TargetActivity 类和对应的布局文件</p></li></ul><p><strong>以下是代码</strong></p><ul><li>appwidget_provider_info.xml</li></ul><p>这个布局文件是 AppWidget 的信息</p><p>描述了 AppWidget 的最小高，最小宽以及它的布局文件</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;appwidget-provider
    android:minHeight=&quot;200dp&quot;
    android:minWidth=&quot;300dp&quot;
    android:initialLayout=&quot;@layout/app_widget&quot;
    xmlns:android=&quot;http://schemas.android.com/apk/res/android&quot; &gt;
&lt;/appwidget-provider&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>app_widget.xml</li></ul><p>这个布局文件是 Widget 在桌面上显示的样式</p><p>定义了 AppWidget 中各个组件及其样式</p><p>其中 Button 用来响应点击事件，加入 TargetActivity</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;LinearLayout xmlns:android=&quot;http://schemas.android.com/apk/res/android&quot;
    android:layout_width=&quot;200dp&quot;
    android:layout_height=&quot;200dp&quot;
    android:orientation=&quot;vertical&quot;&gt;

&lt;TextView
        android:layout_width=&quot;match_parent&quot;
        android:layout_height=&quot;wrap_content&quot;
        android:text=&quot;hello,world!&quot;/&gt;

&lt;Button
        android:id=&quot;@+id/app_widget_btn&quot;
        android:layout_width=&quot;200dp&quot;
        android:layout_height=&quot;150dp&quot;
        android:background=&quot;#ff00ff&quot;
        android:text=&quot;this is my app widget button&quot;/&gt;
&lt;/LinearLayout&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>target_activity.xml</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;LinearLayout xmlns:android=&quot;http://schemas.android.com/apk/res/android&quot;
    android:layout_width=&quot;match_parent&quot;
    android:layout_height=&quot;match_parent&quot;&gt;

    &lt;TextView
        android:layout_width=&quot;match_parent&quot;
        android:layout_height=&quot;wrap_content&quot;
        android:textSize=&quot;50sp&quot;
        android:background=&quot;#00ff00&quot;
        android:text=&quot;\\n hello,welcome to target activity!&quot;/&gt;

&lt;/LinearLayout&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>MyAppWidget.java</li></ul><p>主要是修改了 update() 方法：</p><p>定义了一个预先设定的动作—- Intent 对象；</p><p>利用该 Intent 读写，创建一个 PendingIntent 对象；</p><p>创建一个 RemoteView 对象，并为按钮绑定监听事件</p><p>刷新 AppWidget。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class MyAppWidget extends AppWidgetProvider {

    @Override
    public void onReceive(Context context, Intent intent) {
        // TODO Auto-generated method stub
        super.onReceive(context, intent);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager,
                         int[] appWidgetIds) {
        // TODO Auto-generated method stub
        super.onUpdate(context, appWidgetManager, appWidgetIds);

        //appWidgetIds 每一次向屏幕添加 AppWidget 的时候都会增加一个唯一的 appWidget 的 Id
        for(int i = 0; i &lt; appWidgetIds.length;i++){
          //创建一个 Intent 对象
            Intent intent = new Intent(context,TargetActivity.class);
            //创建一个 PendingIntent 对象
            PendingIntent pendingIntent = PendingIntent.getActivity(context,0,intent,0);
            // remoteViews 代表 AppWidget 上所有的控件
            RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.app_widget);
            //为按钮绑定事件处理器
            /*
            * 参1，指定被绑定处理器的控件id
            * 参2，指定事件发生时会被执行的 PendingIntent
             */
            remoteViews.setOnClickPendingIntent(R.id.app_widget_btn,pendingIntent);
            //更新 AppWidget ，参1是用于指定被更新 appWidget 的ID
            appWidgetManager.updateAppWidget(appWidgetIds[i],remoteViews);
        }
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        // TODO Auto-generated method stub
        super.onDeleted(context, appWidgetIds);
    }

    @Override
    public void onEnabled(Context context) {
        // TODO Auto-generated method stub
        super.onEnabled(context);
    }

    @Override
    public void onDisabled(Context context) {
        // TODO Auto-generated method stub
        super.onDisabled(context);
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>TargetActivity.java</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class TargetActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.target_activity);
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>AndroidManifest.xml</li></ul><p>在 AndroidManifest.xml 中注册 TargetActivity 和 MyAppWidget</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>application</span><span class="token punctuation">&gt;</span></span>
...
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>activity</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>.TargetActivity<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>activity</span><span class="token punctuation">&gt;</span></span>

    <span class="token comment">&lt;!-- 注意这里注册了一个 MyAppWidget 接收数据--&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>receiver</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>.MyAppWidget<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>intent-filter</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>action</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.appwidget.action.APPWIDGET_UPDATE<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>intent-filter</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta-data</span>
            <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.appwidget.provider<span class="token punctuation">&quot;</span></span>
            <span class="token attr-name"><span class="token namespace">android:</span>resource</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>@xml/appwidget_provider_info<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>receiver</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>application</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,32),d=[s];function l(p,o){return e(),t("div",null,d)}const c=n(a,[["render",l],["__file","fcfc830b.html.vue"]]);export{c as default};
