// DOM: Constant Declarations //
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const welcomeText = document.getElementById('w-text')

let time = document.querySelector("#time");

let timer = 0;
let interval = 0;

//Creating Timer For Quiz Timer Section

let countDown = () => {
  if (timer === 20) {
      clearInterval(interval);
      nextButton.click();
  } else {
      timer++;
      time.innerText = timer;
  }
}

let shuffledQuestions, currentQuestionIndex, score


let highScore = 0;
const highScoreElement = document.createElement('div');
highScoreElement.id = 'high-score';
highScoreElement.innerText = `Your high score: ${highScore}`;
questionContainerElement.appendChild(highScoreElement);

function updateHighScore(score) {
  if (score > highScore) {
    highScore = score;
    highScoreElement.innerText = `Your high score: ${highScore}`;
  }
}

// BUTTONS: Event Listeners //
startButton.addEventListener('click', hideTexts)
startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

// TEXT: Hide on Start //
function hideTexts() {
    welcomeText.classList.add('hide')
}


// ---------------------- START GAME ---------------------- //
function startGame() {
  interval = setInterval(countDown, 1000);
    startButton.classList.add('hide')
    score = 0 // Reset score
    highScore = 0 // Reset high score
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerElement.classList.remove('hide')
  setNextQuestion()
  timer = 0;
   // Reset high score when the game is restarted
  highScore = 0;
  highScoreElement.innerText = `Your high score: ${highScore}`;
}

// ------ UPDATE SCORE ------ //
function updateScore() {
    score++
}

// ------ SHOW SCORE ------ //
function showFinalScore() {
    const scoreElement = document.createElement('div')
    scoreElement.classList.add('highscore-container');

  scoreElement.innerText = `Your final score: ${score}`
    questionContainerElement.innerHTML = ''
    questionContainerElement.appendChild(scoreElement)
}

// -------- SET QUESTION -------- //
function setNextQuestion() {
    resetState()
    if (currentQuestionIndex >= shuffledQuestions.length) {
        nextButton.onclick = showFinalScore
    } else {
        showQuestion(shuffledQuestions[currentQuestionIndex])
    }
}

// -------- SHOW QUESTION -------- //
function showQuestion(question) { 
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
      const button = document.createElement('button');
      button.innerText = answer.text;
      button.classList.add('btn');
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener('click', () => {
        selectAnswer(answer);
      });
      answerButtonsElement.appendChild(button);
    })  
  }

// RESET //
function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}


// SELECT AN ANSWER //
function selectAnswer(answer) {
    setStatusClass(document.body, answer.correct);
    Array.from(answerButtonsElement.children).forEach(button => {
      setStatusClass(button, button.dataset.correct);
    });
    if (answer.correct) {
        updateScore();
        updateHighScore(score);
      highScoreElement.innerText = `Your high score: ${score}`;
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
      nextButton.classList.remove('hide');
    } else {
      startButton.innerText = 'Restart';
      startButton.classList.remove('hide');
      nextButton.innerText = 'Score Board'
      questionElement.innerText = 'Well done!';
      questionElement.classList.remove('hide');
    }
    nextButton.classList.remove('hide');
  }

// "CORRECT / WRONG" //
function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}
// CLEAR -> "CORRECT / WRONG" //
function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

// QUESTIONS (x9) //
const questions = [
    {
      question: 'What part of the brain governs the vision?',
      answers: [
        { text: 'Amygdala', correct: false },
        { text: 'Occipital Lobe', correct: true },
        { text: 'Hippocampus', correct: false },
        { text: 'Temporal Lobe', correct: false }
      ]
    },
    {
      question: 'What part of the brain governs the hearing?',
      answers: [
        
        { text: 'Amygdala', correct: false },
        { text: 'Hippocampus', correct: false },
        { text: 'Temporal Lobe', correct: true },
        { text: 'Frontal Lobe', correct: false }
      ]
    },
    {
      question: 'What part of the brain governs the emotions?',
      answers: [
        
        { text: 'Parietal Lobe', correct: false },
        { text: 'Amygdala', correct: true },
        { text: 'Hippocampus', correct: false },
        { text: 'Frontal Lobe', correct: false }
        
      ]
     },
    {
        question: 'What part of the brain governs learning?',
        answers: [
        { text: 'Amygdala', correct: false },
        { text: 'Parietal Lobe', correct: false },
        { text: 'Frontal Lobe', correct: false },
        { text: 'Hippocampus', correct: true }
          
        ]
    },
    {
        question: 'What part of the brain governs reasoning?',
        answers: [
        
        { text: 'Amygdala', correct: false },
        { text: 'Frontal Lobe', correct: true },
        { text: 'Parietal Lobe', correct: false },
        { text: 'Hippocampus', correct: false }
          
        ]
    },
    {
        question: 'What part of the brain governs spatiality?',
        answers: [
          { text: 'Parietal Lobe', correct: true },
          { text: 'Amygdala', correct: false },
          { text: 'Frontal Lobe', correct: false },
          { text: 'Hippocampus', correct: false }
          
        ]
    },
    {
        question: 'What part of the brain governs language?',
        answers: [
          { text: 'Amygdala', correct: false },
          { text: 'Occipital Lobe', correct: false },
          { text: 'Parietal Lobe', correct: true },
          { text: 'Hippocampus', correct: false }
        ]
    },
    {
        question: 'What part of the brain governs sensation?',
        answers: [
          { text: 'Amygdala', correct: false },
          { text: 'Frontal Lobe', correct: false },
          { text: 'Hippocampus', correct: false },
          { text: 'Parietal Lobe', correct: true }
        ]
    },
    {
        question: 'What part of the brain governs the personality?',
        answers: [
          
          { text: 'Parietal Lobe', correct: false },
          { text: 'Frontal Lobe', correct: true },
          { text: 'Occipital Lobe', correct: false },
          { text: 'Amygdala', correct: false }
          
        ]
    },

]


