import BaseGenerator from "@/classes/generators/BaseGenerator"
import GraphNode from "@/classes/graph/GraphNode"

export default class WaveGenerator extends BaseGenerator {

    length: number;
    xPosition: number = 0;
    xOffset: number = 0;
    xScale: number = 30;
    yScale: number = 1;

    constructor() {
        super();
        this.length = 30;
    }

    generate(): GraphNode {
        const derivative = Math.cos(this.xOffset + (this.xPosition / this.xScale));
        const angle = Math.atan2(derivative, 1) * this.yScale;
        const angleDegrees = (angle * 180) / Math.PI;

        const stepVector = this.createVector(angleDegrees, this.length);
        this.xPosition = this.xPosition + stepVector.x;

        return new GraphNode(angleDegrees, this.length);
    }

    reset(): void {
        this.xPosition = 0;
    }

    createVector(angleDegrees: number, length: number) {
        const angleRadians = (angleDegrees * Math.PI) / 180;

        return {x: Math.cos(angleRadians) * length, y: Math.sin(angleRadians) * length};
    }
};