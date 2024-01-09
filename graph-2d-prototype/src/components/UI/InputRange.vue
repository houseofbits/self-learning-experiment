<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
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
  min: {
    type: [Number, String],
    required: true
  },
  max: {
    type: [Number, String],
    required: true
  },
  step: {
    type: Number,
    default: 0.01
  }
})

function updateModelValue(e) {
    emit('update:modelValue', e.target.valueAsNumber);
}

const style = computed(() => {
  return {
    left: props.left + 'px',
    top: props.top + 'px'
  }
})
</script>

<template>
  <div class="range" :style="style">
    <input
      :value="modelValue"
      type="range"
      :step="step"
      :min="min"
      :max="max"
      @change="updateModelValue"
    />
    <div class="information">
      <strong>{{ title }}</strong>
      <span>{{ modelValue }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.range {
  font-family: system-ui;
  position: absolute;
  width: 250px;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  font-size: 14px;
  column-gap: 4px;

  & .information {
    display: flex;
    justify-content: space-between;
  }
}
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
}

/* Removes default focus */
input[type='range']:focus {
  outline: none;
}

/* slider track */
input[type='range']::-webkit-slider-runnable-track {
  background-color: #babdb6;
  border-radius: 5px;
  height: 10px;
}

/* slider thumb */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  margin-top: -3px; /* Centers thumb on the track */
  background-color: #3465a4;
  border-radius: 8px;
  height: 16px;
  width: 24px;
}

input[type='range']:focus::-webkit-slider-thumb {
  outline: 3px solid #3465a4;
  outline-offset: 0.125rem;
}

/* slider track */
input[type='range']::-moz-range-track {
  background-color: #babdb6;
  border-radius: 5px;
  height: 10px;
}

/* slider thumb */
input[type='range']::-moz-range-thumb {
  background-color: #3465a4;
  border: none; /*Removes extra border that FF applies*/
  border-radius: 8px;
  height: 16px;
  width: 24px;
}

input[type='range']:focus::-moz-range-thumb {
  outline: 3px solid #3465a4;
  outline-offset: 0.125rem;
}
</style>
