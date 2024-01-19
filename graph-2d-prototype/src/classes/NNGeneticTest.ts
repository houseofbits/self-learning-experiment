import NeuralNetwork from './classifiers/NeuralNetwork'
import Random from './helpers/Random'
import _ from 'lodash'
import ShapingFunctions from './helpers/ShapingFunctions'

/**
 * Novelty search has been applied to evolutionary robotics, most often in the context of neuroevolution
 * (i.e. the evolution of artificial neural networks or ANNs). Neuroevolution is popular because novelty
 * search rewards novel behaviors, which requires behaviors to be evolved. One way to evolve behaviors is
 * through ANNs. An ANN is like a "brain" for a virtual robot that encodes how it will behave.
 *
 * Instead of returning a fitness value, an evaluation of an individual in the domain should return a characterization
 * of that individual's behavior. Typically this characterization is a vector of real numbers reflecting important aspects
 * of what is interesting in the domain. One can then define a behavioral distance metric between different individuals,
 * which is traditionally the Euclidean distance between two individuals' behavioral characterization vectors.
 * Although any measure of individual novelty can potentially work, the average distance to the k-nearest neighbors of an
 * individual in behavior space has proven effective as the novelty metric in several publications. This metric measures
 * how much a particular area of behavior space has been explored, thereby rewarding individuals in relatively unexplored areas.
 *
 * The first step in calculating the novelty of a new individual is to measure its behavioral distance to all other individuals
 * in the population and to all individuals in the archive, reflecting how different it is from current behaviors
 * (i.e. in the current population) as well as behaviors that were novel in the past (i.e. in the archive). The k-nearest
 * neighbors can be derived from this distance information (i.e. the k individuals that have the smallest distance to the
 * new individual in the behavior space), and novelty is assigned as the average distance to the k-nearest neighbors.
 * If a new individual's novelty is high, it is typically added to the archive.
 */

const POPULATION_SIZE = 1000;
const MATING_POOL_SIZE = 20
const MAX_GENERATIONS = 50
const N_BEHAVIORAL_NEIGHBOURS = 20
const TARGET_FITNESS = 0.995

class NNGeneration {
  network: NeuralNetwork
  fitness: number
  behavioralDistance: Array<number> = []
  novelty: number = 0

  constructor(network: NeuralNetwork, fitness: number) {
    this.network = network
    this.fitness = fitness
  }

  static createCopy(object: NNGeneration) {
    const newObject = new NNGeneration(object.network.copy(), object.fitness)

    newObject.behavioralDistance = object.behavioralDistance
    newObject.novelty = object.novelty

    return newObject
  }
}

export default class NNGeneticTest {
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
  population: Array<NNGeneration> = []
  bestMatch: NNGeneration | null = null
  iterationNum: number = 0
  isGenerationRunning = false
  callback: CallableFunction | null = null
  fitnessSpread: number = 0

  start(callback: CallableFunction | null = null) {
    this.callback = callback
    this.initiateNewPopulation()
    this.isGenerationRunning = true
    this.iterationNum = 0
    this.step()
  }

  stop() {
    this.isGenerationRunning = false
  }

  step() {
    this.mutatePopulation()
    this.calculatePopulationFitness()
    this.calculateFitnessSpread()
    this.calculatePopulationNovelty()
    this.orderPopulationByBestScore()

    this.bestMatch = NNGeneration.createCopy(this.population[0])

    if (this.bestMatch.fitness > TARGET_FITNESS) {
      this.stop()
    }

    if (this.callback) {
      this.callback(
        MAX_GENERATIONS,
        this.iterationNum,
        this.bestMatch.fitness,
        this.bestMatch.novelty,
        this.calculateScore(this.bestMatch, true)
      )
    }

    this.population = this.evolvePopulation()

    this.iterationNum++

    if (this.iterationNum > MAX_GENERATIONS) {
      this.stop()
    }

    if (this.isGenerationRunning) {
      setTimeout(this.step.bind(this), 1)
    } else {
      this.printTestResults()
    }
  }

  evolvePopulation(): Array<NNGeneration> {
    this.orderPopulationByFitness()
    const matingPool = this.population.slice(0, MATING_POOL_SIZE)

    const newPopulation = []
    for (let a = 0; a < POPULATION_SIZE; a++) {
      const index = Random.randomIndex(matingPool.length)
      newPopulation.push(new NNGeneration(matingPool[index].network.copy(), 0))
    }

    return newPopulation
  }

  calculatePopulationNovelty() {
    //Set initial values
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].behavioralDistance = []
    }

    //Calculate distances to other individuals
    for (let i = 0; i < this.population.length; i++) {
      for (let a = i; a < this.population.length; a++) {
        if (a != i) {
          this.population[i].behavioralDistance.push(
            Math.abs(this.population[i].fitness - this.population[a].fitness)
          )
        }
      }
    }

    //Get the N nearest individuals and calculate novelty as average of those distances
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].behavioralDistance.sort()
      const values = this.population[i].behavioralDistance.slice(0, N_BEHAVIORAL_NEIGHBOURS)
      const sum = values.reduce(function (a, b) {
        return a + b
      }, 0)
      this.population[i].novelty = sum / values.length
    }
  }

  initiateNewPopulation() {
    this.population = []

    for (let i = 0; i < POPULATION_SIZE; i++) {
      this.population.push(new NNGeneration(new NeuralNetwork(null, 2, 4, 1), 0))
    }
  }

  /**
   * Mutate population by fixed factor and calculate fitness value
   */
  mutatePopulation() {

    const mutationRate = 1 - this.fitnessSpread;// < 0.1 ? 0.9 : MUTATION_RATE;

    for (let a = 0; a < this.population.length; a++) {
      this.population[a].network.mutate(mutationRate)
    }
  }

  calculatePopulationFitness() {
    for (let a = 0; a < this.population.length; a++) {
      this.population[a].fitness = this.calculateFitnessOfNetwork(this.population[a].network)
    }
  }

  orderPopulationByBestScore() {
    this.population.sort((a: NNGeneration, b: NNGeneration) => {
      const aval = this.calculateScore(a)
      const bval = this.calculateScore(b)

      return Math.sign(bval - aval)
    })
  }

  calculateFitnessSpread() {
    let min = 1.0,
      max = 0
    for (const individual of this.population) {
      if (individual.fitness > max) {
        max = individual.fitness
      }
      if (individual.fitness < min) {
        min = individual.fitness
      }
    }

    this.fitnessSpread = max - min
  }

  calculateScore(nn: NNGeneration, best = false): number {
    // return Math.pow(nn.fitness, FITNESS_POWER_FACTOR) * nn.novelty;

    const val = ShapingFunctions.doubleExponentialSigmoid(nn.fitness - 0.2, 0.7)
    // const val = ShapingFunctions.doubleExponentialSeat(nn.fitness, 0.3);

    // if (best) {
    //     console.log(nn.fitness, val);
    // }

    return nn.fitness * val + (1 - val) * nn.novelty
  }

  orderPopulationByFitness() {
    this.population.sort((a: NNGeneration, b: NNGeneration) => {
      return Math.sign(b.fitness - a.fitness)
    })
  }

  orderPopulationByNovelty() {
    this.population.sort((a: NNGeneration, b: NNGeneration) => {
      return Math.sign(b.novelty - a.novelty)
    })
  }

  calculateFitnessOfNetwork(network: NeuralNetwork): number {
    let fitness = 0
    for (let i = 0; i < this.data.length; i++) {
      const result = network.predict(this.data[i].input)

      fitness = fitness + Math.abs(this.data[i].output - result[0])
    }

    return 1.0 - fitness / 4.0
  }

  printTestResults() {
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
