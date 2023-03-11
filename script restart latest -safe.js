// DOM: Constant Declarations //
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')

const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const welcomeText = document.getElementById('w-text')
const timeElement = document.getElementById('time')

let timeLeft = 60; // total time in seconds
let timerId; // define timerId here

function resetTimer() {

  // Clear any existing timers
  clearInterval(timerId);

  // Reset timer
  timeLeft = 60;
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}

let shuffledQuestions, currentQuestionIndex, score

let highScore = 0;
const highScoreElement = document.createElement('div');
highScoreElement.id = 'high-score';
highScoreElement.innerText = `Your high score: ${highScore}`;
questionContainerElement.appendChild(highScoreElement);


// HIDDEN: TIME
timeElement.classList.add('hide');

// HIDDEN: RESTART BUTTON
restartButton.classList.add('hide');

// BUTTONS: Event Listeners //
startButton.addEventListener('click', hideTexts)
startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})
restartButton.addEventListener('click', () => {
  restartGame();
});

// HIDDEN: WELCOME TEXT
function hideTexts() {
  welcomeText.classList.add('hide')
}

// -------------------------------------------- START GAME -------------------------------------------- //
  
function startGame() {
    timeElement.classList.remove('hide');
    score = 0
    highScore = 0
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  
  // RESET TIMER
  resetTimer();

  // SET THE FIRST QUESTION
  setNextQuestion()
  
   // Reset high score when the game is restarted
  highScore = 0;
  highScoreElement.innerText = `Your high score: ${highScore}`;

  // CLEAR ANY EXISTING TIMERS
  clearInterval(timerId);

  // RESET TIMER
  timeLeft = 60;

  // DISPLAY TIME LEFT
  timeElement.classList.remove('hide');
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}

// START THE TIMER when the user clicks the Start button
startButton.addEventListener('click', () => {
  startButton.classList.add('hide');
  startTimer();
});

// START THE TIMER
function startTimer() {
  timerId = setInterval(countdown, 1000);
}


// COUNTDOWN TIMER FUNCTION
function countdown() {
  timeLeft--;
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
  
  if (timeLeft === 0 || currentQuestionIndex >= shuffledQuestions.length) {
    clearInterval(timerId);
    timeElement.innerText = 'Time is up!';
    timeElement.classList.add('time-up');
    showFinalScore();

    // DISPLAY RESTART BUTTON 1
    restartButton.classList.remove('hide');
  }
}
  
// ----------------------------------------------------------------------------------------

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
  
  
    // DISPLAY RESTART BUTTON 2
    restartButton.classList.remove('hide');
}


// ------ RESTART GAME ------ //
function restartGame() {

  // HIDE RESTART BUTTON
  restartButton.classList.add('hide');
  
  // RESET HIGH SCORE WHEN THE GAME IS RESTARTED
  highScore = 0;
  highScoreElement.innerText = `Your high score: ${highScore}`;
  
  // RESET THE GAME STATE
  resetState();
  currentQuestionIndex = 0;
  score = 0;
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
 
 // START THE GAME
  startGame();

  // START THE TIMER
  startTimer();
}

restartButton.addEventListener('click', restartGame);


// -------- SET QUESTION -------- //
function setNextQuestion() {
    resetState()
    if (currentQuestionIndex >= shuffledQuestions.length) {
      nextButton.onclick = showFinalScore
      restartButton.classList.remove('hide');
    } else {
        showQuestion(shuffledQuestions[currentQuestionIndex])
  }
   // Show restart button if all questions have been answered
   if (currentQuestionIndex === shuffledQuestions.length - 1) {
    restartButton.classList.remove('hide');
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
      highScoreElement.innerText = `Your high score: ${score}`;
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
      nextButton.classList.remove('hide');
    } else {
      
      startButton.classList.add('hide');
      nextButton.innerText = 'Score Board'
      questionElement.innerText = 'Well done!';
      questionElement.classList.remove('hide');
      restartButton.classList.remove('hide');
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
    // {
    //     question: 'What part of the brain governs learning?',
    //     answers: [
    //     { text: 'Amygdala', correct: false },
    //     { text: 'Parietal Lobe', correct: false },
    //     { text: 'Frontal Lobe', correct: false },
    //     { text: 'Hippocampus', correct: true }
          
    //     ]
    // },
    // {
    //     question: 'What part of the brain governs reasoning?',
    //     answers: [
        
    //     { text: 'Amygdala', correct: false },
    //     { text: 'Frontal Lobe', correct: true },
    //     { text: 'Parietal Lobe', correct: false },
    //     { text: 'Hippocampus', correct: false }
          
    //     ]
    // },
    // {
    //     question: 'What part of the brain governs spatiality?',
    //     answers: [
    //       { text: 'Parietal Lobe', correct: true },
    //       { text: 'Amygdala', correct: false },
    //       { text: 'Frontal Lobe', correct: false },
    //       { text: 'Hippocampus', correct: false }
          
    //     ]
    // },
    // {
    //     question: 'What part of the brain governs language?',
    //     answers: [
    //       { text: 'Amygdala', correct: false },
    //       { text: 'Occipital Lobe', correct: false },
    //       { text: 'Parietal Lobe', correct: true },
    //       { text: 'Hippocampus', correct: false }
    //     ]
    // },
    // {
    //     question: 'What part of the brain governs sensation?',
    //     answers: [
    //       { text: 'Amygdala', correct: false },
    //       { text: 'Frontal Lobe', correct: false },
    //       { text: 'Hippocampus', correct: false },
    //       { text: 'Parietal Lobe', correct: true }
    //     ]
    // },
    // {
    //     question: 'What part of the brain governs the personality?',
    //     answers: [
          
    //       { text: 'Parietal Lobe', correct: false },
    //       { text: 'Frontal Lobe', correct: true },
    //       { text: 'Occipital Lobe', correct: false },
    //       { text: 'Amygdala', correct: false }
          
    //     ]
    // },

]


