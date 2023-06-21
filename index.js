const player = document.getElementById("player");
const submit = document.getElementById("submit");
const divGraphic = document.querySelector('#chart')
const myChart = document.querySelector('#myChart')
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const questionContainer = document.getElementById("question-container")
let currentQuestionIndex = 0;
let score = 0;



const getQuestions = () => {
  axios
  .get("https://opentdb.com/api.php?amount=10&category=23")
  .then((res) => {
    questions = res.data.results.map((question) => {
    const answers = [...question.incorrect_answers.map((answer) => ({
    text: answer,
    correct: false,
  })),
  {
    text: question.correct_answer,
    correct: true,
  },
  ];
    const randomAnswers = answers.sort(() => Math.random() - 0.5);
    return {
    question: question.question,
    answers: randomAnswers,
  };
  });
  })
    .catch((err) => console.error(err));
};

getQuestions();


const submitPlayer = () =>{  
  localStorage.setItem('name',player.value);
}


const startQuiz = () => {
  submit.classList.add('hide')
  player.classList.add('hide')
  divGraphic.classList.add('hide')
  questionContainer.classList.remove("hide")
  startButton.classList.add("hide")
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
};


const showQuestion = () => {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
};


const resetState = () => {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
  answerButtons.removeChild(answerButtons.firstChild);
  }
};


const selectAnswer = (e) => {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
    quizResults.push(true)        
  } else {
    selectedBtn.classList.add("incorrect");
    quizResults.push(false)
  }
  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
};


const showScore = () => {
  resetState();
  divGraphic.classList.remove('hide'); 
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
  if (score <= 4) {questionElement.innerHTML = 
    `${localStorage.getItem('name')} your score is ${score} out of ${questions.length} you are fucking stupid!!`;}
  else if (score > 4 && score <= 7) {questionElement.innerHTML =
     `${localStorage.getItem('name')} your score is ${score} out of ${questions.length} not bad, but you can do better!!`;}
  else if (score > 7) {questionElement.innerHTML = 
    `${localStorage.getItem('name')} your score is ${score} out of ${questions.length} you are a genious, congrats!!`;
  }
};


const handleNextButton = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
};


submit.addEventListener('click', submitPlayer)
startButton.addEventListener("click",startQuiz)
nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});


const labels = ['1. Question', '2. Question', '3. Question', '4. Question', '5. Question', 
'6. Question', '7. Question','8. Question', '9. Question', '10. Question'];
const quizResults = [];

const data = {
  labels: labels,
  datasets: [{
    label: 'Quiz Results',    
    backgroundColor: 'green',
    borderColor: ' rgb(34,92,98)',
    color: ' rgb(34,92,98, 1)',
    data: quizResults,
  }]
};


const config = {
  type: 'bar',
  data: data,
  options: {}
};



const myChartConfig = new Chart('myChart', config);
