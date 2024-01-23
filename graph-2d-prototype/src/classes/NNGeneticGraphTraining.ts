import NeuralNetwork from '@/classes/classifiers/NeuralNetwork'
import NNGenetic, { NNGeneticIndividual } from '@/classes/classifiers/NNGenetic'
import FitnessClassifier from '@/classes/classifiers/FitnessClassifier'
import NNGenerator from '@/classes/generators/NNGenerator'
import Graph from '@/classes/graph/Graph'

const GRAPH_NODES_SIZE = 5;

export default class NNGeneticGraphTraining extends NNGenetic {
  graphFitnessClassifier: FitnessClassifier = new FitnessClassifier()
  finishedCallback: CallableFunction | null = null

  constructor() {
    super()

    this.config.populationSize = 100
    this.config.matingPoolSize = 5
    this.config.targetFitness = 0.99
    this.config.maximumGenerations = 500;

    this.graphFitnessClassifier.load()
  }
  calculateFitnessOfNetwork(network: NeuralNetwork): number {
    const generator = new NNGenerator(network, GRAPH_NODES_SIZE * 2)

    const graph = new Graph()
    graph.generate(generator, GRAPH_NODES_SIZE)

    let minVal = 50
    let maxVal = 0
    for (let i = 1; i < graph.nodes.length; i ++) {
      if (graph.nodes[i].length > maxVal) {
        maxVal = graph.nodes[i].length
      }
      if (graph.nodes[i].length < minVal) {
        minVal = graph.nodes[i].length
      }
    }

    if (maxVal < 30) {
        maxVal = 50;
    }

    if (minVal > 30) {
        minVal = 0;
    }    

    const f = Math.min(1.0, Math.abs(30 - (maxVal - minVal) * 0.5) / 30.0)

    return f 
    * this.calcTargetValueFitness(graph.nodes[0].angleInDegrees, -15, 45)    
    * this.calcTargetValueFitness(graph.nodes[1].angleInDegrees, 15, 45)
    * this.calcTargetValueFitness(graph.nodes[2].angleInDegrees, -15, 45)
    * this.calcTargetValueFitness(graph.nodes[3].angleInDegrees, 15, 45);

    // return this.graphFitnessClassifier.predict(graph);
  }

  calcTargetValueFitness(current: number, target: number, range: number): number {
    return 1.0 - Math.min(1.0, Math.abs(target - current) / range);
  }

  onGenerationFinished() {
    if (this.bestMatch) {
      console.log('Fitness: ' + this.bestMatch.fitness)
    }

    if (this.finishedCallback) {
      this.finishedCallback(this.bestMatch)
    }
  }

  createNetwork(): NeuralNetwork {
    return new NeuralNetwork(null, GRAPH_NODES_SIZE * 2, GRAPH_NODES_SIZE * 2, 2)
  }

  calculateScore(nn: NNGeneticIndividual, best = false): number {
    return nn.fitness * nn.novelty;
  }
}
