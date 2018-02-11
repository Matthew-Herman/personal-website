function Ball(x, y) {
	this.xPos = x;
	this.yPos = y;
	this.xSpeed = random(-2, 2);
	this.ySpeed = random(-2, 2);
	
	this.display = function() {
		fill(128);
		ellipse(this.xPos, this.yPos, 25, 25);
	}
	
	this.move = function() {
		this.xPos += this.xSpeed;
		this.yPos += this.ySpeed;
		if (this.xPos > width - 25|| this.xPos < 25) {
			this.xSpeed *= -1;
		}
		if (this.yPos > height -  25|| this.yPos < 25) {
			this.ySpeed *= -1;
		}
	}

}

var myBall;
function setup() {
	var cnv = createCanvas(500,500);
	var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
	myBall = new Ball(250, 250);
}

function draw() {
	background(0);
	myBall.move();
	myBall.display();
}