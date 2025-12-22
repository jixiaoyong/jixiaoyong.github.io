// ===========================================
// SVG Icons (inline, no CDN dependency)
// ===========================================
const SVG_ICONS = {
    sun: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"/></svg>`,
    moon: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"/></svg>`,
    adjust: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M8 256c0 136.966 111.033 248 248 248s248-111.034 248-248S392.966 8 256 8 8 119.033 8 256zm248 184V72c101.705 0 184 82.311 184 184 0 101.705-82.311 184-184 184z"/></svg>`,
    bars: `<svg viewBox="0 0 448 512" fill="currentColor"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>`,
    times: `<svg viewBox="0 0 352 512" fill="currentColor"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>`,
};

// ===========================================
// Smart Font CDN Loader
// SJTUG for China, Google Fonts for international
// ===========================================
const FontLoader = {
    SJTUG_BASE: 'https://google-fonts.mirrors.sjtug.sjtu.edu.cn',
    GOOGLE_BASE: 'https://fonts.googleapis.com',
    FONT_PATH: '/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300&family=Inter:wght@300;400;600&family=Fira+Code:wght@400;500&display=swap',
    CACHE_KEY: 'font_cdn_preference',
    CACHE_EXPIRE_KEY: 'font_cdn_expire',
    CACHE_DAYS: 7,

    getExpireTime(days) {
        return Date.now() + days * 24 * 60 * 60 * 1000;
    },

    isLastDay() {
        const expire = localStorage.getItem(this.CACHE_EXPIRE_KEY);
        if (!expire) return false;
        const remaining = parseInt(expire) - Date.now();
        return remaining > 0 && remaining < 24 * 60 * 60 * 1000; // Less than 1 day
    },

    cache(cdn) {
        localStorage.setItem(this.CACHE_KEY, cdn);
        localStorage.setItem(this.CACHE_EXPIRE_KEY, this.getExpireTime(this.CACHE_DAYS).toString());
    },

    getCached() {
        const cdn = localStorage.getItem(this.CACHE_KEY);
        const expire = localStorage.getItem(this.CACHE_EXPIRE_KEY);
        if (cdn && expire && Date.now() < parseInt(expire)) {
            return cdn;
        }
        return null;
    },

    loadFontCss(baseUrl) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = baseUrl + this.FONT_PATH;
            link.onload = () => resolve(baseUrl);
            link.onerror = () => reject(new Error(`Failed to load from ${baseUrl}`));
            document.head.appendChild(link);
        });
    },

    async testCdn(baseUrl, timeout = 3000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(baseUrl + this.FONT_PATH, {
                method: 'HEAD',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response.ok;
        } catch {
            clearTimeout(timeoutId);
            return false;
        }
    },

    async load() {
        // 1. Check cache
        const cached = this.getCached();
        if (cached) {
            const baseUrl = cached === 'sjtug' ? this.SJTUG_BASE : this.GOOGLE_BASE;
            this.loadFontCss(baseUrl);

            // Background refresh on last day
            if (this.isLastDay()) {
                setTimeout(() => this.backgroundRefresh(), 5000);
            }
            return;
        }

        // 2. No cache - try SJTUG first (better for China)
        try {
            await this.loadFontCss(this.SJTUG_BASE);
            this.cache('sjtug');
            console.log('[FontLoader] Using SJTUG mirror');
        } catch {
            // 3. Fallback to Google
            try {
                await this.loadFontCss(this.GOOGLE_BASE);
                this.cache('google');
                console.log('[FontLoader] Using Google Fonts');
            } catch (e) {
                console.error('[FontLoader] All CDN sources failed', e);
            }
        }
    },

    async backgroundRefresh() {
        console.log('[FontLoader] Background refresh started');
        const sjtugOk = await this.testCdn(this.SJTUG_BASE);
        if (sjtugOk) {
            this.cache('sjtug');
            console.log('[FontLoader] Background refresh: SJTUG is available');
        } else {
            const googleOk = await this.testCdn(this.GOOGLE_BASE);
            if (googleOk) {
                this.cache('google');
                console.log('[FontLoader] Background refresh: Using Google');
            }
        }
    }
};

// Load fonts immediately (async, won't block content)
FontLoader.load();

// Theme Logic
const THEMES = ['light', 'dark', 'auto'];

const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme) => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effective = theme === 'auto' ? (systemPrefersDark ? 'dark' : 'light') : theme;

    document.documentElement.setAttribute('data-theme', effective);

    // Update Highlight.js theme
    const hljsTheme = document.getElementById('hljs-theme');
    if (hljsTheme) {
        hljsTheme.href = effective === 'dark'
            ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
            : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    }

    // Update icons based on user's SELECTED mode (not effective theme)
    const icons = document.querySelectorAll('.theme-icon-dynamic');
    icons.forEach(icon => {
        icon.innerHTML = '';
        if (theme === 'light') {
            icon.innerHTML = SVG_ICONS.sun;
        } else if (theme === 'dark') {
            icon.innerHTML = SVG_ICONS.moon;
        } else {
            icon.innerHTML = SVG_ICONS.adjust;
        }
    });

    // Update mobile menu theme text using i18n
    const textMobile = document.getElementById('theme-text-mobile');
    if (textMobile) {
        const i18n = I18nManager.getI18n();
        textMobile.textContent = i18n.common.theme[theme] || theme;
    }
};

/**
 * I18n Manager to handle global language state and UI updates
 */
const I18nUtils = {
    getStorage(key, def) {
        try {
            return localStorage.getItem(key) || def;
        } catch (e) {
            console.warn('[I18nUtils] Storage access error', e);
            return def; 
        } 
    },
    setStorage(key, val) {
        try {
            localStorage.setItem(key, val);
        } catch (e) {
            console.warn('[I18nUtils] Storage write error', e);
        }
    }
};

/**
 * I18n Manager to handle global language state and UI updates
 */
const I18nManager = {
    getLang() {
        // Priority: 
        // 1. Runtime override (window.__CURRENT_LANG__) - populated by Head Script
        // 2. LocalStorage
        // 3. Fallback to 'zh'
        // This ensures the JS logic matches the "Pre-Hydration" logic from BaseLayout.
        if (window.__CURRENT_LANG__) {
             return window.__CURRENT_LANG__;
        }
        const lang = I18nUtils.getStorage('preferred_lang', 'zh');
        return lang;
    },

    getI18n() {
        const lang = this.getLang();
        return window.__I18N_DATA__[lang] || window.__I18N_DATA__['zh'];
    },

    setLang(lang) {
        console.log('[I18n] setLang:', lang);
        I18nUtils.setStorage('preferred_lang', lang);
        
        // Update runtime global
        window.__CURRENT_LANG__ = lang;
        
        this.updateUI();
        
        // Custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    },

    updateUI() {
        const lang = this.getLang();
        console.log('[I18n] updateUI currentLang:', lang);
        const i18n = this.getI18n();

        document.documentElement.lang = lang; // Ensure HTML lang attribute is synced
        
        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (!key) return;
            
            const keys = key.split('.');
            let val = i18n;
            for (const k of keys) {
                val = val ? val[k] : null;
            }

            if (val !== undefined && val !== null) {
                const attr = el.dataset.i18nAttr;
                const isHtml = el.dataset.i18nHtml === 'true';
                const params = el.dataset.i18nParams;

                // Replace placeholders {0}, {1} with params
                if (params) {
                    val = val.replace('{0}', params);
                }

                if (attr) {
                    el.setAttribute(attr, attr === 'placeholder' ? val + '...' : val);
                } else if (isHtml) {
                    el.innerHTML = val;
                } else {
                    // Preserve icons if they exist (e.g. in Buttons)
                    const icon = el.querySelector('i') || el.querySelector('svg') || el.querySelector('.icon');
                    if (icon) {
                        // If there is an icon, we assume the text is a text node alongside it.
                        // We clear and re-append. 
                        // Implementation detail: Use a span for text if possible to avoid this.
                        // Current impl re-appends icon.
                        const iconClone = icon.cloneNode(true);
                        el.innerHTML = '';
                        el.appendChild(iconClone);
                        el.appendChild(document.createTextNode(' ' + val));
                    } else {
                        el.textContent = val;
                    }
                }
            }
        });

        // Update i18n-content containers (e.g. About page markdown)
        document.querySelectorAll('.i18n-content, .blog-timeline').forEach(el => {
            el.style.display = el.dataset.lang === lang ? 'block' : 'none';
        });
        
        // Update Language Switcher Text
        const langTextDesktop = document.getElementById('lang-text-desktop');
        if (langTextDesktop) langTextDesktop.textContent = lang === 'en' ? 'En' : '中文';

        const langTextMobile = document.getElementById('lang-text-mobile');
        if (langTextMobile) langTextMobile.textContent = lang === 'en' ? 'English' : '中文';

        // Update Homepage Posts if present
        this.updateHomePosts(lang);

        // Update Detail Page Hints if present
        this.updateDetailHints(lang);

        // Update Post Navigation (Prev/Next)
        this.updatePostNav(lang);

        // Update Theme Text (since it depends on current i18n)
        const currentTheme = I18nUtils.getStorage('theme', 'auto');
        if (typeof applyTheme === 'function') {
            applyTheme(currentTheme);
        }
    },

    updatePostNav(lang) {
        document.querySelectorAll('.post-nav-item').forEach(item => {
            // Fallback logic: Preferred Lang -> ZH
            const zhPath = item.getAttribute('data-i18n-zh-path');
            const targetPath = item.getAttribute(`data-i18n-${lang}-path`) || zhPath;
            
            // Only update href if a valid path exists
            if (targetPath) {
                item.href = targetPath;
            }
        });
    },

    updateHomePosts(lang) {
        document.querySelectorAll('.post-item').forEach(item => {
            const title = item.getAttribute(`data-i18n-${lang}-title`);
            const excerpt = item.getAttribute(`data-i18n-${lang}-excerpt`);
            // Fallback logic for path: Preferred Lang -> ZH -> Current Href
            const zhPath = item.getAttribute('data-i18n-zh-path');
            const targetPath = item.getAttribute(`data-i18n-${lang}-path`) || zhPath;
            
            const tagsStr = item.getAttribute(`data-i18n-${lang}-tags`);

            if (title) {
                const titleEl = item.querySelector('h2 a');
                if (titleEl) titleEl.textContent = title;
                
                // Update links with fallback
                if (targetPath) {
                    const coverLink = item.querySelector('.post-cover a');
                    if (coverLink) coverLink.href = targetPath;
                    if (titleEl) titleEl.href = targetPath;
                }
            }
            if (excerpt) {
                const excerptEl = item.querySelector('.post-excerpt p');
                if (excerptEl) excerptEl.textContent = excerpt;
            }
            if (tagsStr) {
                const tagsRaw = tagsStr.split(',').filter(t => t);
                const tagsContainer = item.querySelector('.post-tags');
                if (tagsContainer && tagsRaw.length > 0) {
                    // Re-render tags
                    tagsContainer.innerHTML = tagsRaw.map(tag => `<a href="?tag=${encodeURIComponent(tag)}" class="tag">#${tag}</a>`).join('\n');
                }
            }
        });
    },

    updateDetailHints(lang) {
        const article = document.querySelector('article');
        // Ignore if no article or if it is the "About Page" (which handles i18n internally)
        if (!article || article.classList.contains('about-page')) return;

        // Determine the content language of the article.
        // It could be on the article tag or html tag. SSG puts lang on HTML.
        // However, checking html.lang is tricky because we might have just updated it to currentLang in updateUI.
        // But the *Article Content* itself is static SSG.
        // Data attribute on article: data-lang="en"? It's not there by default.
        // But we DO have data-has-translation-en="true" or similar.
        
        // Infer content language: If current URL contains /en/, it's EN. Else ZH.
        const isUrlEn = window.location.pathname.includes('/en/');
        const contentLang = isUrlEn ? 'en' : 'zh';
        
        const container = document.getElementById('translation-hint-container') || this.createHintContainer(article);

        if (lang === contentLang) {
            container.classList.remove('visible');
            return;
        }

        container.classList.add('visible');
        const hasTranslation = !!article.getAttribute(`data-has-translation-${lang}`);
        const translationPath = article.getAttribute(`data-translation-path-${lang}`);

        if (hasTranslation) {
            container.innerHTML = `
                <div class="translation-banner visible">
                    <span class="banner-text">${lang === 'en' ? 'An English translation is available.' : '本文提供中文翻译版本。'}</span>
                    <a href="${translationPath}" class="btn-simple">
                        ${lang === 'en' ? 'Switch to English' : '切换到中文版'}
                    </a>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="translation-banner visible">
                    <span class="banner-text">${lang === 'en' ? 'This article is only available in Chinese.' : '抱歉，本文目前仅提供英文版本。'}</span>
                    <button class="btn-simple" onclick="loadGoogleTranslate()">
                        ${lang === 'en' ? 'Translate with Google' : '使用 Google 翻译'}
                    </button>
                </div>
            `;
        }
    },

    createHintContainer(article) {
        const container = document.createElement('div');
        container.id = 'translation-hint-container';
        article.prepend(container);
        return container;
    }
};

// The original updateThemeUI function is now largely replaced by applyTheme and I18nManager.updateUI
// Keeping it for now, but it might be removed if no other parts of the code explicitly call it.
const updateThemeUI = (theme) => {
    const icon = document.getElementById('theme-icon');
    const textMobile = document.getElementById('theme-text-mobile');

    // Icons
    if (icon) {
        icon.className = 'icon icon-md';
        if (theme === 'light') icon.innerHTML = SVG_ICONS.sun;
        else if (theme === 'dark') icon.innerHTML = SVG_ICONS.moon;
        else icon.innerHTML = SVG_ICONS.adjust; // Auto
    }

    // Mobile Text
    if (textMobile) {
        textMobile.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    }
};

const toggleTheme = () => {
    const currentTheme = localStorage.getItem('theme') || 'auto';
    const currentIndex = THEMES.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const newTheme = THEMES[nextIndex];

    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
};

// Email Comment Function
const EMAIL_ADDRESS = 'jixiaoyong1995+blog@gmail.com';

const sendEmailComment = (articleTitle, articlePath) => {
    try {
        // Get i18n strings dynamically
        const i18n = I18nManager.getI18n();
        const { subject, bodyHello, bodyIntro, copyFallback } = i18n.article.emailComment;

        // Build article URL
        const articleUrl = window.location.origin + articlePath;

        // Build email subject and body
        const fullSubject = `${subject}《${articleTitle}》`;
        const body = `${bodyHello}\n\n${bodyIntro}\n\n[《${articleTitle}》](${articleUrl})\n\n`;

        // Generate mailto link
        const mailtoLink = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;

        // Try to open email client
        window.location.href = mailtoLink;

    } catch (error) {
        // Fallback: offer to copy email address
        const i18n = I18nManager.getI18n();
        const fallbackMsg = i18n.article.emailComment.copyFallback;

        if (confirm(`${fallbackMsg}\n\n${EMAIL_ADDRESS}`)) {
            navigator.clipboard.writeText(EMAIL_ADDRESS).then(() => {
                // Try to use showToast if available, else alert
                if (typeof showToast === 'function') {
                    showToast('Email copied!');
                } else {
                    alert('Email copied!');
                }
            }).catch(() => {
                // Final fallback: prompt with email
                prompt('Copy this email:', EMAIL_ADDRESS);
            });
        }
    }
};

// Expose globally
window.sendEmailComment = sendEmailComment;

// AI Tag Popup Toggle
const toggleAiPopup = (event) => {
    event.stopPropagation();
    const popup = document.getElementById('aiPopup');
    if (popup) {
        popup.classList.toggle('show');
        if (popup.classList.contains('show')) {
            adjustPopupPosition(popup);
        }
    }
};

const adjustPopupPosition = (popup) => {
    const wrapper = popup.parentElement; // .ai-tag-wrapper
    if (!wrapper) return;

    // 1. Reset to base state to measure dimensions accurately
    // We clear inline styles that might have been set previously
    popup.style.left = '';
    popup.style.transform = '';

    // Force a reflow to ensure styles are applied before measuring
    void popup.offsetWidth;

    const wrapperRect = wrapper.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const padding = 15; // Safe distance from edge

    // 2. Ideal Position: Center popup relative to wrapper
    // wrapper is at 0 (relative context). Center is wrapperWidth/2.
    // Popup center is popupWidth/2.
    // Initial Ideal Left relative to wrapper = (wrapperWidth / 2) - (popupWidth / 2)
    const idealLeft = (wrapperRect.width / 2) - (popupRect.width / 2);

    // 3. Calculate absolute left on screen if we placed it at idealLeft
    // Absolute Popup Left = wrapperRect.left + idealLeft
    const absLeft = wrapperRect.left + idealLeft;

    // 4. Constrain within viewport
    let correctedAbsLeft = absLeft;

    // Check left edge
    if (correctedAbsLeft < padding) {
        correctedAbsLeft = padding;
    }
    // Check right edge
    else if (correctedAbsLeft + popupRect.width > viewportWidth - padding) {
        correctedAbsLeft = viewportWidth - padding - popupRect.width;
    }

    // 5. Calculate delta needed
    // We need to set 'left' (relative to wrapper) such that the absolute position is correctedAbsLeft.
    // Final Relative Left = correctedAbsLeft - wrapperRect.left.
    const finalRelativeLeft = correctedAbsLeft - wrapperRect.left;

    // 6. Arrow Position
    // Arrow should point to center of wrapper.
    // Center of wrapper (relative to popup) is what we need.
    // Arrow is positioned relative to popup.
    // We want Arrow Absolute Left ≈ Wrapper Absolute Center
    // Wrapper Absolute Center = wrapperRect.left + (wrapperRect.width / 2)
    // Popup Absolute Left = correctedAbsLeft
    // Arrow Left (relative to popup) = (Wrapper Absolute Center) - (Popup Absolute Left)
    // We need to account for arrow width (12px, so center is 6px) if we position by 'left'.
    // Let's use the center point directly:
    const arrowCenterRelativeToPopup = (wrapperRect.left + wrapperRect.width / 2) - correctedAbsLeft;
    // Arrow is 12px wide. left = center - 6
    const arrowLeft = arrowCenterRelativeToPopup - 6;

    // 7. Apply styles
    popup.style.left = `${finalRelativeLeft}px`;

    // Update arrow via CSS variable
    popup.style.setProperty('--arrow-left', `${arrowLeft}px`);
};

// Close AI Popup when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.ai-tag-wrapper')) {
        const popup = document.getElementById('aiPopup');
        if (popup) popup.classList.remove('show');
    }
});

window.toggleAiPopup = toggleAiPopup;

// Language Switcher
const switchLanguage = () => {
    const currentLang = I18nManager.getLang();
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    
    console.log(`[I18n] Switch requested: ${currentLang} -> ${newLang}`);
    
    I18nManager.setLang(newLang);
};

const initLanguageListeners = () => {
    document.querySelectorAll('.js-language-switch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            switchLanguage();
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden') && btn.closest('#mobile-menu')) {
                toggleMobileMenu();
            }
        });
    });
};

/**
 * Google Translate Integration
 */
let googleTranslateLoaded = false;
window.loadGoogleTranslate = () => {
    if (googleTranslateLoaded) return;

    const lang = I18nManager.getLang();
    const banner = document.querySelector('.translation-banner');
    const btn = banner?.querySelector('.btn-simple');

    // Disable button and show loading state
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${lang === 'en' ? 'Loading...' : '加载中...'}`;
    }

    // Show loading toast
    showToast(lang === 'en' ? 'Loading Google Translate, please wait...' : '正在加载 Google 翻译，请稍候...');

    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.onerror = () => {
        showToast(lang === 'en'
            ? "Google Translate is unavailable. Please check your network."
            : "无法访问 Google 翻译，请检查网络环境。");
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = lang === 'en' ? 'Translate with Google' : '使用 Google 翻译';
        }
    };

    window.googleTranslateElementInit = () => {
        // Target language based on user preference (ISO 639-1 codes)
        const targetLang = lang === 'en' ? 'en' : 'zh-CN';

        // Set cookie to hint Google Translate (may not always work)
        document.cookie = `googtrans=/zh-CN/${targetLang}; path=/`;

        new google.translate.TranslateElement({
            pageLanguage: 'zh-CN',
            includedLanguages: 'en,zh-CN,ja,ko,fr,de,es',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');

        googleTranslateLoaded = true;

        // Hide the translation banner after widget loads
        if (banner) {
            banner.style.display = 'none';
        }

        // Auto-select target language with retry mechanism
        const selectTargetLanguage = (attempts = 0) => {
            const selectEl = document.querySelector('.goog-te-combo');
            if (selectEl && selectEl.options.length > 0) {
                selectEl.value = targetLang;
                selectEl.dispatchEvent(new Event('change'));
            } else if (attempts < 5) {
                // Retry up to 5 times with increasing delay
                setTimeout(() => selectTargetLanguage(attempts + 1), 300 * (attempts + 1));
            }
        };
        setTimeout(selectTargetLanguage, 500);
    };

    // Create container for the widget
    const container = document.getElementById('translation-hint-container');
    if (container) {
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'google_translate_element';
        widgetContainer.style.marginBottom = '1rem';
        container.appendChild(widgetContainer);
    }

    document.head.appendChild(script);
};

const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Mobile Menu
const toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (menu && icon) {
        const isHidden = menu.classList.toggle('hidden');
        // Only update innerHTML, preserve existing classes (icon icon-xl)
        icon.innerHTML = isHidden ? SVG_ICONS.bars : SVG_ICONS.times;
    }
};

// Add robust listener for mobile menu button
// This prevents race conditions with DOM updates and event bubbling
const initMobileMenuBtn = () => {
    const btn = document.querySelector('.mobile-menu-btn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
};

// Close mobile menu when clicking a menu item
document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobile-menu');

    if (!menu || menu.classList.contains('hidden')) return;

    // Check if clicked on a menu item (anchor or button inside menu)
    if (e.target.closest('#mobile-menu a, #mobile-menu button')) {
        toggleMobileMenu();
        return;
    }

    // Check if clicked outside the menu and not on the toggle button
    if (!e.target.closest('#mobile-menu') && !e.target.closest('.mobile-menu-btn')) {
        toggleMobileMenu();
    }
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Init] DOMContentLoaded');
    // 1. Initial I18n Init
    // Note: I18nManager.getLang() now uses window.__CURRENT_LANG__ which is already smart.
    // We execute updateUI to ensure binding of data-i18n elements if they need to change from SSG default.
    // If SSG matched __CURRENT_LANG__, this should be a no-op visually, but good for consistency.
    I18nManager.updateUI();
    
    initMobileMenuBtn();
    // initLanguageListeners(); // Inline onclick deals with it

    // 2. Restore Theme
    const savedTheme = localStorage.getItem('theme') || 'auto';
    if (typeof applyTheme === 'function') applyTheme(savedTheme);

    // 2. Listen for System Changes (for Auto mode)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'auto') {
            if (typeof applyTheme === 'function') applyTheme('auto');
        }
    });

    // 3. Highlight Code
    if (window.hljs) {
        hljs.highlightAll();
    }

    // Expose functions
    window.toggleTheme = toggleTheme;
    window.toggleMobileMenu = toggleMobileMenu;
    window.switchLanguage = switchLanguage;

    // Search Logic
    let searchIndex = [];

    window.switchView = async (viewName) => {
        if (viewName === 'search') {
            const overlay = document.getElementById('search-overlay');
            const input = document.getElementById('search-input');
            if (overlay) {
                overlay.classList.remove('hidden');
                if (input) setTimeout(() => input.focus(), 100);

                // Lazy Load Index
                if (searchIndex.length === 0) {
                    try {
                        const basePath = window.basePath || '';
                        const res = await fetch(basePath + '/search.json');
                        searchIndex = await res.json();
                    } catch (e) {
                        console.error('Failed to load search index', e);
                    }
                }
            }
        } else if (viewName === 'home') {
            window.location.href = '/';
        } else if (viewName === 'about') {
            window.location.href = '/about.html';
        }
    };

    window.closeSearch = () => {
        const overlay = document.getElementById('search-overlay');
        if (overlay) overlay.classList.add('hidden');
    };

    // Search Input Listener
    const input = document.getElementById('search-input');
    if (input) {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const resultsDiv = document.getElementById('search-results');
            if (!query) {
                resultsDiv.innerHTML = '';
                return;
            }

            const results = searchIndex.filter(post => {
                const lang = I18nManager.getLang();
                const trans = post.translations[lang] || post.translations['zh'];
                return trans.title.toLowerCase().includes(query) ||
                    (post.tags && post.tags.some(t => t.toLowerCase().includes(query)));
            }).slice(0, 10);

            if (results.length === 0) {
                resultsDiv.innerHTML = `<div style="color:var(--text-secondary);text-align:center;">${I18nManager.getI18n().common.searchNoResults || 'No results found'}</div>`;
                return;
            }

            resultsDiv.innerHTML = results.map(post => {
                const lang = I18nManager.getLang();
                const trans = post.translations[lang] || post.translations['zh'];
                return `
                <a href="${trans.path}" class="search-result-item" onclick="closeSearch()">
                    <div class="search-result-title">${trans.title}</div>
                    <div class="search-result-excerpt">${trans.excerpt}</div>
                </a>
            `}).join('');
        });

        // Close on Esc
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') window.closeSearch();
        });
    }
    // 4. Tag Filter Logic
    const params = new URLSearchParams(window.location.search);
    const tagFilter = params.get('tag');

    if (tagFilter && document.location.pathname.endsWith('/')) {
        // We are on home page (or /en/ home) with a tag
        // Since we don't have all posts data in JS (PostList is static HTML),
        // we can fetch search.json to get the list and re-render OR
        // simpler for now: just hide non-matching items from the DOM if they are present.
        // BUT, static HTML only has paginated or full list?
        // Assuming single page full list for simplicity as per current build.ts (PostList(posts))

        const decodedTag = decodeURIComponent(tagFilter).trim().toLowerCase();
        const postItems = document.querySelectorAll('.post-item');
        let count = 0;

        postItems.forEach(item => {
            // Get all tags from this post item
            const tagElements = item.querySelectorAll('.tag');
            const tags = Array.from(tagElements).map(t => {
                // Remove # and any extra whitespace, convert to lowercase
                return t.innerText.replace(/^#/, '').trim().toLowerCase();
            });

            // Check if any tag matches
            const hasMatch = tags.some(tag => tag === decodedTag);

            if (hasMatch) {
                item.style.display = '';
                count++;
            } else {
                item.style.display = 'none';
            }
        });

        // Show status message?
        /*
        const homeDiv = document.getElementById('home');
        if (homeDiv) {
            const msg = document.createElement('div');
            msg.innerHTML = `Filtered by tag: <b>#${tagFilter}</b> (${count} posts) <a href="?">Clear</a>`;
            msg.style.marginBottom = '20px';
            msg.style.textAlign = 'center';
            homeDiv.prepend(msg);
        }
        */
    }

    // 5. Infinite Scroll for Home Page
    const homeDiv = document.getElementById('home');
    if (homeDiv && homeDiv.dataset.totalPosts) {
        const totalPosts = parseInt(homeDiv.dataset.totalPosts, 10);
        const postsPerPage = parseInt(homeDiv.dataset.postsPerPage, 10) || 20;
        let loadedPosts = postsPerPage;
        let isLoading = false;
        let allPostsData = null;

        const loadMoreContainer = document.querySelector('.load-more-container');
        const loadMoreSpinner = document.querySelector('.load-more-spinner');
        const loadMoreEnd = document.querySelector('.load-more-end');
        const postList = document.querySelector('.post-list');

        // Determine i18n text based on path
        const basePath = window.basePath || '';
        const pathWithoutBase = window.location.pathname.replace(basePath, '');
        const isEnglish = pathWithoutBase.startsWith('/en');
        const loadingText = isEnglish ? 'Loading...' : '加载中...';
        const allLoadedText = isEnglish ? '— All posts loaded —' : '— 已加载全部文章 —';

        if (loadMoreEnd) {
            loadMoreEnd.textContent = allLoadedText;
        }

        // Create post item HTML
        const createPostItemHtml = (post) => {
            const dataAttrs = Object.entries(post.translations)
                .map(([lang, t]) => `
                    data-i18n-${lang}-title="${t.title.replace(/"/g, '&quot;')}"
                    data-i18n-${lang}-excerpt="${t.excerpt.replace(/"/g, '&quot;')}"
                    data-i18n-${lang}-path="${t.path}"
                    data-i18n-${lang}-tags="${(t.tags || []).join(',')}"
                `).join(' ');

            // Default to Chinese or first translation
            const t = post.translations[I18nManager.getLang()] || post.translations['zh'] || Object.values(post.translations)[0];
            const displayTags = t.tags || post.tags || [];
            const tagsHtml = displayTags.length > 0
                ? displayTags.map(tag => `<a href="?tag=${encodeURIComponent(tag)}" class="tag">#${tag}</a>`).join('')
                : '';

            if (post.coverImage) {
                return `
                    <div class="post-item has-cover" ${dataAttrs}>
                        <div class="post-header-row">
                            <div class="post-cover">
                                <a href="${t.path}">
                                    <img src="${post.coverImage}" alt="${t.title}" loading="lazy"/>
                                </a>
                            </div>
                            <div class="post-header">
                                <h2><a href="${t.path}">${t.title}</a></h2>
                                <span class="post-date">${post.date}</span>
                            </div>
                        </div>
                        <div class="post-body">
                            <div class="post-excerpt">
                                <p>${t.excerpt}</p>
                            </div>
                            <div class="post-tags">
                                ${tagsHtml}
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="post-item" ${dataAttrs}>
                        <div class="post-header">
                            <h2><a href="${t.path}">${t.title}</a></h2>
                            <span class="post-date">${post.date}</span>
                        </div>
                        <div class="post-excerpt">
                            <p>${t.excerpt}</p>
                        </div>
                        <div class="post-tags">
                            ${tagsHtml}
                        </div>
                    </div>
                `;
            }
        };

        // Load more posts
        const loadMorePosts = async () => {
            if (isLoading || loadedPosts >= totalPosts) return;

            isLoading = true;
            if (loadMoreSpinner) loadMoreSpinner.style.display = 'flex';

            try {
                // Lazy load search.json (unified)
                if (!allPostsData) {
                    const basePath = window.basePath || '';
                    const res = await fetch(basePath + '/search.json');
                    allPostsData = await res.json();
                }

                // Get next batch
                const nextBatch = allPostsData.slice(loadedPosts, loadedPosts + postsPerPage);

                nextBatch.forEach(post => {
                    const temp = document.createElement('div');
                    temp.innerHTML = createPostItemHtml(post);
                    const child = temp.firstElementChild;
                    if (child) postList.appendChild(child);
                });

                loadedPosts += nextBatch.length;

                // Re-apply translations for new elements
                I18nManager.updateUI();

                // Check if all loaded
                if (loadedPosts >= totalPosts) {
                    if (loadMoreSpinner) loadMoreSpinner.style.display = 'none';
                    if (loadMoreEnd) loadMoreEnd.style.display = 'block';
                }
            } catch (e) {
                console.error('Failed to load more posts', e);
            } finally {
                isLoading = false;
                if (loadedPosts < totalPosts && loadMoreSpinner) {
                    loadMoreSpinner.style.display = 'none';
                }
            }
        };

        // Scroll listener with throttling
        let scrollLoadTimeout;
        const handleScroll = () => {
            if (scrollLoadTimeout) return;
            scrollLoadTimeout = setTimeout(() => {
                scrollLoadTimeout = null;

                // Check if near bottom (within 300px)
                const scrollPosition = window.innerHeight + window.scrollY;
                const pageHeight = document.documentElement.scrollHeight;

                if (pageHeight - scrollPosition < 300) {
                    loadMorePosts();
                }
            }, 100);
        };

        // Only enable infinite scroll if there are more posts to load
        if (totalPosts > loadedPosts && !tagFilter) {
            window.addEventListener('scroll', handleScroll);
        } else if (loadedPosts >= totalPosts && loadMoreContainer) {
            // All posts already loaded initially
            loadMoreContainer.style.display = 'none';
        }

        // If tag filter is active, load all posts for filtering
        if (tagFilter && totalPosts > loadedPosts) {
            // Load all remaining posts for tag filtering
            (async () => {
                const searchJsonPath = isEnglish ? basePath + '/en/search.json' : basePath + '/search.json';
                const res = await fetch(searchJsonPath);
                allPostsData = await res.json();

                // Render all remaining posts
                const remainingPosts = allPostsData.slice(loadedPosts);
                remainingPosts.forEach(post => {
                    const temp = document.createElement('div');
                    temp.innerHTML = createPostItemHtml(post);
                    const postItem = temp.firstElementChild;
                    postList.appendChild(postItem);

                    // Apply tag filter
                    const tagElements = postItem.querySelectorAll('.tag');
                    const tags = Array.from(tagElements).map(t =>
                        t.innerText.replace(/^#/, '').trim().toLowerCase()
                    );
                    const decodedTag = decodeURIComponent(tagFilter).trim().toLowerCase();
                    const hasMatch = tags.some(tag => tag === decodedTag);
                    postItem.style.display = hasMatch ? '' : 'none';
                });

                if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            })();
        }
    }

    // 6. Code Block Collapsing
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
        // Simple height check as fallback, but line count is better
        const code = pre.querySelector('code');
        if (!code) return;

        // Approx check: text length or line count
        const text = code.innerText;
        const lineCount = text.split('\n').length;

        // Threshold: 20 lines
        if (lineCount > 20) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper collapsed';

            // Insert wrapper
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            // Button
            const btn = document.createElement('button');
            btn.className = 'code-expand-btn';
            btn.innerHTML = '<i class="fas fa-chevron-down"></i> Expand Code';

            btn.onclick = () => {
                const isCollapsed = wrapper.classList.contains('collapsed');
                if (isCollapsed) {
                    wrapper.classList.remove('collapsed');
                    wrapper.classList.add('expanded');
                    btn.innerHTML = '<i class="fas fa-chevron-up"></i> Collapse Code';
                } else {
                    wrapper.classList.remove('expanded');
                    wrapper.classList.add('collapsed');
                    btn.innerHTML = '<i class="fas fa-chevron-down"></i> Expand Code';
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            };

            wrapper.appendChild(btn);
        }
    });

    // 6.6. Demo Container Smart Collapse
    // 只在页面初始加载时根据内容高度自动收起超过阈值的 demo 容器
    // 一旦用户手动展开，不再自动收起
    const initDemoSmartCollapse = () => {
        const demoContainers = document.querySelectorAll('.demo-container[data-collapse]');

        demoContainers.forEach(container => {
            const threshold = container.dataset.collapse;
            if (threshold === 'none') return; // 不折叠

            const body = container.querySelector('.demo-body');
            if (!body) return;

            // 如果已经被用户手动交互过，不再自动处理
            if (container.dataset.userInteracted) return;

            // 解析阈值
            const parseThreshold = (value) => {
                if (!value) return window.innerHeight * 0.5; // 默认 50vh

                if (value.endsWith('vh')) {
                    return window.innerHeight * (parseInt(value) / 100);
                }
                if (value.endsWith('px')) {
                    return parseInt(value);
                }
                if (value.endsWith('%')) {
                    return window.innerHeight * (parseInt(value) / 100);
                }
                // 默认当作 vh 处理
                return window.innerHeight * 0.5;
            };

            const thresholdPx = parseThreshold(threshold);

            // 检查内容高度，只在初始加载时折叠超过阈值的容器
            if (body.scrollHeight > thresholdPx) {
                container.removeAttribute('open');
            }

            // 监听用户手动交互，一旦用户点击展开/收起，标记为已交互
            container.addEventListener('toggle', () => {
                container.dataset.userInteracted = 'true';
            }, { once: true });
        });
    };

    // 执行智能折叠（只在初始加载时执行一次）
    initDemoSmartCollapse();


    // 6.5. Smart Table Responsive Handler
    // Automatically detects table complexity and applies appropriate display mode
    const initSmartTables = () => {
        const tables = document.querySelectorAll('.article-content table');

        tables.forEach(table => {
            // Wrap table if not already wrapped
            let wrapper = table.parentElement;
            if (!wrapper.classList.contains('table-wrapper')) {
                wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }

            // Determine display mode based on content
            updateTableMode(wrapper, table);
        });
    };

    // Determine and apply the appropriate table display mode
    const updateTableMode = (wrapper, table) => {
        // Temporarily force scroll mode to measure natural width
        wrapper.classList.add('scroll-mode');

        // Force reflow to get accurate measurements
        void table.offsetWidth;

        const naturalWidth = table.scrollWidth;
        const containerWidth = wrapper.clientWidth;

        // Threshold: if natural width exceeds container by 20%, use scroll mode
        const THRESHOLD = 1.2;

        if (naturalWidth > containerWidth * THRESHOLD) {
            // Keep scroll mode - table is too wide to fit nicely
            wrapper.classList.add('scroll-mode');
        } else {
            // Remove scroll mode - table fits within container
            wrapper.classList.remove('scroll-mode');
        }

        // Check if table is tall enough to benefit from sticky headers
        // Only apply if table has more than ~5 rows (roughly 250px)
        const tableHeight = table.offsetHeight;
        if (tableHeight > 250) {
            wrapper.classList.add('sticky-header');
        } else {
            wrapper.classList.remove('sticky-header');
        }
    };

    // Initialize tables
    initSmartTables();

    // Re-evaluate on window resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const wrappers = document.querySelectorAll('.article-content .table-wrapper');
            wrappers.forEach(wrapper => {
                const table = wrapper.querySelector('table');
                if (table) {
                    updateTableMode(wrapper, table);
                }
            });
        }, 150);
    });


    // 6.7. Image Loading State Initialization
    // iOS-style blur-to-clear transition with error handling and retry
    const initImageLoadingState = () => {
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        
        imageWrappers.forEach(wrapper => {
            const img = wrapper.querySelector('img');
            const errorEl = wrapper.querySelector('.image-error');
            if (!img) return;
            
            // Handle image load success
            const onLoad = () => {
                wrapper.classList.remove('loading', 'error');
                wrapper.classList.add('loaded');
                if (errorEl) errorEl.style.display = 'none';
            };
            
            // Handle image load error
            const onError = () => {
                wrapper.classList.remove('loading', 'loaded');
                wrapper.classList.add('error');
                if (errorEl) errorEl.style.display = 'flex';
            };
            
            // Check if already loaded (from cache)
            if (img.complete) {
                if (img.naturalWidth > 0) {
                    onLoad();
                } else {
                    onError();
                }
            } else {
                // Add event listeners
                img.addEventListener('load', onLoad);
                img.addEventListener('error', onError);
            }
            
            // Click to retry on error
            if (errorEl) {
                errorEl.addEventListener('click', () => {
                    // Reset state and reload
                    wrapper.classList.remove('error');
                    wrapper.classList.add('loading');
                    errorEl.style.display = 'none';
                    
                    // Force reload by appending timestamp
                    const originalSrc = img.src.split('?')[0];
                    img.src = originalSrc + '?retry=' + Date.now();
                });
            }
        });
    };
    initImageLoadingState();


    // 7. Image Captions and Lightbox
    const articleContent = document.querySelector('.article-content');
    if (articleContent) {
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = '<img src="" alt="">';
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('img');

        // Close lightbox on click
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        const images = articleContent.querySelectorAll('img');
        images.forEach(img => {
            const alt = img.getAttribute('alt');

            // Add caption if alt text exists and is not empty
            if (alt && alt.trim()) {
                const figure = document.createElement('figure');
                const caption = document.createElement('figcaption');
                caption.textContent = alt;

                img.parentNode.insertBefore(figure, img);
                figure.appendChild(img);
                figure.appendChild(caption);
            }

            // Click to open lightbox
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || '';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // 7. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        // Show/hide based on scroll position
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };

        // Throttled scroll event
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                toggleBackToTop();
                scrollTimeout = null;
            }, 100);
        });

        // Click to scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Initial check
        toggleBackToTop();
    }

    // 8. Table of Contents (TOC)
    const tocSidebar = document.getElementById('toc-sidebar');
    const tocNav = document.getElementById('toc-nav');
    const tocMobileBtn = document.getElementById('toc-mobile-btn');
    const tocBottomsheet = document.getElementById('toc-bottomsheet');
    const tocBottomsheetNav = document.getElementById('toc-bottomsheet-nav');
    const tocArticleContent = document.querySelector('.article-content');

    if (tocArticleContent && tocNav) {
        // Find all headings in article content
        const headings = tocArticleContent.querySelectorAll('h2, h3, h4');

        // Helper for robust body scroll locking (iOS fix)
        let scrollPosition = 0;
        const disableBodyScroll = () => {
            scrollPosition = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        };

        const enableBodyScroll = () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollPosition);
        };

        // Close bottomsheet helper
        const closeTocBottomsheet = () => {
            if (tocBottomsheet && tocBottomsheet.classList.contains('active')) {
                tocBottomsheet.classList.remove('active');
                enableBodyScroll();
            }
        };

        if (headings.length > 0) {
            // Build hierarchical structure: h2 -> [h3 -> [h4]]
            const buildTocStructure = () => {
                const structure = [];
                let currentH2 = null;
                let currentH3 = null;

                Array.from(headings).forEach((heading, index) => {
                    if (!heading.id) {
                        heading.id = `heading-${index}`;
                    }

                    const item = {
                        id: heading.id,
                        text: heading.textContent,
                        level: heading.tagName.toLowerCase()
                    };

                    if (item.level === 'h2') {
                        currentH2 = { ...item, children: [] };
                        structure.push(currentH2);
                        currentH3 = null;
                    } else if (item.level === 'h3') {
                        if (currentH2) {
                            currentH3 = { ...item, children: [] };
                            currentH2.children.push(currentH3);
                        } else {
                            // h3 without parent h2
                            structure.push({ ...item, children: [] });
                        }
                    } else if (item.level === 'h4') {
                        if (currentH3) {
                            currentH3.children.push(item);
                        } else if (currentH2) {
                            currentH2.children.push({ ...item, children: [] });
                        }
                    }
                });

                return structure;
            };

            // iOS-style chevron SVG
            const chevronSvg = `<span class="toc-chevron"><svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"></polyline></svg></span>`;

            // Generate HTML from structure
            const generateTocHtml = (structure) => {
                let html = '';

                structure.forEach(h2Item => {
                    const hasChildren = h2Item.children && h2Item.children.length > 0;
                    const childrenClass = hasChildren ? ' has-children' : '';

                    html += `<div class="toc-group">`;
                    html += `<a href="#${h2Item.id}" class="toc-h2${childrenClass}" data-target="${h2Item.id}">`;
                    if (hasChildren) {
                        html += chevronSvg;
                    }
                    html += `<span class="toc-text">${h2Item.text}</span></a>`;

                    if (hasChildren) {
                        html += `<div class="toc-children">`;
                        h2Item.children.forEach(h3Item => {
                            const h3HasChildren = h3Item.children && h3Item.children.length > 0;
                            const h3ChildrenClass = h3HasChildren ? ' has-children' : '';

                            // Wrap h3 in wrapper for tree line control
                            html += `<div class="toc-h3-wrapper">`;
                            html += `<a href="#${h3Item.id}" class="toc-h3${h3ChildrenClass}" data-target="${h3Item.id}">`;
                            if (h3HasChildren) {
                                html += chevronSvg;
                            }
                            html += `<span class="toc-text">${h3Item.text}</span></a>`;

                            if (h3HasChildren) {
                                html += `<div class="toc-children-h4">`;
                                h3Item.children.forEach(h4Item => {
                                    html += `<div class="toc-h4-wrapper">`;
                                    html += `<a href="#${h4Item.id}" class="toc-h4" data-target="${h4Item.id}">${h4Item.text}</a>`;
                                    html += `</div>`;
                                });
                                html += `</div>`;
                            }
                            html += `</div>`; // close h3-wrapper
                        });
                        html += `</div>`;
                    }
                    html += `</div>`;
                });

                return html;
            };

            // Build and render TOC
            const tocStructure = buildTocStructure();
            const tocHtml = generateTocHtml(tocStructure);

            tocNav.innerHTML = tocHtml;
            if (tocBottomsheetNav) {
                tocBottomsheetNav.innerHTML = tocHtml;
            }

            // Setup expand/collapse functionality
            const setupTocInteraction = (container) => {
                const h2Links = container.querySelectorAll('.toc-h2.has-children');
                const h3Links = container.querySelectorAll('.toc-h3.has-children');

                // Toggle h2 children
                h2Links.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();

                        // Check if clicked on chevron or its SVG child
                        const isChevronClick = e.target.closest('.toc-chevron');

                        const parent = link.closest('.toc-group');
                        const children = parent.querySelector('.toc-children');

                        if (children) {
                            const isExpanded = link.classList.contains('expanded');

                            // Collapse all other h2 sections
                            container.querySelectorAll('.toc-h2.expanded').forEach(el => {
                                if (el !== link) {
                                    el.classList.remove('expanded');
                                    const otherChildren = el.closest('.toc-group').querySelector('.toc-children');
                                    if (otherChildren) otherChildren.classList.remove('expanded');
                                }
                            });

                            // Toggle this section
                            if (isExpanded) {
                                link.classList.remove('expanded');
                                children.classList.remove('expanded');
                            } else {
                                link.classList.add('expanded');
                                children.classList.add('expanded');
                            }

                            // If chevron click, stop here - don't navigate
                            if (isChevronClick) {
                                return;
                            }
                        }

                        // Navigate to heading (only if text was clicked, not chevron)
                        const targetId = link.getAttribute('data-target');
                        const targetEl = document.getElementById(targetId);
                        if (targetEl) {
                            history.pushState(null, '', `#${targetId}`);
                            window.scrollTo({
                                top: targetEl.offsetTop - 100,
                                behavior: 'smooth'
                            });
                            // Close bottomsheet if open
                            closeTocBottomsheet();
                        }
                    });
                });

                // Toggle h3 children (if any h4s)
                h3Links.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();

                        // Check if clicked on chevron or its SVG child
                        const isChevronClick = e.target.closest('.toc-chevron');

                        // Find h4 container within the same wrapper
                        const wrapper = link.closest('.toc-h3-wrapper');
                        const h4Container = wrapper ? wrapper.querySelector('.toc-children-h4') : null;

                        if (h4Container) {
                            const isExpanded = link.classList.contains('expanded');
                            if (isExpanded) {
                                link.classList.remove('expanded');
                                h4Container.classList.remove('expanded');
                            } else {
                                link.classList.add('expanded');
                                h4Container.classList.add('expanded');
                            }

                            // If chevron click, stop here - don't navigate
                            if (isChevronClick) {
                                return;
                            }
                        }

                        // Navigate to heading (only if text was clicked, not chevron)
                        const targetId = link.getAttribute('data-target');
                        const targetEl = document.getElementById(targetId);
                        if (targetEl) {
                            history.pushState(null, '', `#${targetId}`);
                            window.scrollTo({
                                top: targetEl.offsetTop - 100,
                                behavior: 'smooth'
                            });
                            // Close bottomsheet if open
                            closeTocBottomsheet();
                        }
                    });
                });

                // Regular links without children
                const regularLinks = container.querySelectorAll('.toc-h2:not(.has-children), .toc-h3:not(.has-children), .toc-h4');
                regularLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('data-target');
                        const targetEl = document.getElementById(targetId);
                        if (targetEl) {
                            // Update URL hash
                            history.pushState(null, '', `#${targetId}`);
                            window.scrollTo({
                                top: targetEl.offsetTop - 100,
                                behavior: 'smooth'
                            });
                            // Close bottomsheet if open
                            closeTocBottomsheet();
                        }
                    });
                });
            };

            setupTocInteraction(tocNav);
            if (tocBottomsheetNav) {
                setupTocInteraction(tocBottomsheetNav);
            }

            // Show TOC sidebar on desktop
            if (tocSidebar && window.innerWidth > 1200) {
                tocSidebar.classList.add('visible');
            }

            // Show mobile button on smaller screens
            if (tocMobileBtn && window.innerWidth <= 1200) {
                tocMobileBtn.classList.add('visible');
                if (backToTopBtn) {
                    backToTopBtn.classList.add('has-toc');
                }
            }

            // Scroll spy - highlight current heading and auto-expand section
            const updateActiveLink = () => {
                let currentHeading = null;
                const scrollPos = window.scrollY + 150;

                headings.forEach(heading => {
                    if (heading.offsetTop <= scrollPos) {
                        currentHeading = heading;
                    }
                });

                if (!currentHeading) return;

                // Update active state in both containers
                [tocNav, tocBottomsheetNav].forEach(container => {
                    if (!container) return;

                    // Explicitly remove active from ALL TOC links (h2, h3, h4)
                    container.querySelectorAll('.toc-h2, .toc-h3, .toc-h4').forEach(el => {
                        el.classList.remove('active');
                    });

                    // Add active to current
                    const activeLink = container.querySelector(`[data-target="${currentHeading.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');

                        // Auto-expand parent section if not expanded
                        const group = activeLink.closest('.toc-group');
                        if (group) {
                            const h2Link = group.querySelector('.toc-h2.has-children');
                            const children = group.querySelector('.toc-children');
                            if (h2Link && children && !h2Link.classList.contains('expanded')) {
                                // Collapse other sections first
                                container.querySelectorAll('.toc-h2.expanded').forEach(el => {
                                    el.classList.remove('expanded');
                                    const otherChildren = el.closest('.toc-group').querySelector('.toc-children');
                                    if (otherChildren) otherChildren.classList.remove('expanded');
                                });
                                // Expand current section
                                h2Link.classList.add('expanded');
                                children.classList.add('expanded');
                            }
                        }

                        // Also expand h4 container if needed
                        const h4Wrapper = activeLink.closest('.toc-h4-wrapper');
                        if (h4Wrapper) {
                            const h4Container = h4Wrapper.closest('.toc-children-h4');
                            if (h4Container && !h4Container.classList.contains('expanded')) {
                                h4Container.classList.add('expanded');
                                // Find parent h3 link and mark as expanded
                                const h3Wrapper = h4Container.closest('.toc-h3-wrapper');
                                if (h3Wrapper) {
                                    const h3Link = h3Wrapper.querySelector('.toc-h3');
                                    if (h3Link) h3Link.classList.add('expanded');
                                }
                            }
                        }
                    }
                });
            };

            // Throttled scroll listener for scroll spy
            let spyTimeout;
            window.addEventListener('scroll', () => {
                if (spyTimeout) return;
                spyTimeout = setTimeout(() => {
                    updateActiveLink();
                    spyTimeout = null;
                }, 50);
            });

            // Initial highlight
            updateActiveLink();

            // Handle initial URL hash - scroll to heading on page load
            const handleInitialHash = () => {
                const hash = window.location.hash.slice(1);
                if (hash) {
                    const targetEl = document.getElementById(hash);
                    if (targetEl) {
                        // Delay to ensure page is fully rendered
                        setTimeout(() => {
                            window.scrollTo({
                                top: targetEl.offsetTop - 100,
                                behavior: 'smooth'
                            });
                        }, 100);
                    }
                }
            };

            // Handle both initial load and hash changes
            handleInitialHash();
            window.addEventListener('hashchange', () => {
                const hash = window.location.hash.slice(1);
                if (hash) {
                    const targetEl = document.getElementById(hash);
                    if (targetEl) {
                        window.scrollTo({
                            top: targetEl.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            });

            // Make headings clickable to get anchor link
            headings.forEach(heading => {
                heading.style.cursor = 'pointer';
                heading.addEventListener('click', () => {
                    history.pushState(null, '', `#${heading.id}`);
                    // Copy URL to clipboard
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        // Show brief tooltip or feedback
                        const tooltip = document.createElement('div');
                        tooltip.className = 'heading-copy-tooltip';
                        tooltip.textContent = 'Link copied!';
                        heading.style.position = 'relative';
                        heading.appendChild(tooltip);
                        setTimeout(() => tooltip.remove(), 1500);
                    }).catch(() => {
                        // Fallback: just update URL without copy notification
                    });
                });
            });

            // Mobile button click - open bottomsheet
            if (tocMobileBtn && tocBottomsheet) {
                tocMobileBtn.addEventListener('click', () => {
                    tocBottomsheet.classList.add('active');
                    disableBodyScroll();
                });

                tocBottomsheet.querySelector('.toc-bottomsheet-overlay').addEventListener('click', closeTocBottomsheet);
                tocBottomsheet.querySelector('.toc-bottomsheet-close').addEventListener('click', closeTocBottomsheet);

                // Prevent body scroll when touching non-scrollable parts of TOC
                tocBottomsheet.addEventListener('touchmove', (e) => {
                    if (!e.target.closest('.toc-bottomsheet-nav')) {
                        e.preventDefault();
                    }
                }, { passive: false });

                // iOS Edge Case: When TOC is shorter than container, or at scroll bounds, 
                // scroll event might bubble to body. 
                // We add a listener to the nav to stop propagation if it's bubbling.
                // However, touchmove bubbling is what causes scroll. 
                // With overscroll-behavior: none in CSS, this is mostly handled.
                // But let's add stopPropagation for good measure on touchmove within nav
                const nav = tocBottomsheet.querySelector('.toc-bottomsheet-nav');
                if (nav) {
                    nav.addEventListener('touchmove', (e) => {
                       e.stopPropagation(); // Stop bubbling to the parent listener above or body
                    }, { passive: true }); // Standard scroll behavior
                }
            }

            // Handle resize - toggle between sidebar and mobile button
            window.addEventListener('resize', () => {
                if (window.innerWidth > 1200) {
                    tocSidebar.classList.add('visible');
                    tocMobileBtn.classList.remove('visible');
                    if (backToTopBtn) backToTopBtn.classList.remove('has-toc');
                } else {
                    tocSidebar.classList.remove('visible');
                    tocMobileBtn.classList.add('visible');
                    if (backToTopBtn) backToTopBtn.classList.add('has-toc');
                }
            });
        }
    }
});
