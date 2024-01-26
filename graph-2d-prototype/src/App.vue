<script setup lang="ts">
import InputButton from './components/UI/InputButton.vue'
import LineGraph from './components/UI/LineGraph.vue'
import ProgressIndicator from './components/UI/ProgressIndicator.vue'
import InputRange from './components/UI/InputRange.vue'
import { computed, onMounted, ref, reactive } from 'vue'
import SimpleLabel from './components/UI/SimpleLabel.vue'
import Graph from '@/classes/graph/Graph'
import FlatParametricGenerator from '@/classes/generators/FlatParametricGenerator'
import FitnessClassifier from '@/classes/classifiers/FitnessClassifier'
import GraphFitnessTraining from '@/classes/classifiers/GraphFitnessTraining'
import fileDownload from 'js-file-download'
import trainingData from '@/assets/trainingData/fixedStepWaveTrainingData.json'
import Range from '@/classes/helpers/Range'
import Time from '@/classes/helpers/Time'
import * as tf from '@tensorflow/tfjs'
import NNGeneticTestWindow from '@/components/NNGeneticTestWindow.vue'
import NNGeneticGraphTrainingWindow from '@/components/NNGeneticGraphTrainingWindow.vue'
import type NeuralNetwork from '@/classes/classifiers/NeuralNetwork'
import FlatGraph from '@/classes/graph/FlatGraph'
import FlatRandomGenerator from '@/classes/generators/FlatRandomGenerator'
import FlatWaveGenerator from '@/classes/generators/FlatWaveGenerator'

const ITERATION_INTERVAL_MS = 100

let ctx: CanvasRenderingContext2D | null = null

const iterationCount = ref(0)
const totalIterations = ref(0)
const fitnessValue = ref(0)
const generationProgress = ref(0)
const isGenerationInProgress = ref(false)

const isTrainingInProgress = ref(false)
const trainingProgress = ref(0)
const remainingTrainingTime = ref<string | null>(null)

const training = new GraphFitnessTraining()

const fitnessPredictionRandomness = ref(0)
const fitnessPredictionFrequency = ref(30)
const fitnessPredictionAmplitude = ref(1)
const predictedFitness = ref(0)
const calculatedFitness = ref(0)

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

function generateIteration(): void {

    isGenerationInProgress.value = true

  const parametricGenerator = new FlatParametricGenerator()
  const graph = new FlatGraph(40)

  parametricGenerator.beginIteration(6)
  iterationCount.value = 0
  totalIterations.value = parametricGenerator.getIterationCount()
  generatedTrainingData = []
  generatedTrainingOutputs = []

  let intervalId = setInterval(() => {
    if (parametricGenerator.iterate()) {
      iterationCount.value++
      generationProgress.value = Math.round((iterationCount.value / totalIterations.value) * 100)

      fitnessValue.value = parametricGenerator.calculateFitnessValueForCurrentIteration()
      graph.generate(parametricGenerator)

      generatedTrainingData.push(graph.toArray())
      generatedTrainingOutputs.push(fitnessValue.value)

      if (ctx) {
        ctx.reset()
        graph.draw(ctx, 200, 10, 'green')
      }
    } else {
      clearInterval(intervalId)
      isGenerationInProgress.value = false
    }
  }, ITERATION_INTERVAL_MS)
}

function download() {
  const trainingData = {
    input: generatedTrainingData,
    output: generatedTrainingOutputs
  }

  fileDownload(JSON.stringify(trainingData, null, 3), 'trainingData.json', 'application/json')
}

async function train() {
  isTrainingInProgress.value = true
  remainingTrainingTime.value = null

  let data = trainingData
  if (generatedTrainingData.values.length > 0) {
    data = {
      input: generatedTrainingData,
      output: generatedTrainingOutputs
    }

    console.log('Train using current data')
  } else {
    console.log('Train using stored data')
  }

  await training.train(
    trainingData,
    (currentStep: number, totalSteps: number, msPerStep: number) => {
      trainingProgress.value = Math.round((currentStep / totalSteps) * 100)
      const remainingMs = (totalSteps - currentStep) * msPerStep
      remainingTrainingTime.value = Time.msToFormattedTime(remainingMs)
    }
  )

  remainingTrainingTime.value = null
  isTrainingInProgress.value = false
}

async function predictFitness() {
  const classifier = new FitnessClassifier(training.model)
  if (!training.model) {
    console.log('Predict using stored model')
    await classifier.load()
  } else {
    console.log('Predict using current model')
  }

  const generator = new FlatParametricGenerator()
  const graph = new FlatGraph(40)

  generator.setInterpolationValue(fitnessPredictionRandomness.value)
  generator
    .getWaveGenerator()
    .setFrequency(fitnessPredictionFrequency.value)
    .setAmplitude(fitnessPredictionAmplitude.value)
    .setPhase(Range.random(0, 50))

  graph.generate(generator)

  predictedFitness.value = await classifier.predict(graph)
  calculatedFitness.value = generator.calculateFitnessValueForCurrentIteration()

  if (ctx) {
    ctx.reset()
    graph.draw(ctx, 200, 10, 'blue')
  }
}

const trainingProgressBarTitle = computed(() => {
  let title = 'Training'
  if (remainingTrainingTime.value) {
    title += ' (Remaining: ' + remainingTrainingTime.value + ')'
  }
  return title
})

function geneticTrainingFinished(graph: Graph) {
  if (ctx) {
    ctx.reset()
    graph.draw(ctx, 200, 10, 'red')
  }
}

function geneticGraphTrainingStep(graph: FlatGraph, target: FlatGraph) {
  if (ctx) {
    ctx.reset()
    graph.draw(ctx, 200, 10, 'red')
    target.draw(ctx, 200, 10, 'rgba(0,0,255,0.3)')
  }
}

onMounted(() => {
  ctx = getContext()

  tf.setBackend('cpu')
})
</script>

<template>
  <div>
    <canvas id="container" width="800" height="1200"></canvas>

    <InputButton
      left="840"
      top="20"
      :is-disabled="isGenerationInProgress"
      @click="generateIteration"
      >Generate training data
    </InputButton>
    <InputButton
      v-if="!isGenerationInProgress && generatedTrainingData.length"
      left="1050"
      top="20"
      @click="download"
      >Download
    </InputButton>

    <ProgressIndicator
      v-if="isGenerationInProgress"
      :title="'Generating samples ' + iterationCount + ' of ' + totalIterations"
      left="840"
      top="70"
      :value="generationProgress"
    />

    <SimpleLabel v-if="isGenerationInProgress" title="Fitness" left="840" top="110"
      >{{ fitnessValue }}
    </SimpleLabel>

    <InputButton left="840" top="160" @click="train" :is-disabled="isTrainingInProgress"
      >Train
    </InputButton>
    <InputButton
      v-if="!isTrainingInProgress && training.model"
      left="920"
      top="160"
      @click="training.downloadModel()"
      >Download model
    </InputButton>

    <ProgressIndicator
      v-if="isTrainingInProgress"
      :title="trainingProgressBarTitle"
      left="920"
      top="165"
      :value="trainingProgress"
    />

    <InputButton left="840" top="220" @click="predictFitness">Predict</InputButton>
    <SimpleLabel
      v-if="predictedFitness > 0"
      title="Predicted/Calculated fitness"
      left="940"
      top="230"
      >{{ predictedFitness }} / {{ calculatedFitness }}
    </SimpleLabel>
    <InputRange
      v-model="fitnessPredictionRandomness"
      title="Randomness"
      left="840"
      top="270"
      min="0"
      max="1"
    />
    <InputRange
      v-model="fitnessPredictionFrequency"
      title="Wave frequency"
      left="840"
      top="320"
      min="0.8"
      max="3"
    />
    <InputRange
      v-model="fitnessPredictionAmplitude"
      title="Wave amplitude scale"
      left="840"
      top="370"
      min="0.8"
      max="1.6"
    />

    <NNGeneticTestWindow />

    <NNGeneticGraphTrainingWindow @finished="geneticTrainingFinished" @step="geneticGraphTrainingStep" />
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
