// LuminaUI 国际化支持
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'zh'; // 默认语言设置为中文
        this.translations = {
            en: {
                welcome: "Welcome to LuminaUI",
                description: "A modern, lightweight UI framework",
                components: "Components",
                buttons: "Buttons",
                inputs: "Inputs",
                alerts: "Alerts",
                primary: "Primary",
                secondary: "Secondary",
                success: "Success",
                error: "Error",
                warning: "Warning",
                info: "Info",
                textInput: "Text input",
                errorInput: "Error input",
                successAlert: "This is a success alert",
                errorAlert: "This is an error alert",
                warningAlert: "This is a warning alert",
                infoAlert: "This is an info alert",
                copyright: "© 2025 LuminaUI. All rights reserved.",
                demoTitle: "LuminaUI Demo",
                demoDesc: "Explore all components and features",
                colorPalette: "Color Palette",
                primaryButtons: "Primary Buttons",
                secondaryButtons: "Secondary Buttons",
                default: "Default",
                disabled: "Disabled",
                small: "Small",
                large: "Large",
                textInputs: "Text Inputs",
                formExample: "Form Example",
                name: "Name",
                email: "Email",
                submit: "Submit",
                select: "Select an option",
                option1: "Option 1",
                option2: "Option 2",
                option3: "Option 3",
                alertTypes: "Alert Types",
                interactiveAlerts: "Interactive Alerts",
                showSuccess: "Show Success",
                showError: "Show Error",
                showWarning: "Show Warning",
                showInfo: "Show Info",
                cards: "Cards",
                cardTitle: "Card Title",
                cardContent: "This is a simple card component with some sample text content.",
                anotherCard: "Another Card",
                cardContent2: "Cards can contain various types of content including text, images, and buttons.",
                featureCard: "Feature Card",
                featureCardContent: "This card demonstrates the glassmorphism effect with a beautiful backdrop filter.",
                action: "Action",
                cancel: "Cancel",
                lightMode: "Light Mode",
                darkMode: "Dark Mode",
                language: "Language",
                chinese: "中文",
                english: "English",
                textStyles: "Text Styles",
                heading1: "Heading 1",
                heading2: "Heading 2",
                heading3: "Heading 3",
                heading4: "Heading 4",
                heading5: "Heading 5",
                heading6: "Heading 6",
                paragraph: "This is a paragraph with some sample text to demonstrate the typography styles.",
                lightText: "This is light text color.",
                lighterText: "This is lighter text color.",
                boldText: "This is bold text.",
                italicText: "This is italic text.",
                iconButtons: "Icon Buttons"
            },
            zh: {
                welcome: "欢迎使用 LuminaUI",
                description: "一个现代、轻量级的UI框架",
                components: "组件",
                buttons: "按钮",
                inputs: "输入框",
                alerts: "警告框",
                primary: "主要",
                secondary: "次要",
                success: "成功",
                error: "错误",
                warning: "警告",
                info: "信息",
                textInput: "文本输入框",
                errorInput: "错误输入框",
                successAlert: "这是一个成功警告",
                errorAlert: "这是一个错误警告",
                warningAlert: "这是一个警告消息",
                infoAlert: "这是一个信息消息",
                copyright: "© 2025 LuminaUI。保留所有权利。",
                demoTitle: "LuminaUI 演示",
                demoDesc: "探索所有组件和功能",
                colorPalette: "调色板",
                primaryButtons: "主要按钮",
                secondaryButtons: "次要按钮",
                default: "默认",
                disabled: "禁用",
                small: "小",
                large: "大",
                textInputs: "文本输入框",
                formExample: "表单示例",
                name: "姓名",
                email: "邮箱",
                submit: "提交",
                select: "请选择",
                option1: "选项1",
                option2: "选项2",
                option3: "选项3",
                alertTypes: "警告类型",
                interactiveAlerts: "交互式警告",
                showSuccess: "显示成功",
                showError: "显示错误",
                showWarning: "显示警告",
                showInfo: "显示信息",
                cards: "卡片",
                cardTitle: "卡片标题",
                cardContent: "这是一个简单的卡片组件，包含一些示例文本内容。",
                anotherCard: "另一个卡片",
                cardContent2: "卡片可以包含各种类型的内容，包括文本、图像和按钮。",
                featureCard: "功能卡片",
                featureCardContent: "此卡片演示了带有美丽背景滤镜的玻璃态效果。",
                action: "操作",
                cancel: "取消",
                lightMode: "亮色模式",
                darkMode: "暗色模式",
                language: "语言",
                chinese: "中文",
                english: "English",
                textStyles: "文本样式",
                heading1: "标题1",
                heading2: "标题2",
                heading3: "标题3",
                heading4: "标题4",
                heading5: "标题5",
                heading6: "标题6",
                paragraph: "这是一个段落，包含一些示例文本以演示排版样式。",
                lightText: "这是浅色文本。",
                lighterText: "这是更浅的文本。",
                boldText: "这是粗体文本。",
                italicText: "这是斜体文本。",
                iconButtons: "图标按钮"
            }
        };
    }

    // 获取当前语言
    getCurrentLang() {
        return this.currentLang;
    }

    // 设置语言
    setLang(lang) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        this.updateUI();
        // 触发语言切换事件
        window.dispatchEvent(new CustomEvent('langChange', { detail: lang }));
    }

    // 翻译文本
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }

    // 更新UI文本
    updateUI() {
        // 更新所有带有data-i18n属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // 更新placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // 更新title属性
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
    }
}

// 初始化国际化支持
const i18n = new I18n();
window.i18n = i18n;

// 页面加载完成后更新UI
document.addEventListener('DOMContentLoaded', () => {
    i18n.updateUI();
});

// 监听语言切换事件
window.addEventListener('langChange', (e) => {
    // 可以在这里添加额外的处理逻辑
    console.log('Language changed to:', e.detail);
});