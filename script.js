const Gameboard = (function () {
  let board = [];
  for (let i = 0; i < 9; i++) {
    board.push(cell());
  }
  const getBoard = () => board;

  const markCell = (index, mark) => {
    if (board[index].getMark() !== 0) return false;
    board[index].setMark(mark);
    return true;
  };

  return { getBoard, markCell };
})();

function cell() {
  let value = 0;

  const setMark = (mark) => (value = mark);
  const getMark = () => value;
  return { setMark, getMark };
}

const GameController = function (playerOne = "first", playerTwo = "second") {
  const board = Gameboard;
  const player = [
    { name: playerOne, mark: 1 },
    {
      name: playerTwo,
      mark: 2,
    },
  ];

  let activePlayer = player[0];
  const switchPlayerTurn = () => {
    if (activePlayer == player[0]) activePlayer = player[1];
    else activePlayer = player[0];
  };

  const getActivePlayer = () => activePlayer;

  let isGameOver = false;

  const playRound = (index) => {
    if (isGameOver) return;
    const marked = board.markCell(index, activePlayer.mark);
    if (!marked) return;
    const isWon = checkwinning();
    if (isWon) {
      isGameOver = true;
      return `Game won by ${activePlayer.name}`;
    }
    const isDraw = isCellFull();
    if (isDraw) {
      isGameOver = true;
      return "Game is draw";
    }
    switchPlayerTurn();
    return "";
  };

  const resetGame = () => {
    for (let i = 0; i < 9; i++) {
      board.getBoard()[i].setMark(0);
    }
    isGameOver = false;
    activePlayer = player[0];
  };

  const checkwinning = () => {
    const arr = board.getBoard().map((cell) => cell.getMark());
    if (arr[0] != 0 && arr[0] == arr[1] && arr[1] == arr[2]) return true;
    if (arr[3] != 0 && arr[3] == arr[4] && arr[4] == arr[5]) return true;
    if (arr[6] != 0 && arr[6] == arr[7] && arr[7] == arr[8]) return true;

    if (arr[0] != 0 && arr[0] == arr[3] && arr[3] == arr[6]) return true;
    if (arr[1] != 0 && arr[1] == arr[4] && arr[4] == arr[7]) return true;
    if (arr[2] != 0 && arr[2] == arr[5] && arr[5] == arr[8]) return true;

    if (arr[0] != 0 && arr[0] == arr[4] && arr[4] == arr[8]) return true;
    if (arr[2] != 0 && arr[2] == arr[4] && arr[4] == arr[6]) return true;

    return false;
  };

  const isCellFull = () => {
    const allCellVal = board.getBoard().map((cell) => cell.getMark());
    for (let i = 0; i < 9; i++) {
      if (allCellVal[i] == 0) return false;
    }
    return true;
  };

  return {
    playRound,
    getActivePlayer,
    board: board.getBoard(),
    resetGame,
  };
};

function screenController() {
  const playerOne = document.querySelector("#first-person");
  const playerTwo = document.querySelector("#second-person");
  if (!playerOne.value || !playerTwo.value) return;
  const game = GameController(playerOne.value, playerTwo.value);

  const container = document.querySelector(".container");
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const result = document.querySelector(".result");

  const UpdateScreen = () => {
    boardDiv.textContent = "";

    const board = game.board;
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn ...`;

    board.forEach((cell, index) => {
      const cellButton = document.createElement("button");
      cellButton.classList.add("cell");
      cellButton.dataset.index = index;
      const text = cell.getMark();
      let mark = "";
      if (text == 1) mark = "X";
      else if (text == 2) mark = "O";
      cellButton.textContent = mark;
      cellButton.style.backgroundColor = "blue";
      cellButton.style.height = "100%";
      cellButton.style.width = "100%";
      boardDiv.appendChild(cellButton);
    });
  };

  boardDiv.addEventListener("click", (e) => {
    if (!e.target.dataset.index) return;
    const status = game.playRound(e.target.dataset.index);
    UpdateScreen();
    if (!result.textContent) result.textContent = status;
  });

  const reset = document.querySelector(".reset");
  reset.addEventListener("click", () => {
    game.resetGame();
    UpdateScreen();
    playerTurnDiv.textContent = "";
    result.textContent = "";
  });
  UpdateScreen();
}

const start = document.querySelector(".start");
start.addEventListener("click", screenController);
