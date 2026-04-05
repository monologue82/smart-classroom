// 全局认证和会话管理模块

class AuthManager {
    constructor() {
        this.SESSION_KEY = 'smart_classroom_session';
        this.IS_AUTHENTICATED_KEY = 'is_authenticated';
        this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30分钟
    }

    // 创建会话
    createSession() {
        const session = {
            isAuthenticated: true,
            timestamp: Date.now(),
            sessionId: this.generateSessionId()
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        localStorage.setItem(this.IS_AUTHENTICATED_KEY, 'true');
        return session;
    }

    // 生成会话ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 验证会话
    validateSession() {
        try {
            const sessionStr = localStorage.getItem(this.SESSION_KEY);
            if (!sessionStr) {
                return false;
            }

            const session = JSON.parse(sessionStr);
            const isAuthenticated = localStorage.getItem(this.IS_AUTHENTICATED_KEY) === 'true';

            // 检查会话是否过期
            if (Date.now() - session.timestamp > this.SESSION_TIMEOUT) {
                this.clearSession();
                return false;
            }

            // 检查会话完整性
            if (!session.isAuthenticated || !isAuthenticated) {
                return false;
            }

            // 更新时间戳
            session.timestamp = Date.now();
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

            return true;
        } catch (error) {
            console.error('会话验证失败:', error);
            this.clearSession();
            return false;
        }
    }

    // 清除会话
    clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.IS_AUTHENTICATED_KEY);
    }

    // 检查页面访问权限
    checkPageAccess(currentPage) {
        // 登录页面和开发者页面不需要认证
        if (currentPage === 'login.html' || currentPage === 'developer.html') {
            return true;
        }

        // 检查会话
        if (!this.validateSession()) {
            return false;
        }

        return true;
    }

    // 重定向到登录页面
    redirectToLogin() {
        this.clearSession();
        window.location.href = './login.html';
    }

    // 重定向到主页
    redirectToMain() {
        window.location.href = 'main.html';
    }
}

// 创建全局认证管理器实例
const authManager = new AuthManager();

// 页面访问控制函数
function protectPage() {
    // 获取当前页面文件名
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 检查页面访问权限
    if (!authManager.checkPageAccess(currentPage)) {
        // 未授权访问，重定向到登录页面
        authManager.redirectToLogin();
        return false;
    }
    
    return true;
}

// 在页面加载时执行访问控制
document.addEventListener('DOMContentLoaded', function() {
    protectPage();
});

// 导出函数供其他页面使用
window.AuthManager = AuthManager;
window.authManager = authManager;
window.protectPage = protectPage;