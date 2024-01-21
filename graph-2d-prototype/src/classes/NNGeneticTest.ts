import NeuralNetwork from '@/classes/classifiers/NeuralNetwork'
import NNGenetic from "@/classes/classifiers/NNGenetic";

export default class NNGeneticTest extends NNGenetic{
  //AND op
  // data = [
  //     {input: [0,0], output: 0},
  //     {input: [0,1], output: 0},
  //     {input: [1,0], output: 0},
  //     {input: [1,1], output: 1},
  // ];
  //OR op
  // data = [
  //     {input: [0,0], output: 0},
  //     {input: [0,1], output: 1},
  //     {input: [1,0], output: 1},
  //     {input: [1,1], output: 1},
  // ];
  //XOR op
  data = [
    { input: [0, 0], output: 0 },
    { input: [0, 1], output: 1 },
    { input: [1, 0], output: 1 },
    { input: [1, 1], output: 0 }
  ]

  calculateFitnessOfNetwork(network: NeuralNetwork): number {
    let fitness = 0
    for (let i = 0; i < this.data.length; i++) {
      const result = network.predict(this.data[i].input)

      fitness = fitness + Math.abs(this.data[i].output - result[0])
    }

    return 1.0 - fitness / 4.0
  }

  onGenerationFinished() {
    if (this.bestMatch) {
      console.log('Fitness: ' + this.bestMatch.fitness)

      for (let i = 0; i < this.data.length; i++) {
        const result = this.bestMatch.network.predict(this.data[i].input)

        console.log(
          this.data[i].input,
          'Predicted: ' + Math.round(result[0]),
          'Expected: ' + this.data[i].output
        )
      }
    }
  }
}
