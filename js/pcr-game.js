// pcr-game.js - PCR测腺病毒模块

let pcrSteps = [];
let currentStep = 1;
let score = 0;
let selectedOptions = []; // 存储多选题选中的选项ID
let answered = false;
let userAnswers = []; // 存储每步的答案（对于多选题，存储选中的ID数组）
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
const multiSelectHint = document.getElementById('multi-select-hint');

// PCR测腺病毒步骤数据
const pcrStepsData = [
    {
        step: 1,
        title: "第一步: PCR反应体系配制",
        question: "PCR反应体系需要哪些核心组分？请选择所有必需的成分（全选）。",
        isMultiSelect: true, // 标记为多选题
        correctIds: [1, 2, 3, 4, 5, 6], // 所有选项都是正确的（全选）
        options: [
            { id: 1, text: "DNA模板", correct: true },
            { id: 2, text: "引物（上下游）", correct: true },
            { id: 3, text: "dNTP（四种脱氧核苷酸）", correct: true },
            { id: 4, text: "Taq DNA聚合酶", correct: true },
            { id: 5, text: "MIX缓冲液（含Mg²⁺等）", correct: true },
            { id: 6, text: "无菌PCR反应管", correct: true }
        ],
        feedbackCorrect: "正确！完整的PCR反应体系必须包含：DNA模板、特异性引物、dNTP混合物、Taq DNA聚合酶、反应缓冲液（MIX）以及无菌PCR反应管。这些组分缺一不可，共同保证了PCR扩增的特异性和效率。",
        feedbackIncorrect: "错误。完整的PCR反应体系应包括：DNA模板、上下游引物、dNTP混合物、Taq DNA聚合酶、反应缓冲液（含MgCl₂）和PCR反应管。请重新选择所有必需的组分。",
        image: "/microbiology_experiment/images/pcr/1.png",
        imageCaption: "PCR反应体系配制",
        tips: [
            "DNA模板：待扩增的靶序列DNA",
            "引物：特异性结合靶序列，决定扩增特异性",
            "dNTP：四种脱氧核苷酸(dATP、dGTP、dCTP、dTTP)作为合成原料",
            "Taq酶：耐热DNA聚合酶，催化DNA合成",
            "MIX缓冲液：提供适宜的反应环境（pH、Mg²⁺等）",
            "PCR反应管：无菌、无酶污染的一次性耗材"
        ]
    },
    {
        step: 2,
        title: "第二步: PCR扩增程序",
        question: "PCR扩增的标准循环程序顺序是什么？请严格按照正确的顺序选择。",
        isMultiSelect: false, // 单选题
        options: [
            { id: 1, text: "延伸 → 退火 → 变性", correct: false },
            { id: 2, text: "变性 → 退火 → 延伸", correct: true },
            { id: 3, text: "退火 → 变性 → 延伸", correct: false },
            { id: 4, text: "变性 → 延伸 → 退火", correct: false }
        ],
        feedbackCorrect: "正确！PCR标准程序顺序：1.变性（95℃使DNA双链解离成单链）→ 2.退火（50-60℃引物与模板特异性结合）→ 3.延伸（72℃Taq酶从引物3'端合成新链）。循环25-35次后，目的片段可扩增数百万倍。",
        feedbackIncorrect: "错误。正确的PCR扩增顺序是：变性（高温使DNA变性成单链）→ 退火（降温使引物与模板结合）→ 延伸（适温下DNA聚合酶延伸）。",
        image: "/microbiology_experiment/images/pcr/2.png",
        imageCaption: "PCR扩增程序曲线",
        tips: [
            "变性：95℃ 30秒，DNA双链解开成单链",
            "退火：55℃ 30秒，引物与模板特异性结合",
            "延伸：72℃ 1分钟/kb，Taq酶从引物3'端合成新链",
            "循环25-35次，可扩增数百万倍目标片段",
            "最后72℃终延伸5-10分钟，确保产物完整"
        ]
    }
];

// 加载步骤数据
function loadSteps() {
    try {
        console.log('正在加载PCR测腺病毒数据...');
        
        // 显示加载状态
        optionsContainer.innerHTML = '<div class="loading">加载中...</div>';
        questionText.textContent = '正在加载学习内容...';
        
        // 使用本地数据
        pcrSteps = pcrStepsData;
        console.log('成功加载数据，步骤数:', pcrSteps.length);
        
        if (!Array.isArray(pcrSteps) || pcrSteps.length === 0) {
            throw new Error('数据格式不正确或为空');
        }
        
        totalSteps = pcrSteps.length;
        totalStepsElement.textContent = totalSteps;
        
        // 初始化用户答案数组（存储每步的答案，多选题存储ID数组）
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

// 检查多选题答案是否正确
function checkMultiSelectAnswer(step, selectedIds) {
    const correctIds = step.correctIds;
    // 检查是否选择了所有正确选项，且没有多选或少选
    if (selectedIds.length !== correctIds.length) return false;
    // 检查每个选中的ID是否都在正确ID列表中
    return selectedIds.every(id => correctIds.includes(id));
}

// 加载指定步骤
function loadStep(stepNumber) {
    if (!pcrSteps || pcrSteps.length === 0) return;
    
    // 重置重试次数和选中项
    retryCount = 0;
    selectedOptions = [];
    
    const step = pcrSteps[stepNumber - 1];
    currentStep = stepNumber;
    currentStepElement.textContent = stepNumber;
    
    // 显示/隐藏多选题提示
    if (multiSelectHint) {
        multiSelectHint.style.display = step.isMultiSelect ? 'block' : 'none';
    }
    
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
        optionElement.dataset.option = String.fromCharCode(65 + index);
        
        // 如果是多选题，添加多选样式
        if (step.isMultiSelect) {
            optionElement.classList.add('multi-select-option');
        }
        
        // 如果之前已回答正确，显示答案状态
        if (userAnswers[stepNumber - 1] !== null) {
            const savedAnswer = userAnswers[stepNumber - 1];
            const isCorrectAnswer = step.isMultiSelect ? 
                checkMultiSelectAnswer(step, savedAnswer) : 
                (step.options.find(o => o.id === savedAnswer)?.correct || false);
            
            if (isCorrectAnswer) {
                // 之前回答正确的
                if (step.isMultiSelect) {
                    if (savedAnswer.includes(option.id)) {
                        optionElement.classList.add('selected', 'correct');
                    } else if (option.correct) {
                        optionElement.classList.add('correct');
                    }
                } else {
                    if (savedAnswer === option.id) {
                        optionElement.classList.add('selected', 'correct');
                    } else if (option.correct) {
                        optionElement.classList.add('correct');
                    }
                }
                optionElement.classList.add('disabled');
            } else {
                // 之前回答错误的，显示错误状态但允许重新选择
                if (step.isMultiSelect) {
                    if (savedAnswer.includes(option.id)) {
                        optionElement.classList.add('selected', 'incorrect');
                    }
                } else {
                    if (savedAnswer === option.id) {
                        optionElement.classList.add('selected', 'incorrect');
                    }
                }
            }
        }
        
        // 添加点击事件
        if (step.isMultiSelect) {
            optionElement.addEventListener('click', () => selectMultiOption(optionElement, step));
        } else {
            optionElement.addEventListener('click', () => selectSingleOption(optionElement, step));
        }
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
        const savedAnswer = userAnswers[stepNumber - 1];
        const isCorrectAnswer = step.isMultiSelect ? 
            checkMultiSelectAnswer(step, savedAnswer) : 
            (step.options.find(o => o.id === savedAnswer)?.correct || false);
        
        if (isCorrectAnswer) {
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
            // 之前回答错误的，不显示反馈，允许重新作答
            prevBtn.disabled = stepNumber === 1;
            nextBtn.disabled = true;
            answered = false;
        }
    } else {
        // 更新按钮状态
        prevBtn.disabled = stepNumber === 1;
        nextBtn.disabled = true;
        answered = false;
    }
    
    // 更新进度指示器
    updateProgressSteps();
    
    // 如果是最后一步且已答完，显示完成消息
    if (stepNumber === totalSteps && userAnswers[stepNumber - 1] !== null) {
        const savedAnswer = userAnswers[stepNumber - 1];
        const isCorrectAnswer = step.isMultiSelect ? 
            checkMultiSelectAnswer(step, savedAnswer) : 
            (step.options.find(o => o.id === savedAnswer)?.correct || false);
        
        if (isCorrectAnswer) {
            setTimeout(showCompletionMessage, 500);
        }
    }
}

// 多选题选择逻辑
function selectMultiOption(optionElement, step) {
    if (answered && optionElement.classList.contains('disabled')) return;
    
    const optionId = parseInt(optionElement.dataset.id);
    const index = selectedOptions.indexOf(optionId);
    
    if (index === -1) {
        // 未选中，添加选中
        selectedOptions.push(optionId);
        optionElement.classList.add('selected');
    } else {
        // 已选中，取消选中
        selectedOptions.splice(index, 1);
        optionElement.classList.remove('selected');
    }
    
    // 移除所有错误样式
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('incorrect');
    });
    
    // 隐藏之前的反馈
    feedback.style.display = 'none';
}

// 单选题选择逻辑
function selectSingleOption(optionElement, step) {
    if (answered && optionElement.classList.contains('disabled')) return;
    
    // 移除之前的选择
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // 标记当前选择
    optionElement.classList.add('selected');
    
    const optionId = parseInt(optionElement.dataset.id);
    const option = step.options.find(o => o.id === optionId);
    const isCorrect = option ? option.correct : false;
    
    if (isCorrect) {
        handleCorrectAnswer(step, optionId);
    } else {
        handleIncorrectAnswer(step, optionId, optionElement);
    }
}

// 处理正确答案
function handleCorrectAnswer(step, optionId) {
    // 清除可能存在的重新作答按钮
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) retryBtn.remove();
    
    // 保存用户答案
    userAnswers[currentStep - 1] = optionId;
    localStorage.setItem('pcrAnswers', JSON.stringify(userAnswers));
    
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
        opt.classList.add('disabled');
    });
    
    // 更新得分（每步50分，总分100）
    score += 50;
    scoreElement.textContent = score;
    scoreElement.classList.add('score-increase');
    setTimeout(() => {
        scoreElement.classList.remove('score-increase');
    }, 500);
    
    localStorage.setItem('pcrScore', score);
    localStorage.setItem('pcrProgress', currentStep);
    
    // 禁用所有选项
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.add('disabled');
    });
    
    // 标记进度步骤为完成
    const progressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
    if (progressStep) progressStep.classList.add('completed');
    
    // 启用下一步按钮
    nextBtn.disabled = false;
    answered = true;
    
    // 如果是最后一步，显示完成消息
    if (currentStep === totalSteps) {
        setTimeout(showCompletionMessage, 500);
    }
}

// 处理多选题正确答案
function handleMultiCorrectAnswer(step) {
    // 清除可能存在的重新作答按钮
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) retryBtn.remove();
    
    // 保存用户答案（选中的ID数组）
    userAnswers[currentStep - 1] = [...selectedOptions];
    localStorage.setItem('pcrAnswers', JSON.stringify(userAnswers));
    
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
    
    // 显示所有正确答案
    document.querySelectorAll('.option').forEach(opt => {
        if (opt.dataset.correct === 'true') {
            opt.classList.add('correct');
        }
        opt.classList.add('disabled');
    });
    
    // 更新得分
    score += 50;
    scoreElement.textContent = score;
    scoreElement.classList.add('score-increase');
    setTimeout(() => {
        scoreElement.classList.remove('score-increase');
    }, 500);
    
    localStorage.setItem('pcrScore', score);
    localStorage.setItem('pcrProgress', currentStep);
    
    // 标记进度步骤为完成
    const progressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
    if (progressStep) progressStep.classList.add('completed');
    
    // 启用下一步按钮
    nextBtn.disabled = false;
    answered = true;
    
    // 如果是最后一步，显示完成消息
    if (currentStep === totalSteps) {
        setTimeout(showCompletionMessage, 500);
    }
}

// 处理错误答案
function handleIncorrectAnswer(step, optionId, optionElement) {
    retryCount++;
    
    // 显示反馈
    feedback.className = 'feedback incorrect';
    
    if (retryCount >= MAX_RETRIES) {
        // 达到最大重试次数，显示正确答案
        document.querySelectorAll('.option').forEach(opt => {
            if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
            }
            opt.classList.add('disabled');
        });
        
        feedback.textContent = `${step.feedbackIncorrect}\n\n您已尝试 ${MAX_RETRIES} 次，正确答案已显示。`;
        
        // 保存错误答案
        userAnswers[currentStep - 1] = optionId;
        localStorage.setItem('pcrAnswers', JSON.stringify(userAnswers));
        
        // 启用下一步按钮
        nextBtn.disabled = false;
        answered = true;
    } else {
        // 还可以重试
        feedback.textContent = `${step.feedbackIncorrect}\n\n请重新选择正确答案 (剩余尝试次数: ${MAX_RETRIES - retryCount})`;
        
        // 添加重新作答按钮
        addRetryButton();
        
        // 标记错误选项
        optionElement.classList.add('incorrect');
        
        // 保存临时答案
        userAnswers[currentStep - 1] = optionId;
    }
    
    feedback.style.display = 'block';
}

// 处理多选题错误答案
function handleMultiIncorrectAnswer(step) {
    retryCount++;
    
    // 显示反馈
    feedback.className = 'feedback incorrect';
    
    if (retryCount >= MAX_RETRIES) {
        // 达到最大重试次数，显示所有正确答案
        document.querySelectorAll('.option').forEach(opt => {
            if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
            }
            opt.classList.add('disabled');
        });
        
        feedback.textContent = `${step.feedbackIncorrect}\n\n您已尝试 ${MAX_RETRIES} 次，正确答案已显示。`;
        
        // 保存错误答案
        userAnswers[currentStep - 1] = [...selectedOptions];
        localStorage.setItem('pcrAnswers', JSON.stringify(userAnswers));
        
        // 启用下一步按钮
        nextBtn.disabled = false;
        answered = true;
    } else {
        // 还可以重试
        feedback.textContent = `${step.feedbackIncorrect}\n\n请重新选择所有正确答案 (剩余尝试次数: ${MAX_RETRIES - retryCount})`;
        
        // 添加重新作答按钮
        addRetryButton();
        
        // 标记错误选项（选中的标记为红色）
        document.querySelectorAll('.option.selected').forEach(opt => {
            if (opt.dataset.correct !== 'true') {
                opt.classList.add('incorrect');
            }
        });
        
        // 保存临时答案
        userAnswers[currentStep - 1] = [...selectedOptions];
    }
    
    feedback.style.display = 'block';
}

// 提交多选题答案
function submitMultiAnswer(step) {
    if (answered) return;
    
    if (selectedOptions.length === 0) {
        // 未选择任何选项
        feedback.className = 'feedback incorrect';
        feedback.textContent = '请至少选择一个选项。';
        feedback.style.display = 'block';
        return;
    }
    
    const isCorrect = checkMultiSelectAnswer(step, selectedOptions);
    
    if (isCorrect) {
        handleMultiCorrectAnswer(step);
    } else {
        handleMultiIncorrectAnswer(step);
    }
}

// 添加提交按钮（用于多选题）
function addSubmitButton(step) {
    // 检查是否已存在提交按钮
    if (document.getElementById('submit-btn')) return;
    
    // 创建提交按钮
    const submitBtn = document.createElement('button');
    submitBtn.id = 'submit-btn';
    submitBtn.className = 'nav-btn';
    submitBtn.innerHTML = '<i class="fas fa-check"></i> 提交答案';
    submitBtn.style.marginTop = '15px';
    submitBtn.style.marginRight = '10px';
    submitBtn.style.backgroundColor = '#9b59b6';
    
    // 添加到反馈区域
    feedback.parentNode.insertBefore(submitBtn, feedback.nextSibling);
    
    // 添加点击事件
    submitBtn.addEventListener('click', () => submitMultiAnswer(step));
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
    
    // 重置选项状态
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect', 'disabled');
    });
    
    // 重置游戏状态
    selectedOptions = [];
    answered = false;
    nextBtn.disabled = true;
    
    // 清除当前步骤的答案
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
        
        // 检查这一步是否已回答正确
        if (userAnswers[step.step - 1] !== null) {
            const savedAnswer = userAnswers[step.step - 1];
            const isCorrect = step.isMultiSelect ? 
                checkMultiSelectAnswer(step, savedAnswer) : 
                (step.options.find(o => o.id === savedAnswer)?.correct || false);
            if (isCorrect) {
                stepElement.classList.add('completed');
            }
        }
        
        stepElement.dataset.step = step.step;
        
        stepElement.innerHTML = `
            <div class="step-number">${step.step}</div>
            <div class="step-name">${step.title}</div>
        `;
        
        stepElement.addEventListener('click', () => {
            const savedAnswer = userAnswers[step.step - 1];
            const isCorrect = savedAnswer !== null ? 
                (step.isMultiSelect ? 
                    checkMultiSelectAnswer(step, savedAnswer) : 
                    (step.options.find(o => o.id === savedAnswer)?.correct || false)) : false;
            
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
    selectedOptions = [];
    
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
            const step = pcrSteps[currentStep - 1];
            const savedAnswer = userAnswers[currentStep - 1];
            const isCorrect = step.isMultiSelect ? 
                checkMultiSelectAnswer(step, savedAnswer) : 
                (step.options.find(o => o.id === savedAnswer)?.correct || false);
            
            if (isCorrect) {
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
    } else if (e.key >= '1' && e.key <= '6' && !answered) {
        const step = pcrSteps[currentStep - 1];
        if (step && step.isMultiSelect) {
            // 多选题：数字键1-6选择/取消选择选项
            const options = document.querySelectorAll('.option:not(.disabled)');
            const index = parseInt(e.key) - 1;
            if (index < options.length) {
                options[index].click();
            }
        } else if (step && !step.isMultiSelect && e.key >= '1' && e.key <= '4') {
            // 单选题：数字键1-4直接选择
            const options = document.querySelectorAll('.option:not(.disabled)');
            const index = parseInt(e.key) - 1;
            if (index < options.length) {
                options[index].click();
            }
        }
    } else if (e.key === 'Enter' && !answered) {
        // Enter键提交多选题答案
        const step = pcrSteps[currentStep - 1];
        if (step && step.isMultiSelect && selectedOptions.length > 0) {
            submitMultiAnswer(step);
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