import * as tf from '@tensorflow/tfjs'
import Random from '@/classes/helpers/Random'

export default class NeuralNetwork {
  model: tf.Sequential
  inputNodes: number
  hiddenNodes: number
  outputNodes: number

  constructor(a: tf.Sequential | null, inputSize: number, hiddenSize: number, outputSize: number) {
    if (a instanceof tf.Sequential) {
      this.model = a
      this.inputNodes = inputSize
      this.hiddenNodes = hiddenSize
      this.outputNodes = outputSize
    } else {
      this.inputNodes = inputSize
      this.hiddenNodes = hiddenSize
      this.outputNodes = outputSize
      this.model = this.createModel()
    }
  }

  createModel(): tf.Sequential {
    const model = tf.sequential()

    const hidden = tf.layers.dense({
      units: this.hiddenNodes,
      inputShape: [this.inputNodes],
      activation: 'sigmoid'
    })

    model.add(hidden)

    const hidden2 = tf.layers.dense({
      units: this.hiddenNodes,
      activation: 'sigmoid'
    })

    model.add(hidden2)

    const hidden3 = tf.layers.dense({
        units: this.hiddenNodes / 2,
        activation: 'sigmoid'
      })
  
      model.add(hidden3)    

    const output = tf.layers.dense({
      units: this.outputNodes,
      activation: 'sigmoid'
    })

    model.add(output)

    return model
  }

  predict(inputs: Array<number>) {
    const xs = tf.tensor2d([inputs])
    const ys = this.model.predict(xs)
    const outputs = ys.dataSync()

    return outputs
  }

  copy() {
    const modelCopy = this.createModel()
    const weights = this.model.getWeights()
    const weightCopies = []
    for (let i = 0; i < weights.length; i++) {
      weightCopies[i] = weights[i].clone()
    }
    modelCopy.setWeights(weightCopies)
    return new NeuralNetwork(modelCopy, this.inputNodes, this.hiddenNodes, this.outputNodes)
  }

  mutate(mutationRate: number) {
    const weights = this.model.getWeights()
    const mutatedWeights = []

    for (let i = 0; i < weights.length; i++) {
      const tensor = weights[i]
      const shape = weights[i].shape
      const values = tensor.dataSync().slice()

      for (let j = 0; j < values.length; j++) {
        if (Math.random() < mutationRate) {
          const w = values[j]
          values[j] = w + Random.gaussian()
        }
        // const w = values[j];
        // values[j] = Random.lerp(w, mutationRate);
      }

      const newTensor = tf.tensor(values, shape)
      mutatedWeights[i] = newTensor
    }

    this.model.setWeights(mutatedWeights)
  }
}
