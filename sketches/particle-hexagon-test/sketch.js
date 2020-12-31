

let img;
let d = 10;
let num = 20;
let curr;
let r = 80;
let rope;
let rope2;

class TimePath {
    constructor(start, end, speed) {
        this.start = start;
        this.end = end;
        this.speed = speed;
        this.pos = createVector(start.x, start.y);
        this.done = false;
    }

    update() {
        this.done = true;
    }

}

class TimeLinearPath extends TimePath {
    constructor(start, end, speed) {
        super(start, end, speed);
        this.move = p5.Vector.sub(end, start);
        this.move.normalize();
        this.move.mult(speed);
    }

    update() {
        this.pos.add(this.move);
        let toEnd = p5.Vector.sub(this.end, this.move);
        if (toEnd.dot(this.pos) < 0) {
            this.done = true;
        }
    }
}

class TimeCirclePath extends TimePath {
    constructor(start, center, speed) {
        super(start, start, speed);
        this.center = center;
        let r = p5.Vector.sub(start, center);
        this.r = r.mag();
        this.angle = atan2(r.y, r.x);
        this.origangle = this.angle;
        this.wspeed = this.speed / this.r;
    }

    update() {
        this.angle += this.wspeed;
        if (this.angle > this.origangle + TWO_PI) {
            this.done = true;
        }
        this.pos = p5.Vector.add(this.center, createVector(this.r * cos(this.angle), this.r * sin(this.angle)));
    }
}

class Path {
    constructor(lyst) {
        this.points = lyst;
    }

    update(p) {
        this.points.pop();
        this.points = [p, ...this.points];
    }

    head() {
        return this.points[0];
    }

    draw() {

        for (let i = 1; i < this.points.length; i++) {
            line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        }

    }
}

class Rope {
    constructor(lyst, d) {
        this.points = lyst;
        this.d = d;
    }

    at(pp, p, d) {
        let dir = createVector(p.x - pp.x, p.y - pp.y);
        dir.normalize();
        dir.mult(d);
        return p5.Vector.sub(p, dir);
    }

    head() {
        return this.points[0];
    }

    update(p) {
        this.points[0] = p;
        this.points[1] = this.at(this.points[0], p, this.d);
        for (let i = 2; i < this.points.length; i++) {
            this.points[i] = this.at(this.points[i], this.points[i - 1], this.d);
        }
    }

    lerpUpdate(p, d) {
        this.update(p5.Vector.lerp(this.head(), p, d));
    }

    draw() {
        for (let i = 1; i < this.points.length; i++) {
            line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        }

    }
}


class Hexagon {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.deg = 0;
        this.setPoints(0);
    }

    setPoints(deg) {
        this.deg = deg;
        this.points = [];
        for (let i = 0; i < 6; i++) {
            this.points[i] = createVector(this.x + this.r * cos(TAU / 6 * i + deg), this.y + this.r * sin(TAU / 6 * i + deg));
        }
    }

    pointsInc(start, d) {
        let newps = [];
        for (let i = start; i < start + 6; i++) {
            for (let j = 0; j < 1; j += d / this.r) {
                newps.push(p5.Vector.lerp(this.points[i % 6], this.points[(i + 1) % 6], j));
            }
        }
        return newps;
    }

    closestPoint(v) {
        let newv = p5.Vector.sub(v, createVector(this.x, this.y));
        let angle = atan2(newv.y, newv.x);

        angle -= this.deg;
        while (angle < 0) {
            angle += TWO_PI;
        }
        angle *= 6 / TWO_PI;
        let p = round(angle);
        return (p) % 6;
    }

    draw() {
        for (let i = 1; i < this.points.length; i++) {
            line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        }

        line(this.points[0].x, this.points[0].y, this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)
    }
}


let h;
let h2;
let path;

let startpath;
function setup() {
    createCanvas(400, 400);

    h = new Hexagon(200, 200, 50);
    h2 = new Hexagon(200, 200, 50 * 1.18)
    startpath = createVector(200, 200);
    path = new TimeCirclePath(startpath, createVector(100, 200), 3);

}

let stage = 0;
function draw() {

    clear();

    background(20);

    stroke(255);
    strokeWeight(3);

    ellipse(200, 200, 10, 10);

    if (stage === 0) {
        h.draw();
        h2.draw();
        h2.setPoints(PI / 3 + frameCount / 100);
        h.setPoints(-frameCount / 100);
        let stuff = h.closestPoint(createVector(mouseX, mouseY));
        let p = h.points[stuff];
        ellipse(p.x, p.y, 10, 10);
    } else {

        path.update();
        ellipse(path.pos.x, path.pos.y, 10, 10);

        rope.draw();
        rope.lerpUpdate(createVector(mouseX, mouseY), 0.1);

        rope2.draw();
        rope2.lerpUpdate(path.pos, 0.1);
    }

    // s *= 1.18;


}

function mouseClicked() {
    let stuff = h.closestPoint(createVector(mouseX, mouseY));
    rope = new Rope(h.pointsInc(stuff, 10), 10);
    stuff = h2.closestPoint(startpath);
    rope2 = new Rope(h2.pointsInc(stuff, 10), 10);
    stage++;
}
