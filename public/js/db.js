// 数据库操作模块
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class Database {
    constructor() {
        // 确保数据目录存在
        this.dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
        
        // 加密密钥（在实际应用中应该从环境变量或配置文件中读取）
        this.encryptionKey = 'smart_classroom_backup_key_201128'; // 32字节密钥
        
        this.init();
    }
    
    // 生成加密密钥
    generateEncryptionKey() {
        // 在实际应用中，应该从环境变量或配置文件中读取
        return crypto.createHash('sha256').update(this.encryptionKey).digest();
    }
    
    // 加密数据 (使用更安全的AES-256-GCM)
    encryptData(data) {
        try {
            const algorithm = 'aes-256-gcm';
            const key = this.generateEncryptionKey();
            const iv = crypto.randomBytes(16); // 每次生成随机IV
            
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const authTag = cipher.getAuthTag();
            
            // 返回IV、认证标签和加密数据
            return JSON.stringify({
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex'),
                data: encrypted
            });
        } catch (error) {
            console.error('加密数据失败:', error);
            return null;
        }
    }
    
    // 解密数据
    decryptData(encryptedData) {
        try {
            const algorithm = 'aes-256-gcm';
            const key = this.generateEncryptionKey();
            
            // 解析加密数据结构
            const encryptedObj = JSON.parse(encryptedData);
            const iv = Buffer.from(encryptedObj.iv, 'hex');
            const authTag = Buffer.from(encryptedObj.authTag, 'hex');
            const encrypted = encryptedObj.data;
            
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            decipher.setAuthTag(authTag);
            
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            console.error('解密数据失败:', error);
            return null;
        }
    }

    // 获取数据文件路径
    getDataFilePath(filename) {
        return path.join(this.dataDir, filename);
    }

    // 读取数据文件
    readDataFile(filename) {
        const filePath = this.getDataFilePath(filename);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
        return null;
    }

    // 写入数据文件
    writeDataFile(filename, data) {
        const filePath = this.getDataFilePath(filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    // 初始化数据库
    init() {
        // 检查系统是否已初始化
        const systemInitialized = this.readDataFile('system_initialized.json');
        
        if (!systemInitialized) {
            this.initializeDefaultData();
            this.writeDataFile('system_initialized.json', { initialized: true });
        }
    }

    // 初始化默认数据
    initializeDefaultData() {
        // 初始化用户数据
        const usersFile = 'users.json';
        if (!this.readDataFile(usersFile)) {
            this.writeDataFile(usersFile, [
                {
                    username: 'admin',
                    password: 'admin',
                    isAdmin: true,
                    isApproved: true,
                    appliedAt: new Date().toISOString()
                }
            ]);
        }

        // 初始化学生数据
        const studentsFile = 'students.json';
        if (!this.readDataFile(studentsFile)) {
            this.writeDataFile(studentsFile, []);
        }

        // 初始化积分操作记录
        const operationsFile = 'operations.json';
        if (!this.readDataFile(operationsFile)) {
            this.writeDataFile(operationsFile, []);
        }

        // 初始化规则数据
        const rulesFile = 'class_rules.json';
        if (!this.readDataFile(rulesFile)) {
            this.writeDataFile(rulesFile, {
                positiveRules: [],
                negativeRules: []
            });
        }
    }

    // 学生相关操作
    getStudents() {
        const students = this.readDataFile('students.json');
        return students || [];
    }

    addStudent(username) {
        const students = this.getStudents();
        const newStudent = {
            id: Date.now(),
            username: username,
            points: 0,
            lastUpdated: new Date().toISOString()
        };
        students.push(newStudent);
        this.writeDataFile('students.json', students);
        return newStudent;
    }

    deleteStudent(id) {
        let students = this.getStudents();
        students = students.filter(s => s.id !== id);
        this.writeDataFile('students.json', students);
        return students;
    }

    updateStudentPoints(id, points, reason) {
        const students = this.getStudents();
        const student = students.find(s => s.id === id);
        if (student) {
            student.points += points;
            student.lastUpdated = new Date().toISOString();
            
            // 记录操作
            this.addOperation({
                user: student.username,
                type: points > 0 ? '增加' : '扣除',
                points: points,
                reason: reason
            });
            
            this.writeDataFile('students.json', students);
            return student;
        }
        return null;
    }

    // 批量更新学生积分
    batchUpdatePoints(points, reason) {
        const students = this.getStudents();
        students.forEach(student => {
            student.points += points;
            student.lastUpdated = new Date().toISOString();
        });
        
        // 记录操作
        this.addOperation({
            user: '全部',
            type: points > 0 ? '增加' : '扣除',
            points: points * students.length,
            reason: `批量操作: ${reason}`
        });
        
        this.writeDataFile('students.json', students);
        return students;
    }

    // 积分操作记录
    getOperations() {
        const operations = this.readDataFile('operations.json');
        return operations || [];
    }

    addOperation(operation) {
        const operations = this.getOperations();
        operations.push({
            time: new Date().toLocaleString(),
            ...operation
        });
        this.writeDataFile('operations.json', operations);
        return operations;
    }

    clearOperations() {
        this.writeDataFile('operations.json', []);
        return [];
    }

    // 规则相关操作
    getRules() {
        const rules = this.readDataFile('class_rules.json');
        return rules || { positiveRules: [], negativeRules: [] };
    }

    addRule(rule, type) {
        const rules = this.getRules();
        const newRule = {
            id: Date.now().toString(),
            ...rule
        };
        
        if (type === 'positive') {
            rules.positiveRules.push(newRule);
        } else {
            rules.negativeRules.push(newRule);
        }
        
        this.writeDataFile('class_rules.json', rules);
        return newRule;
    }

    updateRule(id, rule, type) {
        const rules = this.getRules();
        const ruleList = type === 'positive' ? rules.positiveRules : rules.negativeRules;
        const index = ruleList.findIndex(r => r.id === id);
        
        if (index !== -1) {
            ruleList[index] = { id, ...rule };
            this.writeDataFile('class_rules.json', rules);
            return ruleList[index];
        }
        return null;
    }

    deleteRule(id, type) {
        const rules = this.getRules();
        const ruleList = type === 'positive' ? rules.positiveRules : rules.negativeRules;
        const index = ruleList.findIndex(r => r.id === id);
        
        if (index !== -1) {
            ruleList.splice(index, 1);
            this.writeDataFile('class_rules.json', rules);
            return true;
        }
        return false;
    }

    // 系统管理
    exportData() {
        const data = {
            students: this.getStudents(),
            operations: this.getOperations(),
            rules: this.getRules(),
            users: this.getUsers(),
            applications: this.getApplications(),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.students) this.writeDataFile('students.json', data.students);
            if (data.operations) this.writeDataFile('operations.json', data.operations);
            if (data.rules) this.writeDataFile('class_rules.json', data.rules);
            if (data.users) this.writeDataFile('users.json', data.users);
            if (data.applications) this.writeDataFile('applications.json', data.applications);
            return true;
        } catch (e) {
            console.error('导入数据失败:', e);
            return false;
        }
    }
    
    // 备份管理
    createBackup(encrypt = false) {
        try {
            // 创建备份目录
            const backupDir = path.join(this.dataDir, 'backups');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            
            // 生成备份文件名
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = encrypt ? `backup_${timestamp}.enc` : `backup_${timestamp}.json`;
            const backupFilePath = path.join(backupDir, backupFileName);
            
            // 导出所有数据
            const backupData = {
                students: this.getStudents(),
                operations: this.getOperations(),
                rules: this.getRules(),
                users: this.getUsers(),
                applications: this.getApplications(),
                backupMetadata: {
                    createdAt: new Date().toISOString(),
                    version: '4.0',
                    encrypted: encrypt
                }
            };
            
            // 准备数据
            const jsonData = JSON.stringify(backupData, null, 2);
            
            if (encrypt) {
                // 加密数据
                const encryptedData = this.encryptData(jsonData);
                if (encryptedData) {
                    // 写入加密备份文件
                    fs.writeFileSync(backupFilePath, encryptedData);
                } else {
                    throw new Error('数据加密失败');
                }
            } else {
                // 写入明文备份文件
                fs.writeFileSync(backupFilePath, jsonData);
            }
            
            return {
                success: true,
                filename: backupFileName,
                path: backupFilePath,
                size: fs.statSync(backupFilePath).size,
                encrypted: encrypt
            };
        } catch (error) {
            console.error('创建备份失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // 获取备份列表
    getBackupList() {
        try {
            const backupDir = path.join(this.dataDir, 'backups');
            if (!fs.existsSync(backupDir)) {
                return [];
            }
            
            const files = fs.readdirSync(backupDir);
            const backups = files
                .filter(file => file.endsWith('.json'))
                .map(file => {
                    const filePath = path.join(backupDir, file);
                    const stats = fs.statSync(filePath);
                    return {
                        filename: file,
                        path: filePath,
                        size: stats.size,
                        createdAt: stats.birthtime.toISOString(),
                        createdAtFormatted: stats.birthtime.toLocaleString()
                    };
                })
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            return backups;
        } catch (error) {
            console.error('获取备份列表失败:', error);
            return [];
        }
    }
    
    // 删除备份
    deleteBackup(filename) {
        try {
            const backupDir = path.join(this.dataDir, 'backups');
            const backupFilePath = path.join(backupDir, filename);
            
            if (fs.existsSync(backupFilePath)) {
                fs.unlinkSync(backupFilePath);
                return { success: true };
            } else {
                return { success: false, error: '备份文件不存在' };
            }
        } catch (error) {
            console.error('删除备份失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 解密备份文件
    decryptBackupFile(filename) {
        try {
            const backupDir = path.join(this.dataDir, 'backups');
            const backupFilePath = path.join(backupDir, filename);
            
            if (!fs.existsSync(backupFilePath)) {
                throw new Error('备份文件不存在');
            }
            
            // 读取加密文件内容
            const encryptedData = fs.readFileSync(backupFilePath, 'utf8');
            
            // 解密数据
            const decryptedData = this.decryptData(encryptedData);
            if (!decryptedData) {
                throw new Error('数据解密失败');
            }
            
            // 解析JSON数据
            const backupData = JSON.parse(decryptedData);
            
            return {
                success: true,
                data: backupData
            };
        } catch (error) {
            console.error('解密备份文件失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    resetAllPoints() {
        let students = this.getStudents();
        students.forEach(student => {
            student.points = 0;
        });
        this.writeDataFile('students.json', students);
        return students;
    }

    // 用户管理功能
    getUsers() {
        const users = this.readDataFile('users.json');
        return users || [];
    }

    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.writeDataFile('users.json', users);
        return user;
    }

    updateUser(username, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.username === username);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            this.writeDataFile('users.json', users);
            return users[index];
        }
        return null;
    }

    deleteUser(username) {
        let users = this.getUsers();
        users = users.filter(u => u.username !== username);
        this.writeDataFile('users.json', users);
        return users;
    }

    // 申请管理功能
    getApplications() {
        const applications = this.readDataFile('applications.json');
        return applications || [];
    }

    addApplication(application) {
        const applications = this.getApplications();
        applications.push(application);
        this.writeDataFile('applications.json', applications);
        return application;
    }

    updateApplication(appId, updates) {
        const applications = this.getApplications();
        const index = applications.findIndex(app => app.id === appId);
        if (index !== -1) {
            applications[index] = { ...applications[index], ...updates };
            this.writeDataFile('applications.json', applications);
            return applications[index];
        }
        return null;
    }

    deleteApplication(appId) {
        let applications = this.getApplications();
        applications = applications.filter(app => app.id !== appId);
        this.writeDataFile('applications.json', applications);
        return applications;
    }

    getPendingApplications() {
        const applications = this.getApplications();
        return applications.filter(app => !app.isApproved);
    }
}

// 导出数据库类和实例
module.exports = { Database };