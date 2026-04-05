// Dynamic Island 全局管理模块
// 用于替换浏览器默认的提示框

class DynamicIslandManager {
  constructor() {
    this.dynamicIsland = null;
    this.islandContent = null;
    this.currentActivity = null;
    this.isInitialized = false;
    this.idleTimeout = null;
    this.idleInterval = null; // 用于显示日期时间的定时器
    this.isUpdating = false; // 标记是否正在更新状态，避免在更新过程中被中断
    
    // 存储音乐播放器的状态
    this.musicPlayerState = {
      albumArt: 'https://cdn.pixabay.com/photo/2014/08/21/20/09/vinyl-record-423533_1280.jpg',
      trackTitle: '智能教室系统',
      artist: 'AuroraNova',
      isPlaying: false
    };
    
    this.init();
  }

  // 初始化Dynamic Island
  init() {
    // 防止重复初始化
    if (this.isInitialized) return;
    
    try {
      // 检查是否已存在Dynamic Island元素
      this.dynamicIsland = document.getElementById('dynamic-island');
      
      if (!this.dynamicIsland) {
        // 如果不存在，创建Dynamic Island元素
        this.createDynamicIsland();
      }
      
      // 确保元素引用有效
      if (this.dynamicIsland) {
        this.islandContent = this.dynamicIsland.querySelector('.island-content');
      }
      
      // 只有在所有必需元素都成功获取后才标记为已初始化
      if (this.dynamicIsland && this.islandContent) {
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Dynamic Island初始化失败:', error);
      // 即使初始化失败也要标记为已初始化，避免重复尝试
      this.isInitialized = true;
    }
    
    // 设置空闲状态
    this.setIdleState();
  }

  // 创建Dynamic Island元素
  createDynamicIsland() {
    const islandHTML = `
      <div id="dynamic-island">
        <div class="island-content">
          <!-- 内容由 JS 动态插入 -->
        </div>
        <div class="island-highlight"></div>
      </div>
    `;
    
    try {
      // 将Dynamic Island添加到body
      if (document.body) {
        document.body.insertAdjacentHTML('afterbegin', islandHTML);
      } else {
        // 如果document.body不存在，等待DOM加载完成
        document.addEventListener('DOMContentLoaded', () => {
          document.body.insertAdjacentHTML('afterbegin', islandHTML);
        });
      }
    } catch (error) {
      console.error('创建Dynamic Island元素失败:', error);
      return;
    }
    
    // 重新获取元素引用
    this.dynamicIsland = document.getElementById('dynamic-island');
    if (this.dynamicIsland) {
      this.islandContent = this.dynamicIsland.querySelector('.island-content');
    }
  }

  // 设置空闲状态（始终显示时间）
  setIdleState() {
    // 清除之前的定时器
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    
    // 清除之前的日期时间定时器
    if (this.idleInterval) {
      clearInterval(this.idleInterval);
    }
    
    // 恢复到空闲状态
    this.updateDynamicIsland('idle');
    
    // 始终显示日期时间
    this.showDateTime();
  }

  // 显示日期时间
  showDateTime() {
    // 立即显示当前日期时间
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    });
    const timeStr = now.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const dateTimeStr = `${dateStr} ${timeStr}`;
    
    this.updateDynamicIsland('datetime', { message: dateTimeStr });
  }

  // 开始显示日期时间的自动更新
  startDateTimeUpdate() {
    // 清除之前的定时器
    if (this.idleInterval) {
      clearInterval(this.idleInterval);
    }
    
    // 立即显示一次日期时间
    this.showDateTime();
    
    // 每分钟更新一次日期时间
    this.idleInterval = setInterval(() => {
      if (this.currentActivity === 'idle' || this.currentActivity === 'datetime') {
        this.showDateTime();
      }
    }, 60000); // 每分钟更新一次
  }

  // 更新Dynamic Island的UI和状态
  updateDynamicIsland(newActivity, data = {}, forceSwitch = false) {
    if (!this.dynamicIsland || !this.islandContent) {
      console.error('Dynamic Island not initialized');
      return;
    }
    
    // 如果是相同活动且不是强制切换，则返回
    if (newActivity === this.currentActivity && !forceSwitch && newActivity !== 'idle') {
      return;
    }

    // 清除之前的定时器
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    
    // 如果切换到非空闲状态，清除日期时间定时器
    if (newActivity !== 'idle' && newActivity !== 'datetime' && this.idleInterval) {
      clearInterval(this.idleInterval);
      this.idleInterval = null;
    }

    // 设置更新标志，防止在更新过程中被外部调用打断
    this.isUpdating = true;

    // 步骤1: 立即开始旧内容淡出动画
    this.dynamicIsland.classList.remove('display-content');

    // 步骤2: 移除所有旧的状态类
    this.dynamicIsland.classList.remove(
      'calling', 'music-playing', 'timer', 'music-expanded', 'greeting', 'info', 'success', 'warning', 'error', 'datetime'
    );

    // 步骤3: 延迟执行，等待淡出完成
    const contentFadeOutDuration = 150;

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.islandContent.innerHTML = '';
        this.currentActivity = newActivity;

        // 步骤4: 根据活动类型添加相应的类和内容
        switch (newActivity) {
          case 'datetime':
            this.dynamicIsland.classList.add('info'); // 使用info样式显示日期时间
            this.islandContent.innerHTML = `
              <i class="fas fa-clock"></i>
              <div class="text">
                <span class="message">${data.message || '欢迎使用智能教室系统'}</span>
              </div>
            `;
            this.dynamicIsland.classList.add('display-content');
            
            // 开始自动更新日期时间
            this.startDateTimeUpdate();
            break;

          case 'info':
            this.dynamicIsland.classList.add('info');
            this.islandContent.innerHTML = `
              <i class="fas fa-info-circle"></i>
              <div class="text">
                <span class="message">${data.message || '信息提示'}</span>
              </div>
            `;
            this.dynamicIsland.classList.add('display-content');
            
            // 2秒后自动回到空闲状态（减少延迟）
            this.idleTimeout = setTimeout(() => {
              this.setIdleState();
            }, 2000);
            break;

          case 'success':
            this.dynamicIsland.classList.add('success');
            this.islandContent.innerHTML = `
              <i class="fas fa-check-circle"></i>
              <div class="text">
                <span class="message">${data.message || '操作成功'}</span>
              </div>
            `;
            this.dynamicIsland.classList.add('display-content');
            
            // 2秒后自动回到空闲状态（减少延迟）
            this.idleTimeout = setTimeout(() => {
              this.setIdleState();
            }, 2000);
            break;

          case 'warning':
            this.dynamicIsland.classList.add('warning');
            this.islandContent.innerHTML = `
              <i class="fas fa-exclamation-triangle"></i>
              <div class="text">
                <span class="message">${data.message || '警告信息'}</span>
              </div>
            `;
            this.dynamicIsland.classList.add('display-content');
            
            // 2.5秒后自动回到空闲状态（减少延迟）
            this.idleTimeout = setTimeout(() => {
              this.setIdleState();
            }, 2500);
            break;

          case 'music':
            this.dynamicIsland.classList.add('music-playing');
            this.islandContent.innerHTML = `
              <img src="${data.albumArt || this.musicPlayerState.albumArt}" alt="Album Art" class="album-art">
              <div class="text">
                <span class="track-title">${data.trackTitle || this.musicPlayerState.trackTitle}</span>
                <span class="artist">${data.artist || this.musicPlayerState.artist}</span>
              </div>
              <i class="fas ${data.isPlaying ? 'fa-pause' : 'fa-play'} play-icon"></i>
            `;
            this.dynamicIsland.classList.add('display-content');
            
            // 5秒后自动回到空闲状态
            this.idleTimeout = setTimeout(() => {
              this.setIdleState();
            }, 5000);
            break;

          case 'error':
            this.dynamicIsland.classList.add('error');
            this.islandContent.innerHTML = `
              <i class="fas fa-exclamation-circle"></i>
              <div class="text">
                <span class="message">${data.message || '错误信息'}</span>
              </div>
            `;
            this.dynamicIsland.classList.add('display-content');
            
            // 3秒后自动回到空闲状态（减少延迟）
            this.idleTimeout = setTimeout(() => {
              this.setIdleState();
            }, 3000);
            break;

          case 'idle':
          default:
            // 空闲状态，只保留基础样式
            this.currentActivity = 'idle';
            // 空闲状态下会显示时间
            break;
        }

        // 步骤5: 添加内容显示类
        if (newActivity !== 'idle') {
          this.dynamicIsland.classList.add('display-content');
        }

        // 状态更新完成，清除更新标志
        this.isUpdating = false;

      }, contentFadeOutDuration);
    });
  }

  // 显示信息提示
  showInfo(message) {
    this.updateDynamicIsland('info', { message });
  }

  // 显示成功提示
  showSuccess(message) {
    this.updateDynamicIsland('success', { message });
  }

  // 显示警告提示
  showWarning(message) {
    this.updateDynamicIsland('warning', { message });
  }

  // 显示错误提示
  showError(message) {
    this.updateDynamicIsland('error', { message });
  }

  // 显示音乐播放器（如果需要）
  showMusic(data = {}) {
    if (data.albumArt) this.musicPlayerState.albumArt = data.albumArt;
    if (data.trackTitle) this.musicPlayerState.trackTitle = data.trackTitle;
    if (data.artist) this.musicPlayerState.artist = data.artist;
    if (typeof data.isPlaying !== 'undefined') this.musicPlayerState.isPlaying = data.isPlaying;
    
    this.updateDynamicIsland('music', this.musicPlayerState, true);
  }

  // 更新时间显示（供外部调用）
  updateTime() {
    // 只有在空闲或日期时间状态下且不在更新过程中才更新时间
    if ((this.currentActivity === 'idle' || this.currentActivity === 'datetime') && !this.isUpdating) {
      this.showDateTime();
    }
  }

  // 显示问候语（已禁用）
  showGreeting() {
    // 不显示问候语
    return;
  }

  // 添加一个通用的show方法，可指定类型
  show(type, message) {
    switch (type) {
      case 'info':
        this.showInfo(message);
        break;
      case 'success':
        this.showSuccess(message);
        break;
      case 'warning':
        this.showWarning(message);
        break;
      case 'error':
        this.showError(message);
        break;
      case 'music':
        this.showMusic(message);
        break;
      default:
        this.showInfo(message);
    }
  }
}

// 延迟创建全局实例，确保DOM完全加载
let dynamicIsland = null;

// 检查dynamicIsland实例是否完整的方法
function isValidDynamicIsland(instance) {
  if (!instance) return false;
  return typeof instance.show === 'function' &&
         typeof instance.showInfo === 'function' &&
         typeof instance.showSuccess === 'function' &&
         typeof instance.showWarning === 'function' &&
         typeof instance.showError === 'function' &&
         typeof instance.updateTime === 'function';
}

// 初始化函数
function initializeDynamicIsland() {
  if (!dynamicIsland || !isValidDynamicIsland(dynamicIsland)) {
    try {
      // 创建新实例
      const tempInstance = new DynamicIslandManager();
      // 确保实例的所有方法都可用
      if (isValidDynamicIsland(tempInstance)) {
        dynamicIsland = tempInstance;
      } else {
        console.error('DynamicIsland实例初始化不完整，方法不可用');
        // 创建一个模拟对象作为备用
        dynamicIsland = createFallbackDynamicIsland();
      }
    } catch (error) {
      console.error('DynamicIsland初始化错误:', error);
      // 创建一个模拟对象作为备用
      dynamicIsland = createFallbackDynamicIsland();
    }
  }
  return dynamicIsland;
}

// 创建一个备用的dynamicIsland对象
function createFallbackDynamicIsland() {
  return {
    show: function(type, message) {
      this[type === 'error' ? 'error' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'](message);
    },
    showInfo: function(message) {
      this.info(message);
    },
    showSuccess: function(message) {
      this.success(message);
    },
    showWarning: function(message) {
      this.warning(message);
    },
    showError: function(message) {
      this.error(message);
    },
    info: function(message) { console.log('Info: ' + message); },
    success: function(message) { console.log('Success: ' + message); },
    warning: function(message) { console.log('Warning: ' + message); },
    error: function(message) { console.log('Error: ' + message); },
    updateTime: function() { console.log('Updating time...'); }
  };
}

// 为了兼容旧的浏览器提示，提供替换函数
function showAlert(message, type = 'info') {
  try {
    // 尝试初始化
    const island = initializeDynamicIsland();
    if (island && typeof island.show === 'function') {
      island.show(type, message);
    } else {
      alert(message);
    }
  } catch (error) {
    console.error('Dynamic Island调用失败:', error);
    alert(message);
  }
}

// 在DOM完全加载后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDynamicIsland);
} else {
  // DOM已经加载完成，直接初始化
  setTimeout(initializeDynamicIsland, 0);
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DynamicIslandManager, dynamicIsland, showAlert };
}