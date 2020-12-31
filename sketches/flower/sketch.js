
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

        this.deg = 0;
        
        this.target = 0;
    }

    initChildren( children ) { 
        this.children = [ ...children ];
    }


    mass() {
        return this.length + [0,...this.children].reduce((a, b) => a + b.mass())
    }

    applyForce(f) {
        f.div(this.mass())
        // f.div(100);
        this.acc.add(f);
    }

    update(deg) {

        let totaldeg = deg + this.deg;

        let slope = createVector(Math.cos(totaldeg), Math.sin(totaldeg));
        slope.mult(this.length);

        this.acc.limit(this.maxforce);
        slope.add(this.acc);
        this.acc.mult(0);

        // New degree angle after applying force
        let newdeg = Math.atan2(slope.y,slope.x);

        // Must make it conform to society and to the previous stalk
        let conformingpart = ( deg + this.target ) % ( 2 * Math.PI ) - newdeg;
    
        if(conformingpart < -Math.PI) {
            conformingpart += Math.PI * 2;
        }
        if(conformingpart > Math.PI) {
            conformingpart -= Math.PI * 2;
        }

        conformingpart *= 0.005;

        newdeg += conformingpart;

        this.deg = newdeg - deg;

        slope.normalize();
        slope.mult(this.length);

        this.end = p5.Vector.add(this.start, slope);

        this.draw();

        for(const child of this.children) {
            child.start = this.end;
            child.update(deg + this.deg);
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

class Petal extends Segment {
    constructor(start, end, length, target) {
        super(start,end,length);
        this.target = target;
    }
}

class Flower {
    constructor() {
        this.allsegments = [];
        this.segmentlength = 50;
        this.first = new Segment(null,null,null);
        
        let curr = this.first;

        let startposition = createVector(width/2,height * 3 / 4);
        for(let i = 0; i < 10; i++) {
            let nextposition = p5.Vector.add(startposition, createVector(0,-this.segmentlength))
            curr.initChildren([new Segment(startposition, nextposition, this.segmentlength)]);
            curr = curr.children[0];
            startposition = nextposition;
        }

        this.petallength = 100;
        let children = [];
        for(let i = 0; i < 6; i++ ) {
            let nextposition = p5.Vector.add(startposition, createVector(0, -this.petallength))
            children.push(new Petal(startposition, nextposition, this.petallength, Math.PI * i / 3))
        }

        curr.initChildren(children);

        this.first = this.first.children[0];
        this.first.recurse(a => {
            console.log(a.mass())
        });
    }

    draw() {

        let wind = p5.Vector.sub(createVector(width / 2, height / 2), createVector(mouseX,mouseY));
        wind.mult(0.1);
        this.first.recurse(a => {
            a.applyForce(createVector(wind.x,0));
        });
        this.first.update(-Math.PI / 2);
    }
}

