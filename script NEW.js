// DOM: Constant Declarations
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const welcomeText = document.getElementById('w-text')
const timeElement = document.getElementById('time')


// GLOBAL VARIABLES
let shuffledQuestions, currentQuestionIndex, score
let highScore = 0;
let timeLeft = 60;


// CREATE HIGH SCORE ELEMENT
const highScoreElement = document.createElement('div');
highScoreElement.id = 'high-score';
highScoreElement.innerText = `Your high score: ${highScore}`;
questionContainerElement.appendChild(highScoreElement);

// UPDATE HIGH SCORE IF CURRENT SCORE IS HIGHER
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

// HIDE WELCOME TEXT ON START BUTTON CLICK
function hideTexts() {
    welcomeText.classList.add('hide')
}

// ---------------------- START GAME ---------------------- //
function startGame() {
  // HIDE START BUTTON
  startButton.classList.add('hide');

  // RESET SCORE
  score = 0;

  // RESET HIGH SCORE
  highScore = 0;

  // SHUFFLE QUESTIONS
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);

  // RESET CURRENT QUESTION INDEX
  currentQuestionIndex = 0;

  // SHOW QUESTION CONTAINER
  questionContainerElement.classList.remove('hide');

  // CREATE HIGH SCORE ELEMENT
  const highScoreElement = document.createElement('div');
  highScoreElement.id = 'high-score';
  highScoreElement.innerText = `Your high score: ${highScore}`;
  questionContainerElement.appendChild(highScoreElement);

  // RESET HIGH SCORE DISPLAY
  highScoreElement.innerText = `Your high score: ${highScore}`;

  // RESET TIMER
  timeLeft = 60;
  timeElement.innerText = "60";
  let timerId;
  clearInterval(timerId); // Stop any existing timer

  // START THE TIMER
  timerId = setInterval(() => {
    timeLeft--;
    timeElement.innerText = timeLeft;
    if (timeLeft <= 0) {
      // DISPLAY TIME LEFT
      timeElement.innerText = `Time Left: ${timeLeft} seconds`;
    } else {
      // TIME IS UP
      clearInterval(timerId); // Stop any existing timer
      timeElement.innerText = 'Time is up!';
      timeElement.classList.add('time-up');
      showFinalScore();
    }
  }, 1000);

  // SET THE FIRST QUESTION
  setNextQuestion();
}


// -------- SET NEXT QUESTION -------- //
function setNextQuestion() {
    // RESET ANSWER BUTTONS
    resetState()
    if (currentQuestionIndex >= shuffledQuestions.length) {
        // SHOW FINAL SCORE IF THERE ARE NO MORE QUESTIONS
        nextButton.onclick = showFinalScore
    } else {
        // SHOW NEXT QUESTION
        showQuestion(shuffledQuestions[currentQuestionIndex])
    }
}

// -------- SHOW FINAL SCORE -------- //
function showFinalScore() {
  
  // HIDE ANSWER BUTTONS
  answerButtonsElement.classList.add('hide');
  
  // DISPLAY FINAL SCORE
  questionElement.innerText = `Your final score is ${score}`;
  
  // DISPLAY RESTART BUTTON
  startButton.innerText = 'Restart';
  startButton.classList.remove('hide');
}

// -------- SHOW QUESTION -------- //
function showQuestion(question) { 
  function pauseTimer() {
    let timerId;
    clearInterval(timerId);
  }
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
        if (shuffledQuestions.length === currentQuestionIndex + 1) {
          let timerId;
          clearInterval(timerId);
          console.log('Timer paused!');
        }
        // PAUSE TIMER ON LAST ANSWER CLICK
        if (shuffledQuestions.length === currentQuestionIndex + 1) {
          pauseTimer();
        }
      });
      answerButtonsElement.appendChild(button);
    })  
  }

// RESET ANSWER BUTTONS
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
// UPDATE SCORE //
function updateScore() {
  score++;
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


