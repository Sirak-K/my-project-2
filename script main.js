// DOM: Constant Declarations //
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')


const welcomeText = document.getElementById('w-text')

const questionElement = document.getElementById('questions-container')
const questionContainerElement = document.getElementById('question-visibility-container')
const questionAnswerContainer = document.getElementById('question-answer-container')

const timeElement = document.getElementById('time')

// const scoreBoardButton = document.getElementById('scoreboard-btn')
// const scoreBoardContainer = document.getElementById('scoreboard-container')




let timeLeft = 60; 
let timerId; 
let shuffledQuestions, currentQuestionIndex
let currentScore = 0;
let highScore = 0;

const clearStorageButton = document.createElement('button');
clearStorageButton.id = 'clear-storage-button';
clearStorageButton.innerText = 'CLEAR STORAGE';

clearStorageButton.addEventListener('click', () => {
  localStorage.clear();
});

const clearContainer = document.getElementById('clear-container');
clearContainer.appendChild(clearStorageButton);


const highScoreElement = document.createElement('div');
highScoreElement.id = 'high-score';
highScoreElement.innerText = `Your high score: ${highScore}`;
questionContainerElement.appendChild(highScoreElement);

const currentScoreElement = document.createElement('div');
currentScoreElement.id = 'current-score';
currentScoreElement.innerText = `Your current score: ${currentScore}`;
questionContainerElement.appendChild(currentScoreElement);


// ARRAY: 
// scores = scoreStorage - represents all the scores that have been recorded so far.

// ARRAY: 
// topScores = getHighestScores - represents the top 5 scores from the scores array, sorted in descending order.

// -- SCOREBOARD -------------------------------------------- //
class ScoreBoard {

  // recordedScores is a parameter of the ScoreBoard constructor function. 
  // It is used to initialize the recordedScores property of the ScoreBoard object.
  // This parameter is used to pass an array of previously recorded scores to the constructor, 
  // which is then stored in the recordedScores property of the ScoreBoard object.
  
  
  constructor(recordedScores) {
    
    // Retrieve saved scores from local storage
    
    this.recordedScores = recordedScores || [];
  }

  getHighestScores() {
    const highestScores = [...this.recordedScores].sort((a, b) => b - a).slice(0, 5);
    return highestScores;
  }

  addScore(currentScore) {
    if (currentScore > 0) {
      let scoreStorage = JSON.parse(localStorage.getItem('recordedScores')) || [];
      
      // Check if the current score is higher than the recorded scores
      if (scoreStorage.length < 5 || currentScore > scoreStorage[scoreStorage.length - 1]) {
    
        // Add the current score to the recorded scores array
        scoreStorage.push(currentScore);
        
        // Sort the recorded scores array in descending order
        scoreStorage.sort((a, b) => b - a);
        
        // Remove any extra scores beyond the top 5
        scoreStorage = scoreStorage.slice(0, 5);
        
        // Save the updated scores array to local storage
        localStorage.setItem('recordedScores', JSON.stringify(scoreStorage));
      }
    }
  }
  
}

const scoreStorage = JSON.parse(localStorage.getItem('recordedScores')) || [];
const scoreStorageManager = new ScoreBoard();

// - FUNCTION : RESET TIMER -------------------------------------------- //
function resetTimer() {
  // Clear any existing timers
  clearInterval(timerId);

  // Reset timer
  timeLeft = 60;
  timeElement.innerText = `Time Left: ${timeLeft} seconds`;
}

// HIDDEN: CURRENT SCORE
highScoreElement.classList.add('hide');

// HIDDEN: TIME
timeElement.classList.add('hide');

// HIDDEN: RESTART BUTTON
restartButton.classList.add('hide');

// BUTTONS: Event Listeners //

startButton.addEventListener('click', () => {
  console.log('Start button clicked');
  hideTexts();
  startGame();
  startTimer();
  startButton.classList.add('hide');
});

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
  highScoreElement.classList.add('hide');
});



// - FUNCTION : HIDE TEXT -------------------------------------------- //
function hideTexts() {
  welcomeText.classList.add('hide')
}

// - FUNCTION : START GAME -------------------------------------------- //
function startGame() {
  console.log('Start game function called');
    timeElement.classList.remove('hide');
    currentScore = 0
    highScore = 0
    shuffledQuestions = questionsList.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerElement.classList.remove('hide')
  
  // RESET TIMER
  resetTimer();

  // SET THE FIRST QUESTION
  setNextQuestion()
  
  // HIDE THE SCORE BOARD BUTTON
  nextButton.classList.add('hide');
  
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


// - FUNCTION : START (TIMER) -------------------------------------------- //
function startTimer() {
  timerId = setInterval(countdown, 1000);
}


// - FUNCTION : COUNTDOWN (TIMER) -------------------------------------------- //
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
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      nextButton.innerText = 'Score Board';
    }
  }
}
// - FUNCTION : UPDATE LOCAL STORAGE -------------------------------------------- //
function updateLocalStorage() {
  
  localStorage.setItem('recordedScores', JSON.stringify(scoreStorage));
}



// - FUNCTION : UPDATE SCORE -------------------------------------------- //

function updateScores(correct) {
  if (correct) {
    updateCurrentScore();
    updateHighScore(currentScore);
  } else {
    updateHighScore(currentScore);
  }
}

//  increments the current score by one 
//  updates the current score element on the page. 
function updateCurrentScore() {
  currentScore++
  currentScoreElement.innerText = `Your current score: ${currentScore}`;
}


// checks if the current score is higher than the current high score, and if so, 
// updates the high score and the high score element on the page
// adds the new high score to the recorded scores array 
// using the addScore() method of the scoreStorageManager object.
function updateHighScore(currentScore) {
  if (currentScore > highScore) {
    highScore = currentScore;

    // Add the high score to the scoreboard and update local storage
    scoreStorageManager.addScore(highScore);
    updateLocalStorage();

    // Update the high score element
    highScoreElement.innerText = `Your high score: ${highScore}`;
    
    // ADD CURRENT SCORE TO RECORDED SCORES ARRAY AND UPDATE HIGH SCORE ELEMENT
    scoreStorageManager.addScore(currentScore);
    highScoreElement.innerText = `Your high score: ${scoreStorageManager.getHighestScores()[0] || 0}`;

    // SAVE THE HIGH SCORE TO LOCAL STORAGE
    localStorage.setItem('highScore', highScore); 
  }
}




// - FUNCTION : SHOW FINAL SCORE -------------------------------------------- //
function showFinalScore() {
    const finalScoreElement = document.createElement('div')
    finalScoreElement.classList.add('highscore-container');
    finalScoreElement.innerText = `Your final score: ${currentScore}`
    questionContainerElement.innerHTML = ''
    questionContainerElement.appendChild(finalScoreElement)
  
    // RESET GAME STATE
     resetState();
  
    // SHOW THE SCORE BOARD BUTTON
    nextButton.classList.remove('hide');
  
    // SHOW THE HIGH SCORE ELEMENT
     highScoreElement.classList.remove('hide'); 
  
    // DISPLAY RESTART BUTTON 
    restartButton.classList.remove('hide');
}


// ------ RESTART GAME ------ //
function restartGame() {

  // HIDE RESTART BUTTON
  restartButton.classList.add('hide');

  // HIDE THE SCORE BOARD BUTTON
  nextButton.classList.add('hide');

  // HIDE HIGH SCORE ELEMENT
  highScoreElement.classList.add('hide'); 
  
  // RESET HIGH SCORE WHEN THE GAME IS RESTARTED
  highScore = 0;
  highScoreElement.innerText = `Your X score: ${highScore}`;
  
 // Retrieve the high score from Local Storage
 const storedHighScore = localStorage.getItem('highScore');
 if (storedHighScore !== null) {
   highScore = parseInt(storedHighScore);
   highScoreElement.innerText = `Your high score: ${highScore}`;
 }

  // RESET THE GAME STATE
  resetState();
  currentQuestionIndex = 0;
  currentScore = 0;
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

    // // Category 3: Hide next button if game is finished
    // nextButton.classList.add('hide');

  // Stop the timer and display "Game Over"
    clearInterval(timerId);
    timeElement.innerText = 'Game Over!';
    timeElement.classList.add('time-up');

    // Category 4: If game is not finished, show the next question
  } else {
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
      const questionAnswerButton = document.createElement('button');
      questionAnswerButton.innerText = answer.text;
      questionAnswerButton.classList.add('question-answer-btn');
      if (answer.correct) {
        questionAnswerButton.dataset.correct = answer.correct;
      }
      questionAnswerButton.addEventListener('click', () => {
        selectAnswer(answer);
      });
      questionAnswerContainer.appendChild(questionAnswerButton);
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
  Array.from(questionAnswerContainer.children).forEach(questionAnswerButton => {
    setStatusClass(questionAnswerButton, questionAnswerButton.dataset.correct);
  });
  
// UPDATE SCORE AND HIGH SCORE ELEMENT
  if (answer.correct) {
    updateScores(true); // call updateScores() with correct=true
    highScoreElement.innerText = `Your high score: ${currentScore}`;
  } else {
    updateScores(false); // call updateScores() with correct=false
  }
  
  // SHOW NEXT BUTTON IF THERE ARE MORE QUESTIONS, 
  // OR SHOW "WELL DONE!" MESSAGE AND RESTART BUTTON IF THERE ARE NO MORE QUESTIONS
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {

    startButton.classList.add('hide');
    restartButton.classList.remove('hide');

    restartButton.innerText = 'Restart?'
    questionElement.classList.remove('hide');
    questionElement.innerText = 'Well done!';
    
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


