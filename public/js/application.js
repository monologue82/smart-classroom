// 申请管理模块
const fs = require('fs');
const path = require('path');

class ApplicationManager {
    constructor(dataDir) {
        this.dataDir = dataDir;
        this.applicationsFile = path.join(this.dataDir, 'applications.json');
        this.ensureApplicationsFile();
    }

    // 确保申请文件存在
    ensureApplicationsFile() {
        if (!fs.existsSync(this.applicationsFile)) {
            fs.writeFileSync(this.applicationsFile, JSON.stringify([], null, 2), 'utf8');
        }
    }

    // 创建新申请
    createApplication(userData) {
        const application = {
            id: this.generateApplicationId(),
            username: userData.username,
            password: userData.password,
            appliedAt: new Date().toISOString(),
            status: 'pending',
            reviewed: false,
            reviewedAt: null,
            reviewedBy: null
        };

        const applications = this.getAllApplications();
        applications.push(application);
        fs.writeFileSync(this.applicationsFile, JSON.stringify(applications, null, 2), 'utf8');
        
        console.log(`[申请管理] 新申请已创建: ${userData.username} (${application.id})`);
        return application;
    }

    // 获取所有申请
    getAllApplications() {
        if (fs.existsSync(this.applicationsFile)) {
            const data = fs.readFileSync(this.applicationsFile, 'utf8');
            return JSON.parse(data);
        }
        return [];
    }

    // 根据ID获取申请
    getApplicationById(id) {
        const applications = this.getAllApplications();
        return applications.find(app => app.id === id);
    }

    // 根据用户名获取申请
    getApplicationsByUsername(username) {
        const applications = this.getAllApplications();
        return applications.filter(app => app.username === username);
    }

    // 更新申请状态
    updateApplicationStatus(id, status, reviewer = null) {
        const applications = this.getAllApplications();
        const index = applications.findIndex(app => app.id === id);
        
        if (index !== -1) {
            applications[index].status = status;
            applications[index].reviewed = true;
            applications[index].reviewedAt = new Date().toISOString();
            if (reviewer) {
                applications[index].reviewedBy = reviewer;
            }
            
            fs.writeFileSync(this.applicationsFile, JSON.stringify(applications, null, 2), 'utf8');
            
            console.log(`[申请管理] 申请状态已更新: ${id} -> ${status}`);
            return applications[index];
        }
        
        return null;
    }

    // 删除申请
    deleteApplication(id) {
        let applications = this.getAllApplications();
        const application = applications.find(app => app.id === id);
        
        if (application) {
            applications = applications.filter(app => app.id !== id);
            fs.writeFileSync(this.applicationsFile, JSON.stringify(applications, null, 2), 'utf8');
            
            console.log(`[申请管理] 申请已删除: ${id}`);
            return true;
        }
        
        return false;
    }

    // 获取待审核申请
    getPendingApplications() {
        const applications = this.getAllApplications();
        return applications.filter(app => app.status === 'pending' && !app.reviewed);
    }

    // 生成申请ID
    generateApplicationId() {
        return 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 清空所有申请
    clearAllApplications() {
        fs.writeFileSync(this.applicationsFile, JSON.stringify([], null, 2), 'utf8');
        console.log('[申请管理] 所有申请已清空');
    }
}

module.exports = { ApplicationManager };