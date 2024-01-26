import * as tf from '@tensorflow/tfjs'
import type Graph from '../graph/Graph';
import type FlatGraph from '../graph/FlatGraph';

export default class FitnessClassifier 
{
    model: null | tf.LayersModel = null;

    constructor(model: tf.LayersModel | null = null) {
        this.model = model;
    }

    async load() {
        this.model = await tf.loadLayersModel('http://localhost:5173/downloads/graph-fitness-model-2/model.json');        
    }

    predict(graph: Graph | FlatGraph)
    {
        if (this.model) {
            const data = graph.toArray();
            const result = this.model.predict(
                tf.tensor2d(data, [1, data.length])
            )

            const outputs = result.dataSync()

            return outputs[0];
        }
    }
}