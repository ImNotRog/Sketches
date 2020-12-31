
let flower;

function setup() {
    createCanvas(windowWidth, windowHeight);
    flower = new Flower();
}

function draw(){ 
    background(255,180,180);
    flower.draw();
}

class Segment {
    constructor(start, end, length) {
        this.start = start;
        this.end = end;
        this.acc = createVector(0,0);
        this.maxforce = 10;
        this.length = length;
        this.children = [];
    }

    initChildren( children ) { 
        this.children = [ ...children ];
    }


    mass() {
        return this.length + [0,...this.children].reduce((a, b) => a + b.mass())
    }

    applyForce(f) {
        f.div(this.mass())
        this.acc.add(f);
    }

    update() {
        this.acc.limit(this.maxforce);
        this.end.add(this.acc);
        this.acc.mult(0);

        // Do rope thing
        let slope = p5.Vector.sub(this.end, this.start);
        slope.normalize();
        slope.mult(this.length);
        this.end = p5.Vector.add(this.start, slope);

        for(const child of this.children) {
            child.start = this.end;
        }
    }
    draw() {
        line(this.start.x,this.start.y,this.end.x,this.end.y);
    }

    recurse(func) {
        func(this);
        for(const child of this.children) {
            child.recurse(func);
        }
    }
}

class Flower {
    constructor() {
        this.allsegments = [];
        this.segmentlength = 50;
        this.first = new Segment(null,null,null);
        
        let curr = this.first;

        let startposition = createVector(500,500);
        for(let i = 0; i < 10; i++) {
            let nextposition = p5.Vector.add(startposition, createVector(0,-this.segmentlength))
            curr.initChildren([new Segment(startposition, nextposition, this.segmentlength)]);
            curr = curr.children[0];
            startposition = nextposition;
        }

        this.first = this.first.children[0];
        this.first.recurse(a => {
            console.log(a.mass())
        });
    }

    draw() {
        this.first.recurse(a => {
            a.applyForce(createVector(300,0))
            a.update();
            a.draw();
        });
    }
}

