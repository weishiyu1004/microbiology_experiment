// cell-game.js - 传代细胞培养模块

let cellSteps = [];
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
const safetyHint = document.getElementById('safety-hint');

// 传代细胞培养步骤数据
const cellStepsData = [
    {
        step: 1,
        title: "第一步",
        question: "在进行细胞传代培养时，第一步应该做什么？",
        options: [
            { id: 1, text: "洗涤细胞", correct: true },
            { id: 2, text: "培养细胞", correct: false },
            { id: 3, text: "中和胰酶", correct: false },
            { id: 4, text: "杀死污染细菌", correct: false }
        ],
        feedbackCorrect: "正确！洗涤细胞的目的是去除残留的培养基和血清成分，因为血清中含有胰酶抑制剂，会影响后续胰酶的消化效果。通常使用PBS或无血清培养基洗涤1-2次。",
        feedbackIncorrect: "错误。洗涤细胞是为了去除残留培养基中的血清成分（胰酶抑制剂），保证后续胰酶能够有效消化细胞。",
        image: "/microbiology_experiment/images/cell/1.png",
        imageCaption: "用PBS洗涤细胞",
        tips: [
            "吸弃旧的培养基",
            "加入适量PBS（磷酸盐缓冲液）",
            "轻轻晃动培养瓶，清洗细胞表面",
            "吸弃PBS，重复洗涤1-2次",
            "去除血清中的胰酶抑制剂"
        ]
    },
    {
        step: 2,
        title: "第二步",
        question: "洗涤细胞后，第二步应该怎么做？",
        options: [
            { id: 1, text: "直接离心", correct: false },
            { id: 2, text: "消化细胞", correct: true },
            { id: 3, text: "分装", correct: false },
            { id: 4, text: "用蒸馏水处理", correct: false }
        ],
        feedbackCorrect: "正确！消化细胞时加入适量胰酶（0.25% Trypsin-EDTA），37℃孵育2-5分钟，在显微镜下观察到细胞变圆、细胞间间隙增大、细胞脱落时，即可终止消化。",
        feedbackIncorrect: "错误。消化细胞应加入胰蛋白酶，37℃孵育，待细胞变圆脱落后及时终止。消化时间过长会损伤细胞。",
        image: "/microbiology_experiment/images/cell/2.png",
        imageCaption: "加入胰酶消化细胞",
        tips: [
            "加入适量0.25%胰酶-EDTA溶液",
            "37℃培养箱中孵育2-5分钟",
            "显微镜下观察细胞形态变化",
            "细胞变圆、间隙增大时终止消化",
            "避免消化过度损伤细胞"
        ]
    },
    {
        step: 3,
        title: "第三步: 中和胰酶",
        question: "细胞消化完成后，第三步需要做什么？",
        options: [
            { id: 1, text: "用PBS冲洗", correct: false },
            { id: 2, text: "中和胰酶", correct: true },
            { id: 3, text: "直接离心", correct: false },
            { id: 4, text: "加入胰酶抑制剂", correct: false }
        ],
        feedbackCorrect: "正确！中和胰酶时加入含血清的完全培养基，血清中的蛋白质可以迅速结合并抑制胰酶活性，保护细胞免受继续消化损伤。",
        feedbackIncorrect: "错误。中和胰酶应加入含血清的完全培养基，血清中的α1-抗胰蛋白酶等成分可迅速中和胰酶活性。",
        image: "/microbiology_experiment/images/cell/3.png",
        imageCaption: "加入含血清培养基中和胰酶",
        tips: [
            "加入含10%胎牛血清的完全培养基",
            "培养基体积为胰酶的2-3倍",
            "轻轻吹打使细胞分散成单细胞悬液",
            "血清中的成分可快速中和胰酶",
            "避免气泡产生"
        ]
    },
    {
        step: 4,
        title: "第四步: 分装",
        question: "中和胰酶并制成细胞悬液后，第四步是什么？",
        options: [
            { id: 1, text: "培养细胞", correct: false },
            { id: 2, text: "分装", correct: true },
            { id: 3, text: "全部倒入一个培养瓶", correct: false },
            { id: 4, text: "再次洗涤", correct: false }
        ],
        feedbackCorrect: "正确！分装时应将细胞悬液按1:2至1:4的比例分装到新的培养瓶中，补充新鲜培养基至适当体积，使细胞能够继续生长。",
        feedbackIncorrect: "错误。分装时应根据细胞生长速度和实验需求，按适当比例将细胞悬液分装到新的培养容器中。",
        image: "/microbiology_experiment/images/cell/4.png",
        imageCaption: "分装细胞到新培养瓶",
        tips: [
            "根据细胞密度确定分装比例（通常1:2-1:4）",
            "将细胞悬液均匀分装到新培养瓶中",
            "补充新鲜完全培养基至合适体积",
            "标记细胞名称、代数、日期",
            "轻摇培养瓶使细胞分布均匀"
        ]
    },
    {
        step: 5,
        title: "第五步: 培养",
        question: "分装完成后，最后一步是什么？",
        options: [
            { id: 1, text: "立即放入冰箱", correct: false },
            { id: 2, text: "37℃、CO₂培养箱中培养", correct: true },
            { id: 3, text: "中和胰酶", correct: false },
            { id: 4, text: "放入烘箱", correct: false }
        ],
        feedbackCorrect: "正确！培养时应将分装好的细胞放入37℃、5% CO₂的细胞培养箱中，定期观察细胞生长情况，根据细胞状态决定换液或再次传代。",
        feedbackIncorrect: "错误。培养应在37℃、5% CO₂的恒温培养箱中进行，保持适宜的温度、湿度和CO₂浓度。",
        image: "/microbiology_experiment/images/cell/5.png",
        imageCaption: "细胞培养箱中培养",
        tips: [
            "将培养瓶放入37℃、5% CO₂培养箱",
            "瓶盖稍松，保证气体交换",
            "定期在显微镜下观察细胞生长状态",
            "根据细胞密度决定是否需要换液",
            "记录培养日期和细胞状态"
        ]
    }
];

// 加载步骤数据
function loadSteps() {
    try {
        console.log('正在加载传代细胞培养数据...');
        
        // 显示加载状态
        optionsContainer.innerHTML = '<div class="loading">加载中...</div>';
        questionText.textContent = '正在加载学习内容...';
        
        // 使用本地数据
        cellSteps = cellStepsData;
        console.log('成功加载数据，步骤数:', cellSteps.length);
        
        if (!Array.isArray(cellSteps) || cellSteps.length === 0) {
            throw new Error('数据格式不正确或为空');
        }
        
        totalSteps = cellSteps.length;
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
    const savedProgress = localStorage.getItem('cellProgress');
    const savedScore = localStorage.getItem('cellScore');
    const savedAnswers = localStorage.getItem('cellAnswers');
    
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
    if (!cellSteps || cellSteps.length === 0) return;
    
    // 重置重试次数
    retryCount = 0;
    
    const step = cellSteps[stepNumber - 1];
    currentStep = stepNumber;
    currentStepElement.textContent = stepNumber;
    
    // 显示/隐藏安全提示
    if (safetyHint) {
        safetyHint.style.display = stepNumber === 1 ? 'block' : 'none';
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
        optionElement.dataset.option = String.fromCharCode(65 + index); // A, B, C, D
        
        // 如果之前已回答正确，显示答案状态
        if (userAnswers[stepNumber - 1] !== null) {
            const selectedId = userAnswers[stepNumber - 1];
            const stepData = cellSteps[stepNumber - 1];
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
        const stepData = cellSteps[stepNumber - 1];
        const selectedOption = stepData.options.find(o => o.id === selectedId);
        
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
        const stepData = cellSteps[stepNumber - 1];
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
    const step = cellSteps[currentStep - 1];
    const option = step.options.find(o => o.id === optionId);
    const isCorrect = option ? option.correct : false;
    
    if (isCorrect) {
        // 清除可能存在的重新作答按钮
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.remove();
        
        // 保存用户答案
        userAnswers[currentStep - 1] = optionId;
        localStorage.setItem('cellAnswers', JSON.stringify(userAnswers));
        
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
        
        // 更新得分（每步20分，总分100分）
        score += 20;
        scoreElement.textContent = score;
        scoreElement.classList.add('score-increase');
        setTimeout(() => {
            scoreElement.classList.remove('score-increase');
        }, 500);
        
        localStorage.setItem('cellScore', score);
        localStorage.setItem('cellProgress', currentStep);
        
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
    if (!cellSteps || cellSteps.length === 0) return;
    
    progressStepsContainer.innerHTML = '';
    
    cellSteps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.className = 'progress-step';
        if (step.step === currentStep) stepElement.classList.add('active');
        
        // 检查这一步是否已回答正确
        if (userAnswers[step.step - 1] !== null) {
            // 检查是否正确（通过检查option的correct属性）
            const stepData = cellSteps[step.step - 1];
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
            const stepData = cellSteps[step.step - 1];
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
        <p>您已成功完成传代细胞培养的所有学习步骤。</p>
         <!-- 添加流程图 -->
    <div style="margin: 15px 0; text-align: center;">
        <img src="/microbiology_experiment/images/cell/cell.png" alt="传代细胞流程图" style="max-width: 100%; border-radius: 10px;">
    </div>
        <p>最终得分: <strong>${score}</strong>/100</p>
        <p>用时: <strong>${minutes}分${seconds}秒</strong></p>
        <p>您已掌握细胞传代培养的关键步骤和要点：洗涤、消化、中和、分装、培养。</p>
        <div class="cell-culture-tip" style="margin-top: 20px;">
            <i class="fas fa-lightbulb"></i> 温馨提示：细胞培养全过程需保持无菌操作，所有试剂和耗材应提前灭菌。
        </div>
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
    localStorage.setItem('cellCompleted', 'true');
    localStorage.setItem('cellProgress', totalSteps);
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
    localStorage.removeItem('cellProgress');
    localStorage.removeItem('cellScore');
    localStorage.removeItem('cellAnswers');
    
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
            const stepData = cellSteps[currentStep - 1];
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
    console.log('页面加载完成，开始初始化传代细胞培养模块...');
    loadSteps();
});