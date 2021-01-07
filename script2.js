const GRID_SIZE = 5;

const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
const playBtn = document.querySelector('.btn');
const instructionsCard = document.querySelector('.card')
const cardBodyText = document.querySelector('.card-text')
const cardHeaderText = document.querySelector('.card-header')
const cardTitleText = document.querySelector('.card-title')

let score = -1;
let highScore = localStorage.getItem('highScore')
canvasContext.fillStyle = 'black';
canvasContext.fillRect(0, 0, 500, 150);
let highScoreText = document.querySelector('.high-score');
highScoreText.innerText = "High Score:" + highScore
let paused = true;

class SnakeBlock {
    constructor(xPosition, yPosition) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.snakeWidth = GRID_SIZE;
        this.snakeHeight = GRID_SIZE;
    }
}

const snake = {
    body: [
        new SnakeBlock(20, 10),
        new SnakeBlock(10, 10),
    ],
    direction: 'right'
}

const apple = {
    x: undefined,
    y: undefined,
    width: GRID_SIZE,
    height: GRID_SIZE
}


const startGame = () => {
    //call random apple generator function to initialize 
    regenerateApplePositions();
    setInterval(() => {
        //draw canvas
        if (!paused) {
            canvasContext.fillStyle = 'black';
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);
            //draw apple
            canvasContext.fillStyle = 'red';
            canvasContext.fillRect(apple.x, apple.y, apple.width, apple.height);

            moveSnake();

            drawSnake();

            if (isSnakeCollidingWithWall()) {
                if (score > highScore) {
                    localStorage.setItem("highScore", score)
                }
                paused = true;
                endGame();
            }

            if (isSnakeCollidingWithSelf()) {
                if (score > highScore) {
                    localStorage.setItem("highScore", score)
                }
               	endGame();
            }

            if (isSnakeEatingApple()) {
                regenerateApplePositions();
            }
        }

    }, 80)
}

const endGame = () => {
	paused = true;
	instructionsCard.style.visibility = "visible";
	cardHeaderText.innerText = 'Game Over'
	cardBodyText.innerText = 'Your Score: ' + score
	cardTitleText.innerText = ''
	playBtn.innerText = 'Play Again'
}

const moveSnake = () => {
    if (snake.direction === 'right') {
        snake.body.unshift(new SnakeBlock(snake.body[0].xPosition + GRID_SIZE, snake.body[0].yPosition))
    }

    if (snake.direction === 'left') {
        snake.body.unshift(new SnakeBlock(snake.body[0].xPosition - GRID_SIZE, snake.body[0].yPosition))
    }

    if (snake.direction === 'up') {
        snake.body.unshift(new SnakeBlock(snake.body[0].xPosition, snake.body[0].yPosition - GRID_SIZE))
    }

    if (snake.direction === 'down') {
        snake.body.unshift(new SnakeBlock(snake.body[0].xPosition, snake.body[0].yPosition + GRID_SIZE))
    }

    if (isSnakeEatingApple() == false) {
        snake.body.splice(-1, 1);
    }

}

const drawSnake = () => {
    snake.body.forEach((block) => {
        canvasContext.fillStyle = 'green';
        canvasContext.fillRect(block.xPosition, block.yPosition, block.snakeWidth, block.snakeHeight);
    })
}

const isSnakeCollidingWithSelf = () => {
    snake.body.forEach((block, index) => {
    	// console.log('head position(' + snake.body[0].xPosition +', '+ snake.body[0].yPosition +')' )
        if (index !== 0) {
            if (snake.body[0].xPosition === block.xPosition &&
                snake.body[0].yPosition === block.yPosition) {
            	if (score > highScore) {
                    localStorage.setItem("highScore", score)
                }
                paused = true;
               	endGame();
            }
        }
    });
    return false;
}

const isSnakeCollidingWithWall = () => {
    let leadBlock = snake.body[0];
    return leadBlock.xPosition < 0 ||
        leadBlock.xPosition == canvas.width  ||
        leadBlock.yPosition < 0 ||
        leadBlock.yPosition == canvas.height
}

document.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
        case 40:
            if (snake.direction !== 'up') {
                setTimeout(function() {
                    paused = false;
                    snake.direction = 'down';
                }, 25);
            }
            break;
        case 38:
            if (snake.direction !== 'down') {
                setTimeout(function() {
                    paused = false;
                    snake.direction = 'up';
                }, 25);
            }
            break;
        case 37:
            if (snake.direction !== 'right') {
                setTimeout(function() {
                    paused = false;
                    snake.direction = 'left';
                }, 25);
            }
            break;
        case 39:
            if (snake.direction !== 'left') {
                setTimeout(function() {
                    paused = false;
                    snake.direction = 'right';
                }, 25);
            }
            break;

        case 80:
            paused = !paused;
            break;
    }
})

playBtn.addEventListener('click', function() {
	if(playBtn.innerText === 'Play'){
		instructionsCard.style.visibility = "hidden";
	    paused = false;
	    startGame();
	} else {
		console.log('here')
		clearInterval();
        location.reload();
	}
})

const xGenerator = (snakeXPositions) => {
    //check that x coordinate generated is not occupied by a snakeblock
    let xCoordinate = Math.floor(Math.random() * canvas.width / 5) * 5;
    return (snakeXPositions.includes(xCoordinate)) ?
        xGenerator(snakeXPositions) :
        xCoordinate;
}

const yGenerator = (snakeYPositions) => {
    //check that y coordinate generated is not occupied by a snakeblock
    let yCoordinate = Math.floor(Math.random() * canvas.height / 5) * 5;
    return (snakeYPositions.includes(yCoordinate)) ?
        yGenerator(snakeYPositions) :
        yCoordinate;
}

const isSnakeEatingApple = () => {
    return apple.x === snake.body[0].xPosition && apple.y === snake.body[0].yPosition;
}

const regenerateApplePositions = () => {
    score += 1;
    let scoreText = document.querySelector('.score');
    scoreText.innerText = "Score : " + score;
    let snakeXPositions = snake.body.map(block => block.xPosition);
    let snakeYPositions = snake.body.map(block => block.yPosition);

    apple.x = xGenerator(snakeXPositions);
    apple.y = yGenerator(snakeYPositions);
}