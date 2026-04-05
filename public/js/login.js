// login.js - 登录页面的JavaScript逻辑

// 页面完全加载后隐藏加载指示器
window.addEventListener('load', function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        // 添加淡出效果
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.visibility = 'hidden';
        
        // 确保元素在动画结束后被隐藏
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
});

// 显示通知
function showNotification(message, type) {
    // 优先使用Dynamic Island提示
    if (typeof showAlert !== 'undefined' && typeof dynamicIsland !== 'undefined') {
        // 映射类型：LuminaUI type -> Dynamic Island type
        let diType = 'info'; // 默认使用info类型
        if (type === 'success') diType = 'success';
        else if (type === 'error') diType = 'error';
        else if (type === 'warning') diType = 'warning';
        else diType = 'info';
        showAlert(message, diType);
    } else {
        // 如果Dynamic Island不可用，使用原始的LuminaUI通知
        const notification = document.getElementById('notification');
        const messageElement = document.getElementById('notification-message');
        
        messageElement.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type);
        
        notification.classList.add('show');
        
        const icon = notification.querySelector('i');
        if(type === 'success') {
            icon.className = 'fas fa-check-circle';
        } else if(type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
        } else {
            icon.className = 'fas fa-info-circle';
        }
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// 引入认证管理器
function loadAuthManager() {
    const script = document.createElement('script');
    script.src = 'js/auth.js';
    script.onload = function() {
        // 页面加载完成后检查是否已登录
        if (typeof authManager !== 'undefined') {
            // 如果已经登录，重定向到主页
            if (authManager.validateSession()) {
                window.location.href = 'main.html';
            }
        }
    };
    document.head.appendChild(script);
}

// 初始化认证管理器
loadAuthManager();

// 生成唯一的申请ID
function generateAppId() {
    return 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

// 登录函数
function login(username, password) {
    try {
        // 从 localStorage 获取用户列表
        let users = JSON.parse(localStorage.getItem('smart_classroom_users') || '[]');
        
        // 如果没有用户，添加默认的 admin 用户
        if (users.length === 0) {
            users.push({
                username: 'admin',
                password: 'admin',
                isAdmin: true,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('smart_classroom_users', JSON.stringify(users));
        }
        
        // 查找用户
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // 创建会话
            if (typeof authManager !== 'undefined') {
                authManager.createSession();
            }
            // 保存当前用户
            localStorage.setItem('currentUser', username);
            // 在灵动岛上显示成功消息
            if (typeof dynamicIsland !== 'undefined' && dynamicIsland.showSuccess) {
                dynamicIsland.showSuccess('登录成功，欢迎回来！');
            } else {
                showNotification('登录成功，欢迎回来！', 'success');
            }
            // 延迟一下，让用户看到灵动岛消息
            setTimeout(() => {
                // 使用转场动画跳转到主页面
                if (typeof transitionToPage !== 'undefined') {
                    transitionToPage('main.html', 'particles');
                } else {
                    window.location.href = 'main.html';
                }
            }, 1500); // 1.5秒延迟，让用户看到灵动岛消息
            return true;
        } else {
            showNotification('用户名或密码错误', 'error');
            return false;
        }
    } catch (error) {
        console.error('登录错误:', error);
        showNotification('登录过程中发生错误', 'error');
        return false;
    }
}

// 注册函数
function register(username, password) {
    try {
        console.log('[前端] 正在注册用户:', username);
        
        // 从 localStorage 获取现有用户列表
        let users = JSON.parse(localStorage.getItem('smart_classroom_users') || '[]');
        
        // 检查用户名是否已存在
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            showNotification('用户名已存在，请使用其他用户名', 'error');
            return false;
        }
        
        // 创建新用户
        const newUser = {
            username: username,
            password: password, // 注意：实际应用中应该对密码进行加密
            isAdmin: false,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('smart_classroom_users', JSON.stringify(users));
        
        console.log('[前端] 注册成功:', username);
        showNotification('注册成功！请使用您的账号登录', 'success');
        
        // 注册成功后切换回登录界面
        setTimeout(() => {
            loginContainer.style.display = 'flex';
            registerContainer.style.display = 'none';
        }, 1500);
        
        return true;
    } catch (error) {
        console.error('[前端] 注册错误:', error);
        showNotification('注册过程中发生错误', 'error');
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const applicationStatus = document.getElementById('applicationStatus');
    const statusText = document.getElementById('statusText');
    const appliedUsername = document.getElementById('appliedUsername');
    const appliedTime = document.getElementById('appliedTime');
    
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    document.getElementById('reg-togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('reg-password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'flex';
    });
    
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
    });
    
    loginBtn.addEventListener('click', async function() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        let isValid = true;
        document.getElementById('username-error').style.display = 'none';
        document.getElementById('password-error').style.display = 'none';
        
        if (!username) {
            document.getElementById('username-error').style.display = 'block';
            document.getElementById('username').classList.add('input-error');
            isValid = false;
        }
        
        if (!password) {
            document.getElementById('password-error').style.display = 'block';
            document.getElementById('password').classList.add('input-error');
            isValid = false;
        }
        
        if (!isValid) {
            showNotification('请填写所有必填项', 'error');
            return;
        }
        
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
        this.disabled = true;
        
        // 调用登录API
        const success = await login(username, password);
        
        if (!success) {
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 1500);
        }
    });
    
    registerBtn.addEventListener('click', function() {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        let isValid = true;
        document.getElementById('reg-username-error').style.display = 'none';
        document.getElementById('reg-password-error').style.display = 'none';
        document.getElementById('reg-confirm-error').style.display = 'none';
        
        if (!username || username.length < 3 || username.length > 20) {
            document.getElementById('reg-username-error').style.display = 'block';
            document.getElementById('reg-username').classList.add('input-error');
            isValid = false;
        }
        
        if (!password || password.length < 6) {
            document.getElementById('reg-password-error').style.display = 'block';
            document.getElementById('reg-password').classList.add('input-error');
            isValid = false;
        }
        
        if (!confirmPassword || password !== confirmPassword) {
            document.getElementById('reg-confirm-error').style.display = 'block';
            document.getElementById('reg-confirm-password').classList.add('input-error');
            isValid = false;
        }
        
        if (!isValid) {
            showNotification('请正确填写所有字段', 'error');
            return;
        }
        
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 注册中...';
        this.disabled = true;
        
        // 调用注册函数
        const success = register(username, password);
        
        if (success) {
            // 重置表单
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-confirm-password').value = '';
            
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('input').forEach(input => {
                input.classList.remove('input-error');
            });
        }
        
        // 2秒后重置按钮状态
        setTimeout(() => {
            this.innerHTML = originalHTML;
            this.disabled = false;
        }, 2000);
    });
    
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
            const errorElement = this.parentElement.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    });
});

// 页面加载完成后初始化LuminaUI
document.addEventListener('DOMContentLoaded', function() {
    // 初始化LuminaUI组件（如果存在相应的初始化函数）
    if (typeof initButtons !== 'undefined') {
        initButtons();
    }
    
    // 页面访问控制
    if (typeof protectPage !== 'undefined') {
        protectPage();
    }
});