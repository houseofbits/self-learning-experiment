import BaseGenerator from "./BaseGenerator";
import GraphNode from "../graph/GraphNode";
import Range from "../helpers/Range";
import WaveGenerator from "./WaveGenerator";
import RandomGenerator from "./RandomGenerator";

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
        this.yScale = new Range(0.8, 1.6);
        this.noise = new Range(0.0, 1.0);
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
    }

    getIterationCount(): number 
    {
        return this.iterations.length;
    }

    iterate(): boolean {
        this.waveGenerator.yScale = this.yScale.getInterpolated(this.iterations[this.currentIteration][0]);
        this.waveGenerator.xScale = this.xScale.getInterpolated(this.iterations[this.currentIteration][1]);
        this.waveGenerator.xOffset = this.xOffset.getInterpolated(this.iterations[this.currentIteration][2]);
        this.noiseValue = this.noise.getInterpolated(this.iterations[this.currentIteration][3]);

        this.currentIteration++;

        return this.currentIteration < this.iterations.length;
    }

    calculateFitnessValueForCurrentIteration(): number 
    {
        const noiseFactor = this.noiseValue / this.noise.getLength();
        const yScaleFactor = Math.abs(this.waveGenerator.yScale - 1.0) / this.yScale.getLength(); 
        const xScaleFactor = Math.abs(this.waveGenerator.xScale - 30.0) / this.xScale.getLength();         

        const value = Math.abs(1.0 - (noiseFactor * 0.7 + yScaleFactor * 0.2 + xScaleFactor * 0.1));

        return parseFloat(value.toFixed(2));
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