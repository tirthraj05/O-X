let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let difficulty = "easy";
let playerWins = 0;
let gamesPlayed = 0;

const popup = document.getElementById("congratsPopup");
const winnerMessage = document.getElementById("winnerMessage");
const indexPage = document.getElementById("indexPage");
const gamePage = document.getElementById("gamePage");
const gameBoard = document.getElementById("gameBoard");
const levelInfo = document.getElementById("levelInfo");

// Winning combinations
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Start Game
function startGame(level) {
  difficulty = level;
  levelInfo.textContent = `Current Level: ${level.toUpperCase()}`;
  indexPage.style.display = "none";
  gamePage.style.display = "block";
  resetGame();
}

// Make a move
function makeMove(cell, index) {
  if (gameState[index] || !gameActive) return;

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;

  const result = checkWinner();

  if (result) {
    gameActive = false;
    if (result === "X") playerWins++;
    gamesPlayed++;
    showPopup(result);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (currentPlayer === "O") {
    setTimeout(() => aiMove(difficulty), 500);
  }
}

// AI Logic
function aiMove(level) {
  let move;
  if (level === "easy") {
    move = easyMove();
  } else if (level === "medium") {
    move = mediumMove();
  } else {
    move = hardMove();
  }

  if (move !== undefined) {
    const aiCell = document.getElementById(`cell-${move}`);
    makeMove(aiCell, move);
  }
}

function easyMove() {
  const emptyCells = gameState.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function mediumMove() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "") return c;
    if (gameState[a] === "O" && gameState[c] === "O" && gameState[b] === "") return b;
    if (gameState[b] === "O" && gameState[c] === "O" && gameState[a] === "") return a;
  }
  return easyMove();
}

function hardMove() {
  return minimax(gameState, "O").index;
}

function minimax(state, player) {
  const emptyCells = state.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);

  if (checkWinner(state) === "X") return { score: -10 };
  if (checkWinner(state) === "O") return { score: 10 };
  if (emptyCells.length === 0) return { score: 0 };

  const moves = [];

  for (let i of emptyCells) {
    const newState = [...state];
    newState[i] = player;

    const result = minimax(newState, player === "O" ? "X" : "O");
    moves.push({ index: i, score: result.score });
  }

  return moves.reduce((best, move) =>
    player === "O" ? (move.score > best.score ? move : best) : (move.score < best.score ? move : best)
  );
}

function checkWinner(state = gameState) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) return state[a];
  }
  return state.includes("") ? null : "Draw";
}

function showPopup(winner) {
  winnerMessage.textContent = winner === "Draw" ? "It's a Draw!" : `Player ${winner} Wins!`;
  popup.style.display = "flex";
}

function closePopup() {
  popup.style.display = "none";
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  gameBoard.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.id = `cell-${i}`;
    cell.className = "cell";
    cell.onclick = () => makeMove(cell, i);
    gameBoard.appendChild(cell);
  }
}

function returnToMenu() {
  indexPage.style.display = "block";
  gamePage.style.display = "none";
}
