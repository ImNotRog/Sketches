let G = 0.1;
let fric = 0.001;

class Firework {

    constructor(pos, vel, color, mass, num, strength) {
        this.pos = pos;
        this.vel = vel;
        this.acc = createVector(0, 0);

        this.mass = mass || 200;

        this.trail = [];
        this.exploded = false;
        this.ended = false;

        this.color = color;

        this.num = num || 50;
        this.strength = strength || 2;

        this.trailMax = 25;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update(nodeList) {

        this.applyForce(createVector(0, G * this.mass));

        this.acc.mult(1 / this.mass);
        this.vel.add(this.acc);

        let currMag = this.vel.mag();
        this.vel.normalize();
        this.vel.mult(currMag - fric * currMag);

        this.acc.mult(0);
        this.pos.add(this.vel);

        if (!this.exploded) {
            this.trail.push(this.pos.copy());
        }

        if (this.trail.length > this.trailMax || this.exploded) {
            this.trail.splice(0, 1);
        }

        if (this.trail.length == 0) {
            this.ended = true;
        }

        if (this.vel.y >= 0 && !this.exploded) {

            this.exploded = true;

            for (var i = 0; i < this.num; i++) {

                let vel = p5.Vector.add(this.vel,
                    p5.Vector.mult(
                        p5.Vector.random2D(),
                        this.strength + random(-0.5, 0.5)));

                nodeList.push(new Particle(this.pos.copy(), vel, this.color, this.mass / 20));

            }
        }

        this.display();

    }

    display() {

        stroke(this.color);
        strokeWeight(3);
        noFill();
        beginShape();
        for (let node of this.trail) {
            vertex(node.x, node.y);
        }
        endShape();

        if (!this.exploded) {

            fill(lerpColor(this.color, color(255, 255, 255), 0.5));
            noStroke();
            ellipse(this.pos.x, this.pos.y, this.strength * 5, this.strength * 5);

            fill(255, 255, 255);
            noStroke();
            ellipse(this.pos.x, this.pos.y, this.strength * 5 / 2, this.strength * 5 / 2);

        }

    }

}


class Particle {

    constructor(pos, vel, color, mass, life) {
        this.pos = pos;
        this.vel = vel;
        this.acc = createVector(0, 0);

        this.color = color;
        this.mass = mass || 1;
        this.life = life || 64;
        this.totalLife = this.life;

        this.ended = false;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update(nodeList) {

        this.applyForce(createVector(0, G * this.mass));

        this.acc.mult(1 / this.mass);

        this.vel.add(this.acc);

        let currMag = this.vel.mag();
        this.vel.normalize();
        this.vel.mult(currMag - fric * currMag * currMag);

        this.acc.mult(0);

        this.pos.add(this.vel);

        this.life--;

        if (this.life <= 0) {
            this.ended = true;
        }

        this.display();
    }

    display() {
        fill(red(this.color), green(this.color), blue(this.color), this.life / this.totalLife * 255);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
    }
}

class System {

    constructor() {
        this.nodes = [];

        this.rate = 25;

        this.curr = 0;
    }

    update() {

        this.curr++;

        for (var i = 0; i < this.nodes.length; i++) {

            this.nodes[i].update(this.nodes);

            if (this.nodes[i].ended) {
                this.nodes.splice(i, 1);
                i--;
            }
        }

        if (this.curr % this.rate === 0) {
            this.curr = 0;
            this.nodes.push(new Firework(createVector(random(0, width), height), createVector(random(-2, 2), -random(4, 9)), color(random(0, 255), random(0, 255), random(0, 255))));
        }
    }

}


