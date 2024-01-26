<script setup lang="ts">
import AbsoluteModal from '@/components/UI/AbsoluteModal.vue'
import { reactive, ref } from 'vue'
import InputButton from '@/components/UI/InputButton.vue'
import LineGraph from '@/components/UI/LineGraph.vue'
import type LineGraphDataSet from '@/classes/helpers/LineGraphDataSet'
import NNGeneticGraphTraining from '@/classes/NNGeneticGraphTraining'
import type { NNGeneticIndividual } from '@/classes/classifiers/NNGenetic'
import FlatNNGenerator from '@/classes/generators/FlatNNGenerator'
import NNGenerator from '@/classes/generators/NNGenerator'
import FlatWaveGenerator from '@/classes/generators/FlatWaveGenerator'
import FlatGraph from '@/classes/graph/FlatGraph'
import LineGraphSettings from '@/classes/helpers/LineGraphSettings'

const emit = defineEmits(['finished', 'step'])

const nnGeneticTraining = new NNGeneticGraphTraining()

nnGeneticTraining.finishedCallback = (result: NNGeneticIndividual | null) => {
  if (result) {
    const generator = new FlatNNGenerator(result.network)
    // const sineWaveGenerator = new FlatWaveGenerator();

    const graph = new FlatGraph(10)

    graph.generate(generator)

    console.log(graph)

    emit('finished', graph)
  }
}

const isModalVisible = ref(false)

function toggleTestGeneticNN() {
  if (nnGeneticTraining.isGenerationRunning) {
    nnGeneticTraining.stop()
  } else {
    graphValues[0].data.length = 0
    graphValues[1].data.length = 0
    graphValues[2].data.length = 0
    nnGeneticTraining.start(GeneticNNStepCallback)
  }
}

const graphValues = reactive<Array<LineGraphDataSet>>([
  {
    label: 'Fitness',
    data: [],
    color: 'green'
  },
  {
    label: 'Novelty',
    data: [],
    color: 'red'
  },
  {
    label: 'Score',
    data: [],
    color: 'blue'
  }
])

function GeneticNNStepCallback(
  nn: NNGenerator,
  maxGen: number,
  currentGen: number,
  fitness: number,
  novelty: number,
  score: number
) {
  graphValues[0].data.push(fitness)
  graphValues[1].data.push(novelty)
  graphValues[2].data.push(score)

  console.log(
    'Generation: ' + currentGen,
    ' Fitness: ' + fitness + ' Novelty: ' + novelty.toFixed(6),
    ' Best score: ' + score
  )

  if (nnGeneticTraining.bestMatch) {
    const generator = new FlatNNGenerator(nnGeneticTraining.bestMatch.network)
    const graph = new FlatGraph(10)

    graph.generate(generator)

    emit('step', graph, nnGeneticTraining.targetGraph)
  }
}

const graphSettings = new LineGraphSettings()
graphSettings.xRange.to = nnGeneticTraining.config.maximumGenerations
graphSettings.xGridInterval = Math.round(nnGeneticTraining.config.maximumGenerations / 25)
</script>
<template>
  <div>
    <AbsoluteModal v-if="isModalVisible" height="600" width="800" @close="isModalVisible = false">
      <template #title>Genetic NN training of a graph reproduction</template>

      <LineGraph
        width="760"
        height="540"
        top="10"
        left="20"
        :data="graphValues"
        :settings="graphSettings"
      />

      <InputButton left="660" top="465" @click="toggleTestGeneticNN"> Start / Stop </InputButton>
    </AbsoluteModal>

    <InputButton left="840" top="550" @click="isModalVisible = true">
      Open Genetic NN training
    </InputButton>
  </div>
</template>
