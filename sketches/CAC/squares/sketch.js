
function setup() {
    createCanvas(200, 500);
    noLoop();
}

const w = 20;
const epsilon = 0.001;

function draw() {
    background(220);

    for (let x = 0; x < width; x += w) {
        for (let y = 0; y < height; y += w) {
            push();
            translate(x, y);
            rotate(epsilon * (random() - 0.5) * y)
            square(0, 0, w);
            pop();
        }
    }

}