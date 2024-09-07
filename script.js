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
        const canvasSize = screenWidth - 20;  // 20px padding for small screens
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

let snake, direction, food, score, gameInterval;

function initGame() {
    rows = canvas.height / boxSize;
    cols = canvas.width / boxSize;

    snake = [{ x: Math.floor(cols / 2) * boxSize, y: Math.floor(rows / 2) * boxSize }];
    direction = { x: 0, y: 0 };
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

function moveSnake() {
    const head = { x: snake[0].x + direction.x * boxSize, y: snake[0].y + direction.y * boxSize };
    
    snake.unshift(head);
    
    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * cols) * boxSize, y: Math.floor(Math.random() * rows) * boxSize };
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    // Check if the snake hits the walls or itself
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
        clearInterval(gameInterval); // Stop the game loop

        // Show the game-over screen with the final score
        finalScore.textContent = `Game Over! Your score: ${score}`;
        gameOverDiv.style.display = 'block';
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    checkCollision();
}

// Restart the game when "Play Again" button is clicked
function resetGame() {
    initGame();
}

// Directional button handlers
function moveUp() {
    if (direction.y === 0) {
        direction = { x: 0, y: -1 };
    }
}

function moveDown() {
    if (direction.y === 0) {
        direction = { x: 0, y: 1 };
    }
}

function moveLeft() {
    if (direction.x === 0) {
        direction = { x: -1, y: 0 };
    }
}

function moveRight() {
    if (direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
}

// Keyboard controls for desktop users
document.addEventListener('keydown', event => {
    if (event.code === 'ArrowUp' && direction.y === 0) {
        moveUp();
    } else if (event.code === 'ArrowDown' && direction.y === 0) {
        moveDown();
    } else if (event.code === 'ArrowLeft' && direction.x === 0) {
        moveLeft();
    } else if (event.code === 'ArrowRight' && direction.x === 0) {
        moveRight();
    }
});

// Initialize the game for the first time
initGame();
