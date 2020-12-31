let board;
let selected;
let selectingBig;
let mouseHoveredOver;
let xo;
let smallBoard;
let completed;

function setup() {
    createCanvas(400, 400);

    selected = 0;
    selectingBig = true;
    mouseHoveredOver = [];
    xo = 1;
    completed = 0;

    //Board construction
    smallBoard = []
    for (let i = 0; i < 3; i++) {
        smallBoard.push([]);
        for (let j = 0; j < 3; j++) {
            smallBoard[i].push(0);
        }
    }
    board = [];
    for (let i = 0; i < 3; i++) {
        board.push([]);
        for (let j = 0; j < 3; j++) {
            board[i].push([]);
            for (let k = 0; k < 3; k++) {
                board[i][j].push([]);
                for (let l = 0; l < 3; l++) {
                    board[i][j][k].push(0);
                }
            }
        }
    }

}

function draw() {
    background(220);

    mouseHoveredOver = [floor((mouseX - 50) / 100), floor((mouseY - 50) / 100), floor(((mouseX - 50) % 100 - 10) / 30), floor(((mouseY - 50) % 100 - 10) / 30)];

    switch (completed) {
        case 1:
            strokeWeight(3);
            stroke(255, 0, 0);
            line(55, 55, 345, 345);
            line(55, 345, 345, 55);
            break;
        case 2:
            strokeWeight(3);
            stroke(0, 0, 255);
            ellipse(200, 200, 290, 290);
            break;
        case 3:
            strokeWeight(3);
            stroke(100);
            arc(200, 200, 290, 290, PI / 4, 7 * PI / 4);
            break;
    }

    //Large line rendering
    stroke(0, 0, 0);
    strokeWeight(3);
    line(150, 50, 150, 350)
    line(250, 50, 250, 350)
    line(50, 150, 350, 150)
    line(50, 250, 350, 250)

    //Little line rendering
    strokeWeight(1);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            push();
            translate(i * 100, j * 100);
            line(85, 55, 85, 145);
            line(115, 55, 115, 145);
            line(55, 85, 145, 85);
            line(55, 115, 145, 115);
            pop();
        }
    }

    //Symbol rendering
    strokeWeight(1);
    noFill();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (smallBoard[i][j] == 1) {
                push();
                translate(i * 100, j * 100);

                strokeWeight(2);
                stroke(255, 0, 0);
                line(55, 55, 145, 145);
                line(55, 145, 145, 55);
                pop();
            }
            if (smallBoard[i][j] == 2) {
                push();
                translate(i * 100, j * 100);

                strokeWeight(2);
                stroke(0, 0, 255);
                noFill();
                ellipse(100, 100, 90, 90);
                pop();
            }
            if (smallBoard[i][j] == 3) {
                push();
                translate(i * 100, j * 100);

                strokeWeight(2);
                stroke(100);
                noFill();
                arc(100, 100, 90, 90, PI / 4, 7 * PI / 4);
                pop();
            }

            if ((i == mouseHoveredOver[0] && j == mouseHoveredOver[1] && selectingBig)) {
                push();
                translate(i * 100, j * 100);

                noStroke();
                fill(0, 0, 0, 100);
                rect(50, 50, 100, 100);
                pop();
            }
            if (!selectingBig && i == selected[0] && j == selected[1]) {
                push();
                translate(i * 100, j * 100);

                noStroke();
                fill(0, 0, 0, 100);
                rect(50, 50, 100, 100);
                pop();
            }
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    if (board[i][j][k][l] === 1) {
                        push();
                        translate(k * 30, l * 30);
                        translate(i * 100, j * 100);
                        strokeWeight(1);
                        stroke(255, 0, 0);
                        line(60, 60, 80, 80);
                        line(80, 60, 60, 80);

                        pop();
                    }
                    if (board[i][j][k][l] === 2) {
                        push();
                        translate(k * 30, l * 30);
                        translate(i * 100, j * 100);
                        strokeWeight(1);
                        noFill();
                        stroke(0, 0, 255);
                        ellipse(70, 70, 20, 20)

                        pop();
                    }

                    if (i == mouseHoveredOver[0] && j == mouseHoveredOver[1] && k == mouseHoveredOver[2] && l == mouseHoveredOver[3] && !selectingBig) {
                        noStroke();
                        fill(0, 0, 0, 100);
                        push();
                        translate(k * 30, l * 30);
                        translate(i * 100, j * 100);
                        rect(55, 55, 30, 30);
                        pop();
                    }
                }
            }
        }
    }

}


mouseClicked = function () {

    try {
        if (completed == 0) {

            if (selectingBig) {
                if (smallBoard[mouseHoveredOver[0]][mouseHoveredOver[1]] == 0) {
                    selected = [mouseHoveredOver[0], mouseHoveredOver[1]];
                    selectingBig = !selectingBig;
                }
            } else if (!selectingBig && mouseHoveredOver[0] == selected[0] && mouseHoveredOver[1] == selected[1]) {

                if (board[mouseHoveredOver[0]][mouseHoveredOver[1]][mouseHoveredOver[2]][mouseHoveredOver[3]] == 0) {

                    selected = [mouseHoveredOver[2], mouseHoveredOver[3]];
                    board[mouseHoveredOver[0]][mouseHoveredOver[1]][mouseHoveredOver[2]][mouseHoveredOver[3]] = xo;
                    if (xo == 1) {
                        xo = 2;
                    } else {
                        xo = 1;
                    }


                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {

                            if (smallBoard[i][j] === 0) {
                                let temp = board[i][j];

                                let containsZero = false
                                for (let k = 0; k < 3; k++) {
                                    for (let l = 0; l < 3; l++) {
                                        if (temp[k][l] == 0) {
                                            containsZero = true
                                        }
                                    }
                                }

                                if (!containsZero) {
                                    smallBoard[i][j] = 3
                                }

                                for (let k = 0; k < 3; k++) {
                                    if (temp[k][0] == temp[k][1] && temp[k][1] == temp[k][2] && temp[k][0] != 0) {
                                        smallBoard[i][j] = temp[k][0];
                                    }
                                    if (temp[0][k] == temp[1][k] && temp[1][k] == temp[2][k] && temp[0][k] != 0) {
                                        smallBoard[i][j] = temp[0][k];
                                    }
                                }
                                if (temp[0][0] == temp[1][1] && temp[0][0] == temp[2][2] && temp[0][0] != 0) {
                                    smallBoard[i][j] = temp[0][0];
                                }
                                if (temp[2][0] == temp[1][1] && temp[2][0] == temp[0][2] && temp[2][0] != 0) {
                                    smallBoard[i][j] = temp[2][0];
                                }
                            }

                        }
                    }

                    if (smallBoard[selected[0]][selected[1]] != 0) {
                        selectingBig = true;
                    }

                    temp = smallBoard;

                    let containsZero = false
                    for (let k = 0; k < 3; k++) {
                        for (let l = 0; l < 3; l++) {
                            if (temp[k][l] == 0) {
                                containsZero = true
                            }
                        }
                    }

                    if (!containsZero) {
                        completed = 3
                    }

                    for (let k = 0; k < 3; k++) {
                        if (temp[k][0] == temp[k][1] && temp[k][1] == temp[k][2] && temp[k][0] != 0) {
                            completed = temp[k][0];
                        }
                        if (temp[0][k] == temp[1][k] && temp[1][k] == temp[2][k] && temp[0][k] != 0) {
                            completed = temp[0][k];
                        }
                    }
                    if (temp[0][0] == temp[1][1] && temp[0][0] == temp[2][2] && temp[0][0] != 0) {
                        completed = temp[0][0];
                    }
                    if (temp[2][0] == temp[1][1] && temp[2][0] == temp[0][2] && temp[2][0] != 0) {
                        completed = temp[2][0];
                    }

                }

            }
        }
    } catch (err) {

    }
}