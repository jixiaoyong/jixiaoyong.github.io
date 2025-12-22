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
    const effectiveTheme = theme === 'auto' ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);

    // Update Highlight.js
    const hljsThemeLink = document.getElementById('hljs-theme');
    if (hljsThemeLink) {
        hljsThemeLink.href = effectiveTheme === 'dark'
            ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
            : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    }

    // Update Icons/Text
    updateThemeUI(theme);
};

const updateThemeUI = (theme) => {
    const icon = document.getElementById('theme-icon');
    const textMobile = document.getElementById('theme-text-mobile');

    // Icons
    if (icon) {
        icon.className = ''; // Reset
        if (theme === 'light') icon.className = 'fas fa-sun';
        else if (theme === 'dark') icon.className = 'fas fa-moon';
        else icon.className = 'fas fa-adjust'; // Auto
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
        // Get i18n strings from button data attributes
        const btn = document.querySelector('.btn-email');
        const subject = btn?.dataset.emailSubject || 'Comment on article';
        const hello = btn?.dataset.emailHello || 'Hi!';
        const intro = btn?.dataset.emailIntro || 'I read your article and here are my thoughts:';
        const fallbackMsg = btn?.dataset.emailFallback || 'Cannot open email client. Copy email address?';

        // Build article URL
        const articleUrl = window.location.origin + articlePath;

        // Build email subject and body
        const fullSubject = `${subject}《${articleTitle}》`;
        const body = `${hello}\n\n${intro}\n\n[《${articleTitle}》](${articleUrl})\n\n`;

        // Generate mailto link
        const mailtoLink = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;

        // Try to open email client
        window.location.href = mailtoLink;

    } catch (error) {
        // Fallback: offer to copy email address
        const btn = document.querySelector('.btn-email');
        const fallbackMsg = btn?.dataset.emailFallback || 'Cannot open email client. Copy email address?';

        if (confirm(`${fallbackMsg}\n\n${EMAIL_ADDRESS}`)) {
            navigator.clipboard.writeText(EMAIL_ADDRESS).then(() => {
                alert('Email copied!');
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
    }
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
    const basePath = window.basePath || '';
    const fullPath = window.location.pathname;

    // Remove basePath to get relative path (e.g. "/blog/en/about" -> "/en/about")
    // Ensure we handle cases where basePath might be empty or "/"
    let relativePath = fullPath;
    if (basePath && fullPath.startsWith(basePath)) {
        relativePath = fullPath.substring(basePath.length);
    }

    // Check if starts with /en or /en/
    const isEnglish = relativePath === '/en' || relativePath.startsWith('/en/');

    let newRelativePath;
    if (isEnglish) {
        // Switch to Chinese: remove /en or /en/ prefix
        // /en -> /
        // /en/ -> /
        // /en/about.html -> /about.html
        if (relativePath === '/en') newRelativePath = '/';
        else newRelativePath = relativePath.replace(/^\/en\//, '/');
    } else {
        // Switch to English: add /en prefix
        // / -> /en/
        // /about.html -> /en/about.html
        if (relativePath === '/' || relativePath === '') newRelativePath = '/en/';
        else newRelativePath = '/en' + relativePath;
    }

    // Add basePath back
    // Ensure no double slashes if basePath ends with / (though usually it shouldn't)
    // Common case: basePath='/blog', newRel='/en/' -> '/blog/en/'
    const finalPath = (basePath + newRelativePath).replace(/\/+/g, '/');

    window.location.href = finalPath;
};

// Mobile Menu
const toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (menu) {
        const isHidden = menu.classList.toggle('hidden');
        if (icon) {
            icon.className = isHidden ? 'fas fa-bars' : 'fas fa-times';
        }
    }
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    // 1. Restore Theme
    const savedTheme = localStorage.getItem('theme') || 'auto';
    applyTheme(savedTheme);

    // 2. Listen for System Changes (for Auto mode)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'auto') {
            applyTheme('auto');
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

            const results = searchIndex.filter(post =>
                post.title.toLowerCase().includes(query) ||
                (post.tags && post.tags.some(t => t.toLowerCase().includes(query)))
            ).slice(0, 10); // Limit results

            if (results.length === 0) {
                resultsDiv.innerHTML = '<div style="color:var(--text-secondary);text-align:center;">No results found</div>';
                return;
            }

            resultsDiv.innerHTML = results.map(post => `
                <a href="${post.path}" class="search-result-item" onclick="closeSearch()">
                    <div class="search-result-title">${post.title}</div>
                    <div class="search-result-excerpt">${post.excerpt}...</div>
                </a>
            `).join('');
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
            const tagsHtml = post.tags && post.tags.length > 0
                ? post.tags.map(tag => `<a href="?tag=${encodeURIComponent(tag)}" class="tag">#${tag}</a>`).join('')
                : '';

            if (post.coverImage) {
                return `
                    <div class="post-item has-cover">
                        <div class="post-header-row">
                            <div class="post-cover">
                                <a href="${post.path}">
                                    <img src="${post.coverImage}" alt="${post.title}" loading="lazy"/>
                                </a>
                            </div>
                            <div class="post-header">
                                <h2><a href="${post.path}">${post.title}</a></h2>
                                <span class="post-date">${post.date}</span>
                            </div>
                        </div>
                        <div class="post-body">
                            <div class="post-excerpt">
                                <p>${post.excerpt}...</p>
                            </div>
                            <div class="post-tags">
                                ${tagsHtml}
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="post-item">
                        <div class="post-header">
                            <h2><a href="${post.path}">${post.title}</a></h2>
                            <span class="post-date">${post.date}</span>
                        </div>
                        <div class="post-excerpt">
                            <p>${post.excerpt}...</p>
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
                // Lazy load search.json
                if (!allPostsData) {
                    const basePath = window.basePath || '';
                    const searchJsonPath = isEnglish ? basePath + '/en/search.json' : basePath + '/search.json';
                    const res = await fetch(searchJsonPath);
                    allPostsData = await res.json();
                }

                // Get next batch
                const nextBatch = allPostsData.slice(loadedPosts, loadedPosts + postsPerPage);

                // Render posts
                const fragment = document.createDocumentFragment();
                nextBatch.forEach(post => {
                    const temp = document.createElement('div');
                    temp.innerHTML = createPostItemHtml(post);
                    fragment.appendChild(temp.firstElementChild);
                });

                postList.appendChild(fragment);
                loadedPosts += nextBatch.length;

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
    // 根据内容高度自动收起超过阈值的 demo 容器
    const initDemoSmartCollapse = () => {
        const demoContainers = document.querySelectorAll('.demo-container[data-collapse]');

        demoContainers.forEach(container => {
            const threshold = container.dataset.collapse;
            if (threshold === 'none') return; // 不折叠

            const body = container.querySelector('.demo-body');
            if (!body) return;

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

            // 检查内容高度
            if (body.scrollHeight > thresholdPx) {
                container.removeAttribute('open');
            }
        });
    };

    // 执行智能折叠
    initDemoSmartCollapse();

    // 窗口大小变化时重新检查（可选，延迟执行避免频繁触发）
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initDemoSmartCollapse, 250);
    });


    // 6.5. Table Responsive Wrapper - wrap tables for horizontal scroll on mobile
    const tables = document.querySelectorAll('.article-content table');
    tables.forEach(table => {
        // Skip if already wrapped
        if (table.parentElement.classList.contains('table-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });

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
                        // If has children, toggle expansion first
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
                        }

                        // Still allow navigation
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
                        }
                    });
                });

                // Toggle h3 children (if any h4s)
                h3Links.forEach(link => {
                    link.addEventListener('click', (e) => {
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
                        }

                        // Still allow navigation
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
                        }
                    });
                });

                // Regular links without children
                const regularLinks = container.querySelectorAll('.toc-h3:not(.has-children), .toc-h4');
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
                            if (tocBottomsheet) {
                                tocBottomsheet.classList.remove('active');
                                document.body.style.overflow = '';
                            }
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
                    document.body.style.overflow = 'hidden';
                });

                // Close bottomsheet
                const closeBottomsheet = () => {
                    tocBottomsheet.classList.remove('active');
                    document.body.style.overflow = '';
                };

                tocBottomsheet.querySelector('.toc-bottomsheet-overlay').addEventListener('click', closeBottomsheet);
                tocBottomsheet.querySelector('.toc-bottomsheet-close').addEventListener('click', closeBottomsheet);
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
