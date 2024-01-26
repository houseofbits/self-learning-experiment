import BaseGenerator from "@/classes/generators//BaseGenerator";
import type NeuralNetwork from "@/classes/classifiers/NeuralNetwork";
import type FlatGraph from "@/classes/graph/FlatGraph";

export default class FlatNNGenerator extends BaseGenerator<FlatGraph, number> {
    network: NeuralNetwork;
    size: number;

    constructor(network: NeuralNetwork, size: number = 80) {
        super();

        this.network = network;
        this.size = size;
    }

    generate(currentGraph: FlatGraph | null): number
    {
        const inputData = currentGraph?.toArray() ?? [];
        
        // const size = currentGraph?.maxSize ?? this.size;

        // if (inputData.length < size) {
        //     while (inputData.length < size) {
        //         inputData.push(0);
        //     }
        // }

        const result = inputData.slice(-2);

        const outputData = this.network.predict([
            result[0] ?? 0,
            result[1] ?? 0
        ]);

        return 45 - (outputData[0] * 90);
    }

    reset(): void {

    }
}; 