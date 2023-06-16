
const divGraphic = document.querySelector('.hide')
const myChart = document.querySelector('#myChart')
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
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
    startQuiz();
  })
    .catch((err) => console.error(err));
};

getQuestions();

const startQuiz = () => {
  divGraphic.classList.add('hide')
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
  } else {
    selectedBtn.classList.add("incorrect");
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
    `Your score is ${score} out of ${questions.length} you are fucking stupid!!`;}
  else if (score > 4 && score <= 7) {questionElement.innerHTML =
     `Your score is ${score} out of ${questions.length} not bad, but you can do better!!`;}
  else if (score > 7) {questionElement.innerHTML = 
    `Your score is ${score} out of ${questions.length} you are a genious, congrats!!`;
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


nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});


const labels = ['pregunta 1', 'pregunta 2', 'pregunta 3', 'pregunta 4', 'pregunta 5', 
'pregunta 6', 'pregunta 7','pregunta 8', 'pregunta 9', 'pregunta 10'];


const data = {
  labels: labels,
  datasets: [{
    label: 'Quiz Results',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: ' rgb(34,92,98);',
    data: [],
  }]
};

const config = {
  type: 'bar',
  data: data,
  options: {}
};



const myChartConfig = new Chart('myChart', config);