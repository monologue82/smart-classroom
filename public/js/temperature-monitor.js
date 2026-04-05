const si = require('systeminformation');
const { exec } = require('child_process');

// 获取CPU温度的备用方法（使用Windows wmic命令）
function getCpuTemperatureWithWmic() {
    return new Promise((resolve) => {
        // 检查是否在Windows系统上
        if (process.platform !== 'win32') {
            resolve(null);
            return;
        }
        
        // 使用wmic命令获取CPU温度
        exec('wmic /namespace:\\\\root\\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature /value', (error, stdout, stderr) => {
            if (error || stderr) {
                // 如果wmic命令失败，返回null
                resolve(null);
                return;
            }
            
            // 解析输出
            const match = stdout.match(/CurrentTemperature=(\d+)/);
            if (match && match[1]) {
                // 转换温度值（WMIC返回的是开尔文温度的十分之一）
                const temp = (parseInt(match[1]) / 10) - 273.15;
                resolve(temp);
            } else {
                resolve(null);
            }
        });
    });
}

async function getAllTemperatures() {
    try {
        // 获取所有温度传感器数据
        let tempData;
        let cpuTemp = 0;
        
        try {
            tempData = await si.cpuTemperature();
            // 修复CPU温度获取逻辑
            if (tempData.main !== null && tempData.main !== undefined) {
                cpuTemp = tempData.main;
            } else if (tempData.cores && tempData.cores.length > 0) {
                // 计算核心温度的平均值
                const validCores = tempData.cores.filter(temp => temp !== null && temp !== undefined);
                if (validCores.length > 0) {
                    const sum = validCores.reduce((acc, temp) => acc + temp, 0);
                    cpuTemp = sum / validCores.length;
                }
            }
        } catch (siError) {
            console.error('使用systeminformation获取CPU温度失败:', siError.message);
        }
        
        // 如果systeminformation无法获取温度，尝试使用wmic命令
        if (cpuTemp === 0 || cpuTemp === null) {
            try {
                const wmicTemp = await getCpuTemperatureWithWmic();
                if (wmicTemp !== null) {
                    cpuTemp = wmicTemp;
                }
            } catch (wmicError) {
                console.error('使用wmic获取CPU温度失败:', wmicError.message);
            }
        }
        
        // 获取GPU温度（如果可用）
        let gpuTemp = 0;
        try {
            const graphicsData = await si.graphics();
            if (graphicsData && graphicsData.controllers && graphicsData.controllers.length > 0) {
                // 查找GPU温度信息，优先查找NVIDIA或AMD的独立显卡
                for (const controller of graphicsData.controllers) {
                    // 跳过虚拟显示器等非独立显卡
                    if (controller.temperature && 
                        controller.vendor && 
                        (controller.vendor.includes('NVIDIA') || controller.vendor.includes('AMD') || controller.vendor.includes('Intel')) &&
                        controller.vram > 0) {
                        gpuTemp = controller.temperature;
                        break;
                    }
                }
                
                // 如果没找到符合条件的GPU，尝试获取第一个有温度数据的控制器
                if (gpuTemp === 0) {
                    for (const controller of graphicsData.controllers) {
                        if (controller.temperature) {
                            gpuTemp = controller.temperature;
                            break;
                        }
                    }
                }
            }
        } catch (gpuError) {
            // GPU温度获取失败，保持默认值0
            console.error('GPU温度获取失败:', gpuError.message);
        }
        
        // 获取其他传感器温度（如果可用）
        let otherTemps = [];
        try {
            // 在某些系统上可能不支持传感器数据获取
            // 这里我们不强制获取，因为不是所有系统都支持
        } catch (sensorsError) {
            // 传感器温度获取失败
            console.error('传感器温度获取失败:', sensorsError.message);
        }
        
        return {
            cpu: cpuTemp || 0,
            gpu: gpuTemp || 0,
            others: otherTemps,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('获取温度数据失败:', error.message);
        return {
            cpu: 0,
            gpu: 0,
            others: [],
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = { getAllTemperatures };