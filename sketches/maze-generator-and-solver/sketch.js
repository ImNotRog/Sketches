var cells = [];
var scaling = 15;
var stack = [];
var current = {
    x: 0,
    y: 0
};
var solve = false;

var start = {
    x: 0,
    y: 0
};
var end;

function setup() {
    createCanvas(600, 600);

    var cell = function (x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.walls = [true, true, true, true];
        this.filled = false;
    }
    cell.prototype.display = function () {
        if (this.filled) {
            fill("#000");
        } else if (current.x === this.x && current.y === this.y) {
            fill("#37FF8B");
        } else if (this.visited) {
            fill(81, 214, 255);
        } else {
            fill(100, 100, 100);
        }
        noStroke();
        rect(this.x * scaling, this.y * scaling, scaling, scaling);
        if (this.visited) {
            stroke(50, 50, 150);
            strokeWeight(1);
        } else {
            stroke(0, 0, 0);
            strokeWeight(1);
        }
        if (this.walls[0]) {
            line(this.x * scaling, this.y * scaling, this.x * scaling + scaling, this.y * scaling);
        }
        if (this.walls[1]) {
            line(this.x * scaling + scaling, this.y * scaling, this.x * scaling + scaling, this.y * scaling + scaling);
        }
        if (this.walls[2]) {
            line(this.x * scaling, this.y * scaling + scaling, this.x * scaling + scaling, this.y * scaling + scaling);
        }
        if (this.walls[3]) {
            line(this.x * scaling, this.y * scaling, this.x * scaling, this.y * scaling + scaling);
        }
    }
    cell.prototype.getNeighbors = function () {
        var neighbors = [];
        if (this.y > 0 && cells[this.y - 1][this.x].visited === false) {
            neighbors.push({
                cell: cells[this.y - 1][this.x],
                position: "top"
            });
        }
        if (this.x < cells[0].length - 1 && cells[this.y][this.x + 1].visited === false) {
            neighbors.push({
                cell: cells[this.y][this.x + 1],
                position: "right"
            });
        }
        if (this.y < cells.length - 1 && cells[this.y + 1][this.x].visited === false) {
            neighbors.push({
                cell: cells[this.y + 1][this.x],
                position: "down"
            });
        }
        if (this.x > 0 && cells[this.y][this.x - 1].visited === false) {
            neighbors.push({
                cell: cells[this.y][this.x - 1],
                position: "left"
            });
        }
        return neighbors;
    }
    cell.prototype.getNeighborsAll = function () {
        var neighbors = [];
        if (this.y > 0) {
            neighbors.push({
                cell: cells[this.y - 1][this.x],
                position: "top"
            });
        }
        if (this.x < cells[0].length - 1) {
            neighbors.push({
                cell: cells[this.y][this.x + 1],
                position: "right"
            });
        }
        if (this.y < cells.length - 1) {
            neighbors.push({
                cell: cells[this.y + 1][this.x],
                position: "down"
            });
        }
        if (this.x > 0) {
            neighbors.push({
                cell: cells[this.y][this.x - 1],
                position: "left"
            });
        }
        return neighbors;
    };
    cell.prototype.update = function () {
        var neighbors = this.getNeighbors();
        if (neighbors.length > 0) {
            var neighbor = neighbors[floor(random(neighbors.length))];
            if (neighbor.position === "top") {
                this.walls[0] = false;
                neighbor.cell.walls[2] = false;
            }
            if (neighbor.position === "right") {
                this.walls[1] = false;
                neighbor.cell.walls[3] = false;
            }
            if (neighbor.position === "down") {
                this.walls[2] = false;
                neighbor.cell.walls[0] = false;
            }
            if (neighbor.position === "left") {
                this.walls[3] = false;
                neighbor.cell.walls[1] = false;
            }

            neighbor.cell.visited = true;

            current = {
                x: neighbor.cell.x,
                y: neighbor.cell.y
            }

            stack.push({
                x: this.x,
                y: this.y,
            })
        } else {
            if (stack.length > 0) {
                var currStack = stack.pop();
                current = {
                    x: currStack.x,
                    y: currStack.y
                }
            } else {
                solve = true;
            }
        }
    }
    cell.prototype.fill = function () {

        if (!(this.x === start.x && this.y === start.y) && !(this.x === end.x && this.y === end.y)) {
            var numOfWalls = 0;
            for (var i = 0; i < this.walls.length; i++) {
                if (this.walls[i]) {
                    numOfWalls++;
                }
            }
            if (numOfWalls >= 3) {
                this.filled = true;
                this.walls = [true, true, true, true];
                var neighbors = this.getNeighborsAll();
                for (var i = 0; i < neighbors.length; i++) {
                    if (neighbors[i].position === "top") {
                        neighbors[i].cell.walls[2] = true;
                    } else if (neighbors[i].position === "right") {
                        neighbors[i].cell.walls[3] = true;
                    } else if (neighbors[i].position === "down") {
                        neighbors[i].cell.walls[0] = true;
                    } else if (neighbors[i].position === "left") {
                        neighbors[i].cell.walls[1] = true;
                    }
                }
            }
        }
    };


    for (var y = 0; y < width; y += scaling) {
        cells.push([]);
        for (var x = 0; x < height; x += scaling) {
            cells[y / scaling].push(new cell(x / scaling, y / scaling));
        }
    }
    cells[0][0].visited = true;

    end = {
        x: cells[0].length - 1,
        y: cells.length - 1
    };
}

function draw() {
    if (!solve) {
        for (var i = 0; i < cells.length; i++) {
            for (var j = 0; j < cells[i].length; j++) {
                cells[i][j].display();
            }
        }
        cells[current.y][current.x].update();
    } else {
        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[i].length; j++) {
                cells[i][j].fill();
                cells[i][j].display();
            }
        }

    }
}