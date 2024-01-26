import BaseGenerator from '@/classes/generators/BaseGenerator'
import FlatGraph from '@/classes/graph/FlatGraph'

export default class FlatInterpolatedGenerator extends BaseGenerator<FlatGraph, number> {
  generatorA: BaseGenerator<FlatGraph, number>
  generatorB: BaseGenerator<FlatGraph, number>
  value: number

  constructor(
    generatorA: BaseGenerator<FlatGraph, number>,
    generatorB: BaseGenerator<FlatGraph, number>,
    value: number
  ) {
    super()
    this.generatorA = generatorA
    this.generatorB = generatorB
    this.value = value
  }

  generate(graph: FlatGraph | null = null): number {
    const a = this.generatorA.generate(graph)
    const b = this.generatorB.generate(graph)

    return this.lerp(a, b, this.value)
  }

  reset(): void {
    this.generatorA.reset()
    this.generatorB.reset()
  }

  lerp(a: number, b: number, t: number): number {
    return a + t * (b - a)
  }

  getGeneratorA<T>(): T {
    return <T>this.generatorA
  }

  getGeneratorB<T>(): T {
    return <T>this.generatorB
  }

  setInterpolationValue(value: number): FlatInterpolatedGenerator {
    this.value = value

    return this
  }
}
