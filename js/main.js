// 主页面逻辑 - 处理模块点击和进度加载
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
    }
}

// 页面加载时，从本地存储加载进度并更新进度条
document.addEventListener('DOMContentLoaded', function() {
    // 加载穿防护服进度
    const wearProgress = localStorage.getItem('wearProgress') || 0;
    const wearTotal = 10; // 穿防护服总步骤数
    const wearPercent = (wearProgress / wearTotal) * 100;
    document.querySelector('#wear-module .progress-bar').style.width = `${wearPercent}%`;
    document.querySelector('#wear-module .progress-text').textContent = `进度: ${wearProgress}/${wearTotal}`;
    
    // 加载脱防护服进度
    const removeProgress = localStorage.getItem('removeProgress') || 0;
    const removeTotal = 10; // 脱防护服总步骤数
    const removePercent = (removeProgress / removeTotal) * 100;
    document.querySelector('#remove-module .progress-bar').style.width = `${removePercent}%`;
    document.querySelector('#remove-module .progress-text').textContent = `进度: ${removeProgress}/${removeTotal}`;
    
    // 加载高压灭菌锅进度
    const autoclaveProgress = localStorage.getItem('autoclaveProgress') || 0;
    const autoclaveTotal = 6; // 高压灭菌锅总步骤数
    const autoclavePercent = (autoclaveProgress / autoclaveTotal) * 100;
    document.querySelector('#autoclave-module .progress-bar').style.width = `${autoclavePercent}%`;
    document.querySelector('#autoclave-module .progress-text').textContent = `进度: ${autoclaveProgress}/${autoclaveTotal}`;
});