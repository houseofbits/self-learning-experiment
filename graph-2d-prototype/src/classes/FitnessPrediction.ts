import * as tf from '@tensorflow/tfjs'
import type Graph from './graph/Graph';

export default class FitnessPrediction 
{
    model: null | tf.LayersModel = null;


    async load(location: string) {
        this.model = await tf.loadLayersModel('localstorage://' + location);
    }

    async predict(graph: Graph) 
    {
        if (this.model) {
            const data = graph.toArray();
            const result = this.model.predict(
                tf.tensor2d(data, [1, data.length])
            )

            console.log(await result.data());
        }
    }
}