// DOM: Constant Declarations //
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')
const welcomeText = document.getElementById('w-text')
const questionContainerElement = document.getElementById('question-visibility-container')
const questionsElement = document.getElementById('questions-container')
const questionAnswerContainer = document.getElementById('question-answer-btns-container')
const timeElement = document.getElementById('timer-text')
const scoreBoardButton = document.getElementById('score-board-btn')
const scoreBoardContainer = document.getElementById('score-board-container')
const scoreBoardTable = document.getElementById('score-board-table')

const gameMessage = document.getElementById('game-message')


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
highestScoreElement.innerText = `Your high score: ${highestScore}`;
questionContainerElement.appendChild(highestScoreElement);

// - CURRENT SCORE ELEMENT------
const currentScoreElement = document.createElement('div');
currentScoreElement.id = 'current-score-container';
currentScoreElement.innerText = `Your current score: ${currentScore}`;
questionContainerElement.appendChild(currentScoreElement);

// - FINAL SCORE ELEMENT------
const finalScoreElement = document.getElementById('final-score')
finalScoreElement.innerText = `Your final score: ${currentScore}`;

// INITIALLY HIDDEN //
finalScoreElement.classList.add('hide');
highestScoreElement.classList.add('hide');
scoreBoardContainer.classList.add('hide');
timeElement.classList.add('hide');
restartButton.classList.add('hide');
gameMessage.classList.add('hide');

// -- SCOREBOARD & SCORE STORAGE MANAGER -------------------------------------------- //
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


// --------------- BUTTONS: Event Listeners --------------- //
// --------------- BUTTON: Score Board --------------- //
scoreBoardButton.addEventListener('click', () => {
  console.log('Clicked: View Rankings');

  // SHOW RANKINGS
  scoreBoardContainer.classList.add('show-flex');
  // HIDE RANKINGS BUTTON
  scoreBoardButton.classList.add('hide');

  // HIDE QUESTION CONTAINER
  questionsElement.classList.add('hide');
  questionContainerElement.classList.add('hide');
  questionAnswerContainer.classList.add('hide');
  
  
  // Get the recorded scores from local storage
  const allRecordedScores = JSON.parse(localStorage.getItem('allRecordedScores')) || [];

  // Create a new ScoreBoard object
  const scoreBoard = new ScoreBoard(allRecordedScores);

  // Get the top 5 scores
  const highestScores = scoreBoard.getHighestScores();

  // Create a table to display the scores
  const scoreBoardTable = document.createElement('table');
  scoreBoardTable.id = 'score-board-table';
  scoreBoardTable.innerHTML = '';
  const headerRow = scoreBoardTable.insertRow();
  const headerCell1 = headerRow.insertCell();
  const headerCell2 = headerRow.insertCell();
  headerCell1.innerText = 'Rank';
  headerCell2.innerText = 'Score';

  // ADD EACH SCORE TO THE TABLE
  highestScores.forEach((iteratedScore, scoreIndex) => {
    const row = scoreBoardTable.insertRow();
    const cell1 = row.insertCell();
    const cell2 = row.insertCell();
    cell1.innerText = scoreIndex + 1;
    cell2.innerText = iteratedScore;
  });

  // Clear any existing contents of the score board container and add the table
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
  gameMessage.classList.remove('hide');
});
// --------------- NEXT --------------- //
nextButton.addEventListener('click', () => {
  console.log('Clicked: Next');
  if (currentQuestionIndex >= shuffledQuestions.length) {
    showFinalScore();
  } else {
    currentQuestionIndex++;
    setNextQuestion();
  }

  // Check if all questions have been answered and disable the "Next" button if they have
  if (questionAnswerContainer.querySelectorAll('.question-answer-btn.selected').length === shuffledQuestions.length) {
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


// - F 1 : HIDE TEXT -------------------------------------------- //
function hideTexts() {
  welcomeText.classList.add('hide')
}

// - F 2 : START GAME -------------------------------------------- //
function startGame() {
  console.log('Start game function called');

  finalScoreElement.classList.add('hide');


  questionsElement.classList.remove('hide');
  questionContainerElement.classList.remove('hide');
  questionAnswerContainer.classList.remove('hide');
  
  highestScore = 0
  currentScore = 0
  
  shuffledQuestions = questionsList.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  
  // RESET TIMER
  resetTimer();

  // SET THE FIRST QUESTION
  setNextQuestion()
  
   // Reset high score when the game is restarted
  highestScore = 0;
  // highestScoreElement.innerText = `Your high score: ${highestScore}`;

  // CLEAR ANY EXISTING TIMERS
  clearInterval(timerId);

  // DISPLAY TIME LEFT
  timeElement.classList.remove('hide');
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}

// - F 3 : START (TIMER) -------------------------------------------- //
function startTimer() {
  timerId = setInterval(countdown, 1000);
}

// - FUNCTION : RESET TIMER -------------------------------------------- //
function resetTimer() {
  // CLEAR ANY EXISTING TIMERS
  clearInterval(timerId);
  // RESET TIMER
  timeLeft = 1;
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}

// - F 4 : COUNTDOWN (TIMER) -------------------------------------------- //
function countdown() {

  // --------- IF ALL QUESTIONS HAVE BEEN ANSWERED ---------
  if (currentQuestionIndex >= shuffledQuestions.length) {
    // STOP: TIMER
    clearInterval(timerId);
    
    // HIDDEN: QUESTIONS
    questionContainerElement.classList.add('hide');

    // MESSAGE: "GAME OVER"
    gameMessage.innerText = 'Game is over!';

    // DISPLAY: FINAL SCORE
    showFinalScore();

    // DISPLAY: RESTART BUTTON
    restartButton.classList.remove('hide');
  } 
  // --------- IF TIME IS UP ---------
  else if (timeLeft === 0) {
    // STOP: TIMER
    clearInterval(timerId);

    // MESSAGE: "TIME IS UP" 
    gameMessage.innerText = 'Time is up!';

    // FUNCTION CALL: FINAL SCORE
    showFinalScore();
  
  } 
  // --------- IF THERE IS STILL TIME LEFT ---------
  else {
    // DECREMENT: TIME LEFT
    timeLeft--;
    // DISPLAY: TIME LEFT
    timeElement.innerText = `Time Left: ${timeLeft} seconds`;
  }
}

// - F 5 : UPDATE LOCAL STORAGE -------------------------------------------- //
function updateLocalStorage() {
  localStorage.setItem('allRecordedScores', JSON.stringify(scoreStorage));
}

// - F 6 : UPDATE SCORES -------------------------------------------- //
function updateScores(correct) {
  if (correct) {
    updateCurrentScore();
    updateHighestScore(currentScore);
  } else {
    updateHighestScore(currentScore);
  }
  // DISPLAY: CURRENT SCORE AS FINAL SCORE ELEMENT
  finalScoreElement.innerText = `Your final score: ${currentScore}`;
}

// - F 7 : UPDATE CURRENT SCORE -------------------------------------------- //
function updateCurrentScore() {
  currentScore++
  currentScoreElement.innerText = `Your current score: ${currentScore}`;
}

// - F 8 : UPDATE HIGHEST SCORE -------------------------------------------- //
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
    highestScoreElement.innerText = `Your high score: ${scoreStorageManager.getHighestScores()[0] || 0}`;
    // SAVE THE HIGH SCORE TO LOCAL STORAGE
    localStorage.setItem('currentScore', currentScore);
  }
}

// - F 9 : SHOW FINAL SCORE -------------------------------------------- //
function showFinalScore() {
    
    // RESET: GAME STATE
    resetState();
  
    // DISPLAY BUTTON: RESTART
    restartButton.classList.remove('hide');
    // DISPLAY BUTTON: SCORE BOARD
    scoreBoardButton.classList.remove('hide');
    // DISPLAY SCORE: CURRENT AS FINAL SCORE
    finalScoreElement.innerText = `Your final score: ${currentScore}`;
    finalScoreElement.classList.remove('hide'); // Add this line to remove the 'hide' class
    
    // HIDDEN ELEMENT: TIME
    timeElement.classList.add('hide');
    // HIDDEN ELEMENT: QUESTIONS
    questionContainerElement.classList.add('hide');
    // HIDDEN BUTTON: NEXT 
    nextButton.classList.add('hide');
    // HIDDEN SCORE: CURRENT 
    currentScoreElement.classList.add('hide') 
  
    // REMOVE: CURRENT SCORE FROM LOCAL STORAGE
    localStorage.removeItem('currentScore');
   
}

// - F 10 : RESTART GAME -------------------------------------------- //
function restartGame() {
  
  gameMessage.classList.add('hide');

  // HIDDEN BUTTON: NEXT
  restartButton.classList.add('hide');
  // HIDDEN ELEMENT: SCOREBOARD
  scoreBoardContainer.classList.add('hide');
  scoreBoardButton.classList.add('hide');
  scoreBoardTable.classList.add('hide');
  // HIDDEN ELEMENT: HIGHEST SCORE
  highestScoreElement.classList.add('hide'); 
  
  // RESET: HIGHEST SCORE ON RESTART
  highestScore = 0;
  highestScoreElement.innerText = `Your X score: ${highestScore}`;
  // RESET: GAME STATE
  resetState();
  currentQuestionIndex = 0;
  currentScore = 0;
  shuffledQuestions = questionsList.sort(() => Math.random() - 0.5);

  // RETRIEVE SCORE: FROM LOCAL STORAGE
  const storedHighestScore = localStorage.getItem('highestScore');
  if (storedHighestScore !== null) {
  highestScore = parseInt(storedHighestScore);
  highestScoreElement.innerText = `Your high score: ${highestScore}`;
  }
  // REMOVE SCORE: FROM LOCAL STORAGE
  localStorage.removeItem('currentScore');

  // FUNCTION CALLS
  startGame();
  startTimer();
}

// - F 11 : SET QUESTION -------------------------------------------- //
function setNextQuestion() {
  // Category 1: Reset state
  resetState();

  // Category 2: Check if the game is finished
  if (currentQuestionIndex >= shuffledQuestions.length) {
    showFinalScore();
    
    // Stop the timer and display "Game Over"
    clearInterval(timerId);
    gameMessage.innerText = 'Game Over!';
    

  // Category 4: If game is not finished, show the next question
  } else {
    answered = false;
    showQuestion(shuffledQuestions[currentQuestionIndex]);

    // Category 5: If it's the last question, hide next button
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      nextButton.classList.add('hide');
    }
  }
}

// - F 12 : SHOW QUESTION -------------------------------------------- //
function showQuestion(question) { 
    questionsElement.innerText = question.question;
    question.answers.forEach(answer => {
      const questionAnswerButton = document.createElement('button');
      questionAnswerButton.innerText = answer.text;
      questionAnswerButton.classList.add('question-answer-btn');
      if (answer.correct) {
        questionAnswerButton.dataset.correct = answer.correct;
      }
      questionAnswerButton.addEventListener('click', () => {
        console.log('Clicked: Answers');
        selectAnswer(answer);
      });
      questionAnswerContainer.appendChild(questionAnswerButton);
    })  
}

// - F 13 : RESET -------------------------------------------- //
function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (questionAnswerContainer.firstChild) {
      questionAnswerContainer.removeChild(questionAnswerContainer.firstChild)
  }
}

// - F 14 : SELECT ANSWER -------------------------------------------- //
function selectAnswer(answer) {


  // Check if the question has already been answered
  if (answered) { return; }
    
  // Set answered to true
  answered = true;

  // SET CORRECT/WRONG CLASS TO BODY
  setStatusClass(document.body, answer.correct);
  
  // SET CORRECT/WRONG CLASS TO ANSWER BUTTONS
  Array.from(questionAnswerContainer.children).forEach(questionAnswerButton => {
    setStatusClass(questionAnswerButton, questionAnswerButton.dataset.correct);
  });
  
// IF CORRECT ANSWER: UPDATE SCORE AND HIGH SCORE ELEMENT
  if (answer.correct) {
    updateScores(true); 
    highestScoreElement.innerText = `Your highest score: ${currentScore}`;
  } else {
    updateScores(false);
  }
  
  // SHOW NEXT BUTTON IF THERE ARE MORE QUESTIONS
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    
    // HIDDEN
    startButton.classList.add('hide');
    questionsElement.classList.add('hide');
    timeElement.classList.add('hide');

    // DISPLAY
    restartButton.classList.remove('hide');
    scoreBoardButton.classList.remove('hide');
    
    // TEXT
    restartButton.innerText = 'Restart'
    scoreBoardButton.innerText = 'View Rankings'
    gameMessage.innerText = 'Well done!';
    
    // HIDE CURRENT SCORE
    currentScoreElement.classList.add('hide');

    // SHOW FINAL SCORE
    showFinalScore();
    
  }
  // Disable all answer buttons
  Array.from(questionAnswerContainer.children).forEach(questionAnswerButton => {
    questionAnswerButton.disabled = true;
  });
}

// - F 15 : "CORRECT / WRONG" -------------------------------------------- //
function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}
// - F 16 : CLEAR -> "CORRECT / WRONG" -------------------------------------------- //
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


