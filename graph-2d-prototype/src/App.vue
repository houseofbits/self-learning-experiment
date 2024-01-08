<script setup lang="ts">
import InputButton from './components/UI/InputButton.vue'
import { onMounted, ref } from 'vue'
import SimpleLabel from './components/UI/SimpleLabel.vue'
import Graph from '@/classes/graph/Graph'
import RandomGenerator from '@/classes/generators/RandomGenerator'
import WaveGenerator from '@/classes/generators/WaveGenerator'
import InterpolatedGenerator from '@/classes/generators/InterpolatedGenerator'
import ParametricGenerator from '@/classes/generators/PrametricGenerator'
import fileDownload from 'js-file-download'

const ITERATION_INTERAVAL_MS = 50

let ctx: CanvasRenderingContext2D | null = null
const iterationCount = ref(0)
const totalIterations = ref(0)
const fitnessValue = ref(0)
let generatedTrainingData: Array<{input: Array<Array<number>>, output: number}> = []

function getContext(): CanvasRenderingContext2D | null {
  const canvas: HTMLCanvasElement | null = <HTMLCanvasElement | null>(
    document.getElementById('container')
  )
  if (!canvas) {
    return null
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return null
  }

  return ctx
}

function drawGraph(
  ctx: CanvasRenderingContext2D,
  graph: Graph,
  x: number,
  y: number,
  color: string
): void {
  const points = graph.createPoints()
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

function generateRandom(): void {
  const parametricGenerator = new ParametricGenerator()
  const graphA = new Graph()

  graphA.generate(parametricGenerator, 40)

  if (ctx) {
    ctx.reset()

    graphA.draw(ctx, 200, 10, 'green')
  }
}

function generateIteration(): void {
  const parametricGenerator = new ParametricGenerator()
  const graph = new Graph()

  parametricGenerator.beginIteration(0.2)
  iterationCount.value = 0
  totalIterations.value = parametricGenerator.getIterationCount()
  generatedTrainingData = []

  let intervalId = setInterval(() => {
    if (parametricGenerator.iterate()) {
      iterationCount.value++
      fitnessValue.value = parametricGenerator.calculateFitnessValueForCurrentIteration()
      graph.generate(parametricGenerator, 40)
      generatedTrainingData.push({
        input: graph.toArray(),
        output: fitnessValue.value
      })
      if (ctx) {
        ctx.reset()
        graph.draw(ctx, 200, 10, 'green')
      }
    } else {
      clearInterval(intervalId)
    }
  }, ITERATION_INTERAVAL_MS)
}

function download() {
  fileDownload(
    JSON.stringify(generatedTrainingData, null, 3),
    'trainingData.json',
    'application/json'
  )
}

onMounted(() => {
  ctx = getContext()
})
</script>

<template>
  <div>
    <canvas id="container" width="800" height="1200"></canvas>

    <InputButton left="840" top="20" @click="generateIteration">Generate training data</InputButton>
    <InputButton left="1050" top="20" @click="download">Download</InputButton>
    <SimpleLabel title="Iterations" left="840" top="70"
      >{{ iterationCount }} of {{ totalIterations }}</SimpleLabel
    >
    <SimpleLabel title="Fitness" left="840" top="90">{{ fitnessValue }}</SimpleLabel>

    <InputButton left="840" top="120" @click="generateRandom">Generate random sample</InputButton>
  </div>
</template>

<style scoped>
#container {
  position: absolute;
  left: 20px;
  top: 20px;
  border: solid 1px gray;
}
</style>
