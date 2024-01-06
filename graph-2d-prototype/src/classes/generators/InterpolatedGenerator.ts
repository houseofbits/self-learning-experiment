import BaseGenerator from '@/classes/generators/BaseGenerator'
import GraphNode from '@/classes/graph/GraphNode'
import interpolateArrays from 'interpolate-arrays'

export default class InterpolatedGenerator extends BaseGenerator {
  generators: Array<BaseGenerator> = []

  constructor(generators: Array<BaseGenerator>) {
    super();
    this.generators = generators;
  }

  generate(): GraphNode {
    const input = [];
    for (const generator of this.generators) {
        const node = generator.generate();

        input.push([
            node.angleInDegrees,
            node.length,
        ]);
    }

    const result = interpolateArrays(input, 0.5);

    return new GraphNode(result[0], result[1])
  }

  reset(): void {}
}
