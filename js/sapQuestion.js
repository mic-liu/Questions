// Cookie相关功能
function saveCurrentQuestion(questionId) {
    document.cookie = `currentQuestion=${questionId}; path=/; max-age=86400`; // 保存1天
}

function getCurrentQuestionFromCookie() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'currentQuestion') {
            return parseInt(value) || 0;
        }
    }
    return 0; // 如果没有Cookie，默认返回第一题
}

// 问题展示相关变量和函数
let currentQuestionIndex = getCurrentQuestionFromCookie();
let questions = [];

// 加载问题数据
async function loadQuestions() {
    try {
        const response = await fetch('../data/merged_questions.json');
        const data = await response.json();
        questions = data.questions.sort((a, b) => a.id - b.id);
        
        // 更新总题目数量显示
        document.getElementById('totalQuestions').textContent = questions.length;
        updateNavigationButtons();
        showCurrentQuestion();
    } catch (error) {
        console.error('加载问题失败:', error);
    }
}

// 显示当前问题
function showCurrentQuestion() {
    const container = document.getElementById('questionContainer');
    const question = questions[currentQuestionIndex];
    
    if (question) {
        container.innerHTML = createQuestionHtml(question);
        document.getElementById('jumpInput').value = currentQuestionIndex + 1;
        saveCurrentQuestion(currentQuestionIndex); // 保存当前题目到Cookie
    }
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const jumpInput = document.getElementById('jumpInput');
    
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1;
    jumpInput.max = questions.length;
}

// 创建问题HTML
function createQuestionHtml(question) {
    const optionsHtml = question.options.map(option => `
        <div class="option-item">
            <input type="${question.type === 'multiple_choice' ? 'checkbox' : 'radio'}" 
                   id="q${question.id}_option${option.id}" 
                   name="q${question.id}_options">
            <label for="q${question.id}_option${option.id}">${option.id}. ${option.text}</label>
        </div>
    `).join('');

    const contentHtml = Array.isArray(question.content) 
        ? question.content.map(line => `<p class="card-text">${line}</p>`).join('')
        : `<p class="card-text">${question.content}</p>`;

    const imagesHtml = question.images ? `
        <div class="text-center mb-3">
            ${question.images.map(image => `
                <img src="../images/${image}" alt="Question Image" class="img-fluid rounded mb-2 question-image">
            `).join('')}
        </div>
    ` : '';

    const explanationHtml = createExplanationHtml(question);
    const referencesHtml = createReferencesHtml(question);

    return `
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="card-title">${question.title}</h5>
            </div>
            <div class="card-body">
                ${contentHtml}
                ${imagesHtml}
                <hr>
                <div class="options-container mb-3">
                    ${optionsHtml}
                </div>
                <hr>
                <div class="accordion" id="accordionExample${question.id}">
                    ${createAnswerAccordionHtml(question)}
                    ${explanationHtml}
                    ${referencesHtml}
                </div>
            </div>
        </div>
    `;
}

// 创建答案手风琴HTML
function createAnswerAccordionHtml(question) {
    return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne${question.id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseOne${question.id}" aria-expanded="false" 
                    aria-controls="collapseOne${question.id}">
                    Answer
                </button>
            </h2>
            <div id="collapseOne${question.id}" class="accordion-collapse collapse" 
                 aria-labelledby="headingOne${question.id}" 
                 data-bs-parent="#accordionExample${question.id}">
                <div class="accordion-body">
                    <span class="correct-answer">${Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}</span>
                </div>
            </div>
        </div>
    `;
}

// 创建解释HTML
function createExplanationHtml(question) {
    if (!question.explanation) return '';
    
    const explanationContent = Array.isArray(question.explanation) 
        ? question.explanation.map(exp => `<p>${exp}</p>`).join('')
        : `<p>${question.explanation}</p>`;

    return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo${question.id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo${question.id}" aria-expanded="false" 
                    aria-controls="collapseTwo${question.id}">
                    Explanation
                </button>
            </h2>
            <div id="collapseTwo${question.id}" class="accordion-collapse collapse" 
                 aria-labelledby="headingTwo${question.id}" 
                 data-bs-parent="#accordionExample${question.id}">
                <div class="accordion-body">
                    ${explanationContent}
                </div>
            </div>
        </div>
    `;
}

// 创建参考资料HTML
function createReferencesHtml(question) {
    if (!question.references) return '';
    
    const referencesListHtml = Array.isArray(question.references) 
        ? question.references.map(ref => `<li>${ref}</li>`).join('')
        : `<li>${question.references}</li>`;

    return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree${question.id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseThree${question.id}" aria-expanded="false" 
                    aria-controls="collapseThree${question.id}">
                    References
                </button>
            </h2>
            <div id="collapseThree${question.id}" class="accordion-collapse collapse" 
                 aria-labelledby="headingThree${question.id}" 
                 data-bs-parent="#accordionExample${question.id}">
                <div class="accordion-body">
                    <ul class="reference-list">
                        ${referencesListHtml}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// 初始化事件监听
function initializeEventListeners() {
    document.getElementById('prevButton').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showCurrentQuestion();
            updateNavigationButtons();
        }
    });

    document.getElementById('nextButton').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showCurrentQuestion();
            updateNavigationButtons();
        }
    });

    document.getElementById('jumpButton').addEventListener('click', () => {
        const jumpInput = document.getElementById('jumpInput');
        const targetQuestion = parseInt(jumpInput.value) - 1;
        
        if (targetQuestion >= 0 && targetQuestion < questions.length) {
            currentQuestionIndex = targetQuestion;
            showCurrentQuestion();
            updateNavigationButtons();
        } else {
            alert('请输入有效的题号！');
        }
    });

    // 在initializeEventListeners函数中添加图片点击事件处理
    document.getElementById('questionContainer').addEventListener('click', (e) => {
        if (e.target.classList.contains('question-image')) {
            e.target.classList.toggle('expanded');
        }
    });

    // 添加选项选择事件监听
    document.getElementById('questionContainer').addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"], input[type="radio"]')) {
            const questionId = e.target.name.match(/\d+/)[0];
            const question = questions.find(q => q.id == questionId);
            const optionId = e.target.id.split('option').pop(); // 获取选项ID，例如B

            // 重置所有选项的背景颜色
            document.querySelectorAll(`[name="q${questionId}_options"]`).forEach(input => {
                const optionElement = input.closest('.option-item');
                const currentOptionId = input.id.split('option').pop();
                const isCorrect = Array.isArray(question.answer)
                    ? question.answer.includes(currentOptionId)
                    : question.answer == currentOptionId;

                if (input.checked && isCorrect) {
                    optionElement.style.backgroundColor = '#d4edda'; // 浅绿色
                } else {
                    optionElement.style.backgroundColor = ''; // 恢复默认背景
                }
            });
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    initializeEventListeners();
});