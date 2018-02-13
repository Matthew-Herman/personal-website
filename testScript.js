//Define constant variables here
const width = 800;
const height = 600;
const cursorSpeed = 8;




//Define custom object constructors here
function EnemyMissile(x, y) {
	this.xStart = x;
	this.yStart = y;
	this.xPos = x;
	this.yPos = y;
	var randomTarget = random(arrBases);
	this.xTarget = randomTarget.xPos;
	this.yTarget = randomTarget.yPos;
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
	
	this.displayMissile = function() {
		fill(color(0, 0, 200));
		triangle(this.xStart-5, this.yStart+15, this.xStart, this.yStart, this.xStart+5, this.yStart+15);	
	}
		
	this.display = function() {
		stroke(color(255, 255, 255));
		point(this.xPos, this.yPos);
		stroke(color(0, 0, 255));
		line(this.xStart, this.yStart, this.xPos, this.yPos);
		stroke(color(255, 255, 255));	
		line(this.xTarget-5, this.yTarget-5, this.xTarget+5, this.yTarget+5);
		line(this.xTarget+5, this.yTarget-5, this.xTarget-5, this.yTarget+5);
		stroke(color(0, 0, 0));
		
		//Detect collision of xPos and yPos with xTarget and yTarget 
		if (collidePointPoint(this.xPos, this.yPos, this.xTarget, this.yTarget, 10)) {
			var index = arrFiredMissiles.indexOf(this);
			arrFiredMissiles.splice(index, 1);
			arrExplosions.push(new Explosion(this.xPos, this.yPos));
		}
	}
	
	this.move = function() {
		this.yPos += this.ySpeed;
		this.xPos += this.xSpeed;
	}
}

function Explosion(x, y) {
	this.xPos = x;
	this.yPos = y;
	this.size = 1;
	
	this.display = function() {
		this.size += 5;
		if (this.size > 150) {
			var index = arrExplosions.indexOf(this);
			arrExplosions.splice(index, 1);
		}
		fill(color(255, 255, 0));
		ellipse(x, y, this.size, this.size);
	}
	
	//Detects collision between Explosion and EnemyMissile
	this.collide = function(enemyMissile) {
		if (collidePointCircle(enemyMissile.xPos, enemyMissile.yPos, this.xPos, this.yPos, this.size)) {
			var index = arrEnemyMissiles.indexOf(enemyMissile);
			arrEnemyMissiles.splice(index, 1);
		}
	}
}

function Base(x, y) { 
	this.xPos = x;
	this.yPos = y;
	
	this.display = function() {
		fill(color(0, 255, 255));
		rect(x-20, y-10, 40, 20)
	}
}

function Map() {
	this.display = function() {
		fill(color(255, 255, 0));
		beginShape();
		vertex(0, height-40);
		vertex(30, height-80);
		vertex(45, height-75);
		vertex(60, height-75);
		vertex(70, height-83);
		vertex(100, height-60);
		vertex(400, height-60);
		vertex(430, height-80);
		vertex(445, height-75);
		vertex(460, height-75);
		vertex(470, height-83);
		vertex(500, height-60);
		vertex(700, height-60);
		vertex(730, height-80);
		vertex(745, height-75);
		vertex(760, height-75);
		vertex(770, height-83);
		vertex(800, height-60);
		vertex(width, height-50);
		vertex(width, height);
		vertex(0, height);
endShape(CLOSE);
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
var arrExplosions = [];
var arrBases = [];
var cursor;
var map;




//Setup
function setup() {
	var cnv = createCanvas(width, height);
  cnv.parent('justify-project');
	for (i = 0; i < 3; i++) {
		arrBases.push(new Base(150+100*i, 560+random(-5, 5)));
	}
	for (i = 0; i < 3; i++) {
		arrBases.push(new Base(530+60*i, 560+random(-5, 5)));
	}
  for (i = 0; i < 10; i++) {
		arrEnemyMissiles.push(new EnemyMissile(random(50, 751), 0));
	}
	var offset = 5;
	for (i = 4; i > 0; i--) {
		for (j = i; j > 0; j--) {
			arrUserMissiles.push(new UserMissile((4-i)*10+offset+j*20, 520+i*10));
		}
	}
	offset = 400;
	for (i = 4; i > 0; i--) {
		for (j = i; j > 0; j--) {
			arrUserMissiles.push(new UserMissile((4-i)*10+offset+j*20, 520+i*10));
		}
	}
	offset = 700;
	for (i = 4; i > 0; i--) {
		for (j = i; j > 0; j--) {
			arrUserMissiles.push(new UserMissile((4-i)*10+offset+j*20, 520+i*10));
		}
	}
	cursor = new Cursor(400, 300);
	map = new Map();
}





//Draw
function draw() {
	checkKey();
	background(0);
	map.display();
	//Draw EnemyMissiles, FiredMissiles
	for (i = 0; i < arrBases.length; i++) {
		arrBases[i].display();
	}
	for (i = 0; i < arrEnemyMissiles.length; i++) {
		arrEnemyMissiles[i].move();
		arrEnemyMissiles[i].display();
	}
	for (i = 0; i < arrUserMissiles.length; i++) {
		arrUserMissiles[i].displayMissile();
	}
	for (i = 0; i < arrFiredMissiles.length; i++) {
		arrFiredMissiles[i].move();
		arrFiredMissiles[i].display();
	}
	for (i = 0; i < arrExplosions.length; i++) {
		arrExplosions[i].display();
	}
	for (i = 0; i < arrExplosions.length; i++) {
		for (j = 0; j< arrEnemyMissiles.length; j++) {
			arrExplosions[i].collide(arrEnemyMissiles[j]);
		}
	}
	cursor.display();
}





//In this function, events on key press are defined
function keyPressed() {
	//if spacebar is pressed
	if (keyCode === 32) {
		if (arrUserMissiles.length != 0) {
			var firedMissile = arrUserMissiles.pop();
			firedMissile.setTarget(cursor.xPos, cursor.yPos);
			arrFiredMissiles.push(firedMissile);
		}
	}
}





//This function is checked every call of draw() for holding keypresses
function checkKey() {
	if (keyIsDown(LEFT_ARROW)) {
	  cursor.xPos -= cursorSpeed;
	}
	if (keyIsDown(RIGHT_ARROW)) {
	  cursor.xPos += cursorSpeed;
	}
	if (keyIsDown(UP_ARROW)) {
	  cursor.yPos -= cursorSpeed;
	}
	if (keyIsDown(DOWN_ARROW)) {
	  cursor.yPos += cursorSpeed;
	}
}
