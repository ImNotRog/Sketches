/**
My First AI Project
It'll train pretty quickly since it's not at all a complicated problem
*/


var neuralNetwork;
var dataset;
var e = 2.71828182846;
var step = 1; // Works well with 0.3-1

var redSlider;
var greenSlider;
var blueSlider;

function setup() {
    createCanvas(400, 300);
    redSlider = createSlider(0, 255, 0);
    greenSlider = createSlider(0, 255, 255);
    blueSlider = createSlider(0, 255, 0);
    redSlider.position(90, 10).style('width', '100px');
    greenSlider.position(90, 30).style('width', '100px');
    blueSlider.position(90, 50).style('width', '100px');
    createP("Red").position(20, -5);
    createP("Green").position(20, 15);
    createP("Blue").position(20, 35);


    dataset = [
        { value: color(255, 0, 0), label: 0 },
        { value: color(235, 64, 52), label: 0 },
        { value: color(217, 29, 0), label: 0 },
        { value: color(252, 20, 28), label: 0 },
        { value: color(222, 15, 0), label: 0 },
        { value: color(255, 65, 23), label: 0 },
        { value: color(255, 255, 0), label: 1 },
        { value: color(255, 209, 23), label: 1 },
        { value: color(252, 244, 3), label: 1 },
        { value: color(232, 250, 40), label: 1 },
        { value: color(255, 213, 0), label: 1 },
        { value: color(232, 228, 7), label: 1 },
        { value: color(0, 255, 0), label: 2 },
        { value: color(123, 232, 7), label: 2 },
        { value: color(86, 232, 7), label: 2 },
        { value: color(7, 232, 15), label: 2 },
        { value: color(26, 232, 7), label: 2 },
        { value: color(7, 232, 60), label: 2 },
        { value: color(0, 255, 255), label: 3 },
        { value: color(7, 232, 195), label: 3 },
        { value: color(7, 221, 232), label: 3 },
        { value: color(3, 255, 196), label: 3 },
        { value: color(2, 232, 240), label: 3 },
        { value: color(2, 240, 208), label: 3 },
        { value: color(0, 0, 255), label: 4 },
        { value: color(2, 42, 240), label: 4 },
        { value: color(5, 61, 240), label: 4 },
        { value: color(10, 38, 240), label: 4 },
        { value: color(12, 48, 250), label: 4 },
        { value: color(12, 16, 250), label: 4 },
        { value: color(255, 0, 255), label: 5 },
        { value: color(250, 2, 246), label: 5 },
        { value: color(218, 5, 250), label: 5 },
        { value: color(250, 12, 250), label: 5 },
        { value: color(202, 28, 255), label: 5 },
        { value: color(255, 14, 202), label: 5 },
        { value: color(250, 255, 250), label: 6 },
        { value: color(240, 230, 233), label: 6 },
        { value: color(228, 237, 235), label: 6 },
        { value: color(250, 255, 250), label: 6 },
        { value: color(232, 240, 255), label: 6 },
        { value: color(0, 15, 0), label: 7 },
        { value: color(30, 0, 10), label: 7 },
        { value: color(10, 20, 0), label: 7 },
        { value: color(20, 20, 10), label: 7 },
        { value: color(24, 34, 43), label: 7 },
        { value: color(12, 34, 32), label: 7 },
        { value: color(0, 30, 34), label: 7 },
    ];

    var sigmoid = function (input) {
        return 1 / (1 + pow(2.71828182846, -input));
    };

    var neuron = function (parents, weights, bias) {
        if (typeof parents === "boolean") {
            this.input = true;
        }
        else {
            this.input = false;
            this.parents = parents;
            this.weights = weights;
            this.bias = bias;
        }

        this.output = false;
        this.children = [];

        this.sumValue = 0;
        this.value = 0;
        this.sumDerivative = 0;
        this.finalDerivative = 0;

        this.biasDerivative = 0;
        this.weightDerivatives = [];

        this.run = function () {
            if (!this.input) {
                this.sumValue = 0;
                for (var i = 0; i < this.parents.length; i++) {
                    this.sumValue += this.parents[i].value * this.weights[i];
                }
                this.sumValue += this.bias;

                this.value = sigmoid(this.sumValue);
            }
        }

        this.applyDerivatives = function () {
            this.bias += this.biasDerivative * step;
            for (let i = 0; i < this.weights.length; i++) {
                this.weights[i] += this.weightDerivatives[i] * step;
            }
        };

        this.backpropagate = function (desiredOutput) {
            if (this.output) {
                this.finalDerivative = 2 * (desiredOutput - this.value);
                this.sumDerivative = pow(e, -this.sumValue) / pow(1 + pow(e, -this.sumValue), 2) * this.finalDerivative;
                this.biasDerivative = this.sumDerivative;

                this.weightDerivatives = [];
                for (var i = 0; i < this.weights.length; i++) {
                    this.weightDerivatives.push(this.parents[i].value * this.sumDerivative);
                }
            }
            else {
                var position = desiredOutput;
                this.finalDerivative = 0;
                for (let i = 0; i < this.children.length; i++) {
                    this.finalDerivative += this.children[i].weights[position] * this.children[i].sumDerivative;
                }

                this.sumDerivative = pow(e, -this.sumValue) / pow(1 + pow(e, -this.sumValue), 2) * this.finalDerivative;
                this.biasDerivative = this.sumDerivative;

                this.weightDerivatives = [];
                for (let i = 0; i < this.weights.length; i++) {
                    this.weightDerivatives.push(this.parents[i].value * this.sumDerivative);
                }
            }
            this.applyDerivatives();
        }
    }

    var NeuralNetwork = function (layersWithQuantities) {
        this.neurons = [];
        this.neurons.push([]);
        for (var i = 0; i < layersWithQuantities[0]; i++) {
            this.neurons[0].push(new neuron(true));
        }
        for (let i = 1; i < layersWithQuantities.length; i++) {
            this.neurons.push([]);
            for (var j = 0; j < layersWithQuantities[i]; j++) {
                var temporaryWeights = [];
                for (var k = 0; k < layersWithQuantities[i - 1]; k++) {
                    temporaryWeights.push(random(-3, 3));
                }
                this.neurons[i].push(new neuron(this.neurons[i - 1], temporaryWeights, random(-1, 1)));
            }
        }
        for (let i = 0; i < this.neurons.length - 2; i++) {
            for (let j = 0; j < this.neurons[i].length; j++) {
                this.neurons[i].children = this.neurons[i + 1];
            }
        }
        for (let i = 0; i < this.neurons[this.neurons.length - 1].length; i++) {
            this.neurons[this.neurons.length - 1][i].output = true;
        }

        this.run = function (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                this.neurons[0][i].value = inputs[i];
            }

            for (let i = 1; i < this.neurons.length; i++) {
                for (var j = 0; j < this.neurons[i].length; j++) {
                    this.neurons[i][j].run();
                }
            }

            var temporaryOutputs = [];
            for (let i = 0; i < this.neurons[this.neurons.length - 1].length; i++) {
                temporaryOutputs.push(this.neurons[this.neurons.length - 1][i].value);
            }
            return temporaryOutputs;
        }

        this.backpropagate = function (outputs, desiredOutput) {
            for (let i = 0; i < this.neurons[this.neurons.length - 1].length; i++) {
                this.neurons[this.neurons.length - 1][i].backpropagate(desiredOutput[i]);
            }

            for (var i = this.neurons.length - 2; i > 0; i--) {
                for (var j = 0; j < this.neurons[i].length; j++) {
                    this.neurons[i][j].backpropagate(j);
                }
            }

            var error = 0;
            for (let i = 0; i < outputs.length; i++) {
                error += pow(desiredOutput[i] - outputs[i], 2);
            }
            return outputs.concat(error);
        }
    }

    neuralNetwork = new NeuralNetwork([3, 5, 8]);
}

function draw() {
    background(220);
    noStroke();
    fill(redSlider.value(), greenSlider.value(), blueSlider.value());
    rect(20, 75, 175, 175);

    fill(100);
    rect(210, 20, 170, 150);
    rect(267, 170, 60, 80);
    rect(210, 210, 170, 40);
    fill(0);
    rect(215, 25, 160, 140);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    var output = neuralNetwork.run([map(redSlider.value(), 0, 255, 0, 1), map(greenSlider.value(), 0, 255, 0, 1), map(blueSlider.value(), 0, 255, 0, 1)]);


    var colorName;
    switch (output.indexOf(max(output))) {
        case 0:
            colorName = "red";
            break;
        case 1:
            colorName = "yellow";
            break;
        case 2:
            colorName = "green";
            break;
        case 3:
            colorName = "cyan";
            break;
        case 4:
            colorName = "blue";
            break;
        case 5:
            colorName = "purple";
            break;
        case 6:
            colorName = "white";
            break;
        case 7:
            colorName = "black";
            break;
    }

    text(colorName, 295, 95);

    console.log(frameCount);

    for (let i = 0; i < 48; i++) {
        var temporaryData = [];
        var temporaryIndex = i;
        temporaryData.push(map(red(dataset[temporaryIndex].value), 0, 255, 0, 1));
        temporaryData.push(map(green(dataset[temporaryIndex].value), 0, 255, 0, 1));
        temporaryData.push(map(blue(dataset[temporaryIndex].value), 0, 255, 0, 1));

        var temporaryDesiredOutput = [0, 0, 0, 0, 0, 0, 0, 0];
        temporaryDesiredOutput[dataset[temporaryIndex].label] = 1;
        (neuralNetwork.backpropagate(neuralNetwork.run(temporaryData), temporaryDesiredOutput));

    }
}
