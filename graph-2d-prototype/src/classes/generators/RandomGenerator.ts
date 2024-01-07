import BaseGenerator from "@/classes/generators//BaseGenerator";
import GraphNode from "@/classes/graph/GraphNode";
import Range from "@/classes/helpers/Range";

export default class RandomGenerator extends BaseGenerator {

    angle: Range;
    length: Range;
    constructor(angleMin: number, angleMax: number, lengthMin: number, lengthMax: number) {
        super();

        this.angle = new Range(angleMin, angleMax);
        this.length = new Range(lengthMin, lengthMax);
    }

    generate(): GraphNode 
    {
        return new GraphNode(this.angle.getRandom(), this.length.getRandom());
    }

    reset(): void {

    }
};