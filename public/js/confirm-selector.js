// 确认选择器组件

class ConfirmSelector {
  constructor() {
    this.overlay = null;
    this.dialog = null;
    this.resolveCallback = null;
  }

  // 显示确认选择器
  show(options = {}) {
    // 默认选项
    const defaultOptions = {
      title: '确认操作',
      content: '您确定要执行此操作吗？',
      confirmText: '确认',
      cancelText: '取消',
      type: 'info' // info, warning, error 等
    };

    const opts = { ...defaultOptions, ...options };

    return new Promise((resolve) => {
      this.resolveCallback = resolve;

      // 创建遮罩
      this.overlay = document.createElement('div');
      this.overlay.className = 'confirm-selector-overlay';

      // 创建对话框
      this.dialog = document.createElement('div');
      this.dialog.className = 'confirm-selector-dialog';

      // 根据类型设置流光颜色
      let glowColor;
      switch(opts.type) {
        case 'warning':
          glowColor = 'rgba(241, 196, 15, 0.8)'; // 黄色
          break;
        case 'error':
          glowColor = 'rgba(231, 76, 60, 0.8)'; // 红色
          break;
        case 'success':
          glowColor = 'rgba(46, 204, 113, 0.8)'; // 绿色
          break;
        default:
          glowColor = 'rgba(108, 99, 255, 0.8)'; // 紫色
      }

      this.dialog.style.setProperty('--glow-color', glowColor);

      // 创建内容
      const title = document.createElement('div');
      title.className = 'confirm-selector-title';
      title.textContent = opts.title;

      const content = document.createElement('div');
      content.className = 'confirm-selector-content';
      content.textContent = opts.content;

      // 创建按钮组
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'confirm-selector-buttons';

      // 取消按钮
      const cancelButton = document.createElement('button');
      cancelButton.className = 'confirm-selector-btn cancel';
      cancelButton.textContent = opts.cancelText;
      cancelButton.addEventListener('click', () => {
        this.hide(false);
      });

      // 确认按钮
      const confirmButton = document.createElement('button');
      confirmButton.className = 'confirm-selector-btn confirm';
      confirmButton.textContent = opts.confirmText;
      confirmButton.addEventListener('click', () => {
        this.hide(true);
      });

      // 组装对话框
      buttonGroup.appendChild(cancelButton);
      buttonGroup.appendChild(confirmButton);

      this.dialog.appendChild(title);
      this.dialog.appendChild(content);
      this.dialog.appendChild(buttonGroup);

      this.overlay.appendChild(this.dialog);
      document.body.appendChild(this.overlay);

      // 触发显示动画
      setTimeout(() => {
        this.overlay.classList.add('show');
      }, 10);
    });
  }

  // 隐藏选择器
  hide(result) {
    if (!this.overlay) return;

    // 触发渐出动画
    this.overlay.classList.remove('show');

    // 等待动画结束后移除元素
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }

      // 重置引用
      this.overlay = null;
      this.dialog = null;

      // 调用resolve回调
      if (this.resolveCallback) {
        this.resolveCallback(result);
        this.resolveCallback = null;
      }
    }, 300);
  }

  // 键盘支持：ESC键取消
  setupKeyboardListener() {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && this.overlay) {
        this.hide(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
  }

  // 点击遮罩关闭
  setupOverlayClickListener() {
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.hide(false);
        }
      });
    }
  }
}

// 创建全局实例
const confirmSelector = new ConfirmSelector();

// 设置键盘监听
confirmSelector.setupKeyboardListener();

// 便捷函数
function showConfirmSelector(options) {
  return confirmSelector.show(options);
}

// 为所有页面添加确认选择器的引用
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已存在实例，避免重复初始化
  if (typeof window.confirmSelector === 'undefined') {
    window.confirmSelector = confirmSelector;
    window.showConfirmSelector = showConfirmSelector;
  }
});