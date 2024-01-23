import BaseGenerator from "@/classes/generators//BaseGenerator";
import GraphNode from "@/classes/graph/GraphNode";
import Range from "@/classes/helpers/Range";
import type NeuralNetwork from "@/classes/classifiers/NeuralNetwork";
import type Graph from "@/classes/graph/Graph";

export default class NNGenerator extends BaseGenerator {
    network: NeuralNetwork;
    size: number;

    constructor(network: NeuralNetwork, size: number = 80) {
        super();

        this.network = network;
        this.size = size;
    }

    generate(currentGraph: Graph | null): GraphNode
    {
        const inputData = currentGraph?.toArray() ?? [];
        
        if (inputData.length < this.size) {
            while (inputData.length < this.size) {
                inputData.push(0);
            }
        }

        const outputData = this.network.predict(inputData);

        return new GraphNode(45 - (outputData[0] * 90), outputData[1] * 50);
    }

    reset(): void {

    }
};