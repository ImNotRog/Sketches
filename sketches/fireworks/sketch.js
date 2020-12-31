let system;

function setup() {
    createCanvas(400, 400);
    system = new System();
    frameRate(64);
}

function draw() {
    background(220);
    system.update();
}