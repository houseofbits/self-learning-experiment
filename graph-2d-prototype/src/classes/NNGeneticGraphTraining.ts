import FlatWaveGenerator from '@/classes/generators/FlatWaveGenerator'
import NeuralNetwork from '@/classes/classifiers/NeuralNetwork'
import NNGenetic, { NNGeneticIndividual } from '@/classes/classifiers/NNGenetic'
import FlatNNGenerator from '@/classes/generators/FlatNNGenerator'
import FlatGraph from '@/classes/graph/FlatGraph'

const GRAPH_NODES_SIZE = 10

export default class NNGeneticGraphTraining extends NNGenetic {
  finishedCallback: CallableFunction | null = null
  targetGraph: FlatGraph;
  
  constructor() {
    super()

    this.config.populationSize = 1000
    this.config.matingPoolSize = 20
    this.config.targetFitness = 0.92
    this.config.maximumGenerations = 500

    const sineWaveGenerator = new FlatWaveGenerator()
    this.targetGraph = new FlatGraph(GRAPH_NODES_SIZE)
    sineWaveGenerator.frequency = 0.8;
    this.targetGraph.generate(sineWaveGenerator)    
  }

  calculateFitnessOfNetwork(network: NeuralNetwork): number {
    const generator = new FlatNNGenerator(network)

    const graph = new FlatGraph(GRAPH_NODES_SIZE)
    graph.generate(generator)

    let sum = 1.0;
    let max = 0;
    for (let i = 0; i < graph.nodes.length; i++) {
        const error = Math.abs(this.targetGraph.nodes[i] - graph.nodes[i]);

        if(error > max) {
            max = error;
        }

        sum += error;

       // sum *= this.calcTargetValueFitness(graph.nodes[i], this.targetGraph.nodes[i], 100);  //Math.abs(targetGraph.nodes[i] - graph.nodes[i]);
    }
    
    sum = sum / graph.nodes.length;

    return Math.max(0.0,  1.0 - (sum / 100.0)) * (1 - (max / 100));
  }

  calcTargetValueFitness(current: number, target: number, range: number): number {
    return 1.0 - Math.min(1.0, Math.abs(target - current) / range)
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
//    return new NeuralNetwork(null, GRAPH_NODES_SIZE, GRAPH_NODES_SIZE, 1)
    return new NeuralNetwork(null, 2, GRAPH_NODES_SIZE, 1)
  }

  calculateScore(nn: NNGeneticIndividual, best = false): number {
    return nn.fitness * nn.novelty
  }
}
