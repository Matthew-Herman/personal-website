//Define object constructors here
function EnemyMissile(x, y) {
	this.xStart = x;
	this.yStart = y;
	this.xPos = x;
	this.yPos = y;
	this.xTarget = random(50, 751);
	this.yTarget = 600;
	this.ySpeed = random(0.5, 1);
	this.xSpeed = (this.ySpeed/this.yTarget)*(this.xTarget-this.xStart);
	
	this.display = function() {
		stroke(color(255, 0, 0));
		line(this.xStart, this.yStart, this.xPos, this.yPos);
		stroke(color(255, 255, 255));
		point(this.xPos, this.yPos);
		stroke(color(0, 0, 0));
	}
	
	this.move = function() {
		this.yPos += this.ySpeed;
		this.xPos += this.xSpeed;
	}
}

function UserMissile(x, y) {
	this.xStart = x;
	this.yStart = y;
	this.xPos = x;
	this.yPos = y;
	this.xTarget = x;
	this.yTarget = y;
	this.xSpeed = 0;
	this.ySpeed = 0;
	
	this.setTarget = function(xTar, yTar) {
		this.xTarget = xTar;
		this.yTarget = yTar;
		this.ySpeed = -5;
		this.xSpeed = -(this.ySpeed/(this.yStart-this.yTarget))*(this.xTarget-this.xStart);
	}
	
	this.display = function() {
		stroke(color(255, 255, 255));
		point(this.xPos, this.yPos);
		stroke(color(0, 0, 255));
		line(this.xStart, this.yStart, this.xPos, this.yPos);
		stroke(color(0, 0, 0));
		if (this.xPos === this.xTarget && this.yPos === this.yTarget) {
			var index = arrFiredMissiles.indexOf(this);
			arrFiredMissiles.splice(index, 1);
		}
	}
	
	this.move = function() {
		this.yPos += this.ySpeed;
		this.xPos += this.xSpeed;
	}
}

function Cursor(x, y){
	this.xPos = x;
	this.yPos = y;
	
	this.display = function() {
		stroke(color(255, 0, 255));
		line(this.xPos-10, this.yPos, this.xPos+10, this.yPos);
		line(this.xPos, this.yPos-10, this.xPos, this.yPos+10);
		stroke(color(0, 0, 0));
	}
}

//Declare objects here to be used in different functions
var arrEnemyMissiles = [];
var arrUserMissiles = [];
var arrFiredMissiles = [];
var cursor;

//Setup
function setup() {
	var cnv = createCanvas(800,600);
  cnv.parent('justify-project');
  for (i = 0; i < 5; i++) {
		arrEnemyMissiles.push(new EnemyMissile(random(50, 751), 0));
	}
	for (i = 0; i < 10; i++) {
		arrUserMissiles.push(new UserMissile(400, 500));
	}
	cursor = new Cursor(400, 300);
}

//Draw
function draw() {
	checkKey();
	background(0);
	for (i = 0; i < arrEnemyMissiles.length; i++) {
		arrEnemyMissiles[i].move();
		arrEnemyMissiles[i].display();
	}
	for (i = 0; i < arrFiredMissiles.length; i++) {
		arrFiredMissiles[i].move();
		arrFiredMissiles[i].display();
	}
	cursor.display();
}

//In this function, events on key press are defined
function keyPressed() {
	//if spacebar is pressed
	if (keyCode === 32) {
		var firedMissile = arrUserMissiles.pop();
		firedMissile.setTarget(cursor.xPos, cursor.yPos);
		arrFiredMissiles.push(firedMissile);
	}
}

//This function is checked every call of draw()
function checkKey() {
	if (keyIsDown(LEFT_ARROW)) {
	  cursor.xPos -= 5;
	}
	if (keyIsDown(RIGHT_ARROW)) {
	  cursor.xPos += 5;
	}
	if (keyIsDown(UP_ARROW)) {
	  cursor.yPos -= 5;
	}
	if (keyIsDown(DOWN_ARROW)) {
	  cursor.yPos += 5;
	}
}
