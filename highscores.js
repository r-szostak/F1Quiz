const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const list = document.getElementById("highscores-list");

list.innerHTML = highScores
  .map((score) => `<li class="list-item">${score.name}: ${score.score}</li>`)
  .join("");
