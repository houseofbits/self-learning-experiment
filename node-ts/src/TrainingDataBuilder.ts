import ParametricGenerator from "./generators/ParametricGenerator";
import Graph from "./graph/Graph";
const fs = require("node:fs/promises");

export default class TrainingDataBuilder {
    parametricGenerator: ParametricGenerator;
    trainingDataInput: Array<Array<number>> = [];
    trainingDataExpected: Array<number> = [];

    constructor() {
        this.parametricGenerator = new ParametricGenerator();
    }

    generateTrainingData(): void {
        this.parametricGenerator.beginIteration(0.2);
        let iterationCount = 0;
        // const totalIterations = this.parametricGenerator.getIterationCount()
        this.trainingDataInput = [];
        this.trainingDataExpected = [];

        const graph = new Graph();
        while (this.parametricGenerator.iterate()) {
            const fitnessValue =
                this.parametricGenerator.calculateFitnessValueForCurrentIteration();
            graph.generate(this.parametricGenerator, 40);

            this.trainingDataInput.push(graph.toArray());
            this.trainingDataExpected.push(fitnessValue);

            iterationCount++;
        }
    }

    async save(path: string) {
        const data = {
            input: this.trainingDataInput,
            output: this.trainingDataExpected,
        };

        try {
            await fs.writeFile(path, JSON.stringify(data, null, 3));
        } catch (err) {
            console.log(err);
        }
    }

    async read(path: string) {
        try {
            const data = await fs.readFile(path, 'utf8');
            const json = JSON.parse(data);
            this.trainingDataInput = json.input;
            this.trainingDataExpected = json.output;
        } catch (err) {
            console.log(err);
        }
    }
}
