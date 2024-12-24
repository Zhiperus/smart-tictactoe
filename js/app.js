// Extract mode from URL
const params = new URLSearchParams(window.location.search);
const mode = params.get("mode"); // e.g., "pvp" or "cvp"

// Update UI based on the mode
const player2NameElement = document.getElementById("player2");
if (mode === "cvp") {
  player2NameElement.textContent = "Computer";
}

// Define players and initialize game variables
const players = ["player1", "player2"];
let currentPlayerIndex = 0;
let round = 0;
const tableCells = document.querySelectorAll("td");

// Setup game grid and directions
const gameGrid = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];
const directions = [
  { dx: 0, dy: 1 }, // RIGHT
  { dx: -1, dy: 1 }, // TOP-RIGHT
  { dx: -1, dy: 0 }, // TOP
  { dx: -1, dy: -1 }, // TOP-LEFT
  { dx: 0, dy: -1 }, // LEFT
  { dx: 1, dy: -1 }, // BOTTOM-LEFT
  { dx: 1, dy: 0 }, // BOTTOM
  { dx: 1, dy: 1 }, // BOTTOM-RIGHT
];

// Utility functions
const isValidCell = (row, col) => row >= 0 && row < 3 && col >= 0 && col < 3;
const getPlayerSymbol = () => (currentPlayer() === "player1" ? "P1" : "P2");
const currentPlayer = () => players[currentPlayerIndex];

// Checker functions
const iterateCells = (grid, startPos, dx, dy, player) => {
  let [row, col] = startPos;
  const playerSymbol = player || getPlayerSymbol();

  for (let i = 0; i < 2; i++) {
    row += dx;
    col += dy;
    if (!isValidCell(row, col) || grid[row][col] !== playerSymbol) {
      return false;
    }
  }
  return true;
};

const checkLines = (grid, startPos, player) =>
  directions.some(({ dx, dy }) => iterateCells(grid, startPos, dx, dy, player));

const checkAdjacent = (grid, startPos, player) => {
  const [row, col] = startPos;
  const playerSymbol = player || getPlayerSymbol();

  const adjacentChecks = [
    [0, -1, 0, 1], // Horizontal
    [-1, 0, 1, 0], // Vertical
    [-1, -1, 1, 1], // Diagonal top-left to bottom-right
    [-1, 1, 1, -1], // Diagonal top-right to bottom-left
  ];

  return adjacentChecks.some(([dx1, dy1, dx2, dy2]) => {
    const firstCell =
      isValidCell(row + dx1, col + dy1) &&
      grid[row + dx1][col + dy1] === playerSymbol;
    const secondCell =
      isValidCell(row + dx2, col + dy2) &&
      grid[row + dx2][col + dy2] === playerSymbol;
    return firstCell && secondCell;
  });
};

const checkWinner = (grid, startPos, player) =>
  checkAdjacent(grid, startPos, player) || checkLines(grid, startPos, player);

// Cell click event handler
const clickCell = (event) => {
  const cell = event.target;
  const cellNumber = parseInt(cell.textContent, 10);
  const row = Math.floor(cellNumber / 3);
  const col = cellNumber % 3;

  if (gameGrid[row][col] === "P1" || gameGrid[row][col] === "P2") return;

  gameGrid[row][col] = getPlayerSymbol();
  cell.classList.add(`cell--${currentPlayer()}`);

  if (checkWinner(gameGrid, [row, col], "")) {
    tableCells.forEach((cell) => cell.removeEventListener("click", clickCell));
    document.getElementById(`${currentPlayer()}-crown`).style.visibility =
      "visible";
  } else {
    switchPlayer();
  }
};

// Cell click event handler with computer mechanics
const clickCellAI = (event) => {
  round++;
  const cell = event.target;
  const cellNumber = parseInt(cell.textContent, 10);
  const row = Math.floor(cellNumber / 3);
  const col = cellNumber % 3;

  if (gameGrid[row][col] === "P1" || gameGrid[row][col] === "P2") return;

  gameGrid[row][col] = getPlayerSymbol();
  cell.classList.add(`cell--${currentPlayer()}`);

  if (checkWinner(gameGrid, [row, col], "")) {
    tableCells.forEach((cell) =>
      cell.removeEventListener("click", clickCellAI)
    );
    document.getElementById(`${currentPlayer()}-crown`).style.visibility =
      "visible";
  } else if (round > 8) {
    tableCells.forEach((cell) =>
      cell.removeEventListener("click", clickCellAI)
    );
  } else {
    switchPlayer();
    const aiMove = minimax(
      flattenGrid(gameGrid),
      "P2",
      [row, col],
      [-5, -5]
    ).index;
    gameGrid[Math.floor(aiMove / 3)][aiMove % 3] = "P2";
    document.getElementById(`cell-${aiMove}`).classList.add(`cell--player2`);

    if (checkWinner(gameGrid, [Math.floor(aiMove / 3), aiMove % 3], "P2")) {
      tableCells.forEach((cell) =>
        cell.removeEventListener("click", clickCellAI)
      );
      document.getElementById("player2-crown").style.visibility = "visible";
    } else if (round === 8) {
      tableCells.forEach((cell) =>
        cell.removeEventListener("click", clickCellAI)
      );
    }

    switchPlayer();
  }
};

// Switch player utility function
const switchPlayer = () => {
  document.getElementById(currentPlayer()).classList.remove("current-player");
  currentPlayerIndex = 1 - currentPlayerIndex;
  document.getElementById(currentPlayer()).classList.add("current-player");
};

// Initialize first player
document.getElementById(currentPlayer()).classList.add("current-player");

// Attach event listeners
if (mode === "cvp") {
  tableCells.forEach((cell) => cell.addEventListener("click", clickCellAI));
} else {
  tableCells.forEach((cell) => cell.addEventListener("click", clickCell));
}

// Minimax AI logic
function minimax(board, player, humanPos, AIPos) {
  const availableSpots = avail(board);
  const grid = reconstructGrid(board);

  if (checkWinner(grid, humanPos, "P1")) return { score: -10 };
  if (checkWinner(grid, AIPos, "P2")) return { score: 10 };
  if (availableSpots.length === 0) return { score: 0 };

  const moves = availableSpots.map((spot) => {
    const move = { index: board[spot] };
    board[spot] = player;

    const nextPlayer = player === "P2" ? "P1" : "P2";
    const nextMove =
      player === "P2"
        ? minimax(board, nextPlayer, humanPos, [Math.floor(spot / 3), spot % 3])
        : minimax(board, nextPlayer, [Math.floor(spot / 3), spot % 3], AIPos);

    move.score = nextMove.score;
    board[spot] = move.index;
    return move;
  });

  return player === "P2"
    ? moves.reduce((best, move) => (move.score > best.score ? move : best), {
        score: -Infinity,
      })
    : moves.reduce((best, move) => (move.score < best.score ? move : best), {
        score: Infinity,
      });
}
// Available spots
function avail(board) {
  return board.filter((cell) => cell !== "P1" && cell !== "P2");
}

// Flatten and reconstruct grid utilities
function flattenGrid(grid) {
  return grid.flat();
}
function reconstructGrid(flat) {
  return [flat.slice(0, 3), flat.slice(3, 6), flat.slice(6, 9)];
}
