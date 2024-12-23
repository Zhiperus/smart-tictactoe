// Define players and initialize game variables
const players = [
  { name: "player1", moves: [] },
  { name: "player2", moves: [] },
];
let currentPlayerIndex = 0;
const currentPlayer = () => players[currentPlayerIndex];

document.getElementById(currentPlayer().name).classList.add("current-player");

// Setup game grid and directions
const tableCells = document.querySelectorAll("td");
const gameGrid = Array.from(document.querySelectorAll(".row")).map((row) =>
  Array.from(row.children)
);

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

const iterateCells = (startPos, dx, dy) => {
  let row = startPos[0];
  let col = startPos[1];
  const moves = currentPlayer().moves;

  for (let i = 0; i < 2; i++) {
    row += dx;
    col += dy;
    if (
      !isValidCell(row, col) ||
      !moves.includes(gameGrid[row][col].textContent)
    ) {
      return false;
    }
  }
  return true;
};

const checkLines = (gridPos) =>
  directions.some(({ dx, dy }) => iterateCells(gridPos, dx, dy));

const checkAdjacent = ([row, col]) => {
  const moves = currentPlayer().moves;

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
    console.log(dx1, dy1);
    console.log(dx2, dy2);
    console.log(isValidCell(row + dx1, col + dy1));
    console.log(isValidCell(row + dx2, col + dy2));
    console.log(row + dx2, col + dy2);
    console.log(gameGrid);
    const firstCell =
      isValidCell(row + dx1, col + dy1) &&
      moves.includes(gameGrid[row + dx1][col + dy1].textContent);
    const secondCell =
      isValidCell(row + dx2, col + dy2) &&
      moves.includes(gameGrid[row + dx2][col + dy2].textContent);
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

  if (players.some((player) => player.moves.includes(cell.textContent))) return;

  currentPlayer().moves.push(cell.textContent);
  cell.classList.add(`cell--${currentPlayer().name}`);

  if (checkWinner([row, col])) {
    tableCells.forEach((cell) => cell.removeEventListener("click", clickCell));
    document.getElementById(`${currentPlayer().name}-crown`).style.visibility =
      "visible";
  } else {
    document
      .getElementById(currentPlayer().name)
      .classList.remove("current-player");
    currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
    document
      .getElementById(currentPlayer().name)
      .classList.add("current-player");
  }
};

// Attach event listeners to all table cells
tableCells.forEach((cell) => cell.addEventListener("click", clickCell));
