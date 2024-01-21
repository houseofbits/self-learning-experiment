import NeuralNetwork from '@/classes/classifiers/NeuralNetwork'
import Random from '@/classes/helpers/Random'
import ShapingFunctions from '@/classes/helpers/ShapingFunctions'

export class NNGeneticConfiguration {

    populationSize: number = 1000;
    matingPoolSize: number = 20;
    maximumGenerations: number = 50;
    behavioralNeighboursSize: number = 20;
    targetFitness: number = 0.995
}

export class NNGeneticIndividual {
    network: NeuralNetwork
    fitness: number = 0;
    behavioralDistance: Array<number> = []
    novelty: number = 0

    constructor(network: NeuralNetwork) {
        this.network = network
    }

    static createCopy(object: NNGeneticIndividual) {
        const newObject = new NNGeneticIndividual(object.network.copy())

        newObject.fitness = object.fitness;
        newObject.behavioralDistance = object.behavioralDistance
        newObject.novelty = object.novelty

        return newObject
    }
}

export default class NNGenetic {
    config: NNGeneticConfiguration = new NNGeneticConfiguration();
    population: Array<NNGeneticIndividual> = []
    bestMatch: NNGeneticIndividual | null = null
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

        this.bestMatch = NNGeneticIndividual.createCopy(this.population[0])

        if (this.bestMatch.fitness > this.config.targetFitness) {
            this.stop()
        }

        if (this.callback) {
            this.callback(
                this.config.maximumGenerations,
                this.iterationNum,
                this.bestMatch.fitness,
                this.bestMatch.novelty,
                this.calculateScore(this.bestMatch, true)
            )
        }

        this.population = this.evolvePopulation()

        this.iterationNum++

        if (this.iterationNum > this.config.maximumGenerations) {
            this.stop()
        }

        if (this.isGenerationRunning) {
            setTimeout(this.step.bind(this), 1)
        } else {
            this.onGenerationFinished();
        }
    }

    evolvePopulation(): Array<NNGeneticIndividual> {
        this.orderPopulationByFitness()
        const matingPool = this.population.slice(0, this.config.matingPoolSize)

        const newPopulation = []
        for (let a = 0; a < this.config.populationSize; a++) {
            const index = Random.randomIndex(matingPool.length)
            newPopulation.push(new NNGeneticIndividual(matingPool[index].network.copy()))
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
            const values = this.population[i].behavioralDistance.slice(0, this.config.behavioralNeighboursSize)
            const sum = values.reduce(function (a, b) {
                return a + b
            }, 0)
            this.population[i].novelty = sum / values.length
        }
    }

    initiateNewPopulation() {
        this.population = []

        for (let i = 0; i < this.config.populationSize; i++) {
            this.population.push(new NNGeneticIndividual(this.createNetwork()));
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
        this.population.sort((a: NNGeneticIndividual, b: NNGeneticIndividual) => {
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

    calculateScore(nn: NNGeneticIndividual, best = false): number {
        // return Math.pow(nn.fitness, FITNESS_POWER_FACTOR) * nn.novelty;

        const val = ShapingFunctions.doubleExponentialSigmoid(nn.fitness - 0.2, 0.7)
        // const val = ShapingFunctions.doubleExponentialSeat(nn.fitness, 0.3);

        // if (best) {
        //     console.log(nn.fitness, val);
        // }

        return nn.fitness * val + (1 - val) * nn.novelty
    }

    orderPopulationByFitness() {
        this.population.sort((a: NNGeneticIndividual, b: NNGeneticIndividual) => {
            return Math.sign(b.fitness - a.fitness)
        })
    }

    orderPopulationByNovelty() {
        this.population.sort((a: NNGeneticIndividual, b: NNGeneticIndividual) => {
            return Math.sign(b.novelty - a.novelty)
        })
    }

    calculateFitnessOfNetwork(network: NeuralNetwork): number {
        //TODO Implement fitness function

        return 0.0
    }

    onGenerationFinished() {

    }

    createNetwork(): NeuralNetwork {
        return new NeuralNetwork(null, 2, 4, 1);
    }
}
