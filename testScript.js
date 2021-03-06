//Prevent default scrolling behaviour on arrow keypresses
var keys = {};
window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = true;
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    },
false);
window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
false);

//Declare/initialize global variables here
const width = 800;
const height = 600;
const cursorSpeed = 12;

const arrEnemyMissiles = [];
const arrUserMissiles = [];
const arrFiredMissiles = [];
const arrExplosions = [];
const arrBases = [];
const arrMissileBatteries = [];

let cursor;
let map;
let missileController;

//Define object constructors here
function EnemyMissile(x, y) 
{
	this.xStart = x;
	this.yStart = y;
	this.xPos = x;
	this.yPos = y;
	var randomTarget = random(arrBases);
	this.xTarget = randomTarget.xPos;
	this.yTarget = randomTarget.yPos;
	this.ySpeed = random(0.5, 1);
	this.xSpeed = (this.ySpeed/this.yTarget)*(this.xTarget-this.xStart);
	this.isSplit = Math.floor(random(0, 4));
	
	this.display = function() {
		stroke(color(255, 0, 0));
		line(this.xStart, this.yStart, this.xPos, this.yPos);
		stroke(color(255, 255, 255));
		point(this.xPos, this.yPos);
		stroke(color(0, 0, 0));
		//Random missile splits
		if ((this.isSplit === 1) && (this.yPos > 100+i*50 && this.yPos < 102+i*50)) {
			arrEnemyMissiles.push(new EnemyMissile(this.xPos, this.yPos));
		}
	}
	
	this.move = function() {
		this.yPos += this.ySpeed;
		this.xPos += this.xSpeed;
	}
}

function EnemyMissileController() {

}

function UserMissile(x, y) 
{
	this.xStart = x;
	this.yStart = y;
	this.xPos = x;
	this.yPos = y;
	this.xTarget = x;
	this.yTarget = y;
	this.speed = 6;
	this.xSpeed = 0;
	this.ySpeed = 0;
	
	this.setTarget = function(xTar, yTar) {
		this.xTarget = xTar;
		this.yTarget = yTar;
		this.direction = Math.atan((this.xTarget-this.xStart)/(this.yTarget-this.yStart));
		this.ySpeed = -this.speed*Math.cos(this.direction);
		this.xSpeed = -this.speed*Math.sin(this.direction);
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
			const index = arrFiredMissiles.indexOf(this);
			arrFiredMissiles.splice(index, 1);
			arrExplosions.push(new Explosion(this.xPos, this.yPos));
		}
	}
	
	this.move = function() {
		this.yPos += this.ySpeed;
		this.xPos += this.xSpeed;
	}
}

function Explosion(x, y) 
{
	this.xPos = x;
	this.yPos = y;
	this.size = 3;
	
	this.display = function() {
		this.size += 1;
		if (this.size > 80) {
			const index = arrExplosions.indexOf(this);
			arrExplosions.splice(index, 1);
		}
		fill(color(255, 255, 0));
		ellipse(x, y, this.size, this.size);
	}
	
	//Detects collision between Explosion and EnemyMissile
	this.collide = function(enemyMissile) {
		if (collidePointCircle(enemyMissile.xPos, enemyMissile.yPos, this.xPos, this.yPos, this.size)) {
			const index = arrEnemyMissiles.indexOf(enemyMissile);
			arrEnemyMissiles.splice(index, 1);
		}
	}
}

function Base(x, y) 
{ 
	this.xPos = x;
	this.yPos = y;
	
	this.display = function() {
		fill(color(0, 255, 255));
		rect(x-20, y-10, 40, 20)
	}
}

function MissileBattery(offset) 
{
	this.arrMissiles = [];
	for (i = 4; i > 0; i--) {
		for (j = i; j > 0; j--) {
			this.arrMissiles.push(new UserMissile((4-i)*10+offset+j*20, 520+i*10));
		}
	}
	
	this.fireMissile = function() {
		if (this.arrMissiles.length > 0) {
			const firedMissile = this.arrMissiles.pop();
			firedMissile.setTarget(cursor.xPos, cursor.yPos);
			arrFiredMissiles.push(firedMissile);
		}
	}
	
	this.display = function() {
		for (j = 0; j < this.arrMissiles.length; j++) {
			this.arrMissiles[j].displayMissile();
		}
	}
}

function Map() 
{
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

function Cursor(x, y)
{
	this.xPos = x;
	this.yPos = y;
	
	this.display = function() {
		stroke(color(255, 0, 255));
		line(this.xPos-10, this.yPos, this.xPos+10, this.yPos);
		line(this.xPos, this.yPos-10, this.xPos, this.yPos+10);
		stroke(color(0, 0, 0));
	}
}










//Setup
function setup() 
{
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
	arrMissileBatteries.push(new MissileBattery(offset));
	offset = 400;
	arrMissileBatteries.push(new MissileBattery(offset));
	offset = 700;
	arrMissileBatteries.push(new MissileBattery(offset));
	cursor = new Cursor(400, 300);
	map = new Map();
	missileController = new EnemyMissileController();
}





//Draw
function draw() 
{
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
	for (i = 0; i < arrMissileBatteries.length; i++) {
		arrMissileBatteries[i].display();
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
	const A_KEY = 65;
	const S_KEY = 83;
	const D_KEY = 68;
	
	//if spacebar is pressed
	if (keyCode === A_KEY) {
		arrMissileBatteries[0].fireMissile();
	}
	if (keyCode === S_KEY) {
		arrMissileBatteries[1].fireMissile();
	}
	if (keyCode === D_KEY) {
		arrMissileBatteries[2].fireMissile();
	}
}





//This function is checked every call of draw() for holding keypresses
function checkKey() {
	if (keyIsDown(LEFT_ARROW) && cursor.xPos > 10) {
	  cursor.xPos -= cursorSpeed;
	}
	if (keyIsDown(RIGHT_ARROW) && cursor.xPos < width-10) {
	  cursor.xPos += cursorSpeed;
	}
	if (keyIsDown(UP_ARROW)&& cursor.yPos > 10) {
	  cursor.yPos -= cursorSpeed;
	}
	if (keyIsDown(DOWN_ARROW) && cursor.yPos < height-100) {
	  cursor.yPos += cursorSpeed;
	}
}





















