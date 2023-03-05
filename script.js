// DOM: Constant Declarations //
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const welcomeText = document.getElementById('w-text')

let shuffledQuestions, currentQuestionIndex

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

// START GAME //
function startGame() {
    startButton.classList.add('hide')
    // Randomizer //
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerElement.classList.remove('hide')
    setNextQuestion()
}
function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}
function showQuestion(question) { 
    questionElement.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })  
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild)
    {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

// Finished round leads to the Restart-button which leads to a new round //
function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.add('hide')
    } else {
        startButton.innerText = 'Restart'
        startButton.classList.remove('hide')
        nextButton.classList.add('hide')
        questionElement.innerText = 'Well done!'
        questionElement.innerText.remove('hide')
        
    }

// Next-button appears when any Answer-button has been clicked on //
nextButton.classList.remove('hide')
}


function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

// QUESTIONS (9) //
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

