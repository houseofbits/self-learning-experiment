import BaseGenerator from '@/classes/generators/BaseGenerator'
import GraphNode from '@/classes/graph/GraphNode'
import Graph from "@/classes/graph/Graph"

export default class InterpolatedGenerator extends BaseGenerator<Graph, GraphNode> {
    generatorA: BaseGenerator<Graph, GraphNode>;
    generatorB: BaseGenerator<Graph, GraphNode>;
    value: number;

    constructor(generatorA: BaseGenerator<Graph, GraphNode>, generatorB: BaseGenerator<Graph, GraphNode>, value: number) {
        super();
        this.generatorA = generatorA;
        this.generatorB = generatorB;
        this.value = value;
    }

    generate(graph: Graph | null = null): GraphNode {

        const nodeA = this.generatorA.generate(graph);
        const nodeB = this.generatorB.generate(graph);

        return new GraphNode(this.lerp(nodeA.angleInDegrees, nodeB.angleInDegrees, this.value), this.lerp(nodeA.length, nodeB.length, this.value));
    }

    reset(): void {
        this.generatorA.reset();
        this.generatorB.reset();
    }

    lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }

    getGeneratorA<T>(): T
    {
        return (<T>this.generatorA);
    }

    getGeneratorB<T>(): T
    {
        return (<T>this.generatorB);
    } 
    
    setInterpolationValue(value: number): InterpolatedGenerator
    {
        this.value = value;
        
        return this;
    }
}
