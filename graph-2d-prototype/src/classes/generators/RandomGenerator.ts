import BaseGenerator from "@/classes/generators//BaseGenerator";
import GraphNode from "@/classes/graph/GraphNode";
import _ from 'lodash';

export default class RandomGenerator extends BaseGenerator {

    angleMin: number;
    angleMax: number;
    lengthMin: number;
    lengthMax: number;

    constructor(angleMin: number, angleMax: number, lengthMin: number, lengthMax: number) {
        super();
        this.angleMin = angleMin;
        this.angleMax = angleMax;
        this.lengthMin = lengthMin;
        this.lengthMax = lengthMax;
    }

    generate(): GraphNode 
    {
        return new GraphNode(_.random(this.angleMin, this.angleMax), _.random(this.lengthMin, this.lengthMax));
    }

    reset(): void {

    }
};