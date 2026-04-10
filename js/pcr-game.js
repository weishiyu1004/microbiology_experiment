// pcr-game.js - PCR测腺病毒模块（单选题版本）

let pcrSteps = [];
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

// PCR测腺病毒步骤数据（单选题版本）
const pcrStepsData = [
    {
        step: 1,
        title: "第一步: PCR反应体系",
        question: "PCR反应体系需要哪些核心组分？请选择最完整正确的选项。",
        options: [
            { id: 1, text: "DNA模板和引物", correct: false },
            { id: 2, text: "DNA模板、引物、dNTP", correct: false },
            { id: 3, text: "DNA模板、引物、dNTP、Taq酶", correct: false },
            { id: 4, text: "DNA模板、引物、dNTP、Taq酶、MIX缓冲液、PCR反应管", correct: true }
        ],
        feedbackCorrect: "正确！完整的PCR反应体系必须包含：DNA模板、特异性引物、dNTP混合物、Taq DNA聚合酶、反应缓冲液（MIX）以及无菌PCR反应管。这些组分缺一不可。",
        feedbackIncorrect: "错误。完整的PCR反应体系应包括：DNA模板、上下游引物、dNTP混合物、Taq DNA聚合酶、反应缓冲液（含MgCl₂）和PCR反应管。",
        image: "/microbiology_experiment/images/pcr/1.png",
        imageCaption: "PCR反应体系配制",
        tips: [
            "DNA模板：待扩增的靶序列DNA",
            "引物：特异性结合靶序列，决定扩增特异性",
            "dNTP：四种脱氧核苷酸作为合成原料",
            "Taq酶：耐热DNA聚合酶，催化DNA合成",
            "MIX缓冲液：提供适宜的反应环境",
            "PCR反应管：无菌、无酶污染的一次性耗材"
        ]
    },
    {
        step: 2,
        title: "第二步: PCR扩增程序",
        question: "PCR扩增的标准循环程序顺序是什么？请严格按照正确的顺序选择。",
        options: [
            { id: 1, text: "延伸 → 退火 → 变性", correct: false },
            { id: 2, text: "变性 → 退火 → 延伸", correct: true },
            { id: 3, text: "退火 → 变性 → 延伸", correct: false },
            { id: 4, text: "变性 → 延伸 → 退火", correct: false }
        ],
        feedbackCorrect: "正确！PCR标准程序顺序：1.变性（95℃使DNA双链解离）→ 2.退火（50-60℃引物与模板结合）→ 3.延伸（72℃Taq酶合成新链）。",
        feedbackIncorrect: "错误。正确的PCR扩增顺序是：变性（高温使DNA变性成单链）→ 退火（降温使引物与模板结合）→ 延伸（适温下DNA聚合酶延伸）。",
        image: "/microbiology_experiment/images/pcr/2.png",
        imageCaption: "PCR扩增程序曲线",
        tips: [
            "变性：95℃ 30秒，DNA双链解开成单链",
            "退火：55℃ 30秒，引物与模板特异性结合",
            "延伸：72℃ 1分钟/kb，Taq酶从引物3'端合成新链",
            "循环25-35次，可扩增数百万倍目标片段"
        ]
    }
];

// 加载步骤数据
function loadSteps() {
    try {
        console.log('正在加载PCR测腺病毒数据...');
        
        optionsContainer.innerHTML = '<div class="loading">加载中...</div>';
        questionText.textContent = '正在加载学习内容...';
        
        pcrSteps = pcrStepsData;
        console.log('成功加载数据，步骤数:', pcrSteps.length);
        
        if (!Array.isArray(pcrSteps) || pcrSteps.length === 0) {
            throw new Error('数据格式不正确或为空');
        }
        
        totalSteps = pcrSteps.length;
        totalStepsElement.textContent = totalSteps;
        
        userAnswers = new Array(totalSteps).fill(null);
        
        loadFromLocalStorage();
        loadStep(currentStep);
        updateProgressSteps();
        
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        
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
    const savedProgress = localStorage.getItem('pcrProgress');
    const savedScore = localStorage.getItem('pcrScore');
    const savedAnswers = localStorage.getItem('pcrAnswers');
    
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
    if (!pcrSteps || pcrSteps.length === 0) return;
    
    retryCount = 0;
    
    const step = pcrSteps[stepNumber - 1];
    currentStep = stepNumber;
    currentStepElement.textContent = stepNumber;
    
    questionTitle.textContent = `步骤${stepNumber}: ${step.title}`;
    questionText.textContent = step.question;
    
    if (stepTips && step.tips) {
        stepTips.innerHTML = step.tips.map(tip => `<li>${tip}</li>`).join('');
    }
    
    optionsContainer.innerHTML = '';
    
    step.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.text;
        optionElement.dataset.id = option.id;
        optionElement.dataset.correct = option.correct;
        optionElement.dataset.option = String.fromCharCode(65 + index);
        
        if (userAnswers[stepNumber - 1] !== null) {
            const selectedId = userAnswers[stepNumber - 1];
            const selectedOptionData = step.options.find(o => o.id === selectedId);
            
            if (selectedOptionData && selectedOptionData.correct) {
                if (selectedId === option.id) {
                    optionElement.classList.add('selected', 'correct');
                } else if (option.correct) {
                    optionElement.classList.add('correct');
                }
                optionElement.classList.add('disabled');
            } else {
                if (selectedId === option.id) {
                    optionElement.classList.add('selected', 'incorrect');
                }
            }
        }
        
        optionElement.addEventListener('click', () => selectOption(optionElement));
        optionsContainer.appendChild(optionElement);
    });
    
    feedback.className = 'feedback';
    feedback.style.display = 'none';
    feedback.innerHTML = '';
    imageContainer.style.display = 'none';
    imageContainer.innerHTML = '';
    
    if (userAnswers[stepNumber - 1] !== null) {
        const selectedId = userAnswers[stepNumber - 1];
        const selectedOption = step.options.find(o => o.id === selectedId);
        
        if (selectedOption && selectedOption.correct) {
            feedback.className = 'feedback correct';
            feedback.textContent = step.feedbackCorrect;
            feedback.style.display = 'block';
            
            if (step.image) {
                imageContainer.innerHTML = `
                    <img src="${step.image}" alt="${step.imageCaption || '步骤图片'}" class="step-image">
                    <p class="image-caption">${step.imageCaption || ''}</p>
                `;
                imageContainer.style.display = 'block';
            }
            
            nextBtn.disabled = false;
            answered = true;
        } else {
            prevBtn.disabled = stepNumber === 1;
            nextBtn.disabled = true;
            answered = false;
            selectedOption = null;
        }
    } else {
        prevBtn.disabled = stepNumber === 1;
        nextBtn.disabled = true;
        answered = false;
        selectedOption = null;
    }
    
    updateProgressSteps();
    
    if (stepNumber === totalSteps && userAnswers[stepNumber - 1] !== null) {
        const selectedId = userAnswers[stepNumber - 1];
        const selectedOptionData = step.options.find(o => o.id === selectedId);
        if (selectedOptionData && selectedOptionData.correct) {
            setTimeout(showCompletionMessage, 500);
        }
    }
}

// 选择选项
function selectOption(optionElement) {
    if (answered && optionElement.classList.contains('disabled')) return;
    
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    optionElement.classList.add('selected');
    selectedOption = optionElement;
    
    const optionId = parseInt(optionElement.dataset.id);
    const step = pcrSteps[currentStep - 1];
    const option = step.options.find(o => o.id === optionId);
    const isCorrect = option ? option.correct : false;
    
    if (isCorrect) {
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.remove();
        
        userAnswers[currentStep - 1] = optionId;
        localStorage.setItem('pcrAnswers', JSON.stringify(userAnswers));
        
        feedback.className = 'feedback correct';
        feedback.textContent = step.feedbackCorrect;
        feedback.style.display = 'block';
        
        if (step.image) {
            imageContainer.innerHTML = `
                <img src="${step.image}" alt="${step.imageCaption || '步骤图片'}" class="step-image">
                <p class="image-caption">${step.imageCaption || ''}</p>
            `;
            imageContainer.style.display = 'block';
        }
        
        document.querySelectorAll('.option').forEach(opt => {
            if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
            }
        });
        
        score += 50;
        scoreElement.textContent = score;
        scoreElement.classList.add('score-increase');
        setTimeout(() => {
            scoreElement.classList.remove('score-increase');
        }, 500);
        
        localStorage.setItem('pcrScore', score);
        localStorage.setItem('pcrProgress', currentStep);
        
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.add('disabled');
        });
        
        const progressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        if (progressStep) progressStep.classList.add('completed');
        
        nextBtn.disabled = false;
        answered = true;
        
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
    if (document.getElementById('retry-btn')) return;
    
    const retryBtn = document.createElement('button');
    retryBtn.id = 'retry-btn';
    retryBtn.className = 'nav-btn retry-btn';
    retryBtn.innerHTML = '<i class="fas fa-redo"></i> 重新作答';
    retryBtn.style.marginTop = '15px';
    retryBtn.style.marginRight = '10px';
    
    feedback.appendChild(retryBtn);
    retryBtn.addEventListener('click', retryQuestion);
}

// 重新作答函数
function retryQuestion() {
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) retryBtn.remove();
    
    feedback.className = 'feedback';
    feedback.style.display = 'none';
    feedback.innerHTML = '';
    
    imageContainer.style.display = 'none';
    imageContainer.innerHTML = '';
    
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect', 'disabled');
    });
    
    selectedOption = null;
    answered = false;
    nextBtn.disabled = true;
    userAnswers[currentStep - 1] = null;
}

// 更新进度步骤显示
function updateProgressSteps() {
    if (!pcrSteps || pcrSteps.length === 0) return;
    
    progressStepsContainer.innerHTML = '';
    
    pcrSteps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.className = 'progress-step';
        if (step.step === currentStep) stepElement.classList.add('active');
        
        if (userAnswers[step.step - 1] !== null) {
            const selectedId = userAnswers[step.step - 1];
            const selectedOption = step.options.find(o => o.id === selectedId);
            if (selectedOption && selectedOption.correct) {
                stepElement.classList.add('completed');
            }
        }
        
        stepElement.dataset.step = step.step;
        
        stepElement.innerHTML = `
            <div class="step-number">${step.step}</div>
            <div class="step-name">${step.title}</div>
        `;
        
        stepElement.addEventListener('click', () => {
            const selectedId = userAnswers[step.step - 1];
            const selectedOption = step.options.find(o => o.id === selectedId);
            const isCorrect = selectedOption ? selectedOption.correct : false;
            
            if (step.step <= currentStep || isCorrect) {
                loadStep(step.step);
            }
        });
        
        progressStepsContainer.appendChild(stepElement);
    });
}

// 显示完成消息
function showCompletionMessage() {
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
        <p>您已成功完成PCR测腺病毒的所有学习步骤。</p>
         <!-- 添加流程图 -->
    <div style="margin: 15px 0; text-align: center;">
        <img src="/microbiology_experiment/images/wear/pcr.png" alt="pcr流程图" style="max-width: 100%; border-radius: 10px;">
    </div>
        <p>最终得分: <strong>${score}</strong>/100</p>
        <p>用时: <strong>${minutes}分${seconds}秒</strong></p>
        <p>您已掌握PCR反应体系和扩增程序的关键要点。</p>
        <button id="review-btn" class="nav-btn" style="margin-top: 15px; margin-right: 10px;">
            <i class="fas fa-redo"></i> 重新学习
        </button>
        <button id="home-btn-2" class="nav-btn home-btn" style="margin-top: 15px;">
            <i class="fas fa-home"></i> 返回首页
        </button>
    `;
    
    document.getElementById('review-btn').addEventListener('click', () => {
        restartGame();
    });
    
    document.getElementById('home-btn-2').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    localStorage.setItem('pcrCompleted', 'true');
    localStorage.setItem('pcrProgress', totalSteps);
}

// 重新开始游戏
function restartGame() {
    currentStep = 1;
    score = 0;
    userAnswers = new Array(totalSteps).fill(null);
    startTime = Date.now();
    retryCount = 0;
    
    localStorage.removeItem('pcrProgress');
    localStorage.removeItem('pcrScore');
    localStorage.removeItem('pcrAnswers');
    
    scoreElement.textContent = '0';
    completionMessage.style.display = 'none';
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
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
        if (userAnswers[currentStep - 1] !== null) {
            const selectedId = userAnswers[currentStep - 1];
            const stepData = pcrSteps[currentStep - 1];
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

// 键盘支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        prevBtn.click();
    } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        nextBtn.click();
    } else if (e.key >= '1' && e.key <= '4' && !answered) {
        const options = document.querySelectorAll('.option:not(.disabled)');
        const index = parseInt(e.key) - 1;
        if (index < options.length) {
            options[index].click();
        }
    } else if (e.key === 'r' || e.key === 'R') {
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.click();
    } else if (e.key === 'h' || e.key === 'H') {
        homeBtn.click();
    }
});

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，开始初始化PCR测腺病毒模块...');
    loadSteps();
});