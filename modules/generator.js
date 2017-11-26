const sleepAmount = 0;

const Generator = () => {
  async function start(visualizationTimeout, done) {
    console.time("gen");
    const emptyBoard = Array(9).fill().map(() => Array(9).fill('_'));
    let board = emptyBoard.map((b) => b.slice(0));
    const cellValues = Array(9).fill().map(() => Array(9).fill().map(() => {
      return getNewValues();
    }));
    await addNumber({ board, cellValues, pos: 0, added: false });
    console.timeEnd("gen");
    return done(board);
  };

  function getNewValues() {
    let possibleValues = Array(9).fill().map((e, i) => i + 1);
    possibleValues = shuffle(possibleValues.slice(0));

    return Array(9).fill().map((e, i) => possibleValues[i]);
  }

  async function addNumber({ board, cellValues, pos }) {
    if (pos >= 81) {
      return;
    }

    // Get row and col
    const row = Math.floor((pos) / 9);
    const col = pos % 9;

    // Try to add Number out of all available cellValues
    for (let idx = 0; idx < cellValues[row][col].length; idx++) {
      const value = cellValues[row][col][idx];

      // Try to insert
      if (isPossible({ board, row, col, value })) {
        // console.log('is possible');

        board[row][col] = value;
        cellValues[row][col].splice(idx, 1);

        drawBoard(board);
        await sleep(sleepAmount);

        // add next number
        return addNumber({ board, cellValues, pos: pos + 1 });
      }
    }

    // Go back one cell and try different value
    board[row][col] = '_';
    cellValues[row][col] = getNewValues();
    drawBoard(board);
    await sleep(sleepAmount);
    return addNumber({ board, cellValues, pos: pos - 1 });
  }

  const isPossible = ({ board, row, col, value }) => {
    // check if value can be inserted in current row
    for (let currentCol = 0; currentCol < col; currentCol++) {
      if (board[row][currentCol] === value) return false;
    }

    // check if value can be inserted in current column
    for (let currentRow = 0; currentRow < row; currentRow++) {
      if (board[currentRow][col] === value) return false;
    }

    // check if value can be inserted in current square
    const squareHorizontal = Math.floor(col / 3);
    const squareVertical = Math.floor(row / 3);
    const breakHorizontal = squareHorizontal * 3;
    const breakVertical = squareVertical * 3;
    const valuesInSquare = [];

    for (let currentRow = breakVertical + 2; currentRow >= breakVertical; currentRow--) {
      for (let currentCol = breakHorizontal + 2; currentCol >= breakHorizontal; currentCol--) {
        valuesInSquare.push(board[currentRow][currentCol]);
      }
    }

    for (let idx = 0; idx < valuesInSquare.length; idx++) {
      if (valuesInSquare[idx] === value) return false;
    }

    return true;
  }

  const drawBoard = (board) => {
    // process.stdout.write('\033c'); //clear cmd

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

  const sleep = () => {
    if (sleepAmount > 0) {
      return new Promise(resolve => setTimeout(resolve, sleepAmount));
    } else {
      return new Promise(resolve => resolve());
    }
  }

  return {
    start,
  };
};

module.exports = Generator;
