import BaseGenerator from "@/classes/generators//BaseGenerator";
import GraphNode from "@/classes/graph/GraphNode";
import Range from "@/classes/helpers/Range";
import WaveGenerator from "@/classes/generators/WaveGenerator";
import RandomGenerator from "@/classes/generators/RandomGenerator";

export default class ParametricGenerator extends BaseGenerator {
    waveGenerator: WaveGenerator;
    randomGenerator: RandomGenerator;
    noiseValue: number = 0;
    xOffset: Range;
    xScale: Range;
    yScale: Range;
    noise: Range;
    iterations: Array<Array<number>> = [];
    currentIteration: number = 0;
    stepSize: number = 0.1;

    constructor() {
        super();

        this.waveGenerator = new WaveGenerator(30);
        this.randomGenerator = new RandomGenerator(-45, 45, 30, 30);
        this.xOffset = new Range(0, 50);
        this.xScale = new Range(20, 50);
        this.yScale = new Range(1, 1.8);
        this.noise = new Range(0, 0.5);
    }

    beginIteration(stepSize: number): void {
        this.currentIteration = 0;
        this.stepSize = stepSize;
        this.iterations = [];
        for (let a = 0; a <= 1.0; a += this.stepSize) {
            for (let b = 0; b <= 1.0; b += this.stepSize) {
                for (let c = 0; c <= 1.0; c += this.stepSize) {
                    for (let d = 0; d <= 1.0; d += this.stepSize) {
                        this.iterations.push([a, b, c, d]);
                    }
                }
            }
        }

        console.log("Number of iterations: " + this.iterations.length);
    }

    step(): boolean {
        this.waveGenerator.yScale = this.yScale.getInterpolated(this.iterations[this.currentIteration][0]);
        this.waveGenerator.xScale = this.xScale.getInterpolated(this.iterations[this.currentIteration][1]);
        this.waveGenerator.xOffset = this.xOffset.getInterpolated(this.iterations[this.currentIteration][2]);
        this.noiseValue = this.noise.getInterpolated(this.iterations[this.currentIteration][3]);

        this.currentIteration++;

        return this.currentIteration < this.iterations.length;
    }

    generate(): GraphNode {
        const nodeA = this.waveGenerator.generate();
        const nodeB = this.randomGenerator.generate();

        return new GraphNode(this.lerp(nodeA.angleInDegrees, nodeB.angleInDegrees, this.noiseValue), this.lerp(nodeA.length, nodeB.length, this.noiseValue));
    }

    reset(): void {
        this.waveGenerator.reset();
        this.randomGenerator.reset();
    }

    lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }
};