const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;

let snake = [{ x: 9 * box, y: 10 * box }];
let food = generateFood();
let score = 0;
let d = 'RIGHT';
let game;

// Event listeners for controls, restart, and resizing
document.addEventListener('keydown', direction);
document.getElementById('restartBtn').addEventListener('click', restartGame);
window.addEventListener('resize', resizeCanvas);

// Add touch event listeners for mobile controls
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && d != 'RIGHT') {
            d = 'LEFT';
        } else if (xDiff < 0 && d != 'LEFT') {
            d = 'RIGHT';
        }
    } else {
        if (yDiff > 0 && d != 'DOWN') {
            d = 'UP';
        } else if (yDiff < 0 && d != 'UP') {
            d = 'DOWN';
        }
    }

    xDown = null;
    yDown = null;
}

// Function to handle key press events for movement
function direction(event) {
    if ((event.keyCode == 37 || event.keyCode == 65) && d != 'RIGHT') d = 'LEFT'; // Left arrow or 'A'
    else if ((event.keyCode == 38 || event.keyCode == 87) && d != 'DOWN') d = 'UP'; // Up arrow or 'W'
    else if ((event.keyCode == 39 || event.keyCode == 68) && d != 'LEFT') d = 'RIGHT'; // Right arrow or 'D'
    else if ((event.keyCode == 40 || event.keyCode == 83) && d != 'UP') d = 'DOWN'; // Down arrow or 'S'
}

// Function to generate a random food position within the canvas
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// Function to check if the snake collides with itself
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Main function to update and draw the game
function draw() {
    // Clear the canvas before drawing new frame
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'white'; // Head is green, body is white
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Get the current head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Move the snake in the current direction
    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    // Check if the snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        food = generateFood(); // Generate new food
    } else {
        snake.pop(); // Remove the last part of the snake if no food was eaten
    }

    // Create new head position
    let newHead = { x: snakeX, y: snakeY };

    // Check for collisions (wall or self)
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game); // Stop the game loop
        alert('Game Over! Your score: ' + score);
    }

    // Add the new head to the snake
    snake.unshift(newHead);
}

// Function to restart the game
function restartGame() {
    clearInterval(game);
    snake = [{ x: 9 * box, y: 10 * box }]; // Reset snake position
    score = 0; // Reset score
    document.getElementById('score').innerText = score;
    d = 'RIGHT'; // Reset direction
    food = generateFood(); // Generate new food
    game = setInterval(draw, 100); // Restart game loop
}

// Function to adjust the canvas size dynamically
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth - 20, 400);
    canvas.height = Math.min(window.innerHeight - 100, 400);
    food = generateFood(); // Ensure food is placed correctly within new canvas size
}

// Initialize the game
resizeCanvas();
game = setInterval(draw, 100);
