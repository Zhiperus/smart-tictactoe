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
const iterateCells = (gameGrid, startPos, dx, dy, player) => {
  let [row, col] = startPos;
  const playerSymbol = player === "" ? getPlayerSymbol() : player;

  for (let i = 0; i < 2; i++) {
    row += dx;
    col += dy;
    if (!isValidCell(row, col) || !(gameGrid[row][col] === playerSymbol)) {
      return false;
    }
  }
  return true;
};

const checkLines = (gameGrid, gridPos, player) =>
  directions.some(({ dx, dy }) =>
    iterateCells(gameGrid, gridPos, dx, dy, player)
  );

const checkAdjacent = (gameGrid, startPos, player) => {
  let [row, col] = startPos;
  const playerSymbol = player === "" ? getPlayerSymbol() : player;

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

const checkWinner = (gameGrid, gridPos, player) =>
  checkAdjacent(gameGrid, gridPos, player) ||
  checkLines(gameGrid, gridPos, player);

// Cell click event handler
const clickCell = (event) => {
  const cell = event.target;
  const cellNumber = parseInt(cell.textContent, 10);
  const row = Math.floor(cellNumber / 3);
  const col = cellNumber % 3;

  if (gameGrid[row][col] === "P1" || gameGrid[row][col] === " P2") return;

  gameGrid[row][col] = getPlayerSymbol();
  cell.classList.add(`cell--${currentPlayer()}`);

  if (checkWinner(gameGrid, [row, col], "")) {
    tableCells.forEach((cell) => cell.removeEventListener("click", clickCell));
    document.getElementById(`${currentPlayer()}-crown`).style.visibility =
      "visible";
  } else {
    document.getElementById(currentPlayer()).classList.remove("current-player");
    currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
    document.getElementById(currentPlayer()).classList.add("current-player");
  }
};

// Cell click event handler
const clickCellAI = (event) => {
  const cell = event.target;
  const cellNumber = parseInt(cell.textContent, 10);
  const row = Math.floor(cellNumber / 3);
  const col = cellNumber % 3;

  if (gameGrid[row][col] === "P1" || gameGrid[row][col] === " P2") return;

  gameGrid[row][col] = getPlayerSymbol();
  cell.classList.add(`cell--${currentPlayer()}`);

  if (checkWinner(gameGrid, [row, col], "")) {
    tableCells.forEach((cell) => cell.removeEventListener("click", clickCell));
    document.getElementById(`${currentPlayer()}-crown`).style.visibility =
      "visible";
  } else {
    document.getElementById(currentPlayer()).classList.remove("current-player");
    currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
    document.getElementById(currentPlayer()).classList.add("current-player");

    let index = minimax(
      [...gameGrid[0], ...gameGrid[1], ...gameGrid[2]],
      "P2",
      [-5, -5]
    ).index;

    console.log([...gameGrid[0], ...gameGrid[1], ...gameGrid[2]]);
    console.log("AI Move: " + index);
    gameGrid[Math.floor(index / 3)][index % 3] = "P2";
    document
      .getElementById(`cell-${index}`)
      .classList.add(`cell--${currentPlayer()}`);

    document.getElementById(currentPlayer()).classList.remove("current-player");
    currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
    document.getElementById(currentPlayer()).classList.add("current-player");
  }
};

// Indicate first move to be for Player 1
document.getElementById(currentPlayer()).classList.add("current-player");

// Attach event listeners to all table cells
if (mode === "cvp")
  tableCells.forEach((cell) => cell.addEventListener("click", clickCellAI));
else tableCells.forEach((cell) => cell.addEventListener("click", clickCell));

function minimax(reboard, player, currPos) {
  let array = avail(reboard);
  const gameGrid = [
    reboard.slice(0, 3),
    reboard.slice(3, 6),
    reboard.slice(6, 9),
  ];

  if (checkWinner(gameGrid, currPos, "P1")) {
    console.log("P1 WINNER");
    console.log(gameGrid);
    console.log("currPos: " + currPos);
    return {
      score: -10,
    };
  } else if (checkWinner(gameGrid, currPos, "P2")) {
    console.log("P2 WINNER");
    console.log(gameGrid);
    console.log("currPos: " + currPos);
    return {
      score: 10,
    };
  } else if (array.length === 0) {
    return {
      score: 0,
    };
  }

  var moves = [];
  for (var i = 0; i < array.length; i++) {
    var move = {};
    move.index = reboard[array[i]];
    let index = move.index;
    reboard[array[i]] = player;

    if (player === "P2") {
      var g = minimax(reboard, "P1", [Math.floor(index / 3), index % 3]);
      move.score = g.score;
    } else {
      var g = minimax(reboard, "P2", [Math.floor(index / 3), index % 3]);
      move.score = g.score;
    }
    reboard[array[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === "P2") {
    var bestScore = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  console.log(moves);
  return moves[bestMove];
}

//available spots
function avail(reboard) {
  return reboard.filter((s) => s != "P1" && s != "P2");
}

// /P1 WINNER
// (3) [Array(3), Array(3), Array(3)]
// 0
// :
// (3) ['P1', 'P2', 'P2']
// 1
// :
// (3) ['P2', 'P1', 5]
// 2
// :
// (3) ['P1', 'P1', 'P2']
// length
// :
// 3
