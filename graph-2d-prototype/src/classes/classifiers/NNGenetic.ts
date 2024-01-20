import NeuralNetwork from '@src/classes/classifiers/NeuralNetwork'
import Random from '@src/classes/helpers/Random'
import _ from 'lodash'
import ShapingFunctions from '@src/classes/helpers/ShapingFunctions'

const POPULATION_SIZE = 1000;
const MATING_POOL_SIZE = 20
const MAX_GENERATIONS = 50
const N_BEHAVIORAL_NEIGHBOURS = 20
const TARGET_FITNESS = 0.995

export class NNGeneration {
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

export default class NNGenetic {

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
        //TODO Implement fitness function

        return 0.0
    }
}
