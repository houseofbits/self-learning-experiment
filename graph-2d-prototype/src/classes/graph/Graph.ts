import BaseGenerator from '@/classes/generators/BaseGenerator'

import GraphNode from '@/classes/graph/GraphNode'

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

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ): void {
    const points = this.createPoints()
    const pointSize = 5

    ctx.lineWidth = 2
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (const point of points) {
      ctx.lineTo(x + point.x, y + point.y)
    }
    ctx.stroke()

    ctx.lineWidth = 1
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(x, y, pointSize, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    for (const point of points) {
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.arc(x + point.x, y + point.y, pointSize, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    }
  }

  toArray(): Array<Array<number>> 
  {
    return this.nodes.map((node: GraphNode) => {
        return [node.angleInDegrees, node.length];
    });
  }
}
