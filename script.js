const start = document.querySelector(".start");
const numberInput = document.querySelector(".start__input");
const difficultySelect = document.querySelector(".difficulty__select");
const typeSelect = document.querySelector(".type__select");
const categorySelect = document.querySelector(".category__select");
const startButton = document.querySelector(".start__button");
const questionsContainer = document.querySelector(".questions__container");
const questionsBody = document.querySelector(".questions__body");
const questionsTemplate = document.querySelector(".questions__template");
const checkAnswersButton = document.querySelector(".check__answers__button");
const checkAnswers = document.querySelector(".check__answers");
const responseCounter = document.querySelector(".response__counter");
const result = document.querySelector(".result");
const resetButton = document.querySelector(".reset__button");
let quizEnd = false;

startButton.addEventListener("click", () => {
  const number = numberInput.value;
  const difficulty = difficultySelect.value;
  const type = typeSelect.value;
  const category = categorySelect.value;
  const params = new URLSearchParams();
  if (number > 0) {
    params.append("amount", number);
  }
  if (difficulty !== "any") {
    params.append("difficulty", difficulty);
  }
  if (type !== "any") {
    params.append("type", type);
  }
  if (category !== "any") {
    params.append("category", category);
  }

  fetch(`https://opentdb.com/api.php?${params}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.results);
      let questions = data.results.map((el) => {
        el.answers = el.incorrect_answers
          .concat(el.correct_answer)
          .sort(() => Math.random() - 0.5);

        return el;
      });

      start.classList.add("hide");
      questionsContainer.classList.remove("hide");
      renderQuestions(questions);
    });
});

function renderQuestions(questions) {
  questionsBody.innerHTML = null;
  let isAllSelected = true;
  let correctCount = 0;
  questions.forEach((question) => {
    if (!question.selected_answer) {
      isAllSelected = false;
    }
    if (question.selected_answer === question.correct_answer) {
      correctCount++;
    }
    const clone = questionsTemplate.content.cloneNode(true);
    const questionsText = clone.querySelector(".questions__text");
    questionsText.innerHTML = question.question;
    const answerOptions = clone.querySelector(".answer__options");
    question.answers.forEach((answer) => {
      const button = document.createElement("button");

      button.classList.remove("true");
      button.classList.remove("select");
      button.classList.remove("false");
      button.classList.add("button__answer");
      if (question.selected_answer === answer && !quizEnd) {
        button.classList.add("select");
      } else if (question.correct_answer === answer && quizEnd) {
        button.classList.add("true");
      } else if (
        question.selected_answer === answer &&
        answer !== question.correct_answer &&
        quizEnd
      ) {
        button.classList.add("false");
      }

      button.innerHTML = answer;
      if (!quizEnd) {
        button.addEventListener("click", () => {
          question.selected_answer = answer;
          renderQuestions(questions);
        });
      }
      answerOptions.append(button);
    });
    questionsBody.append(clone);
  });
  if (isAllSelected) {
    checkAnswersButton.removeAttribute("disabled");
    checkAnswersButton.addEventListener("click", () => {
      quizEnd = true;
      renderQuestions(questions);
      checkAnswers.classList.add("hide");
      responseCounter.classList.remove("hide");
      result.innerHTML = `${correctCount} / ${questions.length}`;
    });
  }
}
resetButton.addEventListener("click", () => {
  questionsContainer.classList.add("hide");
  checkAnswersButton.setAttribute("disabled", true);
  start.classList.remove("hide");
  quizEnd = false;
  responseCounter.classList.add("hide");
  checkAnswers.classList.remove("hide");
});
