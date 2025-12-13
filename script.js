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

  const printBoard = () => {
    const boardWithCellValues = board.map((cell) => cell.getMark());
    console.log(boardWithCellValues);
  };

  const checkwinning = () => {
    const arr = board.map((cell) => cell.getMark());
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
    const allCellVal = board.map((cell) => cell.getMark());
    for (let i = 0; i < 9; i++) {
      if (allCellVal[i] == 0) return false;
    }
    return true;
  };

  return { getBoard, markCell, printBoard, checkwinning, isCellFull };
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

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s Turn`);
  };

  let isGameOver = false;

  const playRound = (index) => {
    if (isGameOver) return;
    console.log(`dropping ${activePlayer.name}'s mark on index ${index}...`);
    const marked = board.markCell(index, activePlayer.mark);
    if (!marked) return;
    const isWon = board.checkwinning();
    if (isWon) {
      isGameOver = true;
      console.log(`Game won by ${activePlayer.name}`);
      return;
    }
    const isDraw = board.isCellFull();
    if (isDraw) {
      isGameOver = true;
      console.log(`Game is draw`);
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };
  printNewRound();

  const resetGame = () => {
    for (let i = 0; i < 9; i++) {
      board[i].setMark(0);
    }
    isGameOver = false;
    activePlayer = player[0];
  };
  return { playRound, getActivePlayer };
};
