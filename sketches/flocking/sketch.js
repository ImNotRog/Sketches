class Boid {

    constructor(x, y) {
        this.pos = createVector(x, y);
        let theta = random(0, TWO_PI);
        this.vel = createVector(cos(theta), sin(theta));
        this.acc = createVector(0, 0);

        this.sWeight = 2;
        this.aWeight = 1;
        this.cWeight = 1;

        this.separationDist = 30;
        this.neighborDist = 70;

        this.maxspeed = 2;
        this.maxforce = 0.1;

    }

    applyForce(force) {
        this.acc.add(force);
    }

    update(boids) {
        this.flock(boids);

        this.acc.limit(this.maxforce);
        this.vel.add(this.acc);
        this.acc.mult(0);

        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);

        if (this.pos.x > width) {
            this.pos.x = 0;
        }
        if (this.pos.y > height) {
            this.pos.y = 0;
        }
        if (this.pos.x < 0) {
            this.pos.x = width;
        }
        if (this.pos.y < 0) {
            this.pos.y = height;
        }

        this.display();
    }

    flock(boids) {
        let s = this.separate(boids);
        let a = this.align(boids);
        let c = this.cohesion(boids);
        s.mult(this.sWeight);
        a.mult(this.aWeight);
        c.mult(this.cWeight);

        let total = createVector(0, 0);
        total.add(s);
        total.add(a);
        total.add(c);

        total.normalize();
        total.mult(this.maxforce);

        this.applyForce(total);
    }

    separate(boids) {

        let returnVec = createVector(0, 0);

        for (var boid of boids) {
            if (dist(boid.pos.x, boid.pos.y, this.pos.x, this.pos.y) < this.separationDist &&
                boid !== this) {
                let reverseVec = p5.Vector.sub(this.pos, boid.pos);
                reverseVec.normalize();
                reverseVec.mult(1 / dist(boid.pos.x, boid.pos.y, this.pos.x, this.pos.y));
                returnVec.add(reverseVec);
            }
        }

        if (returnVec.x != 0 || returnVec.y != 0) {
            returnVec.normalize();
            returnVec.mult(this.maxforce);
            return returnVec;
        }
        return createVector(0, 0);
    }

    align(boids) {

        let avgAlign = createVector(0, 0);

        for (let boid of boids) {
            if (dist(boid.pos.x, boid.pos.y, this.pos.x, this.pos.y) < this.neighborDist &&
                boid !== this) {
                avgAlign.add(boid.vel);
            }
        }

        if (avgAlign.x != 0 || avgAlign.y != 0) {
            avgAlign.div(boids.length);

            avgAlign.normalize();
            avgAlign.mult(this.maxspeed);

            let targetVel = p5.Vector.sub(avgAlign, this.vel);
            targetVel.normalize();
            targetVel.mult(this.maxforce);

            return targetVel;
        }
        return createVector(0, 0);

    }

    cohesion(boids) {

        let avgPos = createVector(0, 0);

        let num = 0;

        for (let boid of boids) {
            if (abs(dist(boid.pos.x, boid.pos.y, this.pos.x, this.pos.y)) < this.neighborDist &&
                boid !== this) {
                avgPos.add(boid.pos);
                num++;
            }
        }

        if (num > 0) {

            avgPos.div(num);

            let targetVel = p5.Vector.sub(avgPos, this.pos);
            targetVel.normalize();
            targetVel.mult(this.maxspeed);

            let targetAcc = p5.Vector.sub(targetVel, this.vel);
            targetAcc.normalize();
            targetAcc.mult(this.maxforce);

            return targetAcc;

        }
        return createVector(0, 0);

    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(atan2(this.vel.y, this.vel.x));
        fill(255, 255, 255);
        noStroke();
        triangle(0, -4, 12, 0, 0, 4);
        pop();
    }

}

class Simulation {

    constructor(num) {
        this.boids = [];
        for (let i = 0; i < num; i++) {
            this.boids.push(new Boid(random(0, width), random(0, height)));
        }
    }
    update() {
        for (let boid of this.boids) {
            boid.update(this.boids);
        }
    }
}

let sim;
function setup() {
    createCanvas(500, 500);
    sim = new Simulation(100);
}

function draw() {
    background(0);
    sim.update();
}