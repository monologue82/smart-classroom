// LuminaUI 主题管理
class ThemeManager {
    constructor() {
        // 检查本地存储中的主题设置
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    // 初始化主题
    init() {
        // 设置当前主题
        this.setTheme(this.currentTheme);
        
        // 监听主题切换事件
        document.addEventListener('themeChange', (e) => {
            this.setTheme(e.detail.theme);
        });
        
        // 监听系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // 只有在设置为自动时才跟随系统变化
                if (localStorage.getItem('theme') === 'auto') {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    // 设置主题
    setTheme(theme) {
        // 保存主题设置
        this.currentTheme = theme;
        
        // 应用主题到HTML元素
        if (theme === 'auto') {
            // 自动模式，根据系统设置决定
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } else {
            // 固定模式
            document.documentElement.setAttribute('data-theme', theme);
        }
        
        // 保存到本地存储
        localStorage.setItem('theme', theme);
        
        // 更新主题切换按钮的文本
        this.updateThemeToggleText();
    }

    // 切换主题
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // 触发主题切换事件
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    }

    // 更新主题切换按钮文本
    updateThemeToggleText() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            if (this.currentTheme === 'light') {
                toggleBtn.innerHTML = '🌙';
                toggleBtn.setAttribute('data-i18n-title', 'darkMode');
            } else {
                toggleBtn.innerHTML = '☀️';
                toggleBtn.setAttribute('data-i18n-title', 'lightMode');
            }
            
            // 更新按钮标题
            if (typeof i18n !== 'undefined') {
                toggleBtn.title = i18n.t(toggleBtn.getAttribute('data-i18n-title'));
            }
        }
    }

    // 获取当前主题
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// 初始化主题管理器
const themeManager = new ThemeManager();
window.themeManager = themeManager;

// 页面加载完成后更新UI
document.addEventListener('DOMContentLoaded', () => {
    themeManager.updateThemeToggleText();
});