// DOM: Constant Declarations //
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')
const welcomeText = document.getElementById('w-text')
const questionElement = document.getElementById('questions-container')
const questionContainerElement = document.getElementById('question-visibility-container')
const questionAnswerContainer = document.getElementById('question-answer-btns-container')
const timeElement = document.getElementById('timer-text')
const scoreBoardButton = document.getElementById('score-board-btn')
const scoreBoardContainer = document.getElementById('score-board-container')
const scoreBoardTable = document.getElementById('score-board-table')

let timeLeft = 60; 
let timerId; 
let shuffledQuestions, currentQuestionIndex
let currentScore = 0;
let latestRecord = 0;

let answered = false;

// - CLEAR LOCAL STORAGE ------
const clearStorageButton = document.createElement('button');
clearStorageButton.id = 'clear-storage-btn';
clearStorageButton.innerText = 'CLEAR STORAGE';
clearStorageButton.addEventListener('click', () => {
  console.log('Clicked: Cleared Local Storage');
  localStorage.clear();
});
const clearContainer = document.getElementById('clear-storage-container');
clearContainer.appendChild(clearStorageButton);



// - HIGH SCORE ELEMENT------


// - CURRENT SCORE ELEMENT------
const currentScoreElement = document.createElement('div');
currentScoreElement.id = 'current-score-container';
currentScoreElement.innerText = `Your current score: ${currentScore}`;
questionContainerElement.appendChild(currentScoreElement);

// - FINAL SCORE ELEMENT------
const finalScoreElement = document.createElement('div')
finalScoreElement.id = 'final-score-container';
finalScoreElement.innerText = `Your final score: ${currentScore}`;
questionContainerElement.appendChild(finalScoreElement)
// finalScoreElement.appendChild(currentScoreElement)

// INITIALLY HIDDEN //
finalScoreElement.classList.add('hide');
scoreBoardContainer.classList.add('hide');
timeElement.classList.add('hide');
restartButton.classList.add('hide');


// -- SCOREBOARD -------------------------------------------- //
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
        // ADD THE CURRENT SCORE TO THE RECORDED SCORES ARRAY
        scoreStorage.push(currentScore);
        // SORT THE RECORDED SCORES ARRAY IN DESCENDING ORDER
        scoreStorage.sort((a, b) => b - a);
        // REMOVE ANY EXTRA SCORES BEYOND THE TOP 5
        scoreStorage = scoreStorage.slice(0, 5);
        // SAVE THE UPDATED SCORES ARRAY TO LOCAL STORAGE
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
  questionElement.classList.add('hide');
  questionContainerElement.classList.add('hide');
  questionAnswerContainer.classList.add('hide');
  
  // HIDE TIMER
  timeElement.classList.add('hide');
  
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
  scoreBoardContainer.classList.remove('show-flex');
  scoreBoardContainer.classList.add('hide');
  scoreBoardButton.classList.add('hide');
  scoreBoardTable.classList.add('hide');
  scoreStorage.classList.add('hide');
  scoreStorageManager.classList.add('hide');
});





// - F 1 : HIDE TEXT -------------------------------------------- //
function hideTexts() {
  welcomeText.classList.add('hide')
}

// - F 2 : START GAME -------------------------------------------- //
function startGame() {
  console.log('Start game function called');

  finalScoreElement.classList.add('hide');


  questionElement.classList.remove('hide');
  questionContainerElement.classList.remove('hide');
  questionAnswerContainer.classList.remove('hide');

  currentScore = 0
  
  shuffledQuestions = questionsList.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  
  // RESET TIMER
  resetTimer();

  // SET THE FIRST QUESTION
  setNextQuestion()
  
   // Reset high score when the game is restarted


  // CLEAR ANY EXISTING TIMERS
  clearInterval(timerId);

  // RESET TIMER
  timeLeft = 60;

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
  timeLeft = 60;
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}

// - F 4 : COUNTDOWN (TIMER) -------------------------------------------- //
function countdown() {
  if (currentQuestionIndex >= shuffledQuestions.length) {
    clearInterval(timerId);
    timeElement.innerText = 'Game Over!';
    timeElement.classList.add('time-up');
    showFinalScore();
    restartButton.classList.remove('hide');
  } else if (timeLeft === 0) {
    clearInterval(timerId);
    timeElement.innerText = 'Time is up!';
    timeElement.classList.add('time-up');
    showFinalScore();
    restartButton.classList.remove('hide');
  } else {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      timeLeft--;
      timeElement.innerText = `Time Left: ${timeLeft} seconds`;
    }
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
    updateFinalScore(currentScore);
  } else {
    updateFinalScore(currentScore);
  }
}

// - F 7 : UPDATE CURRENT SCORE -------------------------------------------- //
function updateCurrentScore() {
  currentScore++
  currentScoreElement.innerText = `Your current score: ${currentScore}`;
}

// - F 8 : UPDATE HIGH SCORE -------------------------------------------- //
function updateFinalScore(currentScore) {
  if (currentScore > latestRecord) {
    latestRecord = currentScore;

    // Add the high score to the scoreboard and update local storage
    scoreStorageManager.addScore(latestRecord);
    updateLocalStorage();
    // Update the high score element
    highScoreElement.innerText = `Your high score: ${latestRecord}`;
    // ADD CURRENT SCORE TO RECORDED SCORES ARRAY AND UPDATE HIGH SCORE ELEMENT
    scoreStorageManager.addScore(currentScore);
    highScoreElement.innerText = `Your high score: ${scoreStorageManager.getHighestScores()[0] || 0}`;
    // SAVE THE HIGH SCORE TO LOCAL STORAGE
    localStorage.setItem('currentScore', currentScore);
  }
}

// - F 9 : SHOW FINAL SCORE -------------------------------------------- //
function showFinalScore() {

    currentScoreElement.classList.add('hide') 
    
    // RESET GAME STATE
     resetState();
    // SHOW THE SCORE BOARD BUTTON
    nextButton.classList.remove('hide');
    // SHOW THE HIGH SCORE ELEMENT

    // DISPLAY RESTART BUTTON 
    restartButton.classList.remove('hide');
    // REMOVE CURRENT SCORE FROM LOCAL STORAGE
    localStorage.removeItem('currentScore');
   
}

// - F 10 : RESTART GAME -------------------------------------------- //
function restartGame() {
  // HIDE RESTART BUTTON
  restartButton.classList.add('hide');
  // HIDE RANKINGS
  scoreBoardContainer.classList.add('hide');
  scoreBoardButton.classList.add('hide');
  scoreBoardTable.classList.add('hide');
  

  // RESET THE GAME STATE
  resetState();
  currentQuestionIndex = 0;
  currentScore = 0;
  shuffledQuestions = questionsList.sort(() => Math.random() - 0.5);
  // REMOVE CURRENT SCORE FROM LOCAL STORAGE
  localStorage.removeItem('currentScore');
 
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
    timeElement.innerText = 'Game Over!';
    timeElement.classList.add('time-up');

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
    questionElement.innerText = question.question;
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
  
// UPDATE SCORE AND HIGH SCORE ELEMENT
  if (answer.correct) {
    updateScores(true); 

  } else {
    updateScores(false);
  }
  
  // SHOW NEXT BUTTON IF THERE ARE MORE QUESTIONS
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    startButton.classList.add('hide');
    restartButton.classList.remove('hide');
    restartButton.innerText = 'Restart'
    scoreBoardButton.classList.remove('hide');
    scoreBoardButton.innerText ='View Rankings'
    questionElement.classList.remove('hide');
    questionElement.innerText = 'Well done!';

    // HIDE CURRENT SCORE
    currentScoreElement.classList.add('hide');
    // SHOW FINAL SCORE
    finalScoreElement.classList.remove('hide');
    

    
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


