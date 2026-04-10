// chorio-game.js - 鸡胚尿囊腔接种模块

let chorioSteps = [];
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

// 鸡胚尿囊腔接种步骤数据
const chorioStepsData = [
    {
        step: 1,
        title: "第一步",
        question: "在进行鸡胚尿囊腔接种时，第一步应该做什么？",
        options: [
            { id: 1, text: "消毒", correct: false },
            { id: 2, text: "鸡胚检卵", correct: true },
            { id: 3, text: "清洗蛋壳表面", correct: false },
            { id: 4, text: "将鸡蛋放入温箱预温", correct: false }
        ],
        feedbackCorrect: "正确！鸡胚检卵是为了筛选出健康活胚，标记接种位置，保证后续接种成功。",
        feedbackIncorrect: "错误。检卵主要目的是通过照蛋器观察，选择发育良好、血管清晰的活胚，标记气室和尿囊腔位置，并剔除死胚。",
        image: "/microbiology_experiment/images/chorio/1.png",
        imageCaption: "使用照蛋器进行鸡胚检卵",
        tips: [
            "在暗室中使用照蛋器观察",
            "选择血管清晰、活动良好的活胚",
            "标记气室边界和尿囊腔注射点",
            "剔除死胚、污染胚或发育不良胚"
        ]
    },
    {
        step: 2,
        title: "第二步",
        question: "检卵完成后，下一步需要做什么？",
        options: [
            { id: 1, text: "消毒", correct: false },
            { id: 2, text: "标记", correct: true },
            { id: 3, text: "锥孔", correct: false },
            { id: 4, text: "封孔", correct: false }
        ],
        feedbackCorrect: "正确！标记时用铅笔在蛋壳上准确标出接种点（气室下缘无血管区），便于后续锥孔和接种。",
        feedbackIncorrect: "错误。标记应使用铅笔在气室边缘下方、避开主要血管的区域做记号，同时标注日期和组别。",
        image: "/microbiology_experiment/images/chorio/2.png",
        imageCaption: "标记鸡胚接种位置",
        tips: [
            "用铅笔或无毒记号笔",
            "标在尿囊腔侧气室下缘",
            "避开粗大血管",
            "标记清晰，作为穿刺点参考"
        ]
    },
    {
        step: 3,
        title: "第三步",
        question: "标记完成后，需要对蛋壳表面进行什么操作？",
        options: [
            { id: 1, text: "消毒", correct: true },
            { id: 2, text: "清洗", correct: false },
            { id: 3, text: "放入紫外灯下照射", correct: false },
            { id: 4, text: "直接穿刺", correct: false }
        ],
        feedbackCorrect: "正确！消毒是防止细菌污染的关键步骤，先用75%酒精，再用碘伏，待干后接种。",
        feedbackIncorrect: "错误。接种前必须对蛋壳表面严格消毒，通常使用75%酒精和碘伏，以降低污染风险。",
        image: "/microbiology_experiment/images/chorio/3.png",
        imageCaption: "蛋壳表面消毒",
        tips: [
            "用75%酒精棉球擦拭标记区",
            "再用碘伏棉球消毒",
            "消毒范围大于穿刺点",
            "待消毒剂挥发干燥后再操作"
        ]
    },
    {
        step: 4,
        title: "第四步",
        question: "消毒之后，需要在鸡胚外壳上打一个小孔以便于注入病毒或样品，这一步是？",
        options: [
            { id: 1, text: "封孔", correct: false },
            { id: 2, text: "锥孔", correct: true },
            { id: 3, text: "清洗", correct: false },
            { id: 4, text: "接种", correct: false }
        ],
        feedbackCorrect: "正确！锥孔需轻柔，仅穿透蛋壳而不损伤壳膜，为后续注射针头进入尿囊腔做准备。",
        feedbackIncorrect: "错误。锥孔应使用无菌锥针，在标记点轻轻旋转钻透蛋壳，注意控制力度，避免刺破卵膜或血管。",
        image: "/microbiology_experiment/images/chorio/4.png",
        imageCaption: "锥孔操作",
        tips: [
            "使用灭菌锥针或小型电钻",
            "仅穿透蛋壳，保留壳膜完整",
            "孔直径约1-2mm",
            "避免损伤尿囊膜"
        ]
    },
    {
        step: 5,
        title: "第五步",
        question: "锥孔之后，第五步应怎么做？",
        options: [
            { id: 1, text: "用注射器将病毒液直接注入气室", correct: false },
            { id: 2, text: "将病毒滴在蛋壳表面", correct: false },
            { id: 3, text: "接种", correct: true },
            { id: 4, text: "直接打开蛋壳倒灌病毒液", correct: false }
        ],
        feedbackCorrect: "正确！接种时针头沿锥孔刺入尿囊腔，缓慢注入病毒液，拔出后轻压孔口防止漏液。",
        feedbackIncorrect: "错误。接种应使用1ml注射器，针头斜面向下刺入约1-1.5cm，注入0.1-0.2ml病毒液，确保进入尿囊腔。",
        image: "/microbiology_experiment/images/chorio/5.png",
        imageCaption: "尿囊腔接种",
        tips: [
            "使用无菌注射器",
            "针头斜面向下，沿锥孔刺入",
            "注入病毒液时缓慢匀速",
            "拔出后轻压蛋壳防止液体溢出"
        ]
    },
    {
        step: 6,
        title: "第六步",
        question: "接种完成后，为防止污染和液体泄漏，需要对打孔处进行封闭处理，这一步是？",
        options: [
            { id: 1, text: "石蜡封孔", correct: true },
            { id: 2, text: "放入培养箱", correct: false },
            { id: 3, text: "用酒精棉球堵住孔口", correct: false },
            { id: 4, text: "标记", correct: false }
        ],
        feedbackCorrect: "正确！封孔可防止外界微生物污染，减少水分蒸发，保证鸡胚正常发育和病毒增殖。",
        feedbackIncorrect: "错误。封孔常用熔化石蜡或无菌封口膜，确保密封良好，避免污染和漏液。",
        image: "/microbiology_experiment/images/chorio/6.png",
        imageCaption: "石蜡封孔",
        tips: [
            "使用75℃熔化的石蜡",
            "用无菌棉签或滴管封口",
            "也可用无菌胶带或医用胶布",
            "确保接种孔完全密封后放入孵化箱"
        ]
    }
];

// 加载步骤数据
function loadSteps() {
    try {
        console.log('正在加载鸡胚尿囊腔接种数据...');
        
        // 显示加载状态
        optionsContainer.innerHTML = '<div class="loading">加载中...</div>';
        questionText.textContent = '正在加载学习内容...';
        
        // 使用本地数据
        chorioSteps = chorioStepsData;
        console.log('成功加载数据，步骤数:', chorioSteps.length);
        
        if (!Array.isArray(chorioSteps) || chorioSteps.length === 0) {
            throw new Error('数据格式不正确或为空');
        }
        
        totalSteps = chorioSteps.length;
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
        questionText.textContent = '数据加载失败，请刷新页面重试。';
    }
}

// 从本地存储加载数据
function loadFromLocalStorage() {
    const savedProgress = localStorage.getItem('chorioProgress');
    const savedScore = localStorage.getItem('chorioScore');
    const savedAnswers = localStorage.getItem('chorioAnswers');
    
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
    if (!chorioSteps || chorioSteps.length === 0) return;
    
    // 重置重试次数
    retryCount = 0;
    
    const step = chorioSteps[stepNumber - 1];
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
            const stepData = chorioSteps[stepNumber - 1];
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
        const stepData = chorioSteps[stepNumber - 1];
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
        const stepData = chorioSteps[stepNumber - 1];
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
    const step = chorioSteps[currentStep - 1];
    const option = step.options.find(o => o.id === optionId);
    const isCorrect = option ? option.correct : false;
    
    if (isCorrect) {
        // 清除可能存在的重新作答按钮
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.remove();
        
        // 保存用户答案
        userAnswers[currentStep - 1] = optionId;
        localStorage.setItem('chorioAnswers', JSON.stringify(userAnswers));
        
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
        
        localStorage.setItem('chorioScore', score);
        localStorage.setItem('chorioProgress', currentStep);
        
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
    if (!chorioSteps || chorioSteps.length === 0) return;
    
    progressStepsContainer.innerHTML = '';
    
    chorioSteps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.className = 'progress-step';
        if (step.step === currentStep) stepElement.classList.add('active');
        
        // 检查这一步是否已回答正确
        if (userAnswers[step.step - 1] !== null) {
            // 检查是否正确（通过检查option的correct属性）
            const stepData = chorioSteps[step.step - 1];
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
            const stepData = chorioSteps[step.step - 1];
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
        <p>您已成功完成鸡胚尿囊腔接种的所有学习步骤。</p>
         <!-- 添加流程图 -->
    <div style="margin: 15px 0; text-align: center;">
        <img src="/microbiology_experiment/images/chorio/chorio.png" alt="接种流程图" style="max-width: 100%; border-radius: 10px;">
    </div>
        <p>最终得分: <strong>${score}</strong>/60</p>
        <p>用时: <strong>${minutes}分${seconds}秒</strong></p>
        <p>您已掌握鸡胚尿囊腔接种的关键步骤和要点。</p>
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
    localStorage.setItem('chorioCompleted', 'true');
    localStorage.setItem('chorioProgress', totalSteps);
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
    localStorage.removeItem('chorioProgress');
    localStorage.removeItem('chorioScore');
    localStorage.removeItem('chorioAnswers');
    
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
            const stepData = chorioSteps[currentStep - 1];
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
    console.log('页面加载完成，开始初始化鸡胚尿囊腔接种模块...');
    loadSteps();
});