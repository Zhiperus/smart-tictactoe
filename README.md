# Smart Tic-Tac-Toe

A browser-based Tic-Tac-Toe game featuring a custom-built AI opponent using the Minimax algorithm and a recursive winner-check system. This project demonstrates purely client-side logic with advanced state evaluation.

## Features

* **Dual Game Modes**:
* **PvP**: Classic Player vs. Player on the same device.
* **CvP (Smart AI)**: Challenge a computer opponent that calculates optimal moves.


* **Recursive AI Logic**: The computer uses a **Minimax algorithm** to simulate all possible future game states, ensuring it always makes the most optimal move to win or draw.
* **Advanced State Validation**: Instead of hardcoding winning combinations, the game uses a dynamic, direction-based checking system (`checkLines` and `checkAdjacent`) to verify win conditions from any cell.

## How the "Smart" Logic Works

### 1. The Minimax Algorithm (Recursion)

The core of the AI is the `minimax` function. It doesn't just look at the current board; it recursively plays the game out to the end in its "mind" for every possible move.

* **Simulation**: It temporarily places a move on the board.
* **Recursion**: It calls itself to simulate the opponent's best response to that move.
* **Scoring**:
* Win for AI: `+10`
* Win for Player: `-10`
* Draw: `0`


* **Decision**: It chooses the move with the highest score (maximizing its own odds) while assuming the opponent will choose the move with the lowest score (minimizing the AI's odds).

> **Reference**: The implementation of this logic was adapted from the game theory concepts found in [Finding Optimal Move in Tic-Tac-Toe using Minimax Algorithm (GeeksforGeeks)](https://www.geeksforgeeks.org/dsa/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/).

### 2. Dynamic Winner Checking

Rather than checking 8 hardcoded lines (3 rows, 3 cols, 2 diagonals), the game uses a vector-based approach:

* **`iterateCells`**: Checks a specific direction (defined by `dx`, `dy` vectors) from a starting cell.
* **`checkAdjacent`**: Verifies immediate neighbors in opposite directions (e.g., checking Left *and* Right simultaneously to see if the current cell completes a line in the middle).
* **`checkLines`**: Scans outward in a single direction to find a sequence of 3.

## Technologies Used

* **HTML5**: Game structure.
* **CSS3**: Styling and responsive grid layout.
* **Vanilla JavaScript (ES6+)**: All game logic, DOM manipulation, and AI algorithms.

## Installation & Usage

Since this is a client-side application, no server installation is required.

1. **Clone the repository**
```bash
git clone https://github.com/Zhiperus/smart-tictactoe.git

```


2. **Play the Game**
Simply open `index.html` in any modern web browser.
3. **Select Mode**
* Default is PvP.
* Use the UI toggle to play against the AI.
