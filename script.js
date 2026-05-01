const GRID_SIZE = 10;
    const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
    const TOTAL_BOMBS = 10;
    const gridEl = document.getElementById("grid");
    const flagsLeftEl = document.getElementById("flagsLeft");
    const resultEl = document.getElementById("result");

    let grid = Array(TOTAL_CELLS).fill(false); // true = bomb
    let checked = Array(TOTAL_CELLS).fill(false); // true = revealed
    let flagged = Array(TOTAL_CELLS).fill(false); // true = user flagged
    let flagsLeft = TOTAL_BOMBS;
    let gameOver = false;

    // Utility: i, j ←→ id {0..99}
    const toId = (i, j) => i * GRID_SIZE + j;
    const fromId = (id) => [Math.floor(id / GRID_SIZE), id % GRID_SIZE];

    // Add bombs randomly (10 bombs)
    {
      let bombCount = 0;
      while (bombCount < TOTAL_BOMBS) {
        const id = Math.floor(Math.random() * TOTAL_CELLS);
        if (!grid[id]) {
          grid[id] = true;
          bombCount++;
        }
      }
    }

    // Count bombs in 3x3 area around (i, j)
    function countBombsAround(i, j) {
      let count = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const ni = i + di;
          const nj = j + dj;
          if (ni >= 0 && ni < GRID_SIZE && nj >= 0 && nj < GRID_SIZE) {
            const id = toId(ni, nj);
            if (grid[id]) count++;
          }
        }
      }
      return count;
    }

    // Render cell content
    function renderCell(id) {
      const cell = document.getElementById(String(id));
      const [i, j] = fromId(id);

      cell.classList.toggle("bomb", grid[id]);
      cell.classList.toggle("checked", checked[id]);
      cell.classList.toggle("flag", flagged[id]);

      if (flagged[id]) {
        cell.textContent = "🚩";
      } else if (checked[id]) {
        if (grid[id]) {
          cell.textContent = "💣";
        } else {
          const bombsCount = countBombsAround(i, j);
          cell.textContent = bombsCount === 0 ? "" : String(bombsCount);
        }
      } else {
        cell.textContent = "";
      }
    }

    // Left‑click: reveal cell
    function reveal(id) {
      if (gameOver || checked[id] || flagged[id]) return;

      checked[id] = true;
      renderCell(id);

      if (grid[id]) {
        // Bomb clicked → show all bombs and end game
        gameOver = true;
        for (let i = 0; i < TOTAL_CELLS; i++) {
          if (grid[i]) {
            checked[i] = true;
            renderCell(i);
          }
        }
        resultEl.textContent = "YOU LOSE!";
      } else {
        // Check win condition
        const revealedSafe = checked.filter((c, i) => c && !grid[i]).length;
        const flaggedBombs = flagged.filter((f, i) => f && grid[i]).length;
        const totalSafeCells = TOTAL_CELLS - TOTAL_BOMBS;

        if (revealedSafe === totalSafeCells || flaggedBombs === TOTAL_BOMBS) {
          gameOver = true;
          // Reveal all bombs as flags
          for (let i = 0; i < TOTAL_CELLS; i++) {
            if (grid[i] && !flagged[i]) {
              flagged[i] = true;
              flagsLeft--;
              renderCell(i);
            }
          }
          resultEl.textContent = "YOU WIN!";
        }
      }
    }

    // Right‑click: toggle flag
    function toggleFlag(id) {
      if (gameOver || checked[id]) return;

      if (flagged[id]) {
        flagged[id] = false;
        flagsLeft++;
      } else {
        if (flagsLeft > 0) {
          flagged[id] = true;
          flagsLeft--;
        }
      }
      renderCell(id);
      flagsLeftEl.textContent = flagsLeft;
    }

    // Create grid UI
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const id = toId(i, j);
        const div = document.createElement("div");
        div.id = String(id);
        div.className = "cell valid";
        div.setAttribute("data", "0");

        div.addEventListener("click", () => reveal(id));
        div.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          toggleFlag(id);
        });

        gridEl.appendChild(div);
        // Initially set data attribute (bomb count around)
        const bombs = countBombsAround(i, j);
        div.setAttribute("data", String(bombs));
      }
    }

    // Default state
    flagsLeftEl.textContent = flagsLeft;
