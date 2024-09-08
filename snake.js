const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameOverDiv = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again');

// Dynamically adjust canvas size to fit small screens while maintaining 400x400 on larger screens
function adjustCanvasSize() {
    const screenWidth = window.innerWidth;
    
    // Keep 400x400 size on larger screens, adjust for smaller screens
    if (screenWidth < 420) {
        const canvasSize = screenWidth - 40;
        canvas.width = canvasSize;
        canvas.height = canvasSize;
    } else {
        canvas.width = 400;
        canvas.height = 400;
    }
}

// Initial canvas size adjustment
adjustCanvasSize();

// Re-adjust the canvas size if the window is resized
window.addEventListener('resize', adjustCanvasSize);

const boxSize = 20; // Snake and food size
let rows = canvas.height / boxSize;
let cols = canvas.width / boxSize;

let snake, direction, nextDirection, food, score, gameInterval;

function initGame() {
    rows = canvas.height / boxSize;
    cols = canvas.width / boxSize;

    snake = [{ x: Math.floor(cols / 2) * boxSize, y: Math.floor(rows / 2) * boxSize }];
    direction = { x: 0, y: 0 };
    nextDirection = direction;
    food = { x: Math.floor(Math.random() * cols) * boxSize, y: Math.floor(Math.random() * rows) * boxSize };
    score = 0;

    // Hide the game-over screen and button
    gameOverDiv.style.display = 'none';

    // Start the game loop
    gameInterval = setInterval(update, 100);
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x, part.y, boxSize, boxSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(part.x, part.y, boxSize, boxSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

function checkCollision(nextX, nextY) {
    // Check if the next position is outside the canvas or hits the snake's body
    if (nextX < 0 || nextX >= canvas.width || nextY < 0 || nextY >= canvas.height || snake.slice(1).some(part => part.x === nextX && part.y === nextY)) {
        clearInterval(gameInterval); // Stop the game loop

        // Show the game-over screen with the final score
        finalScore.innerHTML = `Game Over!<br> <span class="score-label">Your score:</span> <span class="score-value">${score}</span>`;
        gameOverDiv.style.display = 'block';
        return true; // Return true to indicate collision occurred
    }
    return false; // Return false to indicate no collision
}

function moveSnake() {
    // Update direction with the next direction before moving
    direction = nextDirection;

    // Calculate the next position of the snake's head
    const nextX = snake[0].x + direction.x * boxSize;
    const nextY = snake[0].y + direction.y * boxSize;

    // Check for collisions before actually moving the snake
    if (checkCollision(nextX, nextY)) {
        return; // Exit if collision is detected
    }

    // Now move the snake after collision check
    const head = { x: nextX, y: nextY };
    snake.unshift(head);

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * cols) * boxSize, y: Math.floor(Math.random() * rows) * boxSize };
    } else {
        snake.pop();
    }
}

// Prevent reversing into itself by updating nextDirection
function setDirection(newDirection) {
    if (newDirection.x === -direction.x && newDirection.y === -direction.y) {
        return; // Prevent moving in the opposite direction
    }
    nextDirection = newDirection; // Update direction only if it's valid
}

// Directional button handlers
function moveUp() {
    setDirection({ x: 0, y: -1 });
}

function moveDown() {
    setDirection({ x: 0, y: 1 });
}

function moveLeft() {
    setDirection({ x: -1, y: 0 });
}

function moveRight() {
    setDirection({ x: 1, y: 0 });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
}

// Restart the game when "Play Again" button is clicked
function resetGame() {
    initGame();
}

// Keyboard controls for desktop users
document.addEventListener('keydown', event => {
    if (event.code === 'ArrowUp') {
        moveUp();
    } else if (event.code === 'ArrowDown') {
        moveDown();
    } else if (event.code === 'ArrowLeft') {
        moveLeft();
    } else if (event.code === 'ArrowRight') {
        moveRight();
    }
});

// Initialize the game for the first time
initGame();
