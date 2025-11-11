const start = document.querySelector(".start");
const numberInput = document.querySelector(".start__input");
const difficultySelect = document.querySelector(".difficulty__select");
const typeSelect = document.querySelector(".type__select");
const categorySelect = document.querySelector(".category__select");
const startButton = document.querySelector(".start__button");
const questionsContainer = document.querySelector(".questions__container");
const questionsBody = document.querySelector(".questions__body");
const questionsTemplate = document.querySelector(".questions__template");

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
      start.classList.add("hide");
      questionsContainer.classList.remove("hide");
      data.results.forEach((question) => {
        const clone = questionsTemplate.content.cloneNode(true);
        const questionsText = clone.querySelector(".questions__text");
        questionsText.innerHTML = question.question;
        const answerOptions = clone.querySelector(".answer__options");
        answerOptions.questionsBody.append(clone);
      });
    });
});
