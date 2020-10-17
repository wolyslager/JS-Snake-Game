//need a snakeBlock class with properties xspeed, yspeed, xpositon, yposition
//need to create a new instance of the snakeBlock class every time the snake eats an apple
//need to push each instance of snakeBlock into a snake array 
//need to have a marker variable to guide snakeBlocks that follow the first one ( what about when 2 or more markers will be active? potential marker array)
const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
snakeModules = []; 
let markers = [];
let snakeHead;
let snakeTail;
let snakeModule;

class Snake {
	constructor(snakeX, snakeY, snakeXspeed, snakeYspeed){
		this.snakeX = snakeX;
		this.snakeXspeed = snakeXspeed;
		this.snakeY = snakeY;
		this.snakeYspeed = snakeYspeed;
		this.snakeWidth = 5;
		this.snakeHeight = 5;
		this.turnPoint = null;
	}
}

window.onload = function() {
	//create first snake
	snakeGrower();
    snakeHead = snakeModules[0];
	setInterval(drawEverything, 2);
}

const checkMarkers = (module) => {
	let index = snakeModules.indexOf(module);
	let moduleAhead = snakeModules[index-1];
	if(module.snakeX == moduleAhead.turnPoint || module.snakeY == moduleAhead.turnPoint){
		module.snakeXspeed = moduleAhead.snakeXspeed;
		module.snakeYspeed = moduleAhead.snakeYspeed;
		module.snakeX = module.snakeX + module.snakeXspeed;
		module.snakeY = module.snakeY + module.snakeYspeed;
		module.turnPoint = moduleAhead.turnPoint;
		moduleAhead.turnPoint = null;
	} else {
		module.snakeX = module.snakeX + module.snakeXspeed;
		module.snakeY = module.snakeY + module.snakeYspeed;
	}

	canvasContext.fillStyle = 'blue';
	canvasContext.fillRect(module.snakeX, module.snakeY, module.snakeWidth, module.snakeHeight);
}

const drawEverything = () => {
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0,0, canvas.width, canvas.height);
	//loop through snakeModules
	snakeModules.forEach((module, index) => {
		if(index == 0){
			snakeHeadDirection(module);
		} else {
			//check for markers
			checkMarkers(module);
		}	
	})
}

const snakeGrower = () => {
	if(snakeModules.length == 0){
		snakeModule = new Snake(0, 0, 0.5, 0);
		snakeModules.push(snakeModule);
	} else {
		//need to know values for the last snake part for the constructor
		snakeTail = snakeModules[snakeModules.length - 1];
		snakeTailDirection();
		snakeModules.push(snakeModule);
	}
}

const snakeHeadDirection = (module) => {
	module.snakeX = module.snakeX + module.snakeXspeed;
	module.snakeY = module.snakeY + module.snakeYspeed;
	canvasContext.fillStyle = 'red';
	canvasContext.fillRect(module.snakeX, module.snakeY, module.snakeWidth, module.snakeHeight);
}

const snakeTailDirection = () => {
	let snakeTailVertical = snakeTail.snakeXspeed == 0 ? true : false;
	if(snakeTailVertical){
		let snakeGoingDown = snakeTail.snakeYspeed > 0 ? true : false;
		if(snakeGoingDown){
			snakeModule = new Snake(snakeTail.snakeX, snakeTail.snakeY - 5, snakeTail.snakeXspeed,  snakeTail.snakeYspeed);
		} else {
			snakeModule = new Snake(snakeTail.snakeX, snakeTail.snakeY + 5, snakeTail.snakeXspeed, snakeTail.snakeYspeed);
		}
	} else {
		let snakeGoingRight = snakeTail.snakeXspeed > 0 ? true : false;
		if(snakeGoingRight){
			snakeModule = new Snake(snakeTail.snakeX - 5, snakeTail.snakeY , snakeTail.snakeXspeed, snakeTail.snakeYspeed);
			console.log(snakeModule)
		} else {
			snakeModule = new Snake(snakeTail.snakeX + 5, snakeTail.snakeY, snakeTail.snakeXspeed, snakeTail.snakeYspeed);
		}	
	}
}

document.addEventListener('keydown', function(e){
  switch(e.keyCode){
  	case 40:
  		if(snakeHead.snakeYspeed == 0){
  			snakeHead.snakeYspeed = .5;
  			snakeHead.snakeXspeed = 0;
  			snakeHead.turnPoint = snakeHead.snakeX;
  			console.log(snakeHead.turnPoint)
  		}
  		break;
  	case 38:
  		if(snakeHead.snakeYspeed == 0){
  			snakeHead.snakeYspeed = -.5;
  			snakeHead.snakeXspeed = 0;
  			snakeHead.turnPoint = snakeHead.snakeX;
  			console.log(snakeHead.turnPoint)
  		}
  		break;
  	case 37:
  		if(snakeHead.snakeXspeed == 0){
  			snakeHead.snakeXspeed = -.5;
  			snakeHead.snakeYspeed = 0;
  			snakeHead.turnPoint = snakeHead.snakeY;
  			console.log(snakeHead.turnPoint)
  		}
  		break;
  	case 39:
  		if(snakeHead.snakeXspeed == 0){
  			snakeHead.snakeXspeed = .5;
  			snakeHead.snakeYspeed = 0;
  			snakeHead.turnPoint = snakeHead.snakeY;
  			console.log(snakeHead.turnPoint)
  		}
  		break;
  }
})

const button = document.querySelector('.add');
button.addEventListener('click', function(){
	snakeGrower();
	console.log(markers)
})
