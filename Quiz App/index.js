
import quizData from './try.json' with {type: 'json'};


const quiz_ques_answer_tag = document.getElementById('quiz-ques-answer');
const quiz_result_tag = document.getElementById('quiz-result');
const questionTag = document.getElementById('question');
const answerTag = document.getElementById('answer');
const prvBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const scoreTag = document.getElementById("score");
const scoreRingTag = document.getElementById("score-ring");
const restartBtn = document.getElementById('restart-btn');
const startQuizTag = document.getElementById("start-quiz");
const startQuizBtn = document.getElementById("start-quiz-btn");
const finishBtn = document.getElementById('finish-btn');

let answer_selected_store = {};
let currentQuestionIndex = 0;
let alreadyAnswered = "";

function startQuiz(){
    currentQuestionIndex = 0;
    answer_selected_store = {};
    alreadyAnswered = "";
    showQuestion();
}

function showQuestion(){

    let currentQuestion = quizData[currentQuestionIndex];
    let quesId = currentQuestion.id;
    alreadyAnswered = "";

    questionTag.innerHTML = (currentQuestionIndex + 1) + ". " + currentQuestion["question"];

    currentQuestion["options"].forEach(option => {
        let answerBtn = document.createElement("button");

        answerBtn.className = "list-group-item btn btn-success";
        answerBtn.innerText = option;

        // Check if we move to prev question and answer is already selected
        if(quesId in answer_selected_store && answer_selected_store[quesId]["selectedAnswer"] === option){
            answerBtn.classList.add("active");
            alreadyAnswered = answerBtn;
        }

        answerTag.appendChild(answerBtn);

        answerBtn.addEventListener("click", (event) => {
            selectAnswer(currentQuestion["id"], event);
        });
    });
}

function selectAnswer(id, event){
    if (!alreadyAnswered){
        answer_selected_store[id] = {};
    }
    else{
        alreadyAnswered.classList.remove('active');
    }
    alreadyAnswered = event.target;
    answer_selected_store[id]["selectedAnswer"] = alreadyAnswered.innerHTML;
    alreadyAnswered.classList.add('active');
}

function calcAndShowResult(){
    let score = 0;
    for (let ques_id in answer_selected_store){
        let quizQuest = quizData.find((q) => q["id"] === Number(ques_id));

        if (quizQuest){
            let correctAnswer = quizQuest["correct_answer"].trim().toLowerCase();
            let selectedAnswer = answer_selected_store[ques_id]["selectedAnswer"].trim().toLowerCase();

            if(correctAnswer === selectedAnswer ){
                score += 1;
            }
        }
    }

    quiz_ques_answer_tag.style.display = "none";
    quiz_result_tag.style.display = "flex";

    let score_percentage = Math.round((score*100)/quizData.length);

    scoreTag.innerText = String(score_percentage) + "%";
    scoreRingTag.style.strokeDashoffset = Math.round(314 - (score_percentage * 314)/100);
}

function resetState(){
    while(answerTag.firstChild){
        let child = answerTag.firstChild;
        answerTag.removeChild(child);
        child.remove();
    }
}

nextBtn.addEventListener("click", (event) => {

    currentQuestionIndex++;
    resetState();
    if(currentQuestionIndex < quizData.length){
        showQuestion();
    }
    else{
        calcAndShowResult();
    }
})

prvBtn.addEventListener("click", (event) => {

    currentQuestionIndex--;
    if(currentQuestionIndex >= 0){
        resetState();
        showQuestion();
    }
    else{
        currentQuestionIndex = 0;
    }
})

restartBtn.addEventListener("click", (event) => {
    quiz_ques_answer_tag.style.display = "block";
    quiz_result_tag.style.display = "none";
    startQuiz();
})

startQuizBtn.addEventListener("click", (event) => {
    quiz_ques_answer_tag.style.display = "block";
    startQuizTag.style.display = "none";
    startQuiz();
})

finishBtn.addEventListener("click", (event) => {
    quiz_ques_answer_tag.style.display = "none";
    quiz_result_tag.style.display = "none";
    startQuizTag.style.display = "block";

})