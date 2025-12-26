/**
 * Editor Link Utilities for Blog SSG
 * 
 * 客户端脚本，用于：
 * - 检测用户是否已在 editor 登录
 * - 显示/隐藏编辑按钮
 * - 生成编辑 URL
 */

(function () {
    'use strict';

    // Status key shared with editor (public flag, not sensitive token)
    const STATUS_KEY = 'editor_is_logged_in';

    // Editor base URL (same domain)
    const EDITOR_BASE_URL = '/editor';

    // Default project ID
    const PROJECT_ID = 'blog';

    /**
     * 检测用户是否已登录（通过检查 localStorage 中的 login status）
     * 注意：我们不再直接检查 github_token，以提高安全性
     * 
     * @returns {boolean} true 如果用户已登录
     */
    function isEditorLoggedIn() {
        try {
            return localStorage.getItem(STATUS_KEY) === 'true';
        } catch (e) {
            return false;
        }
    }

    /**
     * 生成编辑 URL
     * @param {string} filePath - 文件路径，相对于项目根目录
     * @returns {string} 完整的 editor URL
     */
    function getEditUrl(filePath) {
        const params = new URLSearchParams({
            project: PROJECT_ID,
            edit: filePath
        });
        return EDITOR_BASE_URL + '/?' + params.toString();
    }

    /**
     * 生成登录 URL
     * @returns {string} 登录页面 URL
     */
    function getLoginUrl() {
        const params = new URLSearchParams({
            project: PROJECT_ID
        });
        return EDITOR_BASE_URL + '/login?' + params.toString();
    }

    /**
     * 生成仪表盘 URL
     * @returns {string} 仪表盘 URL
     */
    function getDashboardUrl() {
        return EDITOR_BASE_URL + '/dashboard?project=' + PROJECT_ID;
    }

    /**
     * 初始化编辑按钮显示逻辑
     * 查找所有带有 data-edit-path 属性的元素并设置其可见性
     */
    function initEditButtons() {
        const isLoggedIn = isEditorLoggedIn();

        // 查找所有编辑按钮
        const editButtons = document.querySelectorAll('[data-edit-path]');

        editButtons.forEach(function (btn) {
            if (isLoggedIn) {
                // 显示按钮
                btn.style.display = '';
                btn.classList.remove('hidden');

                // 设置 href（如果是链接）
                const editPath = btn.getAttribute('data-edit-path');
                if (btn.tagName === 'A' && editPath) {
                    btn.href = getEditUrl(editPath);
                }
            } else {
                // 隐藏按钮
                btn.style.display = 'none';
                btn.classList.add('hidden');
            }
        });

        // 处理管理入口链接
        const adminLinks = document.querySelectorAll('[data-editor-link]');
        adminLinks.forEach(function (link) {
            if (link.tagName === 'A') {
                link.href = isLoggedIn ? getDashboardUrl() : getLoginUrl();
            }
        });
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEditButtons);
    } else {
        initEditButtons();
    }

    // 监听 storage 事件，实现跨标签页状态同步
    window.addEventListener('storage', function (e) {
        if (e.key === STATUS_KEY) {
            initEditButtons();
        }
    });

    // 暴露到全局以便调试
    window.editorLink = {
        isLoggedIn: isEditorLoggedIn,
        getEditUrl: getEditUrl,
        getLoginUrl: getLoginUrl,
        getDashboardUrl: getDashboardUrl,
        init: initEditButtons
    };
})();
