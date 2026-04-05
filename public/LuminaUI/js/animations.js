// LuminaUI 动画系统
class Animations {
    constructor() {
        this.initPageTransitions();
        this.initNotificationAnimations();
    }

    // 初始化页面切换动画
    initPageTransitions() {
        // 监听页面切换事件
        document.addEventListener('pageTransition', (e) => {
            this.pageTransition(e.detail.from, e.detail.to);
        });
    }

    // 页面切换动画
    pageTransition(from, to) {
        // 添加页面过渡类
        document.body.classList.add('page-transition');
        
        // 执行过渡动画
        setTimeout(() => {
            // 这里可以添加具体的页面切换逻辑
            // 比如隐藏旧页面，显示新页面
            document.body.classList.remove('page-transition');
        }, 300);
    }

    // 显示通知动画
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} animate-fade-in-up`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="animations.hideNotification(this)">
                    <i class="icon-close"></i>
                </button>
            </div>
        `;
        
        // 添加到通知容器
        const container = document.querySelector('.notifications-container') || this.createNotificationContainer();
        container.appendChild(notification);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            if (notification.parentNode) {
                this.hideNotification(notification);
            }
        }, 3000);
        
        return notification;
    }

    // 隐藏通知
    hideNotification(element) {
        // 添加退出动画类
        const notification = element.classList.contains('notification') ? element : element.closest('.notification');
        notification.classList.add('animate-fade-out-down');
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // 创建通知容器
    createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
        return container;
    }

    // 元素进入视图动画
    animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// 初始化动画系统
const animations = new Animations();
window.animations = animations;

// 页面加载完成后初始化滚动动画
document.addEventListener('DOMContentLoaded', () => {
    animations.animateOnScroll();
});