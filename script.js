const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const welcomeText = document.getElementById('w-text')

let shuffledQuestions, currentQuestionIndex

startButton.addEventListener('click', hideTexts)
startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

function hideTexts() {
    welcomeText.classList.add('hide')
}

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

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        startButton.innerText = 'Restart'
        startButton.classList.remove('hide')
    }
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


const questions = [
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
      question: 'What part of the brain governs emotions?',
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
        question: 'What part of the brain governs personality?',
        answers: [
          
          { text: 'Parietal Lobe', correct: false },
          { text: 'Frontal Lobe', correct: true },
          { text: 'Occipital Lobe', correct: false },
          { text: 'Amygdala', correct: false }
          
        ]
    },

  ]

