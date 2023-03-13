// DOM: Constant Declarations //
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')

const welcomeText = document.getElementById('w-text')

const questionElement = document.getElementById('questions-container')
const questionContainerElement = document.getElementById('question-visibility-container')
const questionAnswerContainer = document.getElementById('question-answer-container')

const timeElement = document.getElementById('time')

const scoreBoardButton = document.getElementById('score-board-btn')
const scoreBoardContainer = document.getElementById('score-board-container')



let timeLeft = 60; 
let timerId; 
let shuffledQuestions, currentQuestionIndex
let currentScore = 0;
let highScore = 0;

const clearStorageButton = document.createElement('button');
clearStorageButton.id = 'clear-storage-btn';
clearStorageButton.innerText = 'CLEAR STORAGE';

clearStorageButton.addEventListener('click', () => {
  console.log('Clicked: Cleared Local Storage');
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
// The ScoreBoard is a class that manages the scores of the game, and it's used to record the high score of each player. 
// When a player finishes a round, the ScoreBoard object is used to check if the player's current score is higher than any of the previously recorded scores. 
// If it is, then the new score is added to the list of recorded scores and the list is sorted in descending order to determine the new high score.
class ScoreBoard {
  constructor(recordedScores) {

  // recordedScores is a parameter of the ScoreBoard constructor function. 
  // It is used to initialize the recordedScores property of the ScoreBoard object.
  // This parameter is used to pass an array of previously recorded scores to the constructor, 
  // which is then stored in the recordedScores property of the ScoreBoard object.
    
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



scoreBoardButton.addEventListener('click', () => {
  console.log('Clicked: View Rankings');

  // HIDE RANKINGS
  scoreBoardContainer.classList.remove('hide');
  scoreBoardButton.classList.add('hide');

  // SHOW SCORE BOARD CONTAINER
  scoreBoardContainer.classList.remove('hide');

  // HIDE QUESTION CONTAINER
  questionElement.classList.add('hide');
  questionContainerElement.classList.add('hide');
  questionAnswerContainer.classList.add('hide');
  
  // Get the recorded scores from local storage
  const recordedScores = JSON.parse(localStorage.getItem('recordedScores')) || [];

  // Create a new ScoreBoard object
  const scoreBoard = new ScoreBoard(recordedScores);

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


  // In this code block, score and index are parameters of a callback function
  // that is being passed to the forEach method.
  // The forEach method is iterating over the highestScores array, and for each element in the array, it calls the callback function, passing in the current element and its index.
  // So, score is the current score being iterated over in the highestScores array, and index is its index in the array.
  
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


startButton.addEventListener('click', () => {
  console.log('Clicked: Start');
  hideTexts();
  startGame();
  startTimer();
  startButton.classList.add('hide');
});

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

restartButton.addEventListener('click', () => {
  console.log('Clicked: Restart');
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

  questionElement.classList.remove('hide');
  questionContainerElement.classList.remove('hide');
  questionAnswerContainer.classList.remove('hide');

  timeElement.classList.remove('hide');
  
    currentScore = 0
    highScore = 0
    shuffledQuestions = questionsList.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    
  
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

  // HIDE RANKINGS
  scoreBoardContainer.classList.add('hide');

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

    

    // Stop the timer and display "Game Over"
    clearInterval(timerId);
    timeElement.innerText = 'Game Over!';
    timeElement.classList.add('time-up');

  // Category 4: If game is not finished, show the next question
  } else {
    showQuestion(shuffledQuestions[currentQuestionIndex]);

    // Category 5: If it's the last question, hide next button
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      nextButton.classList.add('hide');
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
        console.log('Clicked: Answers');
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
    scoreBoardButton.classList.remove('hide');
    scoreBoardButton.innerText ='View Rankings'
    questionElement.classList.remove('hide');
    questionElement.innerText = 'Well done!';
    
  }
  
  
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
    // {
    //   question: 'What part of the brain governs the emotions?',
    //   answers: [
        
    //     { text: 'Parietal Lobe', correct: false },
    //     { text: 'Amygdala', correct: true },
    //     { text: 'Hippocampus', correct: false },
    //     { text: 'Frontal Lobe', correct: false }
        
    //   ]
    //  },
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


