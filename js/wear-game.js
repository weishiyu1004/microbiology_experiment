// wear.js - 合并后的纯前端版本
let wearSteps = [];
let currentStep = 1;
let score = 0;
let selectedOption = null;
let answered = false;
let userAnswers = [];
let totalSteps = 0;
let startTime = Date.now();
let timerInterval = null;
let retryCount = 0;
const MAX_RETRIES = 2;

// DOM元素
const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const imageContainer = document.getElementById('image-container');
const currentStepElement = document.getElementById('current-step');
const totalStepsElement = document.getElementById('total-steps');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const homeBtn = document.getElementById('home-btn');
const restartBtn = document.getElementById('restart-btn');
const progressStepsContainer = document.querySelector('.progress-steps');
const completionMessage = document.getElementById('completion-message');
const stepTips = document.getElementById('step-tips');

// 穿防护服步骤数据（原来wear.js中的数据）
const wearStepsData = [
    {
        step: 1,
        title: "第一步",
        question: "在我们穿脱防护服时，第一步应该干什么",
        options: [
            { id: 1, text: "手卫生", correct: false },
            { id: 2, text: "戴帽子", correct: false },
            { id: 3, text: "用品准备：一次性医用帽子、医用防护口罩、防护服、护目镜、鞋套、靴套、手套、手消毒剂", correct: true },
            { id: 4, text: "穿防护服", correct: false }
        ],
        feedbackCorrect: "正确！第一步：用品准备：一次性医用帽子、医用防护口罩、防护服、护目镜、鞋套、靴套、手套和手消毒剂。",
        feedbackIncorrect: "错误。完整的防护装备包括：一次性医用帽子、医用防护口罩、防护服、护目镜、鞋套、靴套、手套和手消毒剂。",
        image: "/microbiology_experiment/images/wear/1.png",
        imageCaption: "全套防护装备准备",
        tips: ["准备一次性医用帽子、医用防护口罩", "准备防护服、护目镜", "准备鞋套、靴套、手套", "准备手消毒剂"]
    },
    {
        step: 2,
        title: "第二步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "戴医用防护口罩", correct: false },
            { id: 2, text: "手卫生", correct: true },
            { id: 3, text: "穿防护服", correct: false },
            { id: 4, text: "戴帽子", correct: false }
        ],
        feedbackCorrect: "正确！第二步是手卫生",
        feedbackIncorrect: "错误。第二步是手卫生。",
        image: "/microbiology_experiment/images/wear/2.png",
        imageCaption: "使用手消毒剂进行手卫生",
        tips: ["取适量手消毒剂", "掌心对掌心揉搓", "手指交叉揉搓", "确保手部所有表面都消毒"]
    },
    {
        step: 3,
        title: "第三步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "戴护目镜", correct: false },
            { id: 2, text: "戴帽子", correct: false },
            { id: 3, text: "戴医用防护口罩", correct: true },
            { id: 4, text: "手卫生", correct: false }
        ],
        feedbackCorrect: "正确！第三步戴医用防护口罩。",
        feedbackIncorrect: "错误。第三步戴医用防护口罩。",
        image: "/microbiology_experiment/images/wear/3.png",
        imageCaption: "正确佩戴医用防护口罩",
        tips: ["检查口罩有效期和包装", "金属条在上方，按压贴合鼻梁", "拉开褶皱完全覆盖口鼻和下巴", "调整系带松紧度"]
    },
    {
        step: 4,
        title: "第四步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "穿防护服", correct: false },
            { id: 2, text: "戴帽子", correct: true },
            { id: 3, text: "戴医用防护口罩", correct: false },
            { id: 4, text: "手卫生", correct: false }
        ],
        feedbackCorrect: "正确！第四步戴帽子。",
        feedbackIncorrect: "错误。第四步为戴帽子。",
        image: "/microbiology_experiment/images/wear/4.png",
        imageCaption: "帽子完全遮盖头发和耳朵",
        tips: ["确保所有头发都放入帽内", "帽子边缘应遮盖耳朵", "前额不应外露", "帽子应紧贴头部"]
    },
    {
        step: 5,
        title: "第五步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "戴帽子", correct: false },
            { id: 2, text: "手消", correct: false },
            { id: 3, text: "戴内层手套", correct: true },
            { id: 4, text: "带医用防护口罩", correct: false }
        ],
        feedbackCorrect: "正确！第五步为带内层手套。",
        feedbackIncorrect: "错误。第五步应为带内层手套。",
        image: "/microbiology_experiment/images/wear/5.png",
        imageCaption: "佩戴内层手套",
        tips: ["检查手套有无破损", "确保手套尺寸合适", "手套应覆盖防护服袖口", "注意不要污染手套外表面"]
    },
    {
        step: 6,
        title: "第六步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "先穿上衣再穿裤子", correct: false },
            { id: 2, text: "穿防护服", correct: true },
            { id: 3, text: "戴医用防护口罩", correct: false },
            { id: 4, text: "穿内层鞋套、穿靴套", correct: false }
        ],
        feedbackCorrect: "正确！第六步为穿防护服。",
        feedbackIncorrect: "错误。第六步应为穿防护服",
        image: "/microbiology_experiment/images/wear/6.png",
        imageCaption: "正确穿戴防护服",
        tips: ["先穿裤子后穿上衣", "拉链拉到顶部", "用胶带密封拉链", "检查防护服是否完好"]
    },
    {
        step: 7,
        title: "第七步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "戴护目镜", correct: true },
            { id: 2, text: "手卫生", correct: false },
            { id: 3, text: "戴内层手套", correct: false },
            { id: 4, text: "戴帽子", correct: false }
        ],
        feedbackCorrect: "正确！第七步为戴护目镜。",
        feedbackIncorrect: "错误。第七步应为戴护目镜。",
        image: "/microbiology_experiment/images/wear/7.png",
        imageCaption: "正确佩戴护目镜",
        tips: ["护目镜戴在帽子外面", "调整头带松紧度", "确保视野清晰", "检查是否完全密封"]
    },
    {
        step: 8,
        title: "第八步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "戴护目镜", correct: false },
            { id: 2, text: "戴外层手套", correct: true },
            { id: 3, text: "戴帽子", correct: false },
            { id: 4, text: "戴医用防护口罩", correct: false }
        ],
        feedbackCorrect: "正确！第八步为带外层手套。",
        feedbackIncorrect: "错误。第八步应为戴外层手套。",
        image: "/microbiology_experiment/images/wear/8.png",
        imageCaption: "外层手套覆盖防护服袖口",
        tips: ["手套覆盖防护服袖口", "检查手套有无破损", "确保手套与防护服无缝隙", "注意双层手套的密封性"]
    },
    {
        step: 9,
        title: "第九步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "戴外层手套", correct: false },
            { id: 2, text: "戴护目镜", correct: false },
            { id: 3, text: "穿内层鞋套、穿靴套", correct: true },
            { id: 4, text: "手卫生", correct: false }
        ],
        feedbackCorrect: "正确！第九步为穿内层鞋套、穿靴套。",
        feedbackIncorrect: "错误。第九步应为穿内层鞋套、穿靴套。",
        image: "/microbiology_experiment/images/wear/9.png",
        imageCaption: "正确穿戴鞋套和靴套",
        tips: ["先穿内层鞋套", "再穿靴套覆盖鞋套", "确保完全遮盖鞋子", "检查是否牢固"]
    },
    {
        step: 10,
        title: "第十步",
        question: "穿戴完成后，最后一步应该做什么？",
        options: [
            { id: 1, text: "立即开始工作", correct: false },
            { id: 2, text: "再次进行手卫生", correct: true },
            { id: 3, text: "坐下休息", correct: false },
            { id: 4, text: "记录穿戴时间", correct: false }
        ],
        feedbackCorrect: "正确！穿戴完成后应再次进行手卫生。",
        feedbackIncorrect: "错误。穿戴完成后应再次进行手卫生，确保防护到位。",
        image: "/microbiology_experiment/images/wear/10.png",
        imageCaption: "穿戴完成后进行手卫生",
        tips: ["进行最后的手卫生检查", "请同事检查穿戴是否规范", "确保所有防护装备穿戴正确", "准备进入工作区域"]
    }
];

// 加载步骤数据
function loadSteps() {
    try {
        console.log('正在加载穿防护服数据...');
        
        // 显示加载状态
        optionsContainer.innerHTML = '<div class="loading">加载中...</div>';
        questionText.textContent = '正在加载学习内容...';
        
        // 使用本地数据
        wearSteps = wearStepsData;
        console.log('成功加载数据，步骤数:', wearSteps.length);
        
        if (!Array.isArray(wearSteps) || wearSteps.length === 0) {
            throw new Error('数据格式不正确或为空');
        }
        
        totalSteps = wearSteps.length;
        totalStepsElement.textContent = totalSteps;
        
        // 初始化用户答案数组
        userAnswers = new Array(totalSteps).fill(null);
        
        // 从本地存储加载进度
        loadFromLocalStorage();
        
        // 加载当前步骤
        loadStep(currentStep);
        updateProgressSteps();
        
        // 启动计时器
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        
        // 清除加载状态
        setTimeout(() => {
            questionText.textContent = '';
        }, 500);
        
    } catch (error) {
        console.error('加载步骤数据失败:', error);
        
        alert('加载数据失败：' + error.message);
        // 显示默认问题
        questionText.textContent = '数据加载失败，请刷新页面重试。';
    }
}

// 从本地存储加载数据
function loadFromLocalStorage() {
    const savedProgress = localStorage.getItem('wearProgress');
    const savedScore = localStorage.getItem('wearScore');
    const savedAnswers = localStorage.getItem('wearAnswers');
    
    if (savedProgress) {
        currentStep = parseInt(savedProgress);
        if (currentStep > totalSteps) currentStep = totalSteps;
    }
    
    if (savedScore) {
        score = parseInt(savedScore);
        scoreElement.textContent = score;
    }
    
    if (savedAnswers) {
        userAnswers = JSON.parse(savedAnswers);
        // 确保数组长度匹配
        if (userAnswers.length !== totalSteps) {
            userAnswers = new Array(totalSteps).fill(null);
        }
    }
}

// 更新计时器
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    timerElement.textContent = `${minutes}:${seconds}`;
}

// 加载指定步骤
function loadStep(stepNumber) {
    if (!wearSteps || wearSteps.length === 0) return;
    
    // 重置重试次数
    retryCount = 0;
    
    const step = wearSteps[stepNumber - 1];
    currentStep = stepNumber;
    currentStepElement.textContent = stepNumber;
    
    // 更新问题
    questionTitle.textContent = `步骤${stepNumber}: ${step.title}`;
    questionText.textContent = step.question;
    
    // 更新步骤要点
    if (stepTips && step.tips) {
        stepTips.innerHTML = step.tips.map(tip => `<li>${tip}</li>`).join('');
    }
    
    // 清除之前的选项
    optionsContainer.innerHTML = '';
    
    // 添加新选项
    step.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.text;
        optionElement.dataset.id = option.id;
        optionElement.dataset.correct = option.correct;
        optionElement.dataset.option = String.fromCharCode(65 + index); // A, B, C, D
        
        // 如果之前已回答正确，显示答案状态
        if (userAnswers[stepNumber - 1] !== null) {
            const selectedId = userAnswers[stepNumber - 1];
            const stepData = wearSteps[stepNumber - 1];
            const selectedOptionData = stepData.options.find(o => o.id === selectedId);
            
            if (selectedOptionData && selectedOptionData.correct) {
                // 之前回答正确的
                if (selectedId === option.id) {
                    optionElement.classList.add('selected');
                    optionElement.classList.add('correct');
                } else if (option.correct) {
                    optionElement.classList.add('correct');
                }
                optionElement.classList.add('disabled');
            } else {
                // 之前回答错误的，显示错误状态但允许重新选择
                if (selectedId === option.id) {
                    optionElement.classList.add('selected');
                    optionElement.classList.add('incorrect');
                }
                // 不显示正确答案，允许重新选择
            }
        }
        
        optionElement.addEventListener('click', () => selectOption(optionElement));
        optionsContainer.appendChild(optionElement);
    });
    
    // 重置反馈和图片
    feedback.className = 'feedback';
    feedback.style.display = 'none';
    feedback.innerHTML = '';
    imageContainer.style.display = 'none';
    imageContainer.innerHTML = '';
    
    // 如果之前已回答正确，显示反馈和图片
    if (userAnswers[stepNumber - 1] !== null) {
        const selectedId = userAnswers[stepNumber - 1];
        const stepData = wearSteps[stepNumber - 1];
        const selectedOption = stepData.options.find(o => o.id === selectedId);
        
        if (selectedOption && selectedOption.correct) {
            const isCorrect = true;
            
            feedback.className = 'feedback correct';
            feedback.textContent = step.feedbackCorrect;
            feedback.style.display = 'block';
            
            if (isCorrect && step.image) {
                imageContainer.innerHTML = `
                    <img src="${step.image}" alt="${step.imageCaption || '步骤图片'}" class="step-image">
                    <p class="image-caption">${step.imageCaption || ''}</p>
                `;
                imageContainer.style.display = 'block';
            }
            
            nextBtn.disabled = false;
            answered = true;
        } else {
            // 之前回答错误的，不显示反馈，允许重新作答
            prevBtn.disabled = stepNumber === 1;
            nextBtn.disabled = true;
            answered = false;
            selectedOption = null;
        }
    } else {
        // 更新按钮状态
        prevBtn.disabled = stepNumber === 1;
        nextBtn.disabled = true;
        answered = false;
        selectedOption = null;
    }
    
    // 更新进度指示器
    updateProgressSteps();
    
    // 如果是最后一步且已答完，显示完成消息
    if (stepNumber === totalSteps && userAnswers[stepNumber - 1] !== null) {
        const selectedId = userAnswers[stepNumber - 1];
        const stepData = wearSteps[stepNumber - 1];
        const selectedOptionData = stepData.options.find(o => o.id === selectedId);
        
        if (selectedOptionData && selectedOptionData.correct) {
            setTimeout(showCompletionMessage, 500);
        }
    }
}

// 选择选项
function selectOption(optionElement) {
    if (answered && optionElement.classList.contains('disabled')) return;
    
    // 移除之前的选择
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // 标记当前选择
    optionElement.classList.add('selected');
    selectedOption = optionElement;
    
    const optionId = parseInt(optionElement.dataset.id);
    const step = wearSteps[currentStep - 1];
    const option = step.options.find(o => o.id === optionId);
    const isCorrect = option ? option.correct : false;
    
    if (isCorrect) {
        // 清除可能存在的重新作答按钮
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.remove();
        
        // 保存用户答案
        userAnswers[currentStep - 1] = optionId;
        localStorage.setItem('wearAnswers', JSON.stringify(userAnswers));
        
        // 显示反馈
        feedback.className = 'feedback correct';
        feedback.textContent = step.feedbackCorrect;
        feedback.style.display = 'block';
        
        // 显示图片
        if (step.image) {
            imageContainer.innerHTML = `
                <img src="${step.image}" alt="${step.imageCaption || '步骤图片'}" class="step-image">
                <p class="image-caption">${step.imageCaption || ''}</p>
            `;
            imageContainer.style.display = 'block';
        }
        
        // 显示正确答案
        document.querySelectorAll('.option').forEach(opt => {
            if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
            }
        });
        
        // 更新得分
        score += 10;
        scoreElement.textContent = score;
        scoreElement.classList.add('score-increase');
        setTimeout(() => {
            scoreElement.classList.remove('score-increase');
        }, 500);
        
        localStorage.setItem('wearScore', score);
        localStorage.setItem('wearProgress', currentStep);
        
        // 禁用所有选项，防止重复得分
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.add('disabled');
        });
        
        // 标记进度步骤为完成
        const progressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        if (progressStep) progressStep.classList.add('completed');
        
        // 启用下一步按钮
        nextBtn.disabled = false;
        answered = true;
        
        // 如果是最后一步且回答正确，显示完成消息
        if (currentStep === totalSteps) {
            setTimeout(showCompletionMessage, 500);
        }
    } else {
        // 答错逻辑
        retryCount++;
        
        // 显示反馈
        feedback.className = 'feedback incorrect';
        
        if (retryCount >= MAX_RETRIES) {
            // 达到最大重试次数，显示正确答案
            document.querySelectorAll('.option').forEach(opt => {
                if (opt.dataset.correct === 'true') {
                    opt.classList.add('correct');
                }
            });
            
            feedback.textContent = `${step.feedbackIncorrect}\n\n您已尝试 ${MAX_RETRIES} 次，正确答案已显示。`;
            
            // 禁用所有选项
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.add('disabled');
            });
            
            // 保存错误答案（标记为需要重新学习）
            userAnswers[currentStep - 1] = optionId;
            localStorage.setItem('wearAnswers', JSON.stringify(userAnswers));
            
            // 启用下一步按钮
            nextBtn.disabled = false;
            answered = true;
        } else {
            // 还可以重试，不显示正确答案
            feedback.textContent = `${step.feedbackIncorrect}\n\n请重新选择正确答案 (剩余尝试次数: ${MAX_RETRIES - retryCount})`;
            
            // 添加重新作答按钮
            addRetryButton();
            
            // 标记错误选项
            optionElement.classList.add('incorrect');
            
            // 保存临时答案（不保存到本地存储）
            userAnswers[currentStep - 1] = optionId;
        }
        
        feedback.style.display = 'block';
    }
}

// 添加重新作答按钮
function addRetryButton() {
    // 检查是否已存在重新作答按钮
    if (document.getElementById('retry-btn')) return;
    
    // 创建重新作答按钮
    const retryBtn = document.createElement('button');
    retryBtn.id = 'retry-btn';
    retryBtn.className = 'nav-btn retry-btn';
    retryBtn.innerHTML = '<i class="fas fa-redo"></i> 重新作答';
    retryBtn.style.marginTop = '15px';
    retryBtn.style.marginRight = '10px';
    
    // 添加到反馈区域
    feedback.appendChild(retryBtn);
    
    // 添加点击事件
    retryBtn.addEventListener('click', retryQuestion);
}

// 重新作答函数
function retryQuestion() {
    // 移除重新作答按钮
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) retryBtn.remove();
    
    // 清除反馈
    feedback.className = 'feedback';
    feedback.style.display = 'none';
    feedback.innerHTML = '';
    
    // 隐藏图片
    imageContainer.style.display = 'none';
    imageContainer.innerHTML = '';
    
    // 重置选项状态（完全重置，不显示任何答案）
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
        opt.classList.remove('correct');
        opt.classList.remove('incorrect');
        opt.classList.remove('disabled');
    });
    
    // 重置游戏状态
    selectedOption = null;
    answered = false;
    nextBtn.disabled = true;
    
    // 清除当前步骤的答案（允许重新选择）
    userAnswers[currentStep - 1] = null;
}

// 更新进度步骤显示
function updateProgressSteps() {
    if (!wearSteps || wearSteps.length === 0) return;
    
    progressStepsContainer.innerHTML = '';
    
    wearSteps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.className = 'progress-step';
        if (step.step === currentStep) stepElement.classList.add('active');
        
        // 检查这一步是否已回答正确
        if (userAnswers[step.step - 1] !== null) {
            // 检查是否正确（通过检查option的correct属性）
            const stepData = wearSteps[step.step - 1];
            const selectedId = userAnswers[step.step - 1];
            const selectedOption = stepData.options.find(o => o.id === selectedId);
            if (selectedOption && selectedOption.correct) {
                stepElement.classList.add('completed');
            }
        }
        
        stepElement.dataset.step = step.step;
        
        stepElement.innerHTML = `
            <div class="step-number">${step.step}</div>
            <div class="step-name">${step.title}</div>
        `;
        
        // 添加点击事件，允许跳转到任意步骤
        stepElement.addEventListener('click', () => {
            // 允许跳转到已回答正确或当前步骤及之前的步骤
            const stepData = wearSteps[step.step - 1];
            const selectedId = userAnswers[step.step - 1];
            const selectedOption = stepData.options.find(o => o.id === selectedId);
            
            if (step.step <= currentStep || (selectedOption && selectedOption.correct)) {
                loadStep(step.step);
            }
        });
        
        progressStepsContainer.appendChild(stepElement);
    });
}

// 显示完成消息
function showCompletionMessage() {
    // 停止计时器
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    completionMessage.style.display = 'block';
    completionMessage.innerHTML = `
        <h3><i class="fas fa-trophy"></i> 恭喜完成！</h3>
        <p>您已成功完成穿防护服的所有学习步骤。</p>
        <p>最终得分: <strong>${score}</strong>/100</p>
        <p>用时: <strong>${minutes}分${seconds}秒</strong></p>
        <p>您已掌握穿防护服的关键步骤和要点。</p>
        <button id="review-btn" class="nav-btn" style="margin-top: 15px; margin-right: 10px;">
            <i class="fas fa-redo"></i> 重新学习
        </button>
        <button id="home-btn-2" class="nav-btn home-btn" style="margin-top: 15px;">
            <i class="fas fa-home"></i> 返回首页
        </button>
    `;
    
    // 添加重新学习按钮事件
    document.getElementById('review-btn').addEventListener('click', () => {
        restartGame();
    });
    
    // 添加返回首页按钮事件
    document.getElementById('home-btn-2').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // 保存完成状态
    localStorage.setItem('wearCompleted', 'true');
    localStorage.setItem('wearProgress', totalSteps);
}

// 重新开始游戏
function restartGame() {
    // 重置游戏状态
    currentStep = 1;
    score = 0;
    userAnswers = new Array(totalSteps).fill(null);
    startTime = Date.now();
    retryCount = 0;
    
    // 清除本地存储
    localStorage.removeItem('wearProgress');
    localStorage.removeItem('wearScore');
    localStorage.removeItem('wearAnswers');
    
    // 重置界面
    scoreElement.textContent = '0';
    completionMessage.style.display = 'none';
    
    // 重启计时器
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // 重新加载第一步
    loadStep(1);
}

// 事件监听器
prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        loadStep(currentStep - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
        loadStep(currentStep + 1);
    } else {
        // 如果是最后一步且已回答正确，显示完成消息
        if (userAnswers[currentStep - 1] !== null) {
            const selectedId = userAnswers[currentStep - 1];
            const stepData = wearSteps[currentStep - 1];
            const selectedOption = stepData.options.find(o => o.id === selectedId);
            
            if (selectedOption && selectedOption.correct) {
                showCompletionMessage();
            }
        }
    }
});

homeBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

if (restartBtn) {
    restartBtn.addEventListener('click', restartGame);
}

// 添加键盘支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        prevBtn.click();
    } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        nextBtn.click();
    } else if (e.key >= '1' && e.key <= '4' && !answered) {
        // 数字键1-4选择选项
        const options = document.querySelectorAll('.option:not(.disabled)');
        const index = parseInt(e.key) - 1;
        if (index < options.length) {
            options[index].click();
        }
    } else if (e.key === 'r' || e.key === 'R') {
        // R键重新作答
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.click();
    } else if (e.key === 'h' || e.key === 'H') {
        // H键返回首页
        homeBtn.click();
    }
});

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，开始初始化穿防护服模块...');
    loadSteps();
});