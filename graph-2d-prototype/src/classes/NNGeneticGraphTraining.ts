import NeuralNetwork from '@/classes/classifiers/NeuralNetwork'
import NNGenetic from "@/classes/classifiers/NNGenetic";
import FitnessClassifier from "@/classes/classifiers/FitnessClassifier";
import NNGenerator from "@/classes/generators/NNGenerator";
import Graph from "@/classes/graph/Graph";

export default class NNGeneticGraphTraining extends NNGenetic{

  graphFitnessClassifier: FitnessClassifier = new FitnessClassifier();
  finishedCallback: CallableFunction | null = null

  constructor() {
    super();

    this.config.populationSize = 1000;
    this.config.matingPoolSize = 20;
    this.config.targetFitness = 0.99;

    this.graphFitnessClassifier.load();
  }
  calculateFitnessOfNetwork(network: NeuralNetwork): number {

    const generator = new NNGenerator(network);

    const graph = new Graph();
    graph.generate(generator, 40);

    return this.graphFitnessClassifier.predict(graph);
  }

  onGenerationFinished() {
    if (this.bestMatch) {
      console.log('Fitness: ' + this.bestMatch.fitness)
    }

    if (this.finishedCallback) {
      this.finishedCallback(this.bestMatch);
    }
  }

  createNetwork(): NeuralNetwork {
    return new NeuralNetwork(null, 80, 100, 2);
  }
}
