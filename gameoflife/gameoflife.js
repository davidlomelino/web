const canvas = document.getElementById('gameOfLifeCanvas');
const ctx = canvas.getContext('2d');
const rows = 70;
const cols = 140;
const cellSize = 20;
const speed = 300;

let grid = createEmptyGrid();
let isRunning = false;
let intervalId = null;

function createEmptyGrid() {
  return new Array(rows).fill(null)
    .map(() => new Array(cols).fill(0));
}

function drawGrid() {
  // Mörk bakgrund
  ctx.fillStyle = '#878787';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Rita cell
      ctx.beginPath();
      ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);

      // Levande celler får en gradient-färg
      if (grid[row][col]) {
        const gradient = ctx.createLinearGradient(
          col * cellSize, row * cellSize, 
          col * cellSize + cellSize, row * cellSize + cellSize
        );
        gradient.addColorStop(0, '#ffff00ff'); 
        gradient.addColorStop(1, '#a39a1bff'); 
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = '#878787'; 
      }

      ctx.fill();
      ctx.strokeStyle = '#878787';
      // ctx.stroke();
    }
  }
}

function nextGeneration() {
  const nextGrid = grid.map(row => row.slice());
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const neighbors = countNeighbors(row, col);
      if (grid[row][col] === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGrid[row][col] = 0;
      } else if (grid[row][col] === 0 && neighbors === 3) {
        nextGrid[row][col] = 1;
      }
    }
  }
  grid = nextGrid;
}

function countNeighbors(row, col) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const x = row + i;
      const y = col + j;
      if (x >= 0 && x < rows && y >= 0 && y < cols) {
        sum += grid[x][y];
      }
    }
  }
  return sum;
}


function addRandomClusters(clusterCount = 10) {
  for (let n = 0; n < clusterCount; n++) {
    const startRow = Math.floor(Math.random() * (rows - 3));
    const startCol = Math.floor(Math.random() * (cols - 3));

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        grid[startRow + i][startCol + j] = Math.random() > 0.5 ? 1 : 0;
      }
    }
  }
}



function startGame() {
  if (!isRunning) {
    isRunning = true;
    intervalId = setInterval(() => {
      nextGeneration();
      drawGrid();
    }, speed);
  }
}

function stopGame() {
  isRunning = false;
  clearInterval(intervalId);
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  grid[row][col] = grid[row][col] ? 0 : 1;
  drawGrid();
});

grid = createEmptyGrid();
addRandomClusters(15);  // Lägg till 15 slumpade kluster
drawGrid();


document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('stopBtn').addEventListener('click', stopGame);

document.getElementById('exitBtn').addEventListener('click', () => {
  window.location.href = '../index.html';
});
