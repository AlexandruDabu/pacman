const canvas = document.getElementById('pacman');
const ctx = canvas.getContext('2d');

let rows;
let cols;
const cellSize = 25;
let score = 0;
let animationFrameId;
let ghostSpeed = 0.05;
let numberOfGhosts = 1;
rows = cols = 8;
let level = 1;

let pacman = {
    x: Number,  
    y: Number,
    size: 10,
    speed: 1,
};

let ghosts = [];

let map = [];

function hideLayouts() {
    document.getElementById('message').style.display = 'none';
    document.getElementById('playAgain').style.display = 'none';
    document.getElementById('mapLength').style.display = 'none';
    document.getElementById('ghosts').style.display = 'none';
    document.getElementById('StartGame').style.display = 'none';
    document.getElementById('pacman').style.display = 'block';
    document.getElementById('NextLevel').style.display = 'none';
    document.getElementById('onLevels').style.display = 'none';
}

function generateMap() {
    map = [];
    for (let y = 0; y < rows; y++) {
        let row = [];
        for (let x = 0; x < cols; x++) {
            if (y === 0 || y === rows - 1 || x === 0 || x === cols - 1) {
                row.push(1);
            } else if (Math.random() < 0.2) {
                row.push(1);
            } else if (Math.random() < 0.1) {
                row.push(2);
            } else {
                row.push(0);
            }
        }
        map.push(row);
    }
}

function drawMap() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else if (map[y][x] === 2) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(
                    x * cellSize + cellSize / 2,
                    y * cellSize + cellSize / 2,
                    cellSize / 5,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
}

function initializeGhosts(numGhosts, ghostSpeed) {
    ghosts = [];
    for (let i = 0; i < numGhosts; i++) {
        let validPosition = false;
        let ghostX, ghostY;

        while (!validPosition) {
            ghostX = Math.floor(Math.random() * (cols/2 - 2)) + 1 + cols/2
            ghostY = Math.floor(Math.random() * (rows - 2)) + 1

            if (!isWall(ghostX, ghostY)) {
                validPosition = true;
            }
        }

        ghosts.push({
            x: ghostX,
            y: ghostY,
            direction: 180,
            speed: ghostSpeed,
            moveProgress: 0,
        });
    }
}


function isWall(x, y) {
    return map[y] && map[y][x] === 1;
}

function isPoint(x, y) {
    return map[y] && map[y][x] === 2;
}

function movePacman(direction) {
    let newX = pacman.x;
    let newY = pacman.y;

    switch (direction) {
        case 0:
            newX += 1;
            break;
        case 90:
            newY -= 1;
            break;
        case 180:
            newX -= 1;
            break;
        case 270:
            newY += 1;
            break;
    }

    const gridX = Math.floor(newX);
    const gridY = Math.floor(newY);

    if (!isWall(gridX, gridY)) {
        pacman.x = newX;
        pacman.y = newY;
    }

    if (isPoint(gridX, gridY)) {
        map[gridY][gridX] = 0;
        score++;
        updateScore();
    }

    checkWinCondition();
    checkGhostCollision();
}

function updateScore() {
    document.getElementById('score').textContent = 'Score: ' + score;
}

function updateLevel() {
    document.getElementById('level').textContent = 'Level: ' + level;
}

function checkWinCondition() {
    let pointsRemaining = map.some(row => row.includes(2));
    if (!pointsRemaining) {
        showWinMessage();
    }
}

// Show things!
function showLoseMessage() {
    const messageElement = document.getElementById('message');
    const playAgainButton = document.getElementById('playAgain');

    messageElement.style.display = 'block';
    messageElement.textContent = 'You lost! Play again?';

    playAgainButton.style.display = 'block';

    ghosts = [];
    pacman.x = null;
    pacman.y = null;
    rows = cols = 8;
    numberOfGhosts = 1;
    level = 1;
    ghostSpeed = 0.05;
}

function showWinMessage() {
    const messageElement = document.getElementById('message');
    const playAgainButton = document.getElementById('playAgain');
    const NextLevelButton = document.getElementById('NextLevel');

    messageElement.style.display = 'block';
    messageElement.textContent = 'You won! Play again?';

    playAgainButton.style.display = 'block';

    NextLevelButton.style.display = 'block';

    ghosts= [];
    pacman.x = null;
    pacman.y = null;
}
// Show things!

function resetGame() {

    if(animationFrameId){
        cancelAnimationFrame(animationFrameId)
    }
    score = 0;

    ghosts = [];
    const messageElement = document.getElementById('message');
    const playAgainButton = document.getElementById('playAgain');
    messageElement.style.display = 'none';
    playAgainButton.style.display = 'none';

    const mapLengthInput = document.getElementById('mapLength');
    const ghostsInput = document.getElementById('ghosts');
    mapLengthInput.style.display = 'inline-block';
    ghostsInput.style.display = 'inline-block';
    document.getElementById('onLevels').style.display = 'block';
    document.getElementById('NextLevel').style.display = 'none';
    document.getElementById('StartGame').style.display = 'inline-block';
    document.getElementById('pacman').style.display = 'none';
    document.getElementById('score').style.display = 'none';
    document.getElementById('level').style.display = 'none';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function drawPacman() {
    if (pacman.x === null || pacman.y === null) return;

    ctx.beginPath();
    ctx.arc(
        pacman.x * cellSize + cellSize / 2,
        pacman.y * cellSize + cellSize / 2,
        pacman.size,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

function spawnPacman() {
    pacman.x = Math.floor(Math.random() * (cols/2 - 2)) + 1
    pacman.y = Math.floor(Math.random() * (rows/2 - 2)) + 1
    map[pacman.y][pacman.x] = 0;
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(
            ghost.x * cellSize + cellSize / 2,
            ghost.y * cellSize + cellSize / 2,
            pacman.size,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    });
}


function moveGhosts() {
    ghosts.forEach(ghost => {
        let gridX = Math.floor(ghost.x + 0.5);
        let gridY = Math.floor(ghost.y + 0.5);

        ghost.moveProgress += ghost.speed;

        if (ghost.moveProgress >= 1) {
            ghost.x = gridX;
            ghost.y = gridY;

            ghost.moveProgress = 0;

            const availableDirections = [];

            if (!isWall(gridX + 1, gridY)) availableDirections.push(0);
            if (!isWall(gridX - 1, gridY)) availableDirections.push(180);
            if (!isWall(gridX, gridY - 1)) availableDirections.push(90);
            if (!isWall(gridX, gridY + 1)) availableDirections.push(270);

            if (availableDirections.length > 0) {
                if (!availableDirections.includes(ghost.direction)) {
                    const reverseDirection = (ghost.direction + 180) % 360;

                    const newDirections = availableDirections.filter(direction => direction !== reverseDirection);

                    if (newDirections.length > 0) {
                        ghost.direction = newDirections[Math.floor(Math.random() * newDirections.length)];
                    } else {
                        ghost.direction = reverseDirection;
                    }
                }
            }
        }

        switch (ghost.direction) {
            case 0:
                if (!isWall(Math.floor(ghost.x + ghost.speed), gridY)) {
                    ghost.x += ghost.speed;
                }
                break;
            case 90:
                if (!isWall(gridX, Math.floor(ghost.y - ghost.speed))) {
                    ghost.y -= ghost.speed;
                }
                break;
            case 180:
                if (!isWall(Math.floor(ghost.x - ghost.speed), gridY)) {
                    ghost.x -= ghost.speed;
                }
                break;
            case 270:
                if (!isWall(gridX, Math.floor(ghost.y + ghost.speed))) {
                    ghost.y += ghost.speed;
                }
                break;
        }

        ghost.x = Math.max(0, Math.min(ghost.x, cols - 1));
        ghost.y = Math.max(0, Math.min(ghost.y, rows - 1));
    });

    checkGhostCollision();
}



function checkGhostCollision() {
    ghosts.forEach(ghost => {
        const distance = Math.sqrt((ghost.x - pacman.x) ** 2 + (ghost.y - pacman.y) ** 2);
        if (distance < 1) {
            showLoseMessage();
        }
    });
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePacman(90);
            break;
        case 'ArrowDown':
            movePacman(270);
            break;
        case 'ArrowLeft':
            movePacman(180);
            break;
        case 'ArrowRight':
            movePacman(0);
            break;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();
});


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawPacman();
    drawGhosts();
    moveGhosts();

    animationFrameId = requestAnimationFrame(gameLoop);
}

function startGame() {
    if(animationFrameId){
        cancelAnimationFrame(animationFrameId)
    }
    const mapLengthInput = document.getElementById('mapLength');

    rows = cols = parseInt(mapLengthInput.value) || 20;
    const ghostsInput = parseInt(document.getElementById('ghosts').value) || 2
    generateMap();
    initializeGhosts(ghostsInput, ghostSpeed);
    spawnPacman();

    score = 0;
    updateScore();
    
    document.getElementById('score').style.display = 'block';
    
    hideLayouts();

    gameLoop();
}


function onLevelStart() {
    if(animationFrameId){
        cancelAnimationFrame(animationFrameId)
    }
        score = 0;
        generateMap();
        initializeGhosts(numberOfGhosts, ghostSpeed)
        spawnPacman();

        updateScore();

        hideLayouts();

        document.getElementById('score').style.display = 'block';
        document.getElementById('level').style.display = 'block';

        gameLoop();

}

function continueGame() {
    if(animationFrameId){
        cancelAnimationFrame(animationFrameId)
    }
    rows = cols = rows +=2;
    ghostSpeed += 0.01;
    if(level%2)
        numberOfGhosts += 1
    level += 1;
    updateLevel();
    onLevelStart();
}

document.getElementById('onLevels').addEventListener('click', () => {
    onLevelStart();
})

document.getElementById('NextLevel').addEventListener('click' , () => {
    continueGame();
})

document.getElementById('StartGame').addEventListener('click', () => {
    startGame();
});
document.getElementById('playAgain').addEventListener('click', () => {
    resetGame();
})
