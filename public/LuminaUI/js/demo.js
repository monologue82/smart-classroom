// LuminaUI Demo 页面交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有交互功能
    initTabs();
    initAccordion();
    initSwitches();
    initProgressBars();
    initButtons();
    initDropdowns();
    initCarousel();
});

// 标签页交互
function initTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header .tab-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabHeaders.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            tabHeaders.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // 添加当前活动状态
            tab.classList.add('active');
            tabPanes[index].classList.add('active');
        });
    });
}

// 折叠面板交互
function initAccordion() {
    const accordions = document.querySelectorAll('.accordion-header');
    
    accordions.forEach(accordion => {
        accordion.addEventListener('click', () => {
            const content = accordion.nextElementSibling;
            const isActive = accordion.classList.contains('active');
            
            // 关闭所有面板
            document.querySelectorAll('.accordion-header').forEach(header => {
                header.classList.remove('active');
            });
            document.querySelectorAll('.accordion-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 如果之前不是活动状态，则打开当前面板
            if (!isActive) {
                accordion.classList.add('active');
                content.classList.add('active');
            }
        });
    });
}

// 开关交互
function initSwitches() {
    const switches = document.querySelectorAll('.switch input');
    
    switches.forEach(sw => {
        sw.addEventListener('change', function() {
            // 可以在这里添加开关切换时的额外逻辑
            console.log('Switch toggled:', this.checked);
        });
    });
}

// 进度条动画
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    // 模拟进度条动画
    setTimeout(() => {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
}

// 按钮交互
function initButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // 添加点击波纹效果
        button.addEventListener('click', function(e) {
            // 创建波纹元素
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // 计算波纹位置和大小
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size/2;
            const y = e.clientY - rect.top - size/2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            // 添加波纹到按钮
            this.appendChild(ripple);
            
            // 移除波纹动画
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 下拉菜单交互
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdownMenu = this.nextElementSibling;
            
            // 关闭其他下拉菜单
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                }
            });
            
            // 切换当前下拉菜单
            dropdownMenu.classList.toggle('show');
        });
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });
}

// 轮播图交互
function initCarousel() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        let currentIndex = 0;
        const items = carousel.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('.carousel-indicators li');
        const totalItems = items.length;
        
        // 显示指定索引的项目
        function showItem(index) {
            items.forEach((item, i) => {
                item.classList.remove('active');
                if (indicators[i]) indicators[i].classList.remove('active');
            });
            
            items[index].classList.add('active');
            if (indicators[index]) indicators[index].classList.add('active');
            currentIndex = index;
        }
        
        // 下一个项目
        function nextItem() {
            const nextIndex = (currentIndex + 1) % totalItems;
            showItem(nextIndex);
        }
        
        // 上一个项目
        function prevItem() {
            const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
            showItem(prevIndex);
        }
        
        // 绑定控制按钮事件
        const nextButton = carousel.querySelector('.carousel-control-next');
        const prevButton = carousel.querySelector('.carousel-control-prev');
        
        if (nextButton) {
            nextButton.addEventListener('click', nextItem);
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', prevItem);
        }
        
        // 绑定指示器事件
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showItem(index);
            });
        });
        
        // 自动播放（可选）
        setInterval(nextItem, 5000);
    });
}

// 显示模态框
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// 隐藏模态框
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 初始化模态框关闭按钮
document.addEventListener('click', function(e) {
    // 点击模态框背景关闭
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 点击模态框关闭按钮关闭
    if (e.target.classList.contains('modal-close')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// 工具提示交互
document.addEventListener('DOMContentLoaded', function() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.querySelector('.tooltip-text');
            if (tooltipText) {
                tooltipText.style.visibility = 'visible';
                tooltipText.style.opacity = '1';
            }
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipText = this.querySelector('.tooltip-text');
            if (tooltipText) {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
            }
        });
    });
});