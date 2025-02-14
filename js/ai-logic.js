// Define players and initialize game variables
const players = ["player1", "player2"];
let currentPlayerIndex = 0;
let rounds = 0;
const tableCells = document.querySelectorAll("td");

// Setup game grid and directions
const gameGrid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const directions = [
  { name: "RIGHT", dx: 0, dy: 1 },
  { name: "TOP-RIGHT", dx: -1, dy: 1 },
  { name: "TOP", dx: -1, dy: 0 },
  { name: "TOP-LEFT", dx: -1, dy: -1 },
  { name: "LEFT", dx: 0, dy: -1 },
  { name: "BOTTOM-LEFT", dx: 1, dy: -1 },
  { name: "BOTTOM", dx: 1, dy: 0 },
  { name: "BOTTOM-RIGHT", dx: 1, dy: 1 },
];

// Utility functions
const isValidCell = (row, col) => col > -1 && col < 3 && row > -1 && row < 3;

const getPlayerSymbol = () => (currentPlayer() === "player1" ? "P1" : "P2");

const currentPlayer = () => players[currentPlayerIndex];

// Checker functions
const iterateCells = (startPos, dx, dy) => {
  let [row, col] = startPos;
  const playerSymbol = getPlayerSymbol();

  for (let i = 0; i < 2; i++) {
    row += dx;
    col += dy;
    if (!isValidCell(row, col) || !(gameGrid[row][col] === playerSymbol)) {
      return false;
    }
    console.log(gameGrid[row][col]);
  }
  return true;
};

const checkLines = (gridPos) =>
  directions.some(({ dx, dy }) => iterateCells(gridPos, dx, dy));

const checkAdjacent = ([row, col]) => {
  const playerSymbol = getPlayerSymbol();

  const adjacentChecks = [
    // Horizontal
    [0, -1, 0, 1],
    // Vertical
    [-1, 0, 1, 0],
    // Diagonal top-left to bottom-right
    [-1, -1, 1, 1],
    // Diagonal top-right to bottom-left
    [-1, 1, 1, -1],
  ];

  return adjacentChecks.some(([dx1, dy1, dx2, dy2]) => {
    const firstCell =
      isValidCell(row + dx1, col + dy1) &&
      gameGrid[row + dx1][col + dy1] === playerSymbol;
    const secondCell =
      isValidCell(row + dx2, col + dy2) &&
      gameGrid[row + dx2][col + dy2] === playerSymbol;
    return firstCell && secondCell;
  });
};

const checkWinner = (gridPos) => checkAdjacent(gridPos) || checkLines(gridPos);

// Cell click event handler
const clickCell = (event) => {
  const cell = event.target;
  const cellNumber = parseInt(cell.textContent, 10);
  const row = Math.floor((cellNumber - 1) / 3);
  const col = (cellNumber - 1) % 3;

  
  if (gameGrid[row][col] === "P1" || gameGrid[row][col] === "P2") return;

  rounds++;

  gameGrid[row][col] = getPlayerSymbol();
  cell.classList.add(`cell--${currentPlayer()}`);
  console.log(gameGrid);

  if (checkWinner([row, col])) {
    tableCells.forEach((cell) => cell.removeEventListener("click", clickCell));
    document.getElementById(`${currentPlayer()}-crown`).style.visibility =
      "visible";
  } else {
    document.getElementById(currentPlayer()).classList.remove("current-player");
    currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
    document.getElementById(currentPlayer()).classList.add("current-player");
  }
};

// Indicate first move to be for Player 1
document.getElementById(currentPlayer()).classList.add("current-player");

// Attach event listeners to all table cells
tableCells.forEach((cell) => cell.addEventListener("click", clickCell));
