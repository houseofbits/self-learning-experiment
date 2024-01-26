import BaseGenerator from "@/classes/generators//BaseGenerator";
import FlatGraph from "@/classes/graph/FlatGraph"
import Range from "@/classes/helpers/Range";

export default class FlatRandomGenerator extends BaseGenerator<FlatGraph, number> {
    angle: Range;

    constructor(angleMin: number, angleMax: number) {
        super();

        this.angle = new Range(angleMin, angleMax);
    }

    generate(): number 
    {
        return this.angle.getRandom();
    }

    reset(): void {

    }
};