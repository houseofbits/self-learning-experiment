import Range from '@/classes/helpers/Range'
import FlatWaveGenerator from '@/classes/generators/FlatWaveGenerator'
import FlatRandomGenerator from '@/classes/generators/FlatRandomGenerator'
import FlatInterpolatedGenerator from '@/classes/generators/FlatInterpolatedGenerator'
import { cartesianProductOfObject } from '@/classes/helpers/CartesianSet'

export default class FlatParametricGenerator extends FlatInterpolatedGenerator {
  phaseRange: Range
  frequencyRange: Range
  amplitudeRange: Range
  noise: Range
  iterations: Array<{amplitude: number, frequency: number, phase: number, noise: number}> = []
  currentIteration: number = 0
  numberOfSteps: number = 10

  constructor() {
    super(new FlatWaveGenerator(), new FlatRandomGenerator(-45, 45), 0)

    this.phaseRange = new Range(0, 50)
    this.frequencyRange = new Range(0.8, 3)
    this.amplitudeRange = new Range(0.8, 1.6)
    this.noise = new Range(0.0, 1.0)
  }

  beginIteration(numberOfSteps: number): void {
    this.currentIteration = 0
    this.numberOfSteps = numberOfSteps

    this.iterations = cartesianProductOfObject({
      amplitude: this.amplitudeRange.getIterable(this.numberOfSteps),
      frequency: this.frequencyRange.getIterable(this.numberOfSteps),
      phase: this.phaseRange.getIterable(this.numberOfSteps),
      noise: this.noise.getIterable(this.numberOfSteps)
    })
  }

  getWaveGenerator(): FlatWaveGenerator {
    return this.getGeneratorA<FlatWaveGenerator>()
  }

  getNoiseGenerator(): FlatRandomGenerator {
    return this.getGeneratorB<FlatRandomGenerator>()
  }

  getIterationCount(): number {
    return this.iterations.length
  }

  iterate(): boolean {
    this.getWaveGenerator()
      .setAmplitude(this.iterations[this.currentIteration].amplitude)
      .setFrequency(this.iterations[this.currentIteration].frequency)
      .setPhase(this.iterations[this.currentIteration].phase)

    this.value = this.iterations[this.currentIteration].noise;

    this.currentIteration++

    return this.currentIteration < this.iterations.length
  }

  calculateFitnessValueForCurrentIteration(): number {
    const noiseFactor = 1.0 - this.value / this.noise.getLength()

    const yScaleFactor =
      1.0 - Math.abs(this.getWaveGenerator().amplitude - 1.0) / this.amplitudeRange.getLength()

    const xScaleFactor =
      1.0 - Math.abs(this.getWaveGenerator().frequency - 1.0) / this.frequencyRange.getLength()

    const value = noiseFactor * (noiseFactor * 0.7 + yScaleFactor * 0.2 + xScaleFactor * 0.1)

    return Math.abs(value)
  }
}
