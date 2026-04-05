// LuminaUI JavaScript Framework

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all LuminaUI components
    initButtons();
    initInputs();
    initThemeToggle();
});

// Button Component
function initButtons() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Skip icon buttons for ripple effect
        if (button.classList.contains('icon')) return;
        
        // Prevent duplicate ripple effects
        button.addEventListener('click', function(e) {
            // If button is processing, prevent new ripple effect
            if (this.classList.contains('processing')) return;
            
            // Remove existing ripple elements
            const existingRipples = this.querySelectorAll('.ripple');
            existingRipples.forEach(ripple => ripple.remove());
            
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // Add ripple styles
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size/2;
            const y = e.clientY - rect.top - size/2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple-animation 0.6s linear';
            ripple.style.pointerEvents = 'none';
            ripple.style.zIndex = '1';
            ripple.style.overflow = 'hidden';
            
            // Add ripple to button
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentElement) {
                    ripple.remove();
                }
            }, 600);
        });
    });
}

// Input Component
function initInputs() {
    const inputs = document.querySelectorAll('.input');
    
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Remove focus effect
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Add error handling
        if (input.classList.contains('error')) {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'This field is required';
            input.parentNode.insertBefore(errorMessage, input.nextSibling);
        }
    });
}

// Theme Toggle Component
function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            // Add animation class
            this.classList.add('rotating');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.classList.remove('rotating');
            }, 300);
        });
    }
}

// Alert Component
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert ${type} animate-fade-in`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="hideAlert(this)">
                <i class="icon-close">&times;</i>
            </button>
        </div>
    `;
    
    // Add show class after a short delay to trigger animation
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    // Add to alerts container
    const container = document.querySelector('.alerts-container') || createAlertsContainer();
    container.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            hideAlert(alert);
        }
    }, 5000);
    
    return alert;
}

// Hide Alert
function hideAlert(element) {
    // Add exit animation class
    const alert = element.classList.contains('alert') ? element : element.closest('.alert');
    alert.classList.remove('show');
    alert.classList.add('animate-fade-out');
    
    // Remove element after animation completes
    setTimeout(() => {
        if (alert.parentElement) {
            alert.parentElement.removeChild(alert);
        }
    }, 300);
}

// Create Alerts Container
function createAlertsContainer() {
    const container = document.createElement('div');
    container.className = 'alerts-container';
    document.body.appendChild(container);
    return container;
}

// Page Transition Component
function transitionToPage(url) {
    // Add transition class to body
    document.body.classList.add('page-transition');
    
    // Change page after transition
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Scroll Animation Component
function initScrollAnimations() {
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

// Initialize scroll animations
initScrollAnimations();

// Export functions for global use
window.LuminaUI = {
    showAlert,
    transitionToPage
};