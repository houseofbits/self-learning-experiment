import BaseGenerator from "@/classes/generators/BaseGenerator"
import GraphNode from "@/classes/graph/GraphNode"

export default class WaveGenerator extends BaseGenerator {

    length: number;   
    currentPosition: number = 0;

    constructor() {
        super();
        this.length = 30;
    }

    generate(): GraphNode 
    {
        const sin = Math.sin(this.currentPosition);
        const angle = sin * (180/Math.PI);

        this.currentPosition = this.currentPosition + 0.7;

        return new GraphNode(angle, this.length);
    }

    reset(): void {
        this.currentPosition = 0;
    }

};