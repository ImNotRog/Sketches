var Snake;
var Food;
var Game;
var Block;
var snake;

var boardWidth = 20;
var boardHeight = 20;
var sizePerSquare = 23;

var framesSinceDeath = 0;

var speed = 8;

function setup() {
    createCanvas(boardWidth * sizePerSquare, boardHeight * sizePerSquare);

    frameRate(speed);

    Block = function (i, j) {
        this.arrayPos = createVector(i, j);
        this.dispPos = createVector(i * sizePerSquare, j * sizePerSquare);
    }
    Block.prototype.display = function () {
        rect(this.dispPos.x, this.dispPos.y, sizePerSquare, sizePerSquare);
    }

    Food = function (i, j) {
        this.arrayPos = createVector(i, j);
        this.dispPos = createVector(i * sizePerSquare, j * sizePerSquare);
    }
    Food.prototype.display = function () {
        noStroke();
        fill(255, 0, 0);
        ellipse(this.dispPos.x + sizePerSquare / 2, this.dispPos.y + sizePerSquare / 2,
            sizePerSquare / 1.5, sizePerSquare / 1.5);
    }

    Snake = function (x, y) {
        this.body = [new Block(x, y)];
        this.direction = createVector(1, 0);
        this.food = new Food(floor(random(0, boardWidth)), floor(random(0, boardHeight)));
        this.running = true;
    }
    Snake.prototype.display = function () {
        this.food.display();
        noStroke();
        fill(0, 0, 255);
        for (var i = 0; i < this.body.length; i++) {
            this.body[i].display();
        }

    }
    Snake.prototype.update = function () {

        this.newPos = this.body[0].arrayPos.add(this.direction);
        if (this.newPos.x < 0 || this.newPos.x >= boardWidth) {
            this.running = false;
        }
        if (this.newPos.y < 0 || this.newPos.y >= boardHeight) {
            this.running = false;
        }
        for (var i = 1; i < this.body.length; i++) {
            if (this.newPos.x == this.body[i].arrayPos.x && this.newPos.y == this.body[i].arrayPos.y) {
                this.running = false;
            }
        }
        if (this.running) {
            if (this.newPos.x == this.food.arrayPos.x && this.newPos.y == this.food.arrayPos.y) {
                this.body.splice(0, 0, new Block(this.newPos.x, this.newPos.y));
                this.food = new Food(floor(random(0, boardWidth)), floor(random(0, boardHeight)));
            } else {
                this.body.pop();
                this.body.splice(0, 0, new Block(this.newPos.x, this.newPos.y));
            }
        }
    }
    Snake.prototype.changeDir = function (dir) {
        if (dir.x != -1 * this.direction.x && dir.y != -1 * this.direction.y) {
            this.direction = dir;
        }
    }

    snake = new Snake(5, 10);
}

function draw() {
    background(255, 255, 255);
    for (var i = 0; i < boardWidth; i++) {
        for (var j = 0; j < boardHeight; j++) {
            if ((i + j) % 2 == 0) {
                fill(100, 255, 100);
            } else {
                fill(100, 220, 100);
            }
            noStroke();
            rect(i * sizePerSquare, j * sizePerSquare, sizePerSquare, sizePerSquare);
        }
    }

    snake.display();
    if (snake.running) {
        snake.update();
    } else {
        framesSinceDeath++;

        fill(255, 255, 255, min(framesSinceDeath * 10, 100));
        rect(0, 0, boardWidth * sizePerSquare, boardHeight * sizePerSquare);

        fill(0, 0, 0, min((framesSinceDeath - 8) * 20, 200));
        textAlign(CENTER, CENTER);
        textSize(50);
        textFont('sans-serif');
        text("You scored ", boardWidth * sizePerSquare / 2, boardHeight * sizePerSquare / 2 - 50);
        text(snake.body.length, boardWidth * sizePerSquare / 2, boardHeight * sizePerSquare / 2);
        textSize(30);
        text("Press r to play again.", boardWidth * sizePerSquare / 2, boardHeight * sizePerSquare / 2 + 50);

    }

}

function keyPressed() {
    if (key == 'ArrowRight' || key == 'd') {
        snake.changeDir(createVector(1, 0));
    } else if (key == 'ArrowLeft' || key == 'a') {
        snake.changeDir(createVector(-1, 0));
    } else if (key == 'ArrowDown' || key == 's') {
        snake.changeDir(createVector(0, 1));
    } else if (key == 'ArrowUp' || key == 'w') {
        snake.changeDir(createVector(0, -1));
    } else if (key == 'r') {
        snake = new Snake(5, 10);
        framesSinceDeath = 0;
    }
}
