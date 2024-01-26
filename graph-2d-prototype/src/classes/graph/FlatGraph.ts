import BaseGenerator from '@/classes/generators/BaseGenerator'

export default class FlatGraph {
  nodes: Array<number> = []
  maxSize: number
  gridSize: number

  constructor(size: number, gridSize: number = 50) {
    this.maxSize = size
    this.gridSize = gridSize
  }

  add(value: number): void {
    this.nodes.push(value)
  }

  createPoints(): Array<{ x: number; y: number }> {
    const result: Array<{ x: number; y: number }> = []

    let prevX = 0
    let prevY = 0
    for (const angle of this.nodes) {
      const tan = Math.tan(angle * (Math.PI / 180))

      const point = {
        x: prevX + tan * this.gridSize,
        y: prevY + this.gridSize
      }

      result.push(point)

      prevX = point.x
      prevY = point.y
    }

    return result
  }

  generate(generator: BaseGenerator<FlatGraph, number>): void {
    this.nodes = []
    generator.reset()
    for (let index = 0; index < this.maxSize; index++) {
      this.add(generator.generate(this))
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
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

  toArray(): Array<number> {
    return [...this.nodes];
  }
}
