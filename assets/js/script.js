// -------- QUESTIONS -------- //
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

// DOM: Constant Declarations //
const nextButton = document.getElementById('next-btn')
const startButton = document.getElementById('start-btn')
const restartButton = document.getElementById('restart-btn')
const scoreBoardButton = document.getElementById('score-board-btn')

const gameTimer = setClass('.game-timer')
const gameMessage = setClass('.game-message')

const scoreBoardTable = setClass('.score-board-table')
const scoreBoardContainer = setClass('.score-board-container')

const quizSection = setClass('.quiz-section')
const quizSectionContainer = setClass('.quiz-section-container')
const quizAnswerBtnsContainer = setClass('.quiz-answer-btns-container')

let timeLeft = 1; 
let timerId; 
let randomizedQuestions, currentQuestionIndex
let currentScore = 0;
let highestScore = 0;
let questionAnswered = false;

// - HIGHEST SCORE ELEMENT------
const highestScoreElement = document.createElement('div');
highestScoreElement.classList.add('highest-score');
highestScoreElement.innerText = `Your highest score: ${highestScore}`;
quizSectionContainer.appendChild(highestScoreElement);

// - CURRENT SCORE ------
const currentScoreText = setClass('.current-score');
currentScoreText.innerText = `Your current score: ${currentScore}`;
quizSectionContainer.appendChild(currentScoreText);

// - FINAL SCORE ------
const finalScoreText = setClass('.final-score')
finalScoreText.innerText = `Your final score: ${currentScore}`;


// INITIALLY HIDDEN //
gameTimer.classList.add('hide');
restartButton.classList.add('hide');
finalScoreText.classList.add('hide');
gameMessage.classList.remove('hide');
startButton.classList.remove('hide');
highestScoreElement.classList.add('hide');
scoreBoardContainer.classList.add('hide');
quizSectionContainer.classList.add('hide');
scoreBoardContainer.classList.remove('show-flex');



// -- SCORE STORAGE MANAGER ------------------------------------------------------ //
class ScoreBoard {
  constructor(allRecordedScores) {
  // Retrieve saved scores from local storage
  this.allRecordedScores = allRecordedScores || [];
  }
  getHighestScores() {
    const highestScores = [...this.allRecordedScores].sort((a, b) => b - a).slice(0, 5);
    return highestScores;
  }
  addScore(currentScore) {
    if (currentScore > 0) {
      let scoreStorage = JSON.parse(localStorage.getItem('allRecordedScores')) || [];
      
      // CHECK IF THE CURRENT SCORE IS HIGHER THAN THE RECORDED SCORES
      if (scoreStorage.length < 5 || currentScore > scoreStorage[scoreStorage.length - 1]) {
        
        // PUSH: THE CURRENT SCORE TO THE RECORDED SCORES ARRAY
        scoreStorage.push(currentScore);
        
        // SORT: THE RECORDED SCORES ARRAY IN DESCENDING ORDER
        scoreStorage.sort((a, b) => b - a);
        
        // REMOVE: ANY EXTRA SCORES BEYOND THE TOP 5
        scoreStorage = scoreStorage.slice(0, 5);
        
        // SAVE: THE UPDATED SCORES ARRAY TO LOCAL STORAGE
        localStorage.setItem('allRecordedScores', JSON.stringify(scoreStorage));
      }
    }
  }
}
const scoreStorage = JSON.parse(localStorage.getItem('allRecordedScores')) || [];
const scoreStorageManager = new ScoreBoard();

// - EVENT LISTENER: SCORE BOARD ---------------------------- //

scoreBoardButton.addEventListener('click', () => {
  console.log('Clicked: View Rankings');

 // SHOWN
 scoreBoardContainer.classList.add('show-flex');
 highestScoreElement.classList.remove('hide'); 

 // HIDDEN
 gameMessage.classList.add('hide');
 finalScoreText.classList.add('hide');
 scoreBoardButton.classList.add('hide');
 quizSection.classList.add('hide');
 quizSectionContainer.classList.add('hide');
 quizAnswerBtnsContainer.classList.add('hide');
  
// RETRIEVE: the recorded scores from local storage
const allRecordedScores = JSON.parse(localStorage.getItem('allRecordedScores')) || [];

// CREATE: a new ScoreBoard object
const scoreBoard = new ScoreBoard(allRecordedScores);
  
// RETRIEVE: the top 5 scores
const highestScores = scoreBoard.getHighestScores();
  
// CREATE: a table to display the scores
const scoreBoardTable = document.createElement('table');
scoreBoardTable.classList.add('score-board-table');
scoreBoardTable.innerHTML = '';
const headerRow = scoreBoardTable.insertRow();
const headerCell1 = headerRow.insertCell();
const headerCell2 = headerRow.insertCell();
headerCell1.innerText = 'Rank';
headerCell2.innerText = 'Score';

// ADD: EACH SCORE TO THE TABLE
highestScores.forEach((iteratedScore, scoreIndex) => {
const row = scoreBoardTable.insertRow();
const cell1 = row.insertCell();
const cell2 = row.insertCell();
cell1.innerText = scoreIndex + 1;
cell2.innerText = iteratedScore;
  
});

  // CLEAR: any existing contents of the score board container and add the table
  scoreBoardContainer.innerHTML = '';
  scoreBoardContainer.appendChild(scoreBoardTable);
});


// --------- FUNCTIONS START HERE --------- //


// - F 1 : QUERY SELECTORS (CLASSES) ----------------------------------------------- //
function setClass(selector) {
  return document.querySelector(selector);
}

// - F 2 : SETUP EVENT LISTENERS ----------------------------------------------- //
(function setEventListener() {
  startButton.addEventListener('click', startGame);
  nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
  });
  restartButton.addEventListener('click', restartGame);
})();


// - F 3 : PLAY SOUND ----------------------------------------------- //
function playSound(correct) {
  const audio = new Audio();
  audio.src = correct ? 'assets/audio/correct_answer.wav' : 'assets/audio/wrong_answer.wav';
  audio.play();
}
// - F 4 : QUIZ ANSWER CLICK ----------------------------------------------- //
function onAnswerClick(answer) {
  console.log('Clicked: Answers');
  selectAnswer(answer);
}

// - F 5 : START GAME ----------------------------------------------- //
function startGame() {
  console.log('Start game function called');

  // HIDDEN
  gameMessage.classList.add('hide');
  finalScoreText.classList.add('hide');
  startButton.classList.add('hide');

  // SHOWN
  quizAnswerBtnsContainer.classList.remove('hide');
  quizSectionContainer.classList.remove('hide');
  quizSection.classList.remove('hide');

  currentScoreText.classList.remove('hide');
  gameTimer.classList.remove('hide');
  gameTimer.innerText = `Time Left: ${timeLeft} seconds`;

  // RESET
  highestScore = 0
  currentScore = 0
  clearInterval(timerId);
  currentQuestionIndex = 0
  
  // SORT
  randomizedQuestions = questionsList.sort(() => Math.random() - .5)
  
  // FUNCTION CALLS
  resetTimer();
  startTimer();
  setNextQuestion();

}
// - F 6 : START (TIMER) -------------------------------------------- //
function startTimer() {
  timerId = setInterval(countdown, 1000);
}
// - F 7 : COUNTDOWN (TIMER) ---------------------------------------- //
function countdown() {

  // --------- IF; ALL QUESTIONS HAVE BEEN ANSWERED ---------
  if (currentQuestionIndex >= randomizedQuestions.length) {
    // STOP: TIMER
    clearInterval(timerId);
    
    // HIDE: QUESTIONS
    quizSectionContainer.classList.add('hide');

    // MESSAGE: "GAME OVER"
    gameMessage.innerText = 'Game Over!';

    // HIDE: FINAL SCORE
    showFinalScore();

    // HIDE: RESTART BUTTON
    restartButton.classList.remove('hide');
  } 
  // --------- IF; TIME IS UP ---------
  else if (timeLeft === 0) {
    
    // STOP: TIMER
    clearInterval(timerId);

    // MESSAGE: "TIME IS UP" 
    gameMessage.innerText = 'Time is up!';

    // FUNCTION CALL: FINAL SCORE
    showFinalScore();
  
  } 
  // --------- IF; THERE IS STILL TIME LEFT ---------
  else {
    
    // DECREMENT: TIME LEFT
    timeLeft--;

    // SHOW: TIME LEFT
    gameTimer.innerText = `Time Left: ${timeLeft} seconds`;
  }
}
// - F 8 : SHOW QUESTION -------------------------------------------- //
function showQuestion(question) { 

  const quizQuestionText = document.createElement('span');
  quizQuestionText.classList.add('quizQuestionText');
  quizQuestionText.innerText = question.question;

  // Append the question text span element to the quizSection
  quizSection.innerHTML = ''; // Clear the previous content
  quizSection.appendChild(quizQuestionText);

  question.answers.forEach(answer => {

    // VAR-DECL.: QUIZ ANSWER BUTTONS
    const quizAnswerBtn = document.createElement('button');
    quizAnswerBtn.classList.add('quiz-answer-btn');

    quizSection.appendChild(quizAnswerBtnsContainer);
  
  // Add a span element to wrap the text inside the button
  const quizAnswerBtnText = document.createElement('span');
  quizAnswerBtnText.innerText = answer.text;
  quizAnswerBtnText.classList.add('quiz-answer-btn-text');
    
    quizAnswerBtn.appendChild(quizAnswerBtnText);

    // IF; CORRECT
    if (answer.correct) {
      quizAnswerBtn.dataset.correct = answer.correct;
    }
    quizAnswerBtn.addEventListener('click', () => onAnswerClick(answer));
    quizAnswerBtnsContainer.appendChild(quizAnswerBtn);
  })  
}
// - F 9 : SET THE NEXT QUESTION ------------------------------------ //
function setNextQuestion() {
  // RESET: STATE
  resetState();

  // IF; GAME FINISH
  if (currentQuestionIndex >= randomizedQuestions.length) {
    
    // STOP TIMER
    clearInterval(timerId);
    // MESSAGE: "GAME OVER"
    gameMessage.innerText = 'Game Over!';
    showFinalScore();

  // ELSE; GAME NOT FINISH = SET NEXT QUESTION
  } else {
    questionAnswered = false;
    showQuestion(randomizedQuestions[currentQuestionIndex]);

    // IF; LAST QUESTION = HIDE: NEXT BUTTON
    if (currentQuestionIndex === randomizedQuestions.length - 1) {
      nextButton.classList.add('hide');
    }
  }
}
// - F 10 : SELECT AN ANSWER ----------------------------------------- //
function selectAnswer(answer) {
  if (questionAnswered) return;

  questionAnswered = true;
  playSound(answer.correct);
  setStatusClass(document.body, answer.correct);
  setAnswerButtonStatusClasses(answer.correct);

  if (answer.correct) {
    updateScores(true);
    highestScoreElement.innerText = `Your highest score: ${currentScore}`;
  } else {
    updateScores(false);
  }

  if (randomizedQuestions.length > currentQuestionIndex + 1) {
    showNextButton();
  } else {
    endGame();
  }

  disableAnswerButtons();
}

function setAnswerButtonStatusClasses(correct) {
  Array.from(quizAnswerBtnsContainer.children).forEach(quizAnswerBtn => {
    setStatusClass(quizAnswerBtn, correct === (quizAnswerBtn.dataset.correct === 'true'));
  });
}


function showNextButton() {
  nextButton.classList.remove('hide');
}

function endGame() {
  startButton.classList.add('hide');
  gameTimer.classList.add('hide');
  currentScoreText.classList.add('hide');
  quizSectionContainer.classList.add('hide');
  restartButton.classList.remove('hide');
  scoreBoardContainer.classList.add('hide');
  scoreBoardButton.classList.add('hide');
  scoreBoardTable.classList.add('hide');
  gameMessage.classList.remove('hide');

  restartButton.innerText = 'Restart';
  scoreBoardButton.innerText = 'View Rankings';
  gameMessage.innerText = 'Well done!';

  showFinalScore();
}

function disableAnswerButtons() {
  Array.from(quizAnswerBtnsContainer.children).forEach(quizAnswerBtn => {
    quizAnswerBtn.disabled = true;
  });
}




// - F 11 : UPDATE LOCAL STORAGE ------------------------------------- //
function updateLocalStorage() {
  localStorage.setItem('allRecordedScores', JSON.stringify(scoreStorage));
}
// - F 12 : UPDATE SCORES -------------------------------------------- //
function updateScores(correct) {
  if (correct) {
    updateCurrentScore();
    updateHighestScore(currentScore);
  } else {
    updateHighestScore(currentScore);
  }
  // SHOW: CURRENT SCORE AS FINAL SHOW 
  finalScoreText.innerText = `Your final score: ${currentScore}`;
}
// - F 13 : UPDATE CURRENT SCORE ------------------------------------ //
function updateCurrentScore() {
  currentScore++
  currentScoreText.innerText = `Your current score: ${currentScore}`;
}
// - F 14 : UPDATE HIGHEST SCORE ------------------------------------ //
function updateHighestScore(currentScore) {
  if (currentScore > highestScore) {
    highestScore = currentScore;

    // ADD THE HIGHEST SCORE TO THE SCOREBOARD AND UPDATE LOCAL STORAGE
    scoreStorageManager.addScore(highestScore);
    updateLocalStorage();

    // UPDATE THE HIGHEST SCORE ELEMENT
    // highestScoreElement.innerText = `Your high score: ${highestScore}`;

    // ADD CURRENT SCORE TO RECORDED SCORES ARRAY AND UPDATE HIGH SCORE ELEMENT
    scoreStorageManager.addScore(currentScore);
    highestScoreElement.innerText = `Your highest score: ${scoreStorageManager.getHighestScores()[0] || 0}`;
    // SAVE THE HIGH SCORE TO LOCAL STORAGE
    localStorage.setItem('currentScore', currentScore);
  }
}
// - F 15 : SHOW FINAL SCORE ---------------------------------------- //
function showFinalScore() {
    
    // SHOWN
    restartButton.classList.remove('hide');
  scoreBoardButton.classList.remove('hide');
  
    // SHOW SCORE: CURRENT AS FINAL SCORE
    finalScoreText.classList.remove('hide');
    finalScoreText.innerText = `Your final score: ${currentScore}`;
    
    // HIDDEN
    // quizSectionContainer.classList.add('hide');
    gameTimer.classList.add('hide');
    nextButton.classList.add('hide');
    currentScoreText.classList.add('hide') 
  
  
    // RESET: GAME STATE
    resetState();

    // REMOVE: CURRENT SCORE FROM LOCAL STORAGE
    localStorage.removeItem('currentScore');
   
}
// - F 16 : RESTART GAME -------------------------------------------- //
function restartGame() {
  
  // HIDDEN
  gameMessage.classList.add('hide');
  scoreBoardTable.classList.add('hide');
  scoreBoardButton.classList.add('hide');
  highestScoreElement.classList.add('hide');
  scoreBoardContainer.classList.add('hide');
  scoreBoardContainer.classList.remove('show-flex');
  restartButton.classList.add('hide');

  
  // RESET
  highestScore = 0;
  currentQuestionIndex = 0;
  currentScore = 0;

  // Update the currentScoreText element here
  currentScoreText.innerText = `Your current score: ${currentScore}`;

  // SORT
  randomizedQuestions = questionsList.sort(() => Math.random() - 0.5);

  // RETRIEVE SCORE: FROM LOCAL STORAGE
  const storedHighestScore = localStorage.getItem('highestScore');
  if (storedHighestScore !== null) {
  highestScore = parseInt(storedHighestScore);
  highestScoreElement.innerText = `Your highest score: ${highestScore}`;
  }
  // REMOVE SCORE: FROM LOCAL STORAGE
  localStorage.removeItem('currentScore');

  // FUNCTION CALLS
  resetState();
  startGame();

}
// - F 17 : RESET TIMER --------------------------------------------- //
function resetTimer() {

  // RESET
  clearInterval(timerId);
  timeLeft = 2000;
  gameTimer.innerText = `Time Left: ${timeLeft} seconds`;
}
// - F 18 : RESET --------------------------------------------------- //
function resetState() {
    clearStatusClass(document.body)
  nextButton.classList.add('hide')
  
    while (quizAnswerBtnsContainer.firstChild) {
      quizAnswerBtnsContainer.removeChild(quizAnswerBtnsContainer.firstChild)
  }
}
// - F 19 : ANSWER STATUS MANAGER ----------------------------------- //
function setStatusClass(element, correct) {
  clearStatusClass(element);
 
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}
// - F 20 : CLEAR: ANSWER STATUS MANAGER ---------------------------- //
function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}



