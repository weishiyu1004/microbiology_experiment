// remove-game.js - 合并后的纯前端版本
let removeSteps = [];
let currentStep = 1;
let score = 0;
let selectedOption = null;
let answered = false;
let userAnswers = [];
let totalSteps = 0;
let startTime = Date.now();
let timerInterval = null;
let retryCount = 0;
const MAX_RETRIES = 3;

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

// 脱防护服步骤数据（原来remove.js中的数据）
const removeStepsData = [
    {
        step: 1,
        title: "第一步",
        question: "在开始脱下防护服时，第一步应该做什么？",
        options: [
            { id: 1, text: "摘护目镜", correct: false },
            { id: 2, text: "脱防护服、外层手套", correct: false },
            { id: 3, text: "手卫生", correct: true },
            { id: 4, text: "摘一次性帽子", correct: false }
        ],
        feedbackCorrect: "正确！第一步是手卫生，确保双手清洁。",
        feedbackIncorrect: "错误。第一步应该是手卫生。",
        image: "/microbiology_experiment/images/remove/1.png",
        imageCaption: "脱防护服前先消毒双手",
        tips: ["使用速干手消毒剂", "遵循七步洗手法", "确保手部所有表面都消毒", "等待消毒剂完全干燥"]
    },
    {
        step: 2,
        title: "第二步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "脱内层鞋套", correct: false },
            { id: 2, text: "脱内层手套", correct: false },
            { id: 3, text: "摘护目镜", correct: true },
            { id: 4, text: "手卫生", correct: false }
        ],
        feedbackCorrect: "正确！第二步是摘护目镜。",
        feedbackIncorrect: "错误。第二步应该是摘护目镜。",
        image: "/microbiology_experiment/images/remove/2.png",
        imageCaption: "小心摘下护目镜",
        tips: ["低头防止飞溅", "从后方解开系带", "避免触碰护目镜外表面", "放入消毒容器"]
    },
    {
        step: 3,
        title: "第三步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "摘一次性帽子", correct: false },
            { id: 2, text: "手卫生", correct: false },
            { id: 3, text: "脱防护服、外层手套", correct: true },
            { id: 4, text: "摘医用防护口罩", correct: false }
        ],
        feedbackCorrect: "正确！第三步是脱防护服和外层手套。",
        feedbackIncorrect: "错误。第三步应该是脱防护服和外层手套。",
        image: "/microbiology_experiment/images/remove/3.png",
        imageCaption: "脱下防护服和外层手套",
        tips: ["从内向外卷脱防护服", "外层手套随防护服一起脱下", "避免接触防护服外表面", "内面向外折叠"]
    },
    {
        step: 4,
        title: "第四步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "脱内层鞋套", correct: false },
            { id: 2, text: "手卫生", correct: true },
            { id: 3, text: "摘护目镜", correct: false },
            { id: 4, text: "脱防护服、外层手套", correct: false }
        ],
        feedbackCorrect: "正确！第四步是再次进行手卫生。",
        feedbackIncorrect: "错误。第四步应该是手卫生。",
        image: "/microbiology_experiment/images/remove/4.png",
        imageCaption: "脱防护服后进行手卫生",
        tips: ["脱除外层装备后必须洗手", "清除可能接触的污染物", "准备接触内层装备", "确保手部清洁"]
    },
    {
        step: 5,
        title: "第五步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "脱内层手套", correct: false },
            { id: 2, text: "摘一次性帽子", correct: false },
            { id: 3, text: "脱内层鞋套", correct: true },
            { id: 4, text: "摘医用防护口罩", correct: false }
        ],
        feedbackCorrect: "正确！第五步是脱内层鞋套。",
        feedbackIncorrect: "错误。第五步应该是脱内层鞋套。",
        image: "/microbiology_experiment/images/remove/5.png",
        imageCaption: "脱下内层鞋套",
        tips: ["从鞋跟部开始脱", "避免接触鞋套外表面", "内面向外卷脱", "放入医疗废物袋"]
    },
    {
        step: 6,
        title: "第六步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "手卫生", correct: false },
            { id: 2, text: "脱内层手套", correct: true },
            { id: 3, text: "摘护目镜", correct: false },
            { id: 4, text: "脱内层鞋套", correct: false }
        ],
        feedbackCorrect: "正确！第六步是脱内层手套。",
        feedbackIncorrect: "错误。第六步应该是脱内层手套。",
        image: "/microbiology_experiment/images/remove/6.png",
        imageCaption: "脱下内层手套",
        tips: ["捏住手套腕部外侧", "内面向外脱下", "避免接触手套外表面", "两只手套分别处理"]
    },
    {
        step: 7,
        title: "第七步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "手卫生", correct: true },
            { id: 2, text: "摘一次性帽子", correct: false },
            { id: 3, text: "摘医用防护口罩", correct: false },
            { id: 4, text: "脱防护服、外层手套", correct: false }
        ],
        feedbackCorrect: "正确！第七步是再次进行手卫生。",
        feedbackIncorrect: "错误。第七步应该是手卫生。",
        image: "/microbiology_experiment/images/remove/7.png",
        imageCaption: "脱手套后进行手卫生",
        tips: ["脱除所有手套后必须洗手", "清除可能残留的污染物", "准备接触头部装备", "彻底清洁手部"]
    },
    {
        step: 8,
        title: "第八步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "摘医用防护口罩", correct: false },
            { id: 2, text: "摘一次性帽子", correct: true },
            { id: 3, text: "手卫生", correct: false },
            { id: 4, text: "脱内层鞋套", correct: false }
        ],
        feedbackCorrect: "正确！第八步是摘一次性帽子。",
        feedbackIncorrect: "错误。第八步应该是摘一次性帽子。",
        image: "/microbiology_experiment/images/remove/8.png",
        imageCaption: "摘下一次性帽子",
        tips: ["从后向前脱下帽子", "避免接触帽子外表面", "内面向外折叠", "放入医疗废物袋"]
    },
    {
        step: 9,
        title: "第九步",
        question: "接下来应该：",
        options: [
            { id: 1, text: "摘一次性帽子", correct: false },
            { id: 2, text: "手卫生", correct: false },
            { id: 3, text: "摘医用防护口罩", correct: true },
            { id: 4, text: "摘护目镜", correct: false }
        ],
        feedbackCorrect: "正确！第九步是摘医用防护口罩。",
        feedbackIncorrect: "错误。第九步应该是摘医用防护口罩。",
        image: "/microbiology_experiment/images/remove/9.png",
        imageCaption: "摘下医用防护口罩",
        tips: ["只接触口罩带子", "从耳后取下带子", "避免接触口罩外表面", "立即丢弃"]
    },
    {
        step: 10,
        title: "第十步",
        question: "脱下所有防护装备后，最后一步应该做什么？",
        options: [
            { id: 1, text: "立即离开", correct: false },
            { id: 2, text: "手卫生", correct: true },
            { id: 3, text: "坐下休息", correct: false },
            { id: 4, text: "记录脱卸时间", correct: false }
        ],
        feedbackCorrect: "正确！第十步是最后的手卫生，完成所有脱卸步骤。",
        feedbackIncorrect: "错误。第十步应该是手卫生。",
        image: "/microbiology_experiment/images/remove/10.png",
        imageCaption: "完成所有脱卸后彻底洗手",
        tips: ["使用流动水和肥皂", "洗手时间不少于40秒", "遵循七步洗手法", "用纸巾擦干手"]
    }
];

// 加载步骤数据
function loadSteps() {
    try {
        console.log('正在加载脱防护服数据...');
        
        // 显示加载状态
        optionsContainer.innerHTML = '<div class="loading">加载中...</div>';
        questionText.textContent = '正在加载学习内容...';
        
        // 使用本地数据
        removeSteps = removeStepsData;
        console.log('成功加载数据，步骤数:', removeSteps.length);
        
        if (!Array.isArray(removeSteps) || removeSteps.length === 0) {
            throw new Error('数据格式不正确或为空');
        }
        
        totalSteps = removeSteps.length;
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
    const savedProgress = localStorage.getItem('removeProgress');
    const savedScore = localStorage.getItem('removeScore');
    const savedAnswers = localStorage.getItem('removeAnswers');
    
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
    if (!removeSteps || removeSteps.length === 0) return;
    
    // 重置重试次数
    retryCount = 0;
    
    const step = removeSteps[stepNumber - 1];
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
            const stepData = removeSteps[stepNumber - 1];
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
        const stepData = removeSteps[stepNumber - 1];
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
        const stepData = removeSteps[stepNumber - 1];
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
    const step = removeSteps[currentStep - 1];
    const option = step.options.find(o => o.id === optionId);
    const isCorrect = option ? option.correct : false;
    
    if (isCorrect) {
        // 清除可能存在的重新作答按钮
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.remove();
        
        // 保存用户答案
        userAnswers[currentStep - 1] = optionId;
        localStorage.setItem('removeAnswers', JSON.stringify(userAnswers));
        
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
        
        localStorage.setItem('removeScore', score);
        localStorage.setItem('removeProgress', currentStep);
        
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
    
    feedback.className = 'feedback incorrect';
    
    if (retryCount >= MAX_RETRIES) {
        // 第3次仍答错，显示正确答案
        document.querySelectorAll('.option').forEach(opt => {
            if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
            }
            opt.classList.add('disabled');
        });
        
        feedback.textContent = `${step.feedbackIncorrect}\n\n您已尝试 ${MAX_RETRIES} 次，正确答案已显示。`;
        
        userAnswers[currentStep - 1] = optionId;
        localStorage.setItem('wearAnswers', JSON.stringify(userAnswers));
        
        nextBtn.disabled = false;
        answered = true;
    } else {
        // 前2次答错：只提示错误，不显示答案
        const remainingTries = MAX_RETRIES - retryCount;
        feedback.textContent = `❌ 回答错误！请重新选择正确答案。 (剩余尝试次数: ${remainingTries})`;
        
        addRetryButton();
        optionElement.classList.add('incorrect');
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
    if (!removeSteps || removeSteps.length === 0) return;
    
    progressStepsContainer.innerHTML = '';
    
    removeSteps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.className = 'progress-step';
        if (step.step === currentStep) stepElement.classList.add('active');
        
        // 检查这一步是否已回答正确
        if (userAnswers[step.step - 1] !== null) {
            // 检查是否正确（通过检查option的correct属性）
            const stepData = removeSteps[step.step - 1];
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
            const stepData = removeSteps[step.step - 1];
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
        <p>您已成功完成脱防护服的所有学习步骤。</p>
         <!-- 添加流程图 -->
    <div style="margin: 15px 0; text-align: center;">
        <img src="/microbiology_experiment/images/wear/remove.png" alt="脱防护服流程图" style="max-width: 100%; border-radius: 10px;">
    </div>
        <p>最终得分: <strong>${score}</strong>/100</p>
        <p>用时: <strong>${minutes}分${seconds}秒</strong></p>
        <p>您已掌握脱防护服的关键步骤和要点。</p>
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
    localStorage.setItem('removeCompleted', 'true');
    localStorage.setItem('removeProgress', totalSteps);
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
    localStorage.removeItem('removeProgress');
    localStorage.removeItem('removeScore');
    localStorage.removeItem('removeAnswers');
    
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
            const stepData = removeSteps[currentStep - 1];
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
    console.log('页面加载完成，开始初始化脱防护服模块...');
    loadSteps();
});