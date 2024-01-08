import BaseGenerator from './BaseGenerator'
import GraphNode from '../graph/GraphNode'

export default class InterpolatedGenerator extends BaseGenerator {
    generatorA: BaseGenerator;
    generatorB: BaseGenerator;
    value: number;

    constructor(generatorA: BaseGenerator, generatorB: BaseGenerator, value: number) {
        super();
        this.generatorA = generatorA;
        this.generatorB = generatorB;
        this.value = value;
    }

    generate(): GraphNode {

        const nodeA = this.generatorA.generate();
        const nodeB = this.generatorB.generate();

        return new GraphNode(this.lerp(nodeA.angleInDegrees, nodeB.angleInDegrees, this.value), this.lerp(nodeA.length, nodeB.length, this.value));
    }

    reset(): void {
        this.generatorA.reset();
        this.generatorB.reset();
    }

    lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }
}
