import Genetic from 'genetic-js'

export default class GeneticTest {
  genetic: Genetic

  constructor() {
    this.genetic = Genetic.create()

    this.genetic.optimize = Genetic.Optimize.Maximize
    this.genetic.select1 = Genetic.Select1.Tournament2
    this.genetic.select2 = Genetic.Select2.Tournament2

    this.genetic.seed = this.seed
    this.genetic.mutate = this.mutate
    this.genetic.crossover = this.crossover
    this.genetic.fitness = this.fitness
    this.genetic.generation = this.generation

    //this.genetic.notification = function(pop, generation, stats, isFinished)
  }

  solve(expected: string): string {
    const config = {
      iterations: 4000,
      size: 250,
      crossover: 0.3,
      mutation: 0.3,
      skip: 20
    }

    const userData = {
      solution: expected
    }

    this.genetic.evolve(config, userData)

    return this.genetic.userData['solution'];
  }

  randomString(length: number): string {
    let text = ''
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length))

    return text
  }

  replaceAt(str: string, index: number, character: string) {
    return str.substr(0, index) + character + str.substr(index + character.length)
  }

  seed(): string {
    return this.randomString(this.genetic.userData['solution'].length)
  }

  mutate(entity: string): string {
    // chromosomal drift
    const i = Math.floor(Math.random() * entity.length)
    return this.replaceAt(
      entity,
      i,
      String.fromCharCode(entity.charCodeAt(i) + (Math.floor(Math.random() * 2) ? 1 : -1))
    )
  }

  crossover(mother: string, father: string) {
    // two-point crossover
    const len = mother.length
    let ca = Math.floor(Math.random() * len)
    let cb = Math.floor(Math.random() * len)
    if (ca > cb) {
      const tmp = cb
      cb = ca
      ca = tmp
    }

    const son = father.substr(0, ca) + mother.substr(ca, cb - ca) + father.substr(cb)
    const daughter = mother.substr(0, ca) + father.substr(ca, cb - ca) + mother.substr(cb)

    return [son, daughter]
  }

  fitness(entity: string): number {
    let fitness = 0

    for (let i = 0; i < entity.length; ++i) {
      // increase fitness for each character that matches
      if (entity[i] == this.genetic.userData['solution'][i]) fitness += 1

      // award fractions of a point as we get warmer
      fitness +=
        (127 - Math.abs(entity.charCodeAt(i) - this.genetic.userData['solution'].charCodeAt(i))) /
        50
    }

    return fitness
  }

  generation(pop: Array<any>) {
    // stop running once we've reached the solution
    return pop[0].entity != this.genetic.userData['solution']
  }
}
