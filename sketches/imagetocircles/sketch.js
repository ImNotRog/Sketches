
let img;

const size = 400;
const circledensity = 10;

function preload() {
    img = loadImage("dog.jpeg"); 
}

function setup() {
    const imgwidth = size;
    const imgheight = size * img.height / img.width;

    createCanvas(imgwidth,imgheight, WEBGL)
}

function draw() {

    background(0);
    push();
    translate(-width/2, -height/2);
    const imgwidth = size;
    const imgheight = size * img.height / img.width;
    const invscalefactor = img.width / size;

    for (let x = 0; x < imgwidth; x += circledensity) {
        const scaledx = x * invscalefactor;
        for (let y = 0; y < imgheight; y += circledensity) {
            const scaledy = y * invscalefactor;

            const color = img.get(scaledx, scaledy);

            const distance = dist(mouseX,mouseY,x,y);
            fill(...color);
            noStroke();
            circle(x, y, map( constrain( distance, 0, 200), 0, 200, circledensity, circledensity/2) );
        }
    }

    pop();
}

