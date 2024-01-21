import BaseGenerator from "@/classes/generators//BaseGenerator";
import GraphNode from "@/classes/graph/GraphNode";
import Range from "@/classes/helpers/Range";
import type NeuralNetwork from "@/classes/classifiers/NeuralNetwork";
import type Graph from "@/classes/graph/Graph";

export default class NNGenerator extends BaseGenerator {
    network: NeuralNetwork;

    constructor(network: NeuralNetwork) {
        super();

        this.network = network;
    }

    generate(currentGraph: Graph | null): GraphNode
    {
        const inputData = currentGraph?.toArray() ?? [];
        while (inputData.length < 80) {
            inputData.push(0);
        }

        const outputData = this.network.predict(inputData);

        return new GraphNode(outputData[0], outputData[1]);
    }

    reset(): void {

    }
};