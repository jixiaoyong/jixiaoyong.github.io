/**
 * GitHub 贡献 Sparkline · 账号注册年–至今 · 按月超细条
 * 优先读 localStorage 缓存；30 天内仅刷新近 2 个月，历史月份复用缓存。
 * 私有仓库不计入公开 API。柱高按全时段全局最大值线性比例。
 */
(function (global) {
  const USER = "jixiaoyong";
  const FALLBACK_START_YEAR = 2016;
  const BAR_H_DEFAULT = 36;
  const MIN_NONZERO_PX = 2;
  const CACHE_VERSION = 1;
  const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
  const RECENT_MONTH_COUNT = 2;
  const API_YEAR = (y) => `https://github-contributions-api.jogruber.de/v4/${USER}?y=${y}`;
  /** 年份轴策略：adaptive | decimate | slant | scroll */
  const YEAR_LABEL_STRATEGY = "adaptive";
  const YEAR_LABEL_MIN_PX = 14;
  const YEAR_LABEL_FULL_MIN_PX = 22;
  const LOADING_MIN_MS = 0;

  let measureCanvas = null;

  let cachedStartYear = null;
  const yearLabelObservers = new WeakMap();

  function cacheKey() {
    return `github-contrib:v${CACHE_VERSION}:${USER}`;
  }

  function readCacheEntry() {
    try {
      const raw = localStorage.getItem(cacheKey());
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (entry.user !== USER || entry.version !== CACHE_VERSION) return null;
      if (!entry.byMonth || typeof entry.byMonth !== "object") return null;
      return entry;
    } catch (_) {
      return null;
    }
  }

  function writeCacheEntry(entry) {
    try {
      localStorage.setItem(cacheKey(), JSON.stringify(entry));
    } catch (_) {
      /* quota / 隐私模式 */
    }
  }

  function isCacheFresh(entry) {
    return Boolean(entry && entry.fetchedAt && Date.now() - entry.fetchedAt < CACHE_TTL_MS);
  }

  function recentMonthKeys(referenceDate = new Date()) {
    const keys = [];
    for (let i = 0; i < RECENT_MONTH_COUNT; i++) {
      const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    return keys;
  }

  function yearsForMonthKeys(monthKeys) {
    return [...new Set(monthKeys.map((k) => parseInt(k.slice(0, 4), 10)))];
  }

  async function resolveStartYear() {
    if (cachedStartYear != null) return cachedStartYear;
    try {
      const r = await fetch(`https://api.github.com/users/${USER}`);
      if (r.ok) {
        const u = await r.json();
        if (u.created_at) {
          cachedStartYear = new Date(u.created_at).getFullYear();
          return cachedStartYear;
        }
      }
    } catch (_) {
      /* 离线或限流时回退 */
    }
    cachedStartYear = FALLBACK_START_YEAR;
    return cachedStartYear;
  }

  function readBarHeight(container) {
    if (!container) return BAR_H_DEFAULT;
    const raw = getComputedStyle(container).getPropertyValue("--spark-h").trim();
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : BAR_H_DEFAULT;
  }

  function yearMaxMap(months) {
    const map = {};
    months.forEach((m) => {
      const y = m.key.slice(0, 4);
      map[y] = Math.max(map[y] || 0, m.count);
    });
    return map;
  }

  function globalMax(months) {
    let max = 0;
    months.forEach((m) => {
      if (m.count > max) max = m.count;
    });
    return Math.max(1, max);
  }

  function linearRatio(count, max) {
    return count / Math.max(1, max);
  }

  function scaledRatio(count, max) {
    return linearRatio(count, max);
  }

  function monthLevel(count, max) {
    if (count <= 0) return 0;
    const r = linearRatio(count, max);
    if (r < 0.15) return 1;
    if (r < 0.35) return 2;
    if (r < 0.6) return 3;
    return 4;
  }

  function barHeight(count, max, barH) {
    if (count <= 0) return 1;
    const scaled = linearRatio(count, max) * barH;
    return Math.max(MIN_NONZERO_PX, Math.round(scaled));
  }

  function monthRange(startYear, endYear) {
    const now = new Date();
    const months = [];
    for (let y = startYear; y <= endYear; y++) {
      const lastM = y === now.getFullYear() ? now.getMonth() + 1 : 12;
      for (let m = 1; m <= lastM; m++) {
        months.push(`${y}-${String(m).padStart(2, "0")}`);
      }
    }
    return months;
  }

  function buildDemoMonths(keys) {
    return keys.map((key, i) => {
      const n = Math.floor(((Math.sin(i * 0.31) + 1) * 4 + (i % 9 === 0 ? 8 : 0)) * (0.35 + (i % 7) * 0.08));
      return { key, count: n };
    });
  }

  function buildResultFromByMonth(byMonth, keys, startYear) {
    const months = keys.map((key) => ({ key, count: byMonth[key] || 0 }));
    const total = months.reduce((s, m) => s + m.count, 0);
    return {
      months,
      total,
      demo: false,
      startYear,
      start: keys[0],
      end: keys[keys.length - 1],
    };
  }

  async function fetchYearsByMonth(years) {
    const responses = await Promise.all(
      years.map((y) =>
        fetch(API_YEAR(y))
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    );

    const byMonth = {};
    let total = 0;
    responses.forEach((data) => {
      if (!data || !Array.isArray(data.contributions)) return;
      data.contributions.forEach((d) => {
        const k = d.date.slice(0, 7);
        byMonth[k] = (byMonth[k] || 0) + (d.count || 0);
        total += d.count || 0;
      });
    });

    return { byMonth, total };
  }

  function saveCacheFromByMonth(byMonth, startYear, endYear) {
    writeCacheEntry({
      version: CACHE_VERSION,
      user: USER,
      fetchedAt: Date.now(),
      startYear,
      endYear,
      byMonth,
    });
  }

  async function loadFull(startYear, endYear, keys) {
    const years = [];
    for (let y = startYear; y <= endYear; y++) years.push(y);

    const { byMonth, total } = await fetchYearsByMonth(years);
    const months = keys.map((key) => ({ key, count: byMonth[key] || 0 }));

    if (total === 0) {
      const demo = buildDemoMonths(keys);
      return {
        months: demo,
        total: demo.reduce((s, m) => s + m.count, 0),
        demo: true,
        startYear,
        start: keys[0],
        end: keys[keys.length - 1],
      };
    }

    saveCacheFromByMonth(byMonth, startYear, endYear);
    return buildResultFromByMonth(byMonth, keys, startYear);
  }

  async function loadIncremental(cacheEntry, startYear, endYear, keys) {
    const recentKeys = recentMonthKeys().filter((k) => keys.includes(k));
    const yearsToFetch = yearsForMonthKeys(recentKeys.length ? recentKeys : recentMonthKeys());
    const { byMonth: freshByMonth } = await fetchYearsByMonth(yearsToFetch);

    const merged = { ...cacheEntry.byMonth };
    keys.forEach((k) => {
      if (!(k in merged)) merged[k] = 0;
    });
    recentKeys.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(freshByMonth, k)) {
        merged[k] = freshByMonth[k];
      }
    });

    saveCacheFromByMonth(merged, startYear, endYear);
    return buildResultFromByMonth(merged, keys, startYear);
  }

  async function load(options) {
    const opts = options || {};
    const startYear = opts.startYear ?? (await resolveStartYear());
    const endYear = new Date().getFullYear();
    const keys = monthRange(startYear, endYear);

    if (opts.forceDemo) {
      const months = buildDemoMonths(keys);
      const total = months.reduce((s, m) => s + m.count, 0);
      return { months, total, demo: true, startYear, start: keys[0], end: keys[keys.length - 1] };
    }

    const cacheEntry = readCacheEntry();
    const canUseIncremental =
      cacheEntry &&
      isCacheFresh(cacheEntry) &&
      cacheEntry.startYear === startYear;

    if (canUseIncremental) {
      try {
        const result = await loadIncremental(cacheEntry, startYear, endYear, keys);
        if (result.total > 0) return result;
      } catch (_) {
        /* 增量失败时回退 */
      }
      if (cacheEntry.byMonth) {
        const fallback = buildResultFromByMonth(cacheEntry.byMonth, keys, startYear);
        if (fallback.total > 0) return fallback;
      }
    }

    try {
      return await loadFull(startYear, endYear, keys);
    } catch (_) {
      if (cacheEntry && cacheEntry.byMonth) {
        const stale = buildResultFromByMonth(cacheEntry.byMonth, keys, startYear);
        if (stale.total > 0) return stale;
      }
      throw _;
    }
  }

  function yearMonthCounts(months) {
    const counts = {};
    months.forEach((m) => {
      const y = m.key.slice(0, 4);
      counts[y] = (counts[y] || 0) + 1;
    });
    return counts;
  }

  function yearFlex(count) {
    return `${count} 1 0%`;
  }

  function yearLabelShort(year) {
    return `'${String(year).slice(2)}`;
  }

  function yearLabelTwoDigit(year) {
    return String(year).slice(2);
  }

  function measureLabelTextWidth(text, element) {
    if (!text) return YEAR_LABEL_FULL_MIN_PX;
    if (element) {
      const style = getComputedStyle(element);
      const font = style.font || `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      if (!measureCanvas) measureCanvas = document.createElement("canvas");
      const ctx = measureCanvas.getContext("2d");
      if (ctx) {
        ctx.font = font;
        return ctx.measureText(text).width;
      }
    }
    return String(text).length * 5.5;
  }

  function labelSlotFitsText(span, text) {
    const slotW = span.getBoundingClientRect().width;
    if (slotW <= 0) return false;
    return slotW >= measureLabelTextWidth(text, span) + 2;
  }

  function labelSlotFitsFull(span) {
    const text = span.dataset.labelFull || span.dataset.year || span.textContent;
    return labelSlotFitsText(span, text);
  }

  function canShowAllFullYearLabels(labels) {
    return labels.length > 0 && labels.every(labelSlotFitsFull);
  }

  function applyYearLabelStrategy(wrap) {
    if (!wrap) return;
    const yearsEl = wrap.querySelector(".sparkline-years");
    if (!yearsEl) return;

    wrap.classList.remove("sparkline-wrap--scroll");
    yearsEl.className = "sparkline-years";
    yearsEl.classList.add(`sparkline-years--${YEAR_LABEL_STRATEGY}`);
    if (YEAR_LABEL_STRATEGY === "scroll") {
      wrap.classList.add("sparkline-wrap--scroll");
    }

    const labels = [...yearsEl.querySelectorAll(".sparkline-year")];
    const total = labels.length;
    labels.forEach((span, index) => {
      const full = span.dataset.year || span.textContent;
      const isEdge = index === 0 || index === total - 1;
      span.classList.toggle("sparkline-year--edge", isEdge);
      span.classList.toggle("sparkline-year--mid", !isEdge);
      span.classList.remove("sparkline-year--hidden", "sparkline-year--decimate-hide");
      span.dataset.labelFull = full;
      span.dataset.labelShort = yearLabelShort(full);
      span.dataset.labelTwoDigit = yearLabelTwoDigit(full);

      span.textContent = full;
    });

    if (YEAR_LABEL_STRATEGY === "adaptive") {
      refineAdaptiveYearLabels(yearsEl, labels);
    } else if (YEAR_LABEL_STRATEGY === "decimate") {
      refineDecimatedYearLabels(yearsEl, labels);
    }
  }

  function applyEdgeTwoDigitIfNeeded(labels, total) {
    [0, total - 1].forEach((index) => {
      const span = labels[index];
      if (!labelSlotFitsText(span, span.dataset.labelFull)) {
        span.textContent = span.dataset.labelTwoDigit;
      }
    });
  }

  function refineAdaptiveYearLabels(yearsEl, labels) {
    const total = labels.length;
    if (total <= 2) {
      labels.forEach((span) => {
        span.classList.remove("sparkline-year--hidden");
        span.textContent = span.dataset.labelFull;
      });
      labels.forEach((span) => {
        if (!labelSlotFitsText(span, span.dataset.labelFull)) {
          span.textContent = span.dataset.labelTwoDigit;
        }
      });
      return;
    }

    // 1) 全部四位年份
    labels.forEach((span) => {
      span.classList.remove("sparkline-year--hidden");
      span.textContent = span.dataset.labelFull;
    });
    if (canShowAllFullYearLabels(labels)) return;

    // 2) 首尾四位，中间 'YY
    labels.forEach((span, index) => {
      const isEdge = index === 0 || index === total - 1;
      span.textContent = isEdge ? span.dataset.labelFull : span.dataset.labelShort;
    });

    // 3) 首尾槽位仍不足 → 两位无撇号（16、26）
    applyEdgeTwoDigitIfNeeded(labels, total);

    const width = yearsEl.getBoundingClientRect().width;
    if (width <= 0) return;

    const shortMinPx = YEAR_LABEL_MIN_PX;
    const edgeMinPx = Math.max(
      measureLabelTextWidth(labels[0].textContent, labels[0]),
      measureLabelTextWidth(labels[total - 1].textContent, labels[total - 1])
    ) + 2;
    const middle = labels.slice(1, -1);
    let step = 1;
    while (step <= middle.length) {
      const visibleMiddle = Math.ceil(middle.length / step);
      const needed = 2 * edgeMinPx + visibleMiddle * shortMinPx;
      if (needed <= width) break;
      step += 1;
    }

    if (step > 1) {
      middle.forEach((span, index) => {
        if (index % step !== 0) span.classList.add("sparkline-year--hidden");
      });
    }
  }

  function refineDecimatedYearLabels(yearsEl, labels) {
    const width = yearsEl.getBoundingClientRect().width;
    const narrow = width > 0 && width < 520;
    labels.forEach((span, index) => {
      const isEdge = index === 0 || index === labels.length - 1;
      span.classList.remove("sparkline-year--decimate-hide");
      if (narrow && !isEdge && index % 2 === 0) {
        span.classList.add("sparkline-year--decimate-hide");
      }
    });
  }

  function observeYearLabels(wrap) {
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const prev = yearLabelObservers.get(wrap);
    if (prev) prev.disconnect();

    const ro = new ResizeObserver(() => applyYearLabelStrategy(wrap));
    ro.observe(wrap);
    const yearsEl = wrap.querySelector(".sparkline-years");
    if (yearsEl) ro.observe(yearsEl);
    yearLabelObservers.set(wrap, ro);
  }

  function renderYearAxis(wrap, months) {
    if (!wrap) return;
    let yearsEl = wrap.querySelector(".sparkline-years");
    if (!yearsEl) {
      yearsEl = document.createElement("div");
      yearsEl.className = "sparkline-years";
      yearsEl.setAttribute("aria-hidden", "true");
      wrap.appendChild(yearsEl);
    }
    yearsEl.innerHTML = "";
    const counts = yearMonthCounts(months);
    const years = Object.keys(counts).sort();
    years.forEach((y) => {
      const span = document.createElement("span");
      span.className = "sparkline-year";
      span.dataset.year = y;
      span.style.flex = yearFlex(counts[y]);
      span.textContent = y;
      yearsEl.appendChild(span);
    });
    applyYearLabelStrategy(wrap);
    observeYearLabels(wrap);
  }

  function showBarTip(wrap, text) {
    if (!wrap || !text) return;
    let tip = wrap.querySelector(".spark-tip");
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "spark-tip";
      tip.setAttribute("role", "status");
      tip.setAttribute("aria-live", "polite");
      wrap.appendChild(tip);
    }
    tip.textContent = text;
    tip.classList.add("visible");
    clearTimeout(tip._hideTimer);
    tip._hideTimer = setTimeout(() => tip.classList.remove("visible"), 2200);
  }

  function bindSparkInteraction(wrap, container) {
    if (!wrap || !container) return;
    container.querySelectorAll(".spark").forEach((bar) => {
      const label = bar.title;
      bar.setAttribute("tabindex", "0");
      bar.setAttribute("aria-label", label);

      const reveal = () => showBarTip(wrap, label);
      bar.addEventListener("click", reveal);
      bar.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          reveal();
        }
      });
    });
  }

  function renderSparkline(container, months, startYear) {
    const wrap = container.closest(".sparkline-wrap");
    const barH = readBarHeight(container);
    const maxCount = globalMax(months);
    const total = months.reduce((s, m) => s + m.count, 0);

    container.innerHTML = "";
    container.className = "sparkline sparkline--fine";
    container.style.height = `${barH}px`;
    container.setAttribute("role", "img");
    container.setAttribute(
      "aria-label",
      `GitHub ${startYear} 至今每月贡献，共 ${total} 次`
    );

    if (wrap) {
      const oldTip = wrap.querySelector(".spark-tip");
      if (oldTip) oldTip.remove();
    }

    const counts = yearMonthCounts(months);
    const groups = {};
    months.forEach((m) => {
      const year = m.key.slice(0, 4);
      if (!groups[year]) {
        const group = document.createElement("div");
        group.className = "sparkline-year-group";
        group.dataset.year = year;
        group.style.flex = yearFlex(counts[year]);
        groups[year] = group;
        container.appendChild(group);
      }
      const bar = document.createElement("span");
      bar.className = "spark";
      const lv = monthLevel(m.count, maxCount);
      bar.dataset.l = String(lv);
      bar.dataset.y = year;
      bar.style.height = `${barHeight(m.count, maxCount, barH)}px`;
      const [y, mo] = m.key.split("-");
      bar.title = `${y}.${mo}: ${m.count}`;
      groups[year].appendChild(bar);
    });

    renderYearAxis(wrap, months);
    bindSparkInteraction(wrap, container);
  }

  function syncCacheResult() {
    const entry = readCacheEntry();
    if (!entry || !isCacheFresh(entry) || !entry.byMonth) return null;
    const startYear = entry.startYear || FALLBACK_START_YEAR;
    const endYear = new Date().getFullYear();
    const keys = monthRange(startYear, endYear);
    const result = buildResultFromByMonth(entry.byMonth, keys, startYear);
    return result.total > 0 ? result : null;
  }

  function clearContribLoading(root, loadingStartedAt) {
    if (!root.classList.contains("contrib-loading")) return;
    const elapsed = loadingStartedAt ? Date.now() - loadingStartedAt : LOADING_MIN_MS;
    const wait = Math.max(0, LOADING_MIN_MS - elapsed);
    const remove = () => root.classList.remove("contrib-loading");
    if (wait > 0) setTimeout(remove, wait);
    else remove();
  }

  function mount(root, options) {
    if (!root) return;
    const sparkEl = root.querySelector(".sparkline");
    if (!sparkEl) return;

    const opts = options || {};
    const forceDemo = opts.forceDemo === true;
    let loadingStartedAt = 0;

    const run = (runOpts) => {
      const merged = { ...opts, ...(runOpts || {}) };
      const demo = merged.forceDemo === true;
      const showLoading = !demo && !syncCacheResult();

      if (showLoading) {
        root.classList.add("contrib-loading");
        loadingStartedAt = Date.now();
      }

      return load({ forceDemo: demo })
        .then((result) => {
          renderSparkline(sparkEl, result.months, result.startYear);
          clearContribLoading(root, loadingStartedAt);
          root.dataset.demo = result.demo ? "1" : "0";
          return result;
        })
        .catch(() => {
          clearContribLoading(root, loadingStartedAt);
        });
    };

    if (!forceDemo) {
      const cached = syncCacheResult();
      if (cached) {
        renderSparkline(sparkEl, cached.months, cached.startYear);
        root.dataset.demo = "0";
        load(opts)
          .then((result) => {
            renderSparkline(sparkEl, result.months, result.startYear);
            root.dataset.demo = result.demo ? "1" : "0";
          })
          .catch(() => {});
        return { refresh: run };
      }
    }

    run(opts);
    return { refresh: run };
  }

  global.GithubContrib = {
    load,
    renderSparkline,
    mount,
    resolveStartYear,
    yearMaxMap,
    globalMax,
    linearRatio,
    barHeight,
    monthLevel,
    scaledRatio,
    USER,
    FALLBACK_START_YEAR,
    BAR_H: BAR_H_DEFAULT,
    MIN_NONZERO_PX,
    YEAR_LABEL_STRATEGY,
    applyYearLabelStrategy,
  };
})(window);
