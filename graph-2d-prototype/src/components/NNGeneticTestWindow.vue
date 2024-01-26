<script setup lang="ts">
import AbsoluteModal from "@/components/UI/AbsoluteModal.vue";
import {reactive, ref} from "vue";
import InputButton from "@/components/UI/InputButton.vue";
import LineGraph from "@/components/UI/LineGraph.vue";
import NNGeneticTestTraining from "@/classes/NNGeneticTestTraining";
import type LineGraphDataSet from "@/classes/helpers/LineGraphDataSet";

const nnGeneticTest = new NNGeneticTestTraining()

const isModalVisible = ref(false);

function toggleTestGeneticNN() {
  if (nnGeneticTest.isGenerationRunning) {
    nnGeneticTest.stop()
  } else {
    graphValues[0].data.length = 0
    graphValues[1].data.length = 0
    graphValues[2].data.length = 0
    nnGeneticTest.start(GeneticNNStepCallback)
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
  },
]);

function GeneticNNStepCallback(
    maxGen: number,
    currentGen: number,
    fitness: number,
    novelty: number,
    score: number
) {
  graphValues[0].data.push(fitness);
  graphValues[1].data.push(novelty);
  graphValues[2].data.push(score);

  console.log(
      'Generation: ' + currentGen,
      ' Fitness: ' + fitness + ' Novelty: ' + novelty.toFixed(6),
      ' Best score: ' + score
  )
}
</script>
<template>
  <div>
    <AbsoluteModal v-if="isModalVisible" height="600" width="800" @close="isModalVisible = false">
      <template #title>Genetic NN training (Using binary operators AND, OR, XOR as a test data)</template>

      <LineGraph width="760" height="540" top="10" left="20" :data="graphValues"/>

      <InputButton left="660" top="465" @click="toggleTestGeneticNN">
        Start / Stop
      </InputButton>
    </AbsoluteModal>

    <InputButton left="840" top="500" @click="isModalVisible = true">
      Open Genetic NN test
    </InputButton>
  </div>
</template>