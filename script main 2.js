// DOM: Constant Declarations //
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')
const questionElement = document.getElementById('questions-container')

const questionContainerElement = document.getElementById('question-visibility-container')
const questionAnswerContainer = document.getElementById('question-answer-container')
const welcomeText = document.getElementById('w-text')
const timeElement = document.getElementById('time')

let timeLeft = 60; // total time in seconds
let timerId; // define timerId here


let shuffledQuestions, currentQuestionIndex, score

let highScore = 0;
const currentHighScoreElement = document.createElement('div');
currentHighScoreElement.id = 'high-score';
currentHighScoreElement.innerText = `Your high score: ${highScore}`;
questionContainerElement.appendChild(currentHighScoreElement);



// - FUNCTION : RESET TIMER -------------------------------------------- //
function resetTimer() {
  // Clear any existing timers
  clearInterval(timerId);

  // Reset timer
  timeLeft = 60;
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}

// HIDDEN: TIME
// scoreBoardPage.classList.add('hide');


// HIDDEN: TIME
timeElement.classList.add('hide');

// HIDDEN: RESTART BUTTON
restartButton.classList.add('hide');

// BUTTONS: Event Listeners //

startButton.addEventListener('click', hideTexts)
startButton.addEventListener('click', startGame)

nextButton.addEventListener('click', () => {
  if (currentQuestionIndex >= shuffledQuestions.length) {
    showFinalScore();
} else {
    currentQuestionIndex++;
    setNextQuestion();
}
})
restartButton.addEventListener('click', () => {
  restartGame();
  currentHighScoreElement.classList.add('hide');
});

// START THE TIMER when the user clicks the Start button
startButton.addEventListener('click', () => {
  startButton.classList.add('hide');
  startTimer();
});


// - FUNCTION : HIDE TEXT -------------------------------------------- //
function hideTexts() {
  welcomeText.classList.add('hide')
}

// - FUNCTION : START GAME -------------------------------------------- //
function startGame() {
    timeElement.classList.remove('hide');
    score = 0
    highScore = 0
    shuffledQuestions = questionsList.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  
  // RESET TIMER
  resetTimer();

  // SET THE FIRST QUESTION
  setNextQuestion()
  
   // Reset high score when the game is restarted
  highScore = 0;
  currentHighScoreElement.innerText = `Your high score: ${highScore}`;

  // CLEAR ANY EXISTING TIMERS
  clearInterval(timerId);

  // RESET TIMER
  timeLeft = 60;

  // DISPLAY TIME LEFT
  timeElement.classList.remove('hide');
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}



// - FUNCTION : START (TIMER) -------------------------------------------- //
function startTimer() {
  timerId = setInterval(countdown, 1000);
}


// - FUNCTION : COUNTDOWN (TIMER) -------------------------------------------- //
function countdown() {
  timeLeft--;
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
  
  if (timeLeft === 0 || currentQuestionIndex >= shuffledQuestions.length) {
    clearInterval(timerId);
    timeElement.innerText = 'Time is up!';
    timeElement.classList.add('time-up');
    showFinalScore();

  // Show restart button if all questions have been answered
  restartButton.classList.remove('hide');
} else if (currentQuestionIndex === shuffledQuestions.length - 1) {
  nextButton.innerText = 'Score Board';
}
}
  
// ----------------------------------------------------------------------------------------

// - FUNCTION : UPDATE SCORE -------------------------------------------- //
function updateScore() {
    score++
}

// - FUNCTION : SHOW FINAL SCORE -------------------------------------------- //
function showFinalScore() {
    const finalScoreElement = document.createElement('div')
    finalScoreElement.classList.add('highscore-container');
    finalScoreElement.innerText = `Your final score: ${score}`
    questionContainerElement.innerHTML = ''
    questionContainerElement.appendChild(finalScoreElement)
  
    // Stop the timer when the game is finished
    clearInterval(timerId);
  
    // DISPLAY RESTART BUTTON 
    restartButton.classList.remove('hide');
}


// ------ RESTART GAME ------ //
function restartGame() {

  // HIDE RESTART BUTTON
  restartButton.classList.add('hide');

  // HIDE HIGH SCORE ELEMENT
  currentHighScoreElement.classList.add('hide'); 
  
  // RESET HIGH SCORE WHEN THE GAME IS RESTARTED
  highScore = 0;
  currentHighScoreElement.innerText = `Your high score: ${highScore}`;
  
  // RESET THE GAME STATE
  resetState();
  currentQuestionIndex = 0;
  score = 0;
  shuffledQuestions = questionsList.sort(() => Math.random() - 0.5);
 


 // START THE GAME
  startGame();

  // START THE TIMER
  startTimer();
}

restartButton.addEventListener('click', restartGame);


// -------- SET QUESTION -------- //
function setNextQuestion() {
  // Category 1: Reset state
  resetState();

  // Category 2: Check if the game is finished
  if (currentQuestionIndex >= shuffledQuestions.length) {
    showFinalScore();
    restartButton.classList.remove('hide');

    // Category 3: Hide next button if game is finished
    nextButton.classList.add('hide');
  } 
  // Category 4: If game is not finished, show the next question
  else {
    showQuestion(shuffledQuestions[currentQuestionIndex]);

    // Category 5: If it's the last question, change next button text to "Score Board"
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      nextButton.innerText = 'Score Board';
    }
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
      questionAnswerContainer.appendChild(button);
    })  
}

// RESET //
function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (questionAnswerContainer.firstChild) {
      questionAnswerContainer.removeChild(questionAnswerContainer.firstChild)
    }
}

// SELECT AN ANSWER //
function selectAnswer(answer) {

  // SET CORRECT/WRONG CLASS TO BODY
  setStatusClass(document.body, answer.correct);
  
  // SET CORRECT/WRONG CLASS TO ANSWER BUTTONS
  Array.from(questionAnswerContainer.children).forEach(button => {
    setStatusClass(button, button.dataset.correct);
  });
  
  // UPDATE SCORE AND HIGH SCORE ELEMENT
  if (answer.correct) {
    updateScore();
    currentHighScoreElement.innerText = `Your high score: ${score}`;
  }
  
  // SHOW NEXT BUTTON IF THERE ARE MORE QUESTIONS, OR SHOW WELL-DONE MESSAGE AND RESTART BUTTON IF THERE ARE NO MORE QUESTIONS
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    startButton.classList.add('hide');
    restartButton.innerText = 'Restart?'
    questionElement.innerText = 'Well done!';
    questionElement.classList.remove('hide');
    restartButton.classList.remove('hide');
  }
  
  // SET NEXT BUTTON TEXT TO "NEXT" AND SHOW NEXT BUTTON
  nextButton.innerText = 'Next';
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
const questionsList = [
    {
      question: 'What part of the brain governs vision?',
      answers: [
        { text: 'Amygdala', correct: false },
        { text: 'Occipital Lobe', correct: true },
        { text: 'Hippocampus', correct: false },
        { text: 'Temporal Lobe', correct: false }
      ]
    },
    {
      question: 'What part of the brain governs hearing?',
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


