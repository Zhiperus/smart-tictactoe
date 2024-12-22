const player1 = { name: "player1", moves: [] };
const player2 = { name: "player2", moves: [] };
const tableCells = document.getElementsByTagName("td");
const gameGrid = [
  [...document.getElementsByClassName("row-1")[0].children],
  [...document.getElementsByClassName("row-2")[0].children],
  [...document.getElementsByClassName("row-3")[0].children],
];
const directions = [
  "LEFT",
  "TOP-LEFT",
  "TOP",
  "TOP-RIGHT",
  "RIGHT",
  "BOTTOM-RIGHT",
  "BOTTOM",
  "BOTTOM-LEFT",
];
let currentPlayer = player1;
document.getElementById(currentPlayer.name).classList.add("current-player");

const iterateDirection = (direction) => {
  switch (direction) {
    case "RIGHT":
      return (gridPos) => [gridPos[0], gridPos[1] + 1];
    case "TOP-RIGHT":
      return (gridPos) => [gridPos[0] - 1, gridPos[1] + 1];
    case "TOP":
      return (gridPos) => [gridPos[0] - 1, gridPos[1]];
    case "TOP-LEFT":
      return (gridPos) => [gridPos[0] - 1, gridPos[1] - 1];
    case "LEFT":
      return (gridPos) => [gridPos[0], gridPos[1] - 1];
    case "BOTTOM-LEFT":
      return (gridPos) => [gridPos[0] + 1, gridPos[1] - 1];
    case "BOTTOM":
      return (gridPos) => [gridPos[0] + 1, gridPos[1]];
    case "BOTTOM-RIGHT":
      return (gridPos) => [gridPos[0] + 1, gridPos[1] + 1];
  }
};

const iterateCells = (gridPos, iterator) => {
  let newGridPos = gridPos;
  let currentPlayerMoves = currentPlayer.moves;

  for (let i = 0; i < 2; i++) {
    newGridPos = iterator(newGridPos);
    let [row, column] = newGridPos;

    if (!(column < 3 && column > -1) || !(row < 3 && row > -1)) {
      return 0;
    }

    if (!currentPlayerMoves.includes(gameGrid[row][column].textContent)) {
      return 0;
    }
  }
  return 1;
};

const checkLines = (gridPos) => {
  for (let direction of directions) {
    if (iterateCells(gridPos, iterateDirection(direction))) return 1;
  }

  return 0;
};

const checkAdjacent = (gridPos) => {
  let [row, column] = gridPos;
  let currentPlayerMoves = currentPlayer.moves;

  if (!(column + 1 < 3 && column - 1 > -1) || !(row + 1 < 3 && row - 1 > -1)) {
    return 0;
  }

  // Left and right
  if (
    currentPlayerMoves.includes(gameGrid[row][column + 1].textContent) &&
    currentPlayerMoves.includes(gameGrid[row][column - 1].textContent)
  ) {
    return 1;
    // Up and Down
  } else if (
    currentPlayerMoves.includes(gameGrid[row + 1][column].textContent) &&
    currentPlayerMoves.includes(gameGrid[row - 1][column].textContent)
  ) {
    return 1;
    // If center, then check adjacent diagonals
  } else if (
    gameGrid[row][column].textContent === "5" &&
    ((currentPlayerMoves.includes("3") && currentPlayerMoves.includes("7")) ||
      (currentPlayerMoves.includes("1") && currentPlayerMoves.includes("9")))
  ) {
    return 1;
  }

  return 0;
};

const checkWinner = (gridPos) => {
  if (checkAdjacent(gridPos) || checkLines(gridPos)) return 1;
};

const clickCell = (event) => {
  let cell = event.target;
  let cellNumber = parseInt(cell.textContent);
  let row = Math.floor((cellNumber - 1) / 3);
  let column = (cellNumber - 1) % 3;

  if (
    player1.moves.includes(cell.textContent) ||
    player2.moves.includes(cell.textContent)
  )
    return;

  currentPlayer.moves.push(cell.textContent);

  cell.classList.add(`cell--${currentPlayer.name}`);

  if (checkWinner([row, column])) {
    for (let cell of tableCells) {
      cell.removeEventListener("click", clickCell);
    }

    document.getElementById(`${currentPlayer.name}-crown`).style.visibility =
      "visible";
  } else {
    document
      .getElementById(currentPlayer.name)
      .classList.remove("current-player");
    currentPlayer = currentPlayer.name === "player1" ? player2 : player1;
    document.getElementById(currentPlayer.name).classList.add("current-player");
  }
};

for (let cell of tableCells) {
  cell.addEventListener("click", clickCell);
}
