const scoreDisplay = document.getElementById("score-display");
const username = document.getElementById("username");
const saveButton = document.getElementById("SaveScoreButton");
const recentScore = localStorage.getItem("RecentScore");
scoreDisplay.innerHTML = `Your Score ${recentScore}`;

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

username.addEventListener("keyup", (e) => {
  saveButton.disabled = !username.value;
});
saveScore = (e) => {
  e.preventDefault();

  const score = {
    score: recentScore,
    name: username.value,
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  location.assign("./index.html");
};
