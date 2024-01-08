import BaseGenerator from '../generators/BaseGenerator'
import GraphNode from './GraphNode';

export default class Graph {
  nodes: Array<GraphNode> = []

  add(node: GraphNode): void {
    this.nodes.push(node)
  }

  createPoints(): Array<{ x: number; y: number }> {
    const result: Array<{ x: number; y: number }> = []

    let prevX = 0
    let prevY = 0
    for (const node of this.nodes) {
      const sin = Math.sin(node.angleInDegrees * (Math.PI / 180))
      const cos = Math.cos(node.angleInDegrees * (Math.PI / 180))

      const point = {
        x: prevX + sin * node.length,
        y: prevY + cos * node.length
      }

      result.push(point)

      prevX = point.x
      prevY = point.y
    }

    return result
  }

  generate(generator: BaseGenerator, numberOfNodes: number): void {
    this.nodes = [];
    generator.reset();
    for (let index = 0; index < numberOfNodes; index++) {
      this.add(generator.generate())
    }
  }

  toArray(): Array<number> 
  {
    const result = [];
    for (const node of this.nodes) {
        result.push(node.angleInDegrees);
        result.push(node.length);
    }

    return result;
  }
}
