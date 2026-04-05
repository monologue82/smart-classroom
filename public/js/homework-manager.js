// 作业管理器 - 处理作业的自动清理和历史记录功能
const fs = require('fs');
const path = require('path');

class HomeworkManager {
    constructor(db) {
        this.db = db;
        this.dataDir = path.join(__dirname, 'data');
        this.homeworkFile = path.join(this.dataDir, 'homework.json');
        this.historyDir = path.join(this.dataDir, 'homework_history');
        
        // 确保历史记录目录存在
        if (!fs.existsSync(this.historyDir)) {
            fs.mkdirSync(this.historyDir, { recursive: true });
        }
        
        // 启动定时任务
        this.startCleanupTask();
    }
    
    // 获取当前作业数据
    getCurrentHomework() {
        if (fs.existsSync(this.homeworkFile)) {
            const data = fs.readFileSync(this.homeworkFile, 'utf8');
            return JSON.parse(data);
        }
        return [];
    }
    
    // 保存当前作业数据
    saveCurrentHomework(homework) {
        fs.writeFileSync(this.homeworkFile, JSON.stringify(homework, null, 2), 'utf8');
    }
    
    // 保存历史记录
    saveHistory(homework, date) {
        const historyFile = path.join(this.historyDir, `homework_${date}.json`);
        const historyData = {
            date: date,
            savedAt: new Date().toISOString(),
            homework: homework
        };
        fs.writeFileSync(historyFile, JSON.stringify(historyData, null, 2), 'utf8');
    }
    
    // 获取历史记录列表
    getHistoryList() {
        if (!fs.existsSync(this.historyDir)) {
            return [];
        }
        
        const files = fs.readdirSync(this.historyDir);
        return files
            .filter(file => file.startsWith('homework_') && file.endsWith('.json'))
            .map(file => {
                const date = file.replace('homework_', '').replace('.json', '');
                const filePath = path.join(this.historyDir, file);
                const stats = fs.statSync(filePath);
                return {
                    date: date,
                    file: file,
                    createdAt: stats.birthtime.toISOString()
                };
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    // 获取指定日期的历史记录
    getHistoryByDate(date) {
        const historyFile = path.join(this.historyDir, `homework_${date}.json`);
        if (fs.existsSync(historyFile)) {
            const data = fs.readFileSync(historyFile, 'utf8');
            return JSON.parse(data);
        }
        return null;
    }
    
    // 清理昨天的作业并保存到历史记录
    cleanupYesterdayHomework() {
        try {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            // 获取当前作业
            const currentHomework = this.getCurrentHomework();
            
            // 如果有作业数据，则保存到历史记录
            if (currentHomework.length > 0) {
                this.saveHistory(currentHomework, yesterdayStr);
                console.log(`[作业管理] 已保存 ${yesterdayStr} 的作业到历史记录`);
            }
            
            // 清空当前作业
            this.saveCurrentHomework([]);
            console.log(`[作业管理] 已清空 ${yesterdayStr} 的作业数据`);
            
            return true;
        } catch (error) {
            console.error('[作业管理] 清理作业时发生错误:', error);
            return false;
        }
    }
    
    // 启动定时任务（每天凌晨1点执行）
    startCleanupTask() {
        // 立即执行一次检查
        this.scheduleNextCleanup();
        
        // 设置定时器
        setInterval(() => {
            this.scheduleNextCleanup();
        }, 60000); // 每分钟检查一次
    }
    
    // 安排下一次清理任务
    scheduleNextCleanup() {
        const now = new Date();
        const nextRun = new Date(now);
        nextRun.setHours(1, 0, 0, 0); // 设置为今天的凌晨1点
        
        // 如果今天已经过了凌晨1点，则设置为明天的凌晨1点
        if (now > nextRun) {
            nextRun.setDate(nextRun.getDate() + 1);
        }
        
        const timeUntilNextRun = nextRun.getTime() - now.getTime();
        
        // 清除之前的定时器
        if (this.cleanupTimer) {
            clearTimeout(this.cleanupTimer);
        }
        
        // 设置新的定时器
        this.cleanupTimer = setTimeout(() => {
            this.cleanupYesterdayHomework();
            // 安排下一次执行
            this.scheduleNextCleanup();
        }, timeUntilNextRun);
        
        console.log(`[作业管理] 下次清理任务安排在: ${nextRun.toLocaleString()}`);
    }
}

module.exports = { HomeworkManager };