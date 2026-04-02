// 主页面逻辑 - 处理6个模块的点击和进度加载

function startGame(moduleType) {
    // 保存当前选择的模块类型到本地存储
    localStorage.setItem('currentModule', moduleType);
    
    // 跳转到对应的游戏页面
    switch(moduleType) {
        case 'wear':
            window.location.href = 'wear-game.html';
            break;
        case 'remove':
            window.location.href = 'remove-game.html';
            break;
        case 'autoclave':
            window.location.href = 'autoclave-game.html';
            break;
        case 'chorio':
            window.location.href = 'chorio-game.html';
            break;
        case 'pcr':
            window.location.href = 'pcr-game.html';
            break;
        case 'cell':
            window.location.href = 'cell-game.html';
            break;
        default:
            console.error('未知模块类型:', moduleType);
    }
}

// 更新单个模块的进度显示
function updateModuleProgress(moduleId, storageKey, totalSteps) {
    const progress = localStorage.getItem(storageKey) || 0;
    const percent = (progress / totalSteps) * 100;
    const moduleCard = document.getElementById(moduleId);
    if (moduleCard) {
        const progressBar = moduleCard.querySelector('.progress-bar');
        const progressText = moduleCard.querySelector('.progress-text');
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `进度: ${progress}/${totalSteps}`;
    }
}

// 页面加载时，从本地存储加载所有模块的进度并更新进度条
document.addEventListener('DOMContentLoaded', function() {
    // 模块配置表
    const modules = [
        { id: 'wear-module', storageKey: 'wearProgress', totalSteps: 10 },
        { id: 'remove-module', storageKey: 'removeProgress', totalSteps: 10 },
        { id: 'autoclave-module', storageKey: 'autoclaveProgress', totalSteps: 6 },
        { id: 'chorio-module', storageKey: 'chorioProgress', totalSteps: 6 },
        { id: 'pcr-module', storageKey: 'pcrProgress', totalSteps: 2 },
        { id: 'cell-module', storageKey: 'cellProgress', totalSteps: 5 }
    ];
    
    // 更新所有模块进度
    modules.forEach(module => {
        updateModuleProgress(module.id, module.storageKey, module.totalSteps);
    });
    
    // 可选：显示完成状态标记（如果某个模块完全完成，可添加特殊样式）
    modules.forEach(module => {
        const progress = localStorage.getItem(module.storageKey) || 0;
        const moduleCard = document.getElementById(module.id);
        if (moduleCard && parseInt(progress) === module.totalSteps) {
            moduleCard.style.boxShadow = '0 0 0 2px #2ecc71, 0 10px 30px rgba(0,0,0,0.1)';
            // 添加完成图标
            const iconDiv = moduleCard.querySelector('.module-icon');
            if (iconDiv && !iconDiv.querySelector('.fa-check-circle')) {
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fas fa-check-circle';
                checkIcon.style.color = '#2ecc71';
                checkIcon.style.position = 'absolute';
                checkIcon.style.top = '10px';
                checkIcon.style.right = '10px';
                checkIcon.style.fontSize = '1.5rem';
                moduleCard.style.position = 'relative';
                moduleCard.appendChild(checkIcon);
            }
        }
    });
});

// 导出函数供全局使用
window.startGame = startGame;