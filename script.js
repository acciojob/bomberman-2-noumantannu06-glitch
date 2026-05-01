  const BOARD_SIZE = 10;
    const TOTAL_BOMBS = 10;
    let board = [];
    let bombs = [];
    let flagsLeft = TOTAL_BOMBS;
    let revealedCount = 0;
    let gameOver = false;

    // Directions for neighbors (8 directions)
    const DIRECTIONS = [
      [-1,-1], [-1,0], [-1,1],
      [0,-1],           [0,1],
      [1,-1],  [1,0],  [1,1]
    ];

    function initGame() {
      board = [];
      bombs = [];
      flagsLeft = TOTAL_BOMBS;
      revealedCount = 0;
      gameOver = false;
      document.getElementById('result').textContent = '';
      document.getElementById('flagsCount').textContent = flagsLeft;
      createBoard();
      placeBombs();
      calculateNumbers();
    }

    function createBoard() {
      const boardEl = document.getElementById('board');
      boardEl.innerHTML = '';
      for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
        const cell = document.createElement('div');
        cell.id = i.toString();
        cell.className = 'cell valid';
        cell.dataset.number = '0';
        cell.addEventListener('click', leftClick);
        cell.addEventListener('contextmenu', rightClick);
        boardEl.appendChild(cell);
        board.push({ id: i, isBomb: false, revealed: false, flagged: false, number: 0 });
      }
    }

    function placeBombs() {
      let placed = 0;
      while (placed < TOTAL_BOMBS) {
        const rand = Math.floor(Math.random() * 100);
        if (!bombs.includes(rand)) {
          bombs.push(rand);
          board[rand].isBomb = true;
          document.getElementById(rand).classList.add('bomb');
          placed++;
        }
      }
    }

    function calculateNumbers() {
      board.forEach(cell => {
        if (!cell.isBomb) {
          let count = 0;
          const row = Math.floor(cell.id / 10);
          const col = cell.id % 10;
          DIRECTIONS.forEach(([dr, dc]) => {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
              const nid = nr * 10 + nc;
              if (board[nid].isBomb) count++;
            }
          });
          cell.number = count;
          document.getElementById(cell.id).dataset.number = count.toString();
        }
      });
    }

    function leftClick(e) {
      if (gameOver) return;
      const cellId = parseInt(e.target.id);
      const cell = board[cellId];
      const el = e.target;

      if (cell.flagged) return; // Ignore if flagged

      if (cell.isBomb) {
        revealAllBombs();
        document.getElementById('result').textContent = 'YOU LOSE!';
        gameOver = true;
        return;
      }

      revealCell(cellId);
      checkWin();
    }

    function rightClick(e) {
      e.preventDefault();
      if (gameOver) return;
      const cellId = parseInt(e.target.id);
      const cell = board[cellId];
      const el = e.target;

      if (cell.revealed) return;

      if (!cell.flagged && flagsLeft > 0) {
        cell.flagged = true;
        el.classList.add('flag');
        el.textContent = '🚩';
        flagsLeft--;
        document.getElementById('flagsCount').textContent = flagsLeft;
      } else if (cell.flagged) {
        cell.flagged = false;
        el.classList.remove('flag');
        el.textContent = '';
        flagsLeft++;
        document.getElementById('flagsCount').textContent = flagsLeft;
      }
      checkWin();
    }

    function revealCell(id) {
      const cell = board[id];
      const el = document.getElementById(id);
      if (cell.revealed) return;

      cell.revealed = true;
      el.classList.add('checked');
      revealedCount++;

      if (cell.number === 0) {
        // Recursively reveal neighbors
        const row = Math.floor(id / 10);
        const col = id % 10;
        DIRECTIONS.forEach(([dr, dc]) => {
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
            const nid = nr * 10 + nc;
            if (!board[nid].flagged) {
              revealCell(nid);
            }
          }
        });
      } else {
        el.textContent = cell.number;
      }
    }

    function revealAllBombs() {
      bombs.forEach(bombId => {
        const el = document.getElementById(bombId);
        el.classList.add('checked');
        el.textContent = '💣';
      });
    }

    function checkWin() {
      // Win: 90 safe cells revealed OR all 10 bombs flagged
      if (revealedCount >= 90 || flagsLeft === 0) {
        document.getElementById('result').textContent = 'YOU WIN!';
        gameOver = true;
      }
    }

    // Init game on load
    initGame();