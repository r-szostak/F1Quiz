const urlToFetch = "http://ergast.com/api/f1/driverstandings/1";
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("answer-text"));
const counterValue = document.getElementById("question-counter");
const scoreValue = document.getElementById("score-value");

const max_Questions = 5;
let newQuestions = [];
let questionCounter;
let currentQuestion = {};
let score;
let preventMultiClick;

const startGame = async () => {
  //gdy użytkownik naciśnie start rozpoczyna grę
  questionCounter = 0;
  score = 0;
  const drivers = await getDrivers();
  generateQuestions(drivers);

  renderNewQuestion();
};

const getRandomYear = (range, startYear) => {
  //losuje rok z którego ma być pytanie
  return Math.floor(Math.random() * range + startYear);
};

const getDrivers = async () => {
  // -zwraca tablicę z kierowcami

  let allDrivers;
  const endpoint = `${urlToFetch}.json?limit=72`;
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      jsonResponse = await response.json();
      allDrivers = jsonResponse.MRData.StandingsTable.StandingsLists;
    }
  } catch (error) {
    console.log(error);
  }

  return allDrivers;
};

const generateQuestions = (drivers) => {
  let usedYears = [];
  let answers = [];
  let winner;
  let i = 0;
  let startYear;
  while (newQuestions.length < max_Questions) {
    const questionYear = getRandomYear(72, 1950);

    if (!usedYears.includes(questionYear)) {
      const winnerIndex = drivers.findIndex(
        (driver) => driver.season === questionYear.toString()
      );
      winner = `${drivers[winnerIndex].DriverStandings[0].Driver.givenName} ${drivers[winnerIndex].DriverStandings[0].Driver.familyName}`;

      if (questionYear < 1960) {
        startYear = 1951;
      } else if (questionYear > 2000) {
        startYear = 2000;
      } else startYear = questionYear - 10;
      //console.log(winner);
      let yearForAnswers = getRandomYear(20, startYear);
      //console.log(yearForAnswers);

      while (answers.length < 3) {
        let yearForAnswers = getRandomYear(20, startYear);
        console.log(yearForAnswers);
        let index = drivers.findIndex(
          (driver) => driver.season === yearForAnswers.toString()
        );
        const newDriver = `${drivers[index].DriverStandings[0].Driver.givenName} ${drivers[index].DriverStandings[0].Driver.familyName}`;
        if (!answers.includes(newDriver) && newDriver != winner) {
          answers.push(newDriver);
        }
      }
      newQuestions[i] = {
        question: `Who won the championship in ${questionYear}`,
      };
      newQuestions[i].answer = Math.floor(Math.random() * 4) + 1;
      answers.splice(newQuestions[i].answer - 1, 0, winner);
      answers.forEach((answer, index) => {
        newQuestions[i]["choice" + (index + 1)] = answer;
      });

      answers = [];
      i++;
    }
    usedYears.push(questionYear);
  }
};

const renderNewQuestion = () => {
  if (newQuestions.length === 0 || questionCounter === max_Questions) {
    localStorage.setItem("RecentScore", score);
    location.assign("./end.html");
  }
  questionCounter++;
  counterValue.innerText = `${questionCounter}/${max_Questions}`;

  currentQuestion = newQuestions[0];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  newQuestions.shift();
  preventMultiClick = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!preventMultiClick) return;

    preventMultiClick = false;

    const selectedAnswer = e.target.dataset["number"];
    const choiceClass =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    choiceClass === "correct" ? (score += 5) : null;
    scoreValue.innerText = score;

    e.target.classList.add(choiceClass);
    setTimeout(() => {
      e.target.classList.remove(choiceClass);
      renderNewQuestion();
    }, 1000);
  });
});

startGame();
