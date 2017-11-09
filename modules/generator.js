const Generator = () => {
  const start = (visualizationTimeout, done) => {
    const emptyBoard = Array(9).fill().map(() => Array(9).fill('_'));
    const filledBoard = fillBoard(emptyBoard, visualizationTimeout);
    return done(filledBoard);
  };

  async function fillBoard(board, visualizationTimeout) {
    const possibleValues = Array(9).fill().map((e, i) => i + 1);
    for (let rowNumber = 0; rowNumber < board.length; rowNumber++) {
      let row = board[rowNumber];
      let availableValues = shuffle(possibleValues.slice(0));
      for (let colNumber = 0; colNumber < row.length; colNumber++) {
        let count = 0;
        let currentValue = 'X';

        for (var i = 0; i < availableValues.length; i++) {
          var val = availableValues[i];
          if (isPossible({ board, row: rowNumber, col: colNumber, value: val })) {
            currentValue = val;
            availableValues.splice(i, 1);
            break;
          }
        }

        if (currentValue === 'X') {
          rowNumber--;
          break;
        }
        availableValues = shuffle(availableValues);
        board[rowNumber][colNumber] = currentValue;
        if (visualizationTimeout !== false) {
          if (visualizationTimeout > 0) {
            drawBoard(board);
            await sleep(visualizationTimeout);
          }
        }
      }
    }
    drawBoard(board);
    return board;
  };

  const isPossible = ({ board, row, col, value }) => {
    // check if value can be inserted in current row
    for (let currentCol = 0; currentCol < col; currentCol++) {
      if (board[row][currentCol] === value) return false;
    }

    // check if value can be inserted in current column
    for (let currentRow = 0; currentRow < row; currentRow++) {
      if (board[currentRow][col] === value) return false;
    }

    return true;
  }

  const drawBoard = (board) => {
    process.stdout.write('\033c');

    console.log(' - - - - - - - - - - - -');

    for (let rowNumber = 0; rowNumber < board.length; rowNumber++) {
      const row = board[rowNumber];
      let rowString = '| ';
      for (let colNumber = 0; colNumber < row.length; colNumber++) {
        const cell = row[colNumber];
        if ((colNumber + 1) % 3 === 0) {
          rowString += `${cell} | `;
        } else {
          rowString += `${cell} `;
        }
      }
      console.log(rowString);
      if ((rowNumber + 1) % 3 === 0) {
        console.log(' - - - - - - - - - - - -');
      }
    }
  }

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return {
    start,
  };
};

module.exports = Generator;
