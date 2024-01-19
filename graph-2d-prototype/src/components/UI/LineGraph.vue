<script setup lang="ts">
import type LineGraphDataSet from '@/classes/helpers/LineGraphDataSet'
import LineGraphSettings from '@/classes/helpers/LineGraphSettings'
import { computed, onMounted, ref, watch } from 'vue'

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
  data: {
    type: Array<LineGraphDataSet>,
    required: true
  },
  settings: {
    type: LineGraphSettings,
    default: () => new LineGraphSettings()
  }
})

const graphPaddingTop = 10
const graphPaddingBottom = 40
const graphPaddingLeft = 40
const graphPaddingRight = 10

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

function getContext(): CanvasRenderingContext2D | null {
  if (!canvas.value) {
    return null
  }

  const ctx = canvas.value.getContext('2d')
  if (!ctx) {
    return null
  }

  return ctx
}

function renderLeftLabel(text: string, x: number, y: number) {
  if (!ctx) {
    return
  }

  ctx.fillStyle = 'black'
  ctx.font = '12px system-ui'
  ctx.textAlign = 'end'
  ctx.textBaseline = 'middle'
  ctx.rotate(Math.PI * 4)
  ctx.fillText(text, x, y)
}

function renderBottomLabel(text: string, x: number, y: number) {
  if (!ctx) {
    return
  }

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(-Math.PI / 4)
  ctx.fillStyle = 'black'
  ctx.font = '12px system-ui'
  ctx.textAlign = 'right'
  ctx.fillText(text, 0, 12 / 2)
  ctx.restore()
}

function renderGrid() {
  if (!ctx) {
    return
  }

  const width = parseInt(props.width.toString()) - graphPaddingLeft - graphPaddingRight
  const height = parseInt(props.height.toString()) - graphPaddingTop - graphPaddingBottom
  const xMax = parseFloat(props.settings.xRange.to.toString())
  const xGridInterval = parseFloat(props.settings.xGridInterval.toString())
  const yMax = parseFloat(props.settings.yRange.to.toString())
  const yGridInterval = parseFloat(props.settings.yGridInterval.toString())

  const xStep = (width / xMax) * xGridInterval
  const yStep = (height / yMax) * yGridInterval

  ctx.beginPath()

  for (let x = 0; x <= width; x += xStep) {
    ctx.moveTo(x + graphPaddingLeft, graphPaddingTop)
    ctx.lineTo(x + graphPaddingLeft, graphPaddingTop + height)
  }

  for (let y = 0; y <= height; y += yStep) {
    ctx.moveTo(graphPaddingLeft, y + graphPaddingTop)
    ctx.lineTo(graphPaddingLeft + width, y + graphPaddingTop)
  }

  ctx.lineWidth = 0.5
  ctx.strokeStyle = 'rgba(180,180,180,0.65)'
  ctx.stroke()

  ctx.beginPath()

  ctx.moveTo(graphPaddingLeft, graphPaddingTop)
  ctx.lineTo(graphPaddingLeft, graphPaddingTop + height)

  ctx.moveTo(graphPaddingLeft, graphPaddingTop + height)
  ctx.lineTo(graphPaddingLeft + width, graphPaddingTop + height)

  ctx.strokeStyle = 'rgba(80,80,80,1)'
  ctx.stroke()

  let pos = yMax
  for (let y = 0; y <= height; y += yStep) {
    renderLeftLabel(
      pos.toFixed(props.settings.yLabelFractions),
      graphPaddingLeft - 5,
      y + graphPaddingTop
    )
    pos -= yGridInterval
  }

  pos = 0
  for (let x = 0; x <= width; x += xStep) {
    renderBottomLabel(
      pos.toFixed(props.settings.xLabelFractions),
      x + graphPaddingLeft,
      graphPaddingTop + height + 3
    )
    pos += xGridInterval
  }
}

function renderLines() {
  if (!ctx) {
    return
  }

  const width = parseInt(props.width.toString()) - graphPaddingLeft - graphPaddingRight
  const height = parseInt(props.height.toString()) - graphPaddingTop - graphPaddingBottom
  const yRange = props.settings.yRange.getLength()
  const xRange = props.settings.xRange.getLength()
  const xStep = width / xRange

  for (const dataSet of props.data) {
    if (dataSet.data.length > 1) {
      let y = (dataSet.data[0] * height) / yRange

      ctx.beginPath()
      ctx.moveTo(graphPaddingLeft, height + graphPaddingTop - y)

      for (let i = 1; i < dataSet.data.length; i++) {
        y = (dataSet.data[i] * height) / yRange
        ctx.lineTo(graphPaddingLeft + i * xStep, height + graphPaddingTop - y)
      }

      ctx.lineWidth = 1.5
      ctx.strokeStyle = dataSet.color
      ctx.stroke()
    }
  }
}

function renderLabels() {
  if (!ctx) {
    return
  }

  let top = props.settings.labelsTop

  for (const dataSet of props.data) {
    ctx.fillStyle = dataSet.color
    ctx.fillRect(props.settings.labelsLeft + 5, top, 10, 10)
    renderLeftLabel(dataSet.label, props.settings.labelsLeft, top + 5)

    top += 20
  }
}

function render() {
  if (!ctx) {
    return
  }

  ctx.reset()

  renderGrid()
  renderLines()
  renderLabels()
}

const style = computed(() => {
  return {
    left: props.left + 'px',
    top: props.top + 'px',
    width: props.width + 'px',
    height: props.height + 'px'
  }
})

watch(
  () => props.data,
  () => {
    render()
  },
  { deep: true }
)

onMounted(() => {
  ctx = getContext()
  render()
})
</script>

<template>
  <div class="chart-wrapper" :style="style"></div>

  <canvas
    ref="canvas"
    class="canvas"
    :style="style"
    :width="props.width"
    :height="props.height"
  ></canvas>
</template>

<style scoped>
.canvas {
  position: absolute;
  border: solid 1px rgb(177, 177, 177);
}
</style>
