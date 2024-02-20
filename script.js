const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');

// Grid setup
const cellSize = 9;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);

// Set canvas dimensions
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

// Grid init
let grid = [];
for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
        grid[i][j] = false; // Initialize all cells as alive
        // if (Math.floor(i / canvas.width) === canvas.width / 2) {
        //     console.log(i)
        //     grid[i][j] = true
        // }
    }
}

let simulationRunning = false;
let intervalId = null;
const updateTime = 500;

let firstRun = true;

let backupGrid;

const updateButton = document.getElementById('updateButton');
updateButton.addEventListener('click', function() {
    simulationRunning = !simulationRunning;
    if (simulationRunning) {
        updateButton.textContent = 'Stop Simulation';
        if (firstRun) {
            backupGrid = grid;
            console.log(backupGrid)
            firstRun = false
        }
        intervalId = setInterval(updateGrid, updateTime)
        // updateGrid(); // Start the simulation
    } else {
        updateButton.textContent = 'Start Simulation';
        clearInterval(intervalId)
    }
});

const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', function() {
    // console.log(firstRun, grid === backupGrid)
    clearInterval(intervalId);
    firstRun = true;
    grid = backupGrid;
    updateGrid()
});


canvas.addEventListener('click', function(e) {
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);

    grid[y][x] = !grid[y][x];

    drawGrid();
});

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const color = grid[i][j] ? '#000' : '#fff';

            ctx.fillStyle = color;
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }

    // Draw horizontal line at the middle
    ctx.strokeStyle = '#ccc'; // Color of the line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw vertical line at the middle
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}


function updateGrid() {
    const newGrid = [];

    for (let i = 0; i < rows; i++) {
        newGrid[i] = [];
        for (let j = 0; j < cols; j++) {
            const neighbors = countNeighbors(i, j);

            if (grid[i][j]) {
                if (neighbors <= 2 || neighbors > 5) {
                    newGrid[i][j] = false;
                } else {
                    newGrid[i][j] = true;
                }
            } else {
                if (neighbors > 2 && neighbors < 5) {
                    newGrid[i][j] = true;
                } else {
                    newGrid[i][j] = false;
                }
                if (neighbors === 6) {
                    newGrid[i][j] = true
                }
            }
        }
    }
    grid = newGrid;

    drawGrid();

    // if (simulationRunning) {
    //     requestAnimationFrame(updateGrid);
    // }
}

function countNeighbors(row, col) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;

            const newRow = row + i;
            const newCol = col + j;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (grid[newRow][newCol]) {
                    count++;
                }
            }
        }
    }

    return count;
}

drawGrid(); // Initial draw




// Zooming unimportant
let currentZoom = 1; 
let minZoom = 1; 
let maxZoom = 3; 
let stepSize = 0.1;
  
canvas.addEventListener('wheel', function (event) { 
    // Zoom in or out based on the scroll direction 
    let direction = event.deltaY > 0 ? -1 : 1; 
    zoomImage(direction); 
});

function zoomImage(direction) { 
    let newZoom = currentZoom + direction * stepSize; 
  
    // Limit the zoom level to the minimum and maximum values 
    if (newZoom < minZoom || newZoom > maxZoom) { 
        return; 
    } 
  
    currentZoom = newZoom; 
  
    // Update the CSS transform of the image to scale it 
    // let image = document.querySelector('#image-container img'); 
    canvas.style.transform = 'scale(' + currentZoom + ')'; 
}