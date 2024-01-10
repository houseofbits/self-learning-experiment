import * as tf from '@tensorflow/tfjs'
import type Graph from '../graph/Graph';

export default class FitnessClassifier 
{
    model: null | tf.LayersModel = null;

    async load() {
        this.model = await tf.loadLayersModel('http://localhost:5173/downloads/graph-fitness-model/model.json');        
    }

    async predict(graph: Graph) 
    {
        if (this.model) {
            const data = graph.toArray();
            const result = this.model.predict(
                tf.tensor2d(data, [1, data.length])
            )

            const values = await result.data();

            return values[0].toFixed(2);
        }
    }
}