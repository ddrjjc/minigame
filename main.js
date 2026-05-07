const mazeElement = document.getElementById('maze');
const playerElement = document.getElementById('player');
const goalElement = document.getElementById('goal');

const SIZE = 25; // Level 5 difficulty: 25x25 grid
const CELL_SIZE = 24; // Larger cells for better visibility (25 * 24 = 600px)

let maze = [];
let playerPos = { x: 0, y: 0 };
let goalPos = { x: SIZE - 1, y: SIZE - 1 };

function initMaze() {
    maze = Array(SIZE).fill().map(() => Array(SIZE).fill(1)); // 1 is wall, 0 is path
    generateMaze(0, 0);
    drawMaze();
    resetPlayer();
}

function generateMaze(x, y) {
    maze[y][x] = 0;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && maze[ny][nx] === 1) {
            maze[y + dy][x + dx] = 0;
            generateMaze(nx, ny);
        }
    }
}

function drawMaze() {
    mazeElement.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
    mazeElement.style.gridTemplateRows = `repeat(${SIZE}, 1fr)`;
    mazeElement.innerHTML = '';

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (maze[y][x] === 1) cell.classList.add('wall');
            mazeElement.appendChild(cell);
        }
    }

    goalElement.style.width = `${CELL_SIZE}px`;
    goalElement.style.height = `${CELL_SIZE}px`;
    goalElement.style.left = `${goalPos.x * CELL_SIZE}px`;
    goalElement.style.top = `${goalPos.y * CELL_SIZE}px`;
    goalElement.innerText = '🏁';
    goalElement.style.display = 'flex';
    goalElement.style.alignItems = 'center';
    goalElement.style.justifyContent = 'center';
    goalElement.style.fontSize = `${CELL_SIZE * 0.8}px`;
}

function resetPlayer() {
    playerPos = { x: 0, y: 0 };
    updatePlayerPosition();
}

function updatePlayerPosition() {
    playerElement.style.width = `${CELL_SIZE}px`;
    playerElement.style.height = `${CELL_SIZE}px`;
    playerElement.style.left = `${playerPos.x * CELL_SIZE}px`;
    playerElement.style.top = `${playerPos.y * CELL_SIZE}px`;
    playerElement.innerText = '🚗';
    playerElement.style.display = 'flex';
    playerElement.style.alignItems = 'center';
    playerElement.style.justifyContent = 'center';
    playerElement.style.fontSize = `${CELL_SIZE * 0.8}px`;
    
    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
        setTimeout(() => {
            alert('Great job! You parked the car!');
            initMaze();
        }, 100);
    }
}

function movePlayer(dx, dy) {
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;

    if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && maze[ny][nx] === 0) {
        playerPos.x = nx;
        playerPos.y = ny;
        updatePlayerPosition();
        
        // Rotate car based on direction
        if (dx === 1) playerElement.style.transform = 'rotate(0deg)';
        if (dx === -1) playerElement.style.transform = 'rotate(180deg)';
        if (dy === 1) playerElement.style.transform = 'rotate(90deg)';
        if (dy === -1) playerElement.style.transform = 'rotate(-90deg)';
    }
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
    }
});

document.getElementById('up').onclick = () => movePlayer(0, -1);
document.getElementById('down').onclick = () => movePlayer(0, 1);
document.getElementById('left').onclick = () => movePlayer(-1, 0);
document.getElementById('right').onclick = () => movePlayer(1, 0);

initMaze();
