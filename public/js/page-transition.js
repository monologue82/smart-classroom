class PageTransitionManager {
  constructor() {
    this.overlay = null;
    this.transitionType = 'fade';
    this.isTransitioning = false;
    this.performanceObserver = null;
    this.init();
  }

  init() {
    // 创建过渡覆盖层
    this.createOverlay();
    
    // 监听所有页面跳转链接
    this.bindNavigationEvents();
    
    // 监听页面加载完成事件
    window.addEventListener('load', () => {
      this.pageEnterAnimation();
    });
    
    // 初始化性能监控
    this.initPerformanceMonitoring();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'page-transition-overlay';
    // 将覆盖层添加到body的第一个子元素位置，以确保层级正确
    if (document.body.firstChild) {
      document.body.insertBefore(this.overlay, document.body.firstChild);
    } else {
      document.body.appendChild(this.overlay);
    }
  }

  // 页面进入动画
  pageEnterAnimation() {
    // 使用requestAnimationFrame优化动画性能
    requestAnimationFrame(() => {
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      
      // 使用requestAnimationFrame确保在下一次重绘时执行
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
  }

  // 新的页面离开动画，支持多种动画效果
  async pageLeaveAnimation(transitionType = 'fade') {
    if (!this.overlay) return Promise.resolve();
    
    return new Promise((resolve) => {
      // 使用requestAnimationFrame优化性能
      requestAnimationFrame(() => {
        // 根据过渡类型添加不同的视觉效果
        switch(transitionType) {
          case 'particles':
            this.overlay.classList.add('particles');
            break;
          case 'wave':
            this.overlay.classList.add('wave');
            break;
          case 'cubes':
            this.overlay.classList.add('cubes');
            break;
          case 'rings':
            this.overlay.classList.add('rings');
            break;
          default:
            // 默认使用渐变背景
            this.overlay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        
        this.overlay.classList.add('active');
        this.overlay.classList.add(`${transitionType}-out`);
        
        // 根据不同动画类型设置不同的持续时间
        let duration = 300; // 默认持续时间
        switch(transitionType) {
          case 'rotate':
          case 'flip':
          case 'flip-horizontal':
          case 'flip-vertical':
            duration = 500;
            break;
          case 'cube':
            duration = 600;
            break;
          case 'bounce':
            duration = 500;
            break;
          case 'particles':
          case 'wave':
          case 'cubes':
          case 'rings':
            duration = 700; // 稍长的视觉效果持续时间
            break;
          default:
            duration = 300;
        }
        
        // 使用更精确的计时器
        setTimeout(() => {
          // 移除动画类和视觉效果类
          this.overlay.classList.remove(`${transitionType}-out`);
          this.overlay.classList.remove('particles', 'wave', 'cubes', 'rings');
          // 重置背景为默认值
          this.overlay.style.background = '';
          resolve();
        }, duration);
      });
    });
  }

  // 新的页面进入动画，支持多种动画效果
  async pageEnterAnimationWithEffect(transitionType = 'fade') {
    // 为body添加特定的进入动画类
    document.body.classList.add(`${transitionType}-in`);
    
    // 根据不同动画类型设置不同的持续时间
    let duration = 300; // 默认持续时间
    switch(transitionType) {
      case 'rotate':
      case 'flip':
      case 'flip-horizontal':
      case 'flip-vertical':
        duration = 500;
        break;
      case 'cube':
        duration = 600;
        break;
      case 'bounce':
        duration = 500;
        break;
      case 'particles':
      case 'wave':
      case 'cubes':
      case 'rings':
        duration = 700; // 稍长的视觉效果持续时间
        break;
      default:
        duration = 300;
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // 移除动画类
        document.body.classList.remove(`${transitionType}-in`);
        resolve();
      }, duration);
    });
  }

  // 绑定导航事件
  bindNavigationEvents() {
    // 使用事件委托优化性能
    document.addEventListener('click', async (e) => {
      const link = e.target.closest('a');
      
      // 检查是否为内部页面跳转链接
      if (link && link.href && !link.target && !link.href.startsWith('http') && !link.href.startsWith('mailto:')) {
        e.preventDefault();
        
        // 阻止重复点击
        if (this.isTransitioning) {
          e.stopPropagation();
          return;
        }
        
        this.isTransitioning = true;
        
        // 从链接中获取动画类型，如果没有则使用默认值
        let transitionType = link.getAttribute('data-transition') || 'fade';
        if (!transitionType || transitionType === 'fade') {
          transitionType = this.transitionType;
        }
        
        try {
          // 执行离开动画
          await this.pageLeaveAnimation(transitionType);
          
          // 跳转到目标页面
          window.location.href = link.href;
        } catch (error) {
          console.error('页面切换动画出错:', error);
          // 出错时直接跳转
          window.location.href = link.href;
        }
      }
    }, true); // 使用捕获模式提高性能
    
    // 处理返回按钮
    window.addEventListener('popstate', (e) => {
      // 这里可以根据需要添加回退动画
    });
    
    // 处理表单提交 - 如果表单提交导致页面跳转
    document.addEventListener('submit', async (e) => {
      const form = e.target.closest('form');
      if (form && form.action && !form.target) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        e.preventDefault();
        
        // 使用默认的淡出动画
        try {
          await this.pageLeaveAnimation();
          form.submit();
        } catch (error) {
          console.error('表单提交动画出错:', error);
          form.submit();
        }
      }
    }, true);
  }

  // 初始化性能监控
  initPerformanceMonitoring() {
    // 使用性能API监控动画性能
    if ('performance' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            // 监控动画性能指标
            if (entry.duration > 16.67) { // 超过一帧的时间(60fps)
              console.warn(`动画性能警告: ${entry.name} 耗时 ${entry.duration.toFixed(2)}ms`);
            }
          }
        }
      });
      
      this.performanceObserver.observe({entryTypes: ['measure']});
    }
  }

  // 销毁资源
  destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

// 初始化页面切换管理器
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PageTransitionManager !== 'undefined') {
    window.pageTransitionManager = new PageTransitionManager();
    
    // 页面卸载前清理资源
    window.addEventListener('beforeunload', () => {
      if (window.pageTransitionManager) {
        window.pageTransitionManager.destroy();
      }
    });
  }
});

// 通用页面切换函数
function transitionToPage(url, transitionType = 'fade') {
  if (window.pageTransitionManager && !window.pageTransitionManager.isTransitioning) {
    window.pageTransitionManager.isTransitioning = true;
    window.pageTransitionManager.transitionType = transitionType;
    
    window.pageTransitionManager.pageLeaveAnimation(transitionType).then(() => {
      window.location.href = url;
    });
  } else {
    // 如果管理器未初始化，直接跳转
    window.location.href = url;
  }
}

// 为导航链接添加动画效果
function initAnimatedNavigation() {
  // 为导航栏中的链接添加特殊处理
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.classList.contains('active')) {
        e.preventDefault();
        return;
      }
      
      const href = this.getAttribute('href');
      const transitionType = this.getAttribute('data-transition') || 'fade';
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        e.preventDefault();
        transitionToPage(href, transitionType);
      }
    });
  });
  
  // 为按钮添加动画效果
  const pageButtons = document.querySelectorAll('[onclick*="window.location.href"], [onclick*="location.href"]');
  pageButtons.forEach(button => {
    const originalOnclick = button.onclick;
    button.onclick = function(e) {
      if (originalOnclick) {
        // 尝试从onclick中提取URL
        const onclickStr = button.getAttribute('onclick');
        const urlMatch = onclickStr.match(/['"](.*?\.(html|htm))['"]/);
        if (urlMatch) {
          e.preventDefault();
          transitionToPage(urlMatch[1]);
          return false;
        }
      }
      if (originalOnclick) {
        originalOnclick.call(this, e);
      }
    };
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initAnimatedNavigation);

// 页面加载完成后执行进入动画
document.addEventListener('DOMContentLoaded', () => {
  // 检查URL参数或页面特定的动画设置
  const urlParams = new URLSearchParams(window.location.search);
  const pageTransition = urlParams.get('transition') || 'fade';
  
  // 执行页面进入动画
  if (window.pageTransitionManager) {
    window.pageTransitionManager.pageEnterAnimationWithEffect(pageTransition);
  } else {
    // 如果管理器未初始化，执行基础动画
    requestAnimationFrame(() => {
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
  }
});