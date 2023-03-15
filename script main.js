// DOM: Constant Declaratioquiz-answer-btnns //
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')
const welcomeText = document.getElementById('w-text')
const gameMessage = document.getElementById('game-message')
const quizContainerWrapper = document.getElementById('quiz-container-wrapper')
const quizContainer = document.getElementById('quiz-container')
const quizAnswerBtnsContainer = document.getElementById('quiz-answer-btns-container')
const timeElement = document.getElementById('timer-text')
const scoreBoardButton = document.getElementById('score-board-btn')
const scoreBoardContainer = document.getElementById('score-board-container')
const scoreBoardTable = document.getElementById('score-board-table')

let timeLeft = 1; 
let timerId; 
let shuffledQuestions, currentQuestionIndex
let currentScore = 0;
let highestScore = 0;
let answered = false;

// - CLEAR LOCAL STORAGE ------
// const clearStorageButton = document.createElement('button');
// clearStorageButton.id = 'clear-storage-btn';
// clearStorageButton.innerText = 'CLEAR STORAGE';
// clearStorageButton.addEventListener('click', () => {
//   console.log('Clicked: Cleared Local Storage');
//   localStorage.clear();
// });
// const clearContainer = document.getElementById('clear-storage-container');
// clearContainer.appendChild(clearStorageButton);


// - HIGHEST SCORE ELEMENT------
const highestScoreElement = document.createElement('div');
highestScoreElement.id = 'highest-score';
highestScoreElement.innerText = `Your highest score: ${highestScore}`;
quizContainerWrapper.appendChild(highestScoreElement);

// - CURRENT SCORE ------
const currentScoreText = document.createElement('div');
currentScoreText.id = 'current-score-container';
currentScoreText.innerText = `Your current score: ${currentScore}`;
quizContainerWrapper.appendChild(currentScoreText);

// - FINAL SCORE ------
const finalScoreText = document.getElementById('final-score')
finalScoreText.innerText = `Your final score: ${currentScore}`;

// INITIALLY HIDDEN //
finalScoreText.classList.add('hide');
highestScoreElement.classList.add('hide');
scoreBoardContainer.classList.add('hide');
scoreBoardContainer.classList.remove('show-flex');
timeElement.classList.add('hide');
restartButton.classList.add('hide');
gameMessage.classList.add('hide');
highestScoreElement.classList.add('hide');


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

// - EVENT LISTENERS ---------------------------- //

// --------------- BUTTONS: Event Listeners --------------- //
// ------------- SCORE BOARD --------------- //
scoreBoardButton.addEventListener('click', () => {
  console.log('Clicked: View Rankings');

  // SHOW: RANKINGS
  scoreBoardContainer.classList.add('show-flex');
  // HIDE: RANKINGS BUTTON
  scoreBoardButton.classList.add('hide');
  // HIDE: FINAL SCORE
  finalScoreText.classList.add('hide');
  // HIDE: QUIZ CONTAINER
  quizContainer.classList.add('hide');
  quizContainerWrapper.classList.add('hide');
  quizAnswerBtnsContainer.classList.add('hide');
  
  
  // RETRIEVE: the recorded scores from local storage
  const allRecordedScores = JSON.parse(localStorage.getItem('allRecordedScores')) || [];
  // RETRIEVE: the top 5 scores
  const highestScores = scoreBoard.getHighestScores();

  // CREATE: a new ScoreBoard object
  const scoreBoard = new ScoreBoard(allRecordedScores);
  // CREATE: a table to display the scores
  const scoreBoardTable = document.createElement('table');
  scoreBoardTable.id = 'score-board-table';
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
// --------------- START --------------- //
startButton.addEventListener('click', () => {
  console.log('Clicked: Start');
  hideTexts();
  startGame();
  startTimer();
  startButton.classList.add('hide');
  
});
// --------------- NEXT --------------- //
nextButton.addEventListener('click', () => {
  console.log('Clicked: Next');
  // IF; SHOW FINAL SCORE
  if (currentQuestionIndex >= shuffledQuestions.length) {
    showFinalScore();
  // ELSE; SET NEXT QUESTION
  } else {
    currentQuestionIndex++;
    setNextQuestion();
  }

  // CHECK: if all questions have been answered and disable the "Next" button if they have
  if (quizAnswerBtnsContainer.querySelectorAll('.quiz-answer-btn.selected').length === shuffledQuestions.length) {
    nextButton.classList.add('hide');
  }
});
// --------------- RESTART --------------- //
restartButton.addEventListener('click', () => {
  console.log('Clicked: Restart');
  restartGame();
  highestScoreElement.classList.add('hide');
  scoreBoardContainer.classList.remove('show-flex');
  scoreBoardContainer.classList.add('hide');
  scoreBoardButton.classList.add('hide');
  scoreBoardTable.classList.add('hide');
  scoreStorage.classList.add('hide');
  scoreStorageManager.classList.add('hide');
  gameMessage.classList.add('hide');
});


// ----- START GAME ----------------------------------------------------------------------------------- //

// - F 1 : START GAME ----------------------------------------------- //
function startGame() {
  console.log('Start game function called');

  // HIDE: FINAL SCORE
  finalScoreText.classList.add('hide');

  // HIDE: QUIZ
  quizContainer.classList.remove('hide');
  quizContainerWrapper.classList.remove('hide');
  quizAnswerBtnsContainer.classList.remove('hide');

  // RESET: SCORES 
  highestScore = 0
  currentScore = 0
  
  // ARRAY: SORT
  shuffledQuestions = questionsList.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  
  // RESET: TIMER
  resetTimer();

  // FUNCTION CALL: SET THE FIRST QUESTION
  setNextQuestion()
  
   // RESET: high score when the game is restarted
  highestScore = 0;

  // CLEAR: ANY EXISTING TIMERS
  clearInterval(timerId);

  // SHOW: TIME LEFT
  timeElement.classList.remove('hide');
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}
// - F 2 : HIDE TEXT ------------------------------------------------ //
function hideTexts() {
  welcomeText.classList.add('hide')
}
// - F 3 : START (TIMER) -------------------------------------------- //
function startTimer() {
  timerId = setInterval(countdown, 1000);
}
// - F 4 : COUNTDOWN (TIMER) ---------------------------------------- //
function countdown() {

  // --------- IF; ALL QUESTIONS HAVE BEEN ANSWERED ---------
  if (currentQuestionIndex >= shuffledQuestions.length) {
    // STOP: TIMER
    clearInterval(timerId);
    
    // HIDE: QUESTIONS
    quizContainerWrapper.classList.add('hide');

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
    timeElement.innerText = `Time Left: ${timeLeft} seconds`;
  }
}

// ----- SHOW QUESTIONS -------------------------------------------------------------------------------- //

// - F 5 : SHOW QUESTION -------------------------------------------- //
function showQuestion(question) { 
  quizContainer.innerText = question.question;
  question.answers.forEach(answer => {
    // VAR-DECL.: QUIZ ANSWER BUTTONS
    const quizAnswerBtn = document.createElement('button');
    quizAnswerBtn.innerText = answer.text;
    quizAnswerBtn.classList.add('quiz-answer-btn');
    // IF; CORRECT
    if (answer.correct) {
      quizAnswerBtn.dataset.correct = answer.correct;
    }
    quizAnswerBtn.addEventListener('click', () => {
      console.log('Clicked: Answers');
      selectAnswer(answer);
    });
    quizAnswerBtnsContainer.appendChild(quizAnswerBtn);
  })  
}
// - F 6 : SET THE NEXT QUESTION ------------------------------------ //
function setNextQuestion() {
  // RESET: STATE
  resetState();

  // IF; GAME FINISH
  if (currentQuestionIndex >= shuffledQuestions.length) {
    
    // STOP TIMER
    clearInterval(timerId);
    // MESSAGE: "GAME OVER"
    gameMessage.innerText = 'Game Over!';
    showFinalScore();

  // ELSE; GAME NOT FINISH = SET NEXT QUESTION
  } else {
    answered = false;
    showQuestion(shuffledQuestions[currentQuestionIndex]);

    // IF; LAST QUESTION = HIDE: NEXT BUTTON
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      nextButton.classList.add('hide');
    }
  }
}
// - F 7 : SELECT AN ANSWER ----------------------------------------- //
function selectAnswer(answer) {


  // CHECK: if the question has already been answered
  if (answered) { return; }
    
  // VAR-ASSIGN: answered to true
  answered = true;

  // SET: CORRECT/WRONG CLASS TO BODY
  setStatusClass(document.body, answer.correct);
  
  // SET: CORRECT/WRONG CLASS TO ANSWER BUTTONS
  Array.from(quizAnswerBtnsContainer.children).forEach(quizAnswerBtn => {
    setStatusClass(quizAnswerBtn, quizAnswerBtn.dataset.correct);
  });
  
// IF; CORRECT ANSWER: UPDATE SCORE AND HIGH SCORE ELEMENT
  if (answer.correct) {
    updateScores(true); 
    highestScoreElement.innerText = `Your highest score: ${currentScore}`;
  } else {
    updateScores(false);
  }
  
  // IF; MORE QUESTIONS = SHOW: NEXT BUTTON
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    
    // HIDDEN
    startButton.classList.add('hide');
    quizContainer.classList.add('hide');
    timeElement.classList.add('hide');

    // DISPLAY
    restartButton.classList.remove('hide');
    scoreBoardButton.classList.remove('hide');
    
    // TEXT
    restartButton.innerText = 'Restart'
    scoreBoardButton.innerText = 'View Rankings'
    gameMessage.innerText = 'Well done!';
    
    // HIDE CURRENT SCORE
    currentScoreText.classList.add('hide');

    // SHOW FINAL SCORE
    showFinalScore();
    
  }
  // DISABLE: all answer buttons
  Array.from(quizAnswerBtnsContainer.children).forEach(quizAnswerBtn => {
    quizAnswerBtn.disabled = true;
  });
}

// ----- UPDATE SCORES --------------------------------------------------------------------------------- //

// - F 8 : UPDATE LOCAL STORAGE ------------------------------------- //
function updateLocalStorage() {
  localStorage.setItem('allRecordedScores', JSON.stringify(scoreStorage));
}
// - F 9 : UPDATE SCORES -------------------------------------------- //
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
// - F 10 : UPDATE CURRENT SCORE ------------------------------------ //
function updateCurrentScore() {
  currentScore++
  currentScoreText.innerText = `Your current score: ${currentScore}`;
}
// - F 11 : UPDATE HIGHEST SCORE ------------------------------------ //
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
// - F 12 : SHOW FINAL SCORE ---------------------------------------- //
function showFinalScore() {
    
    // RESET: GAME STATE
    resetState();
  
    // SHOW: BUTTONS
    restartButton.classList.remove('hide');
    scoreBoardButton.classList.remove('hide');
  
    // SHOW SCORE: CURRENT AS FINAL SCORE
    finalScoreText.classList.remove('hide');
    finalScoreText.innerText = `Your final score: ${currentScore}`;
    
    // HIDDEN
    timeElement.classList.add('hide');
    quizContainerWrapper.classList.add('hide');
    nextButton.classList.add('hide');
    currentScoreText.classList.add('hide') 
  
    // REMOVE: CURRENT SCORE FROM LOCAL STORAGE
    localStorage.removeItem('currentScore');
   
}


// ----- RESTART GAME ---------------------------------------------------------------------------------- //

// - F 13 : RESTART GAME -------------------------------------------- //
function restartGame() {
  
  // HIDDEN
  gameMessage.classList.add('hide');
  restartButton.classList.add('hide');
  scoreBoardContainer.classList.add('hide');
  scoreBoardButton.classList.add('hide');
  scoreBoardTable.classList.add('hide');
  highestScoreElement.classList.add('hide'); 

  // RESET
  highestScore = 0;8
  currentQuestionIndex = 0;
  currentScore = 0;

  // SORT
  shuffledQuestions = questionsList.sort(() => Math.random() - 0.5);

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
  startTimer();
}
// - F 14 : RESET TIMER --------------------------------------------- //
function resetTimer() {

  // RESET
  clearInterval(timerId);
  timeLeft = 60;
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}
// - F 15 : RESET --------------------------------------------------- //
function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (quizAnswerBtnsContainer.firstChild) {
      quizAnswerBtnsContainer.removeChild(quizAnswerBtnsContainer.firstChild)
  }
}

// -------  ANSWER STATUS MANAGER ----------------------------------------------------------------------- //

// - F 16 : ANSWER STATUS MANAGER ----------------------------------- //
function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}
// - F 17 : CLEAR: ANSWER STATUS MANAGER ---------------------------- //
function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

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


