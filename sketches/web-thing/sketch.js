let trianglecolors;
let d = 100;
let r = 150;
function setup() {
    createCanvas(windowWidth, windowHeight);

    let colorChoices = [
        "#7E6C6C",
        "#F87575",
        "#FFA9A3",
        "#B9E6FF",
        "#5C95FF"
    ]

    trianglecolors = [];
    for (let i = 0; i < width / d + 2; i++) {
        trianglecolors.push([]);
        for (let j = 0; j < height / d + 2; j++) {
            trianglecolors[i].push([]);
            for (let k = 0; k < 2; k++) {
                trianglecolors[i][j].push(color(colorChoices[(i + j + k * 3) % colorChoices.length]));
            }
        }
    }
    frameRate(30);
}

function draw() {
    background(20);

    let func = x => 1 / (exp(-10 * (x - 0.5)) + 1);
    let noisefunc = (x, y, z) => (func(noise(x, y, z)));

    let positions = [];
    for (let i = 0; i < width / d + 2; i++) {
        positions.push([]);
        for (let j = 0; j < height / d + 2; j++) {
            positions[i].push(createVector((noisefunc(i * d * 10, j * d * 10, frameCount / r + i * 100) + i - 1) * d, (noisefunc(i * d * 10, j * d & 10, frameCount / 500 + r) + j - 1) * d));
        }
    }


    //   for(let i = 0; i < width/d + 1; i++) {
    //     for(let j = 0; j < height / d + 1; j++) {
    //       // fill(trianglecolors[i][j][0]);

    //       let d = dist(positions[i][j].x,positions[i][j].y,positions[i+1][j].x,positions[i+1][j].y);
    //       fill(255,255,255,50 - d/4)
    //       noStroke();
    //       triangle(positions[i][j].x,positions[i][j].y,
    //               positions[i+1][j].x,positions[i+1][j].y,
    //               positions[i+1][j+1].x,positions[i+1][j+1].y)
    //       // fill(255,255,255,255)
    //       triangle(positions[i][j].x,positions[i][j].y,
    //               positions[i][j+1].x,positions[i][j+1].y,
    //               positions[i+1][j+1].x,positions[i+1][j+1].y)
    //     }
    //   }

    for (let i = 1; i < width / d + 1; i++) {
        for (let j = 1; j < height / d + 1; j++) {


            for (let i1 = -1; i1 <= 1; i1++) {
                for (let j1 = -1; j1 <= 1; j1++) {
                    let di = dist(positions[i][j].x, positions[i][j].y, positions[i + i1][j + j1].x, positions[i + i1][j + j1].y);
                    let d2 = dist(positions[i][j].x, positions[i][j].y, width / 2, height / 2) * d * d / 300 * 0;
                    stroke(255, 255, 255, map(di * di + d2, d * d * 3, 0, 0, 100));
                    line(positions[i][j].x, positions[i][j].y, positions[i + i1][j + j1].x, positions[i + i1][j + j1].y)
                }
            }
        }
    }

}