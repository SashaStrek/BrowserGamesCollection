const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameOverDiv = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again');

const boxSize = 20; // Snake and food size
const rows = canvas.height / boxSize;
const cols = canvas.width / boxSize;

let snake, direction, food, score, gameInterval;

function initGame() {
    snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
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

// Keyboard controls
document.addEventListener('keydown', event => {
    if (event.code === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (event.code === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (event.code === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (event.code === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
});

// Initialize the game for the first time
initGame();
