import * as tf from '@tensorflow/tfjs'
import TrainingData from '@/classes/helpers/TrainingData'

export default class GraphFitnessTraining 
{
  model: tf.Sequential | null = null

  createModel(dataSize: number): void {
    this.model = tf.sequential()
    this.model.add(tf.layers.dense({ units: 80, inputShape: [dataSize], activation: 'sigmoid' }))
    this.model.add(tf.layers.dense({ units: 40, activation: 'sigmoid' }))
    this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }))
    this.model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' })
  }

  async train(trainingData: TrainingData, callback: CallableFunction) 
  {
    const epochSize = 1000
    const dataSize = trainingData.input[0].length
    const dataSetSize = trainingData.input.length

    this.createModel(dataSize)

    const inputTensor = tf.tensor2d(trainingData.input, [dataSetSize, dataSize])
    const outputTensor = tf.tensor2d(trainingData.output, [dataSetSize, 1])

    if (this.model) {
      await this.model.fit(inputTensor, outputTensor, {
        epochs: epochSize,
        callbacks: {
          onEpochEnd: (epoch) => callback(Math.round((epoch / epochSize) * 100))
        }
      })
    }
  }

  async saveModel() {
    if (this.model) {
      await this.model.save('localstorage://GraphFitnessModel')
    }
  }

  async downloadModel() {
    if (this.model) {
        await this.model.save('downloads://GraphFitnessModel')
      }
  }
}
