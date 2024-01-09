<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  left: {
    type: [String, Number],
    required: true
  },
  top: {
    type: [String, Number],
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

const style = computed(() => {
  return {
    left: props.left + 'px',
    top: props.top + 'px'
  }
})
</script>

<template>
  <div class="progress-container" :style="style">
    <progress max="100" :value="value"></progress>
    <div class="information">
      <strong>{{ title }}</strong>
      <span>{{ value }}%</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.progress-container {
  font-family: system-ui;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  font-size: 14px;
  column-gap: 4px;

  & progress {
    width: 250px;
    height: 15px;
  }

  & .information {
    display: flex;
    justify-content: space-between;
  }
}
</style>
