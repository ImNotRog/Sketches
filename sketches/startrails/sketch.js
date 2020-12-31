

class RotatingParticle {
    static colors() {
        return [color("#80ffdb6"), color("#72efdd"), color("#64dfdf"), color("#56cfe1"), color("#48bfe3"), color("#4ea8de"), color("#5390d9"), color("#5e60ce")];
    }
    static randColor() {
        return RotatingParticle.colors()[Math.floor(Math.random() * RotatingParticle.colors().length)];
    }
    static maxDist() {
        return 50;
    }
    thetaVel() {
        return 0.005;
    }
    maxThetaDist() {
        return RotatingParticle.maxDist() / this.r;
    }

    constructor(r, theta) {
        this.color = RotatingParticle.randColor();
        this.minT = theta;
        this.maxT = theta;
        this.r = r;

    }
    update() {
        this.maxT += this.thetaVel();
        if (this.maxT - this.minT > this.maxThetaDist()) {
            this.minT = this.maxT - this.maxThetaDist();
        }
    }
    display() {
        noFill();
        stroke(red(this.color), green(this.color), blue(this.color), 255);
        strokeWeight(1);
        arc(0, 0, 2 * this.r, 2 * this.r, this.minT, this.maxT);

    }
}

let a = 1;

class RotatingParticleSystem {
    constructor() {
        this.particles = [];
        let r2 = (width * width + height * height) / 4;
        for (let i = 0; i < 500; i++) {
            let currR = Math.pow(Math.pow(r2, a) * Math.random(), 0.5 / a);
            let theta = 2 * Math.PI * Math.random();
            this.particles.push(new RotatingParticle(currR, theta));
        }
        // this.back = new NoiseBackground();
    }
    draw() {

        // let mask = createGraphics(width,height);

        push();
        translate(width / 2, height / 2);
        for (const p of this.particles) {
            p.update();
            p.display();
        }
        pop();
    }
}