<script setup lang="ts">
import InputButton from './components/UI/InputButton.vue'
import { onMounted, ref } from 'vue'
import SimpleLabel from './components/UI/SimpleLabel.vue'
import Graph from '@/classes/graph/Graph'
import RandomGenerator from '@/classes/generators/RandomGenerator'
import WaveGenerator from '@/classes/generators/WaveGenerator'
import InterpolatedGenerator from '@/classes/generators/InterpolatedGenerator'
import ParametricGenerator from '@/classes/generators/PrametricGenerator'
import FitnessPrediction from '@/classes/FitnessPrediction'
import fileDownload from 'js-file-download'
import trainingData from '@/assets/trainingData/fixedStepWaveTrainingData.json'
import * as tf from '@tensorflow/tfjs'
import Range from '@/classes/helpers/Range'

const ITERATION_INTERAVAL_MS = 100

let ctx: CanvasRenderingContext2D | null = null
const iterationCount = ref(0)
const totalIterations = ref(0)
const fitnessValue = ref(0)
const trainingProgress = ref(0)
let generatedTrainingData: Array<Array<number>> = []
let generatedTrainingOutputs: Array<number> = []

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
  generatedTrainingOutputs = []

  let intervalId = setInterval(() => {
    if (parametricGenerator.iterate()) {
      iterationCount.value++
      fitnessValue.value = parametricGenerator.calculateFitnessValueForCurrentIteration()
      graph.generate(parametricGenerator, 40)

      generatedTrainingData.push(graph.toArray())
      generatedTrainingOutputs.push(fitnessValue.value)

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
  const trainingData = {
    input: generatedTrainingData,
    output: generatedTrainingOutputs
  }

  fileDownload(JSON.stringify(trainingData, null, 3), 'trainingData.json', 'application/json')
}

async function train() {
  trainingProgress.value = 0

  const dataSize = trainingData.input[0].length
  const dataPointsSize = trainingData.input.length

  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 80, inputShape: [dataSize], activation: 'sigmoid' }))
  model.add(tf.layers.dense({ units: 40, activation: 'sigmoid' }))
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }))
//   model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' })
  model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' })

  // Generate some synthetic data for training.
  const inputTensor = tf.tensor2d(trainingData.input, [dataPointsSize, dataSize])
  const outputTensor = tf.tensor2d(trainingData.output, [dataPointsSize, 1])

  const epochSize = 1000

  // Train model with fit().
  await model.fit(inputTensor, outputTensor, {
    epochs: epochSize,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        trainingProgress.value = Math.round((epoch / epochSize) * 100)
      }
    }
  })

  const saveResult = await model.save('localstorage://test-model')
}

async function predictFitness() {
  const prediction = new FitnessPrediction()
  await prediction.load('test-model')

  const generator = new InterpolatedGenerator(
    new WaveGenerator(30),
    new RandomGenerator(-45, 45, 30, 30),
   1
  )

  const xScale = new Range(20, 50)
  const yScale = new Range(0.8, 1.6)

  generator.generatorA.xScale = xScale.getRandom()
  generator.generatorA.yScale = yScale.getRandom()

  const graph = new Graph()
  graph.generate(generator, 40)

  await prediction.predict(graph)

  if (ctx) {
    ctx.reset()
    graph.draw(ctx, 200, 10, 'blue')
  }
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
    <InputButton left="840" top="170" @click="train">Train</InputButton>
    <SimpleLabel title="Progress" left="920" top="180">{{ trainingProgress }}%</SimpleLabel>

    <InputButton left="840" top="220" @click="predictFitness">Predict</InputButton>
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
