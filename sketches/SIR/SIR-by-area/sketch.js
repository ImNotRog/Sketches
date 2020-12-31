
// SIP simulation with quarantine, by proximity

let Node;
let Side;
let Simulation;

let simulation;

function setup() {

    Node = function (param1, param2) {
        // Node(x,y) -> Node
        // Creates a Node object, which represents a human in a SIR system, or 
        // susceptible-incubated-infected-without symptoms-removed system.
        // S C I W R

        // Some presets
        if (typeof param1 == int) {
            this.pos = createVector(param1, param2);
        } else {
            this.pos = createVector(random(param1.left, param1.right), random(param1.top, param1.bottom));
        }

        this.ppos = this.pos.copy();

        this.vel = p5.Vector.random2D();
        this.accel = createVector(0, 0);
        this.status = "s";
        this.currProbability = 0;
        this.infectedFor = 0;
        this.incubatedFor = 0;

        this.initializeAfter = function () {
            this.incubation = random(simulation.incubationLow, simulation.incubationHigh);
            if (random() < simulation.withoutProb) {
                this.immune = true;
            } else {
                this.immune = false;
            }
        }

        this.move = function () {
            // Node.move() -> undefined
            // Makes the Node move in a modified random walk

            // Preset the ppos
            this.ppos = this.pos.copy();

            // Creates a random acceleration
            this.accel = p5.Vector.random2D();
            this.accel.mult(simulation.accel);

            // Adds acceleration to velocity, then sets velocity's speed to a set value
            this.vel = p5.Vector.add(this.vel, this.accel);
            this.vel.normalize();
            this.vel.mult(simulation.speed);

            // Adds velocity to position
            this.pos = p5.Vector.add(this.pos, this.vel);

            // Checks collisions with sides
            for (let i = 0; i < simulation.sides.length; i++) {
                if (simulation.sides[i].p1.x == simulation.sides[i].p2.x) {

                    // If the y position is between the endpoints of the line segment
                    if (this.ppos.y < simulation.sides[i].p2.y && this.ppos.y > simulation.sides[i].p1.y) {

                        // If the Node has crossed the side, simulate a collision
                        if (this.ppos.x < simulation.sides[i].p1.x && this.pos.x > simulation.sides[i].p2.x) {
                            this.pos.x = simulation.sides[i].p1.x - 1;
                            this.vel.x *= -1;
                        }
                        if (this.ppos.x > simulation.sides[i].p1.x && this.pos.x < simulation.sides[i].p2.x) {
                            this.pos.x = simulation.sides[i].p1.x + 1;
                            this.vel.x *= -1;
                        }

                    }

                } else {

                    // If the x position is between the endpoints of the line segment
                    if (this.ppos.x < simulation.sides[i].p2.x && this.ppos.x > simulation.sides[i].p1.x) {

                        // If the Node has crossed the side, simulate a collision
                        if (this.ppos.y < simulation.sides[i].p1.y && this.pos.y > simulation.sides[i].p2.y) {
                            this.pos.y = simulation.sides[i].p1.y - 1;
                            this.vel.y *= -1;
                        }
                        if (this.ppos.y > simulation.sides[i].p1.y && this.pos.y < simulation.sides[i].p2.y) {
                            this.pos.y = simulation.sides[i].p1.y + 1;
                            this.vel.y *= -1;
                        }
                    }
                }

            }

        }

        this.display = function () {
            // Node.display() -> undefined
            // Displays the Node as a colored circle, colored based on status

            // Filling presets:
            if (this.status == "s") {
                fill(50, 120, 255);
            } else if (this.status == "c") {
                if (this.incubatedFor < 64) {
                    stroke(255, 255, 0, (64 - this.incubatedFor) * 5);
                    strokeWeight(3);
                    noFill();
                    ellipse(this.pos.x, this.pos.y, simulation.dispSize / 10 * this.incubatedFor);
                }

                fill(255, 255, 50);
            } else if (this.status == "i") {

                if (this.infectedFor < 64) {
                    stroke(255, 50, 50, (64 - this.infectedFor) * 5);
                    strokeWeight(3);
                    noFill();
                    ellipse(this.pos.x, this.pos.y, simulation.dispSize / 10 * this.infectedFor);
                }

                fill(255, 50, 50);

            } else if (this.status == "w") {

                if (this.infectedFor < 64) {
                    stroke(50, 255, 50, (64 - this.infectedFor) * 5);
                    strokeWeight(3);
                    noFill();
                    ellipse(this.pos.x, this.pos.y, simulation.dispSize / 10 * this.infectedFor);
                }

                fill(50, 255, 50);

            } else if (this.status == "r") {
                fill(100, 100, 100);
            }

            noStroke();

            // Actually displaying:
            ellipse(this.pos.x, this.pos.y, simulation.dispSize, simulation.dispSize);
        }

        this.presetInfection = function () {
            // Node.presetInfection() -> undefined
            // Just does some updating stuff

            if (this.status == "c") {
                this.incubatedFor++;

                if (this.incubatedFor > this.incubation) {
                    if (this.immune) {
                        this.status = "w";
                    } else {
                        this.status = "i";
                    }
                }
            }

            // If the Node is infected, it will be removed after a while.
            if (this.status == "i" || this.status == "w") {
                this.infectedFor++;

                if (this.infectedFor > simulation.infectionLength) {
                    this.status = "r";
                }
            }
        }

        this.giveInfection = function () {
            // Node.giveInfection() -> undefined
            // If infected, a Node increases the probability of getting the disease for
            // the area it is

            if (this.status == "i" || this.status == "c" || this.status == "w") {

                let i = floor(this.pos.x / simulation.areaSides);
                let j = floor(this.pos.y / simulation.areaSides);

                if (i >= simulation.areaProbs.length) {
                    i = simulation.areaProbs.length - 1;
                }

                if (j >= simulation.areaProbs[i].length) {
                    j = simulation.areaProbs[i].length - 1;
                }


                simulation.areaProbs[i][j] += simulation.increaseProb;

            }

        }

        this.calcInfection = function () {
            // Node.calcInfection() -> undefined
            // Sees if the probability is high enough to get the infection

            let i = floor(this.pos.x / simulation.areaSides);
            let j = floor(this.pos.y / simulation.areaSides);

            if (i >= simulation.areaProbs.length) {
                i = simulation.areaProbs.length - 1;
            }
            if (j >= simulation.areaProbs[i].length) {
                j = simulation.areaProbs[i].length - 1;
            }

            if (this.status == "s") {
                if (random() < simulation.areaProbs[i][j]) {
                    this.status = "c";
                }
            }

        }

        this.randomPos = function (areaObject) {
            // Node.randomPos(areaObject)
            // Sets the position as a random position in an area

            this.pos = createVector(random(areaObject.left, areaObject.right), random(areaObject.top, areaObject.bottom));
        }

        this.in = function (areaObject) {
            // Node.in(areaObject) -> boolean
            // Returns if the Node is in an area

            if (this.pos.x <= areaObject.right && this.pos.x >= areaObject.left) {
                if (this.pos.y <= areaObject.bottom && this.pos.y <= areaObject.bottom) {

                    return true

                }
            }

            return false

        }

    }

    Side = function (x1, y1, x2, y2) {
        // Side(x1,y1,x2,y2) -> Side
        // Creates a Side object which represents a wall, which must be horizontal or vertical.

        // Make sure the line is vertical or horizontal
        if (x1 != x2 && y1 != y2) {
            throw new Error('Side not vertical or horizontal, not built to handle this! :(');
        }

        // Store the endpoints
        this.p1 = createVector(x1, y1);
        this.p2 = createVector(x2, y2);

        this.display = function () {
            // Side.display()
            // Displays the Side

            stroke(0, 0, 0);
            strokeWeight(2);
            line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        }

    }

    Simulation = function (x, y) {
        // Simulation(x,y) -> Simulation
        // Creates a SIR Simulation

        // Finds where to display
        this.corner = createVector(x, y);

        // constants
        this.speed = 0.5;
        this.accel = 0.05;
        this.dispSize = 7;
        this.infectionLength = 64 * 5;
        this.incubationLow = 64 * 1;
        this.incubationHigh = 64 * 3;
        this.withoutProb = 0.1;

        // SIR numbers
        this.susceptible = [];
        this.incubated = [];
        this.infected = [];
        this.removed = [];
        this.without = [];

        // Lists
        this.nodes = [];
        this.sides = [];

        // Rendering constants
        this.animationWidth = 600;
        this.animationHeight = 450;
        this.frames = 0;
        this.framesPerSurvey = 3;
        this.widthPerBar = 0.5;
        this.graphHeight = 300;


        // Area Constants
        this.areaSides = 15;
        this.increaseProb = 0.0010;
        this.decreaseProb = 0.00045;
        this.lerpColorCoeff = 10;
        this.probCap = 0.1;

        this.areaProbs = [];
        for (let i = 0; i < this.animationWidth / this.areaSides; i++) {
            this.areaProbs.push([]);
            for (let j = 0; j < this.animationHeight / this.areaSides; j++) {
                this.areaProbs[i].push(0);
            }
        }

        // Spawn Object
        this.spawnObject = [{
            size: 500,
            left: 200,
            top: 0,
            bottom: 450,
            right: 600
        },]

        // Field constants
        this.fieldArea = {
            left: 200,
            top: 0,
            bottom: 400,
            right: 600
        };

        // Quarantine constants
        this.quarantineArea = {
            left: 0,
            top: 250,
            bottom: 400,
            right: 150
        };
        this.quarantineLength = 16;

        // Custom Barriers
        this.sides = [new Side(0, 250, 0, 400), new Side(0, 0, 600, 0), new Side(200, 450, 600, 450), new Side(0, 400, 150, 400), new Side(600, 0, 600, 450), new Side(150, 250, 150, 400), new Side(0, 250, 150, 250), new Side(200, 0, 200, 450)];

        // Creates a set number of Nodes based on the spawnObject parameter
        // Format: [ {size: ###, top: ##, left: ##, right: ##, bottom: ## } ]
        this.populationSize = 0;
        this.nodes = [];
        for (let i = 0; i < this.spawnObject.length; i++) {
            for (let j = 0; j < this.spawnObject[i].size; j++) {
                this.nodes.push(new Node(this.spawnObject[i]));
            }

            this.populationSize += this.spawnObject[i].size;
        }

        // Infect a Node
        this.nodes[0].status = "c";

        this.initializeAfter = function () {
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].initializeAfter();
            }
        }

        this.updateAreaProbs = function () {
            for (let i = 0; i < this.areaProbs.length; i++) {
                for (let j = 0; j < this.areaProbs[i].length; j++) {
                    this.areaProbs[i][j] -= this.decreaseProb;

                    if (this.areaProbs[i][j] > this.probCap) {
                        this.areaProbs[i][j] = this.probCap;
                    }
                    if (this.areaProbs[i][j] < 0) {
                        this.areaProbs[i][j] = 0;
                    }
                }

            }
        }

        this.renderAreaProbs = function () {
            for (let i = 0; i < this.areaProbs.length; i++) {

                for (let j = 0; j < this.areaProbs[0].length; j++) {

                    noStroke();
                    fill(lerpColor(color(0, 0, 255), color(255, 0, 0), this.areaProbs[i][j] * this.lerpColorCoeff));
                    rect(i * this.areaSides, j * this.areaSides, this.areaSides, this.areaSides);

                }
            }

            fill(255, 255, 255, 150);
            rect(0, 0, this.animationWidth, this.animationHeight);
        }

        this.updateSim = function () {
            // Simulation.updateSim()
            // Updates a Simulation's Nodes

            // Move the nodes and make sure the nodes' infection probabilities are set to 0
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].move();
                this.nodes[i].presetInfection();
            }

            // Each infected Node dishes out infection
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].giveInfection();
            }

            // Each Node sees if they're infected
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].calcInfection();
            }

            this.updateAreaProbs();
            this.renderAreaProbs();

        }

        this.renderSim = function () {
            // Simulation.renderSim()
            // Displays the simulation

            this.nodes.forEach(currNode => currNode.display());
            this.sides.forEach(currSide => currSide.display());

        };

        this.updateGraph = function () {
            // Node.updateGraph()
            // Updates the graph for the Simulation

            this.frames++;

            // Once every couple frames, take a survey to see how many are S, I, and R
            // Also, makes sure that there's at least one infected

            if (this.frames == 0 || (this.frames % this.framesPerSurvey == 0 && (this.infected[this.infected.length - 1] !== 0 || this.incubated[this.incubated.length - 1] !== 0 || this.without[this.without.length - 1] !== 0))) {

                // Adds a new entry to each category
                this.susceptible.push(0);
                this.infected.push(0);
                this.removed.push(0);
                this.incubated.push(0);
                this.without.push(0);

                // Takes chart of all the Nodes
                for (let i = 0; i < this.nodes.length; i++) {
                    if (this.nodes[i].status == "s") {
                        this.susceptible[this.susceptible.length - 1]++;
                    }
                    if (this.nodes[i].status == "i") {
                        this.infected[this.infected.length - 1]++;
                    }
                    if (this.nodes[i].status == "r") {
                        this.removed[this.removed.length - 1]++;
                    }
                    if (this.nodes[i].status == "c") {
                        this.incubated[this.incubated.length - 1]++;
                    }
                    if (this.nodes[i].status == "w") {
                        this.without[this.without.length - 1]++;
                    }
                }

            }

        }

        this.renderLayer = function (listOfLists, layerColor) {
            // Node.renderLayer(listOfLists,layerColor)
            // Render a single layer for the Graph

            fill(layerColor);
            beginShape();
            vertex(width - (this.infected.length - 1) * this.widthPerBar, height);

            for (let i = 0; i < this.infected.length; i++) {
                let vertexHeight = 0;
                for (let j = 0; j < listOfLists.length; j++) {
                    vertexHeight += listOfLists[j][i];
                }

                vertex(width - (this.infected.length - 1 - i) * this.widthPerBar, height - ((vertexHeight) * this.graphHeight / this.populationSize));
            }

            vertex(width, height);
            endShape(CLOSE);

        }

        this.renderGraph = function () {
            // Node.renderGraph()
            // Renders the graph for the Simulation

            // Render the background, which conviniently should be R
            noStroke();
            fill(100, 100, 100);
            rect(width - (this.infected.length - 1) * this.widthPerBar, this.animationHeight, (this.infected.length - 1) * this.widthPerBar, this.graphHeight);

            // Render layers
            this.renderLayer([this.susceptible, this.infected, this.incubated, this.without],
                color(50, 120, 255))
            this.renderLayer([this.infected, this.incubated, this.without], color(50, 255, 50))
            this.renderLayer([this.infected, this.incubated], color(255, 255, 0))
            this.renderLayer([this.infected], color(255, 50, 50))

        }

        this.quarantine = function () {


            for (let i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].in(this.fieldArea)) {
                    if (this.nodes[i].infectedFor >= this.quarantineLength && this.nodes[i].status == "i") {
                        this.nodes[i].randomPos(this.quarantineArea);
                    }
                } else if (this.nodes[i].in(this.quarantineArea)) {
                    if (this.nodes[i].status == "r") {
                        this.nodes[i].randomPos(this.fieldArea);
                    }
                }
            }

        }

        this.update = function () {
            // Simulation.update()
            // Fully update the Simulation

            this.updateSim();
            this.renderSim();
            this.updateGraph();
            this.renderGraph();
            this.quarantine();

        }

    }

    simulation = new Simulation(0, 0);
    simulation.initializeAfter();

    createCanvas(simulation.animationWidth, simulation.animationHeight + simulation.graphHeight);

}

function draw() {

    background(220);

    simulation.update();

}