<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { ChartData } from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  left: {
    type: [String, Number],
    required: true
  },
  top: {
    type: [String, Number],
    required: true
  },
  width: {
    type: [String, Number],
    required: true
  },
  height: {
    type: [String, Number],
    required: true
  },
  labels: {
    type: Array<string>,
    required: true
  },
  fitnessValues: {
    type: Array<number>,
    required: true
  },
  noveltyValues: {
    type: Array<number>,
    required: true
  },
  scoreValues: {
    type: Array<number>,
    required: true
  }
})

const renderIndex = ref(0)

const style = computed(() => {
  return {
    left: props.left + 'px',
    top: props.top + 'px',
    width: props.width + 'px',
    height: props.height + 'px'
  }
})

const data = ref<ChartData>({
  datasets: []
})

const options = ref({
  responsive: true,
  maintainAspectRatio: false
})

watch(
  () => props.labels,
  () => {
    data.value = {
      labels: props.labels,
      datasets: [
        {
          label: 'Fitness',
          backgroundColor: 'red',
          data: props.fitnessValues
        },
        {
          label: 'Novelty',
          backgroundColor: 'green',
          data: props.noveltyValues
        },
        {
          label: 'Score',
          backgroundColor: 'blue',
          data: props.scoreValues
        }
      ]
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="chart-wrapper" :style="style">
    <Line :key="renderIndex" :data="data" :options="options" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: absolute;
}
</style>
