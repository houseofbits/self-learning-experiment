import Graph from "@/classes/graph/Graph";
import WaveGenerator from "@/classes/generators/WaveGenerator";
import Range from "@/classes/helpers/Range";

export default class WaveGraph {
    graph: Graph;
    generator: WaveGenerator;
    xOffset: Range;
    xScale: Range;
    yScale: Range;

    constructor() {
        this.graph = new Graph();
        this.generator = new WaveGenerator();
        this.xOffset = new Range(0, 50);
        this.xScale = new Range(10, 50);
        this.yScale = new Range(1, 1.8);
    }

    generate(): void {
        this.generator.yScale = this.yScale.getRandom();
        this.generator.xScale = this.xScale.getRandom();
        this.generator.xOffset = this.xOffset.getRandom();
        this.graph.generate(this.generator, 40);
    }

    draw(ctx: CanvasRenderingContext2D,
         x: number,
         y: number,
         color: string): void {

        this.graph.draw(ctx, x, y, color);
    }
};