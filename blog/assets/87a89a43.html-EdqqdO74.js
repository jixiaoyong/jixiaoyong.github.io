import{_ as e,c as a,o as t,a as i}from"./app-CHaeU_ce.js";const s={},r=i(`<p>最近看到一个<a href="https://v2ex.com/t/633650?p=1" target="_blank" rel="noopener noreferrer">帖子</a>，表示有人以<code>&quot;YYYY-MM-dd&quot;</code>格式化日期时，在<code>2019-12-30</code>时出现<code>2020-12-30</code>的 BUG。</p><p>本文来简单分析一下为什么会出现这个情况。</p><p>根据<a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#year" target="_blank" rel="noopener noreferrer">JDK 文档关于日期的定义</a>，<code>y</code>表示的是我们日常使用的年份，而<code>Y</code>表示的是<code>Week year</code>。</p><p>先了解几个知识点：</p><h2 id="week-year" tabindex="-1"><a class="header-anchor" href="#week-year"><span>Week year</span></a></h2><p><code>Week year</code>表示的是<strong>这个周所属的年份</strong>。</p><blockquote><p>A <em>week year</em> is in sync with a <code>WEEK_OF_YEAR</code> cycle. All weeks between the first and last weeks (inclusive) have the same <em>week year</em> value. Therefore, the first and last days of a week year may have different calendar year values.</p><p>来源：<a href="https://docs.oracle.com/javase/7/docs/api/java/util/GregorianCalendar.html#week_year" target="_blank" rel="noopener noreferrer">https://docs.oracle.com/javase/7/docs/api/java/util/GregorianCalendar.html#week_year</a></p></blockquote><h2 id="weak-of-year" tabindex="-1"><a class="header-anchor" href="#weak-of-year"><span>WEAK_OF_YEAR</span></a></h2><p>指的是这一年所有的周，从第 01 周开始到该年最后一周。</p><p>要注意这个周不一定是自然周，所包含的日期也不一定全部都是当年的日期。</p><blockquote><p>Values calculated for the <a href="https://docs.oracle.com/javase/7/docs/api/java/util/Calendar.html#WEEK_OF_YEAR" target="_blank" rel="noopener noreferrer"><code>WEEK_OF_YEAR</code></a> field range from 1 to 53. The first week of a calendar year is the earliest seven day period starting on <a href="https://docs.oracle.com/javase/7/docs/api/java/util/Calendar.html#getFirstDayOfWeek()" target="_blank" rel="noopener noreferrer"><code>getFirstDayOfWeek()</code></a> that contains at least <a href="https://docs.oracle.com/javase/7/docs/api/java/util/Calendar.html#getMinimalDaysInFirstWeek()" target="_blank" rel="noopener noreferrer"><code>getMinimalDaysInFirstWeek()</code></a> days from that year.</p></blockquote><h2 id="第-01-周" tabindex="-1"><a class="header-anchor" href="#第-01-周"><span>第 01 周</span></a></h2><p>根据这份<a href="https://docs.oracle.com/javase/7/docs/api/java/util/GregorianCalendar.html#week_year" target="_blank" rel="noopener noreferrer">JDK 文档</a>，当 <code>getFirstDayOfWeek()</code> is <code>MONDAY</code>（2） and <code>getMinimalDaysInFirstWeek()</code> is 4 时，JAVA 判断周日期的标准与<a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener noreferrer">ISO_8601</a>兼容：</p><blockquote><p>第 01 周有几个相互等效且兼容的描述：</p><p>一年中第一个星期四的星期（正式的 ISO 定义），</p><p>1 月 4 日这一周，</p><p>起始年份中大部分（四天或以上）的第一周，以及</p><p>从 12 月 29 日至 1 月 4 日的星期一开始的一周。</p><p>来源：<a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener noreferrer">https://en.wikipedia.org/wiki/ISO_8601</a></p></blockquote><p>按照 JAVA 文档中的定义，每年最开始的几天和最后的几天的<code>Week year</code>不一定是当年的年份值，而是受到每年的<em>第 01 周/最后一周</em>的影响。</p><p>JAVA 中判断周主要受到<code>Calendar</code>对象的<code>getFirstDayOfWeek()</code>和<code>getMinimalDaysInFirstWeek()</code>这两个本地值的影响。</p><p>其中：</p><ul><li><code>getFirstDayOfWeek() </code>指定一周的第一天，比如，美国一周从<code>SUNDAY</code> 开始，法国则是<code>MONDAY</code> 。</li><li><code>getMinimalDaysInFirstWeek()</code> 一年第一周所需最小的天数。比如 1 表示只要包含第一天就算该年的第一周，而 7 表示只有完整的一周都在该年才算该年的第一周。</li></ul><p><strong>注意</strong>：真正影响我们格式化日期结果的是<code>SimpleDateFormat</code>中的<code>calendar</code>对象对应的值。</p><p>而通过打印这个<code>simpleDateFormat.calendar</code>，我们看到：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//JDK1.7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">minimalDaysInFirstWeek</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">firstDayOfWeek</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> //SUNDAY</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以可以得出结论，JAVA<strong>默认只要次年的 1 月 1 日在在这个跨年周，那么本周所有日期的<code>Week year</code>都是次年的</strong>（<code>JDK1.7</code>）。</p><h2 id="问题分析" tabindex="-1"><a class="header-anchor" href="#问题分析"><span>问题分析</span></a></h2><p>有了以上知识，我们再看看<code>2019-12-30</code>以<code>YYYY</code>格式化为什么会出现问题：</p><p>先看一下这些日期对应的星期：</p><table><thead><tr><th>周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr></thead><tbody><tr><td>29</td><td>30</td><td>31</td><td><strong>1</strong></td><td>2</td><td>3</td><td>4</td></tr></tbody></table><p>首先根据 JDK 默认的<code>第01周</code>的定义，<code>2020-01-01</code>所在的周为<code>2020的第一周</code>，所以<code>2019-12-29到2020-01-04</code>都属于是<code>2020年的第01周</code>。</p><p>再根据<code>YYYY</code>表示的是<code>Week year</code>的结论，可以知道，当使用<code>YYYY</code>格式化时，<code>2019-12-29到2020-01-04</code>都会得到<code>2020</code>。</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">val</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> calendar </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> Calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">getInstance</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">val</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> simpleDateFormat </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> SimpleDateFormat</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;YYYY yyyy MM dd&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">set</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2019</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">12</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">29</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(simpleDateFormat.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">format</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(calendar.time))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//output</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">DATE:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">2019</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> 12</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> 29</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">minimalDaysInFirstWeek:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">firstDayOfWeek:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">YYYY yyyy MM dd</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2020</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2019</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 12</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 29</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而如果我们把第一周最小天数<code>minimalDaysInFirstWeek</code>改为<code>5</code>天，那么很明显这一周属于<code>2020</code>年的天数（从周日到周一，只有 1 号到 4 号 4 天）不够 5 天，所以这一周被划归为<code>2019</code>年的第<code>53周</code>，<code>2019-12-29到2020-01-04</code>的<code>week year</code>都是属于<code>2019</code>。</p><div class="language-kotlin line-numbers-mode" data-highlighter="shiki" data-ext="kotlin" data-title="kotlin" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">val</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> calendar </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> Calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">getInstance</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">val</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> simpleDateFormat </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> SimpleDateFormat</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;YYYY yyyy MM dd&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">set</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2019</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">12</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">29</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">simpleDateFormat.calendar.minimalDaysInFirstWeek </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 5</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(simpleDateFormat.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">format</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(calendar.time))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">//output</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">DATE:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">2019</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> 12</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> 29</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">minimalDaysInFirstWeek:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">firstDayOfWeek:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">YYYY yyyy MM dd</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2019</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 2019</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 12</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 29</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再比如下面这个<a href="https://blog.csdn.net/bewilderment/article/details/48391717" target="_blank" rel="noopener noreferrer">示例</a>中的<code>2010-12-26</code>。</p><figure><img src="https://img-blog.csdn.net/20150912103324519?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>按照<code>JDK1.7</code>默认算法，一周从周日（<code>2010-12-26</code>）开始，并且当年的 1 月 1 日（<code>2011-01-01</code>）所在周为该年第一周，所以<code>2010-12-26到2011-01-01</code>都被划到了<code>2011</code>年的第一周。</p><p>但如果按照<a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener noreferrer">ISO_8601</a>的标准，一周从周一开始，并且起始年份包含的天数至少要有<code>4</code>天：</p><p>则很明显<code>2010-12-26</code>属于<code>2010</code>年的<code>51周</code>，而<code>2010-12-27到2011-01-02</code>都属于<code>2010</code>年的第<code>52周</code>（属于 2020 年的只有 2 天，不满足第一周的条件）。</p><table><thead><tr><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th><th>周日</th></tr></thead><tbody><tr><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td></tr><tr><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>1</td><td>2</td></tr></tbody></table><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>结合以上结论，我们可以看到，在 JAVA 中（<code>JDK1.7</code>）：</p><ul><li><p><code>“YYYY” </code>表示<code>Week year</code></p></li><li><p>每年最开始的几天和最后的几天的<code>Week year</code>不一定是当年的值，而是受到当年的第一周/最后一周的影响。</p></li><li><p>JAVA 周的判断与<code>simpleDateFormat.calendar.minimalDaysInFirstWeek</code>和<code>simpleDateFormat.calendar.firstDayOfWeek</code>有关。</p><p>而这两个值都属于本地化值，<strong>在国内可以简单理解为一年 1 月 1 日所在的周就是当年的第一周。</strong></p></li><li><p>我们可以通过修改<code>minimalDaysInFirstWeek</code>和<code>firstDayOfWeek</code>来更改<code>YYYY</code>格式化的值。</p></li></ul><h2 id="附录" tabindex="-1"><a class="header-anchor" href="#附录"><span>附录</span></a></h2><p>JDK 中日期格式化的参数及含义（来自 <a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#month%EF%BC%89%EF%BC%9A" target="_blank" rel="noopener noreferrer">https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#month）：</a></p><table><thead><tr><th>Letter</th><th>Date or Time Component</th><th>Presentation</th><th>Examples</th></tr></thead><tbody><tr><td><code>G</code></td><td>Era designator</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#text" target="_blank" rel="noopener noreferrer">Text</a></td><td><code>AD</code></td></tr><tr><td><code>y</code></td><td>Year</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#year" target="_blank" rel="noopener noreferrer">Year</a></td><td><code>1996</code>; <code>96</code></td></tr><tr><td><code>Y</code></td><td>Week year</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#year" target="_blank" rel="noopener noreferrer">Year</a></td><td><code>2009</code>; <code>09</code></td></tr><tr><td><code>M</code></td><td>Month in year</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#month" target="_blank" rel="noopener noreferrer">Month</a></td><td><code>July</code>; <code>Jul</code>; <code>07</code></td></tr><tr><td><code>w</code></td><td>Week in year</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>27</code></td></tr><tr><td><code>W</code></td><td>Week in month</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>2</code></td></tr><tr><td><code>D</code></td><td>Day in year</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>189</code></td></tr><tr><td><code>d</code></td><td>Day in month</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>10</code></td></tr><tr><td><code>F</code></td><td>Day of week in month</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>2</code></td></tr><tr><td><code>E</code></td><td>Day name in week</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#text" target="_blank" rel="noopener noreferrer">Text</a></td><td><code>Tuesday</code>; <code>Tue</code></td></tr><tr><td><code>u</code></td><td>Day number of week (1 = Monday, ..., 7 = Sunday)</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>1</code></td></tr><tr><td><code>a</code></td><td>Am/pm marker</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#text" target="_blank" rel="noopener noreferrer">Text</a></td><td><code>PM</code></td></tr><tr><td><code>H</code></td><td>Hour in day (0-23)</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>0</code></td></tr><tr><td><code>k</code></td><td>Hour in day (1-24)</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>24</code></td></tr><tr><td><code>K</code></td><td>Hour in am/pm (0-11)</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>0</code></td></tr><tr><td><code>h</code></td><td>Hour in am/pm (1-12)</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>12</code></td></tr><tr><td><code>m</code></td><td>Minute in hour</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>30</code></td></tr><tr><td><code>s</code></td><td>Second in minute</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>55</code></td></tr><tr><td><code>S</code></td><td>Millisecond</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#number" target="_blank" rel="noopener noreferrer">Number</a></td><td><code>978</code></td></tr><tr><td><code>z</code></td><td>Time zone</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#timezone" target="_blank" rel="noopener noreferrer">General time zone</a></td><td><code>Pacific Standard Time</code>; <code>PST</code>; <code>GMT-08:00</code></td></tr><tr><td><code>Z</code></td><td>Time zone</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#rfc822timezone" target="_blank" rel="noopener noreferrer">RFC 822 time zone</a></td><td><code>-0800</code></td></tr><tr><td><code>X</code></td><td>Time zone</td><td><a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#iso8601timezone" target="_blank" rel="noopener noreferrer">ISO 8601 time zone</a></td><td><code>-08</code>; <code>-0800</code>; <code>-08:00</code></td></tr></tbody></table><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><p>感谢这篇文章，让我推翻了上一次的结论，发现了真正的原因：<a href="https://blog.csdn.net/bewilderment/article/details/48391717" target="_blank" rel="noopener noreferrer">JAVA 中的 SimpleDateFormat yyyy 和 YYYY 的区别</a></p><p><a href="https://docs.oracle.com/javase/7/docs/api/java/util/GregorianCalendar.html#week_year" target="_blank" rel="noopener noreferrer">GregorianCalenda jdk1.7</a></p><p>在线显示本周是一年第几周的网站：<a href="https://www.epochconverter.com/weeknumbers" target="_blank" rel="noopener noreferrer">What&#39;s the Current Week Number?</a></p>`,47),d=[r];function n(o,l){return t(),a("div",null,d)}const c=e(s,[["render",n],["__file","87a89a43.html.vue"]]),p=JSON.parse('{"path":"/posts/87a89a43.html","title":"Java 笔记之 YYYY 格式化日期","lang":"zh-CN","frontmatter":{"permalink":"/posts/87a89a43.html","title":"Java 笔记之 YYYY 格式化日期","abbrlink":"87a89a43","date":"2020-01-07T03:38:54.000Z","updated":"2023-12-30T08:17:02.000Z","isOriginal":true,"description":"最近看到一个帖子，表示有人以\\"YYYY-MM-dd\\"格式化日期时，在2019-12-30时出现2020-12-30的 BUG。 本文来简单分析一下为什么会出现这个情况。 根据JDK 文档关于日期的定义，y表示的是我们日常使用的年份，而Y表示的是Week year。 先了解几个知识点： Week year Week year表示的是这个周所属的年份。 A...","head":[["meta",{"property":"og:url","content":"https://jixiaoyong.github.io/blog/posts/87a89a43.html"}],["meta",{"property":"og:site_name","content":"JI,XIAOYONG"}],["meta",{"property":"og:title","content":"Java 笔记之 YYYY 格式化日期"}],["meta",{"property":"og:description","content":"最近看到一个帖子，表示有人以\\"YYYY-MM-dd\\"格式化日期时，在2019-12-30时出现2020-12-30的 BUG。 本文来简单分析一下为什么会出现这个情况。 根据JDK 文档关于日期的定义，y表示的是我们日常使用的年份，而Y表示的是Week year。 先了解几个知识点： Week year Week year表示的是这个周所属的年份。 A..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://img-blog.csdn.net/20150912103324519?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-31T16:00:22.000Z"}],["meta",{"property":"article:author","content":"JI,XIAOYONG"}],["meta",{"property":"article:published_time","content":"2020-01-07T03:38:54.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-31T16:00:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java 笔记之 YYYY 格式化日期\\",\\"image\\":[\\"https://img-blog.csdn.net/20150912103324519?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast\\"],\\"datePublished\\":\\"2020-01-07T03:38:54.000Z\\",\\"dateModified\\":\\"2024-05-31T16:00:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"JI,XIAOYONG\\",\\"url\\":\\"https://jixiaoyong.github.io\\"}]}"]]},"headers":[{"level":2,"title":"Week year","slug":"week-year","link":"#week-year","children":[]},{"level":2,"title":"WEAK_OF_YEAR","slug":"weak-of-year","link":"#weak-of-year","children":[]},{"level":2,"title":"第 01 周","slug":"第-01-周","link":"#第-01-周","children":[]},{"level":2,"title":"问题分析","slug":"问题分析","link":"#问题分析","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"附录","slug":"附录","link":"#附录","children":[]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"createdTime":1653726847000,"updatedTime":1717171222000,"contributors":[{"name":"jixiaoyong","email":"jixiaoyong1995@gmail.com","commits":3},{"name":"JI,XIAOYONG","email":"jixiaoyong1995@gmail.com","commits":1}]},"readingTime":{"minutes":5.41,"words":1623},"filePathRelative":"_posts/Java笔记之YYYY格式化日期.md","localizedDate":"2020年1月7日","excerpt":"<p>最近看到一个<a href=\\"https://v2ex.com/t/633650?p=1\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">帖子</a>，表示有人以<code>\\"YYYY-MM-dd\\"</code>格式化日期时，在<code>2019-12-30</code>时出现<code>2020-12-30</code>的 BUG。</p>\\n<p>本文来简单分析一下为什么会出现这个情况。</p>\\n<p>根据<a href=\\"https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#year\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">JDK 文档关于日期的定义</a>，<code>y</code>表示的是我们日常使用的年份，而<code>Y</code>表示的是<code>Week year</code>。</p>","autoDesc":true}');export{c as comp,p as data};