import Range from '@/classes/helpers/Range'
import WaveGenerator from '@/classes/generators/WaveGenerator'
import RandomGenerator from '@/classes/generators/RandomGenerator'
import InterpolatedGenerator from './InterpolatedGenerator'

export default class ParametricGenerator extends InterpolatedGenerator {
  phaseRange: Range
  frequencyRange: Range
  amplitudeRange: Range
  noise: Range
  iterations: Array<Array<number>> = []
  currentIteration: number = 0
  stepSize: number = 0.1

  constructor() {
    super(new WaveGenerator(30), new RandomGenerator(-45, 45, 0, 50), 0)

    this.phaseRange = new Range(0, 50)
    this.frequencyRange = new Range(20, 50)
    this.amplitudeRange = new Range(0.8, 1.6)
    this.noise = new Range(0.0, 1.0)
  }

  beginIteration(stepSize: number): void {
    this.currentIteration = 0
    this.stepSize = stepSize
    this.iterations = []
    for (let a = 0; a <= 1.0; a += this.stepSize) {
      for (let b = 0; b <= 1.0; b += this.stepSize) {
        for (let c = 0; c <= 1.0; c += this.stepSize) {
          for (let d = 0; d <= 1.0; d += this.stepSize) {
            this.iterations.push([a, b, c, d])
          }
        }
      }
    }
  }

  getWaveGenerator(): WaveGenerator {
    return this.getGeneratorA<WaveGenerator>()
  }

  getNoiseGenerator(): RandomGenerator {
    return this.getGeneratorB<RandomGenerator>()
  }

  getIterationCount(): number {
    return this.iterations.length
  }

  iterate(): boolean {
    this.getWaveGenerator()
      .setAmplitude(this.amplitudeRange.getInterpolated(this.iterations[this.currentIteration][0]))
      .setFrequency(this.frequencyRange.getInterpolated(this.iterations[this.currentIteration][1]))
      .setPhase(this.phaseRange.getInterpolated(this.iterations[this.currentIteration][2]))

    this.value = this.noise.getInterpolated(this.iterations[this.currentIteration][3])

    this.currentIteration++

    return this.currentIteration < this.iterations.length
  }

  calculateFitnessValueForCurrentIteration(): number {
    const noiseFactor = this.value / this.noise.getLength()
    const yScaleFactor =
      Math.abs(this.getWaveGenerator().amplitude - 1.0) / this.amplitudeRange.getLength()
    const xScaleFactor =
      Math.abs(this.getWaveGenerator().frequency - 30.0) / this.frequencyRange.getLength()

    const value = (1.0 - noiseFactor) * (1.0 - (noiseFactor * 0.7 + yScaleFactor * 0.2 + xScaleFactor + 0.1))

    return Math.abs(value);
  }
}
