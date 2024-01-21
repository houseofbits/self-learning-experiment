<script setup lang="ts">
import {computed, onMounted, ref} from "vue";

const emit = defineEmits(['close']);

const props = defineProps({
  width: {
    type: [String, Number],
    required: true,
  },
  height: {
    type: [String, Number],
    required: true,
  },
  isDisabled: {
    type: [Boolean, String],
    default: false,
  }
});

const isVisible = ref(false);

function close() {
  isVisible.value = false;
  setTimeout(() => emit('close'), 200);
}

const style = computed(() => {
  return {
    width: props.width + 'px',
    height: props.height + 'px',
  };
});

onMounted(() => {
  isVisible.value = true;
})

</script>
<template>
  <div class="modal-overlay" :class="{visible: isVisible}">
    <div class="modal-window" :style="style">
      <header>
        <div class="title">
          <slot name="title">Modal title</slot>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="15" viewBox="0 0 384 512" @click="close">
          <path fill="#414f68"
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
        </svg>
      </header>
      <div class="content">
        <slot>Modal content</slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 300ms;
  opacity: 0;

  & .modal-window {
    overflow: hidden;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    transition: all 300ms;
    opacity: 0;
    transform: scale(0.5);

    & header {
      width: 100%;
      height: 20px;
      border-bottom: 1px solid rgba(128, 128, 128, 0.45);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px;
      flex-direction: row;
      color: rgb(77, 77, 108);

      & .title {
        font-family: system-ui;
        font-weight: bold;
      }

      & svg {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }

    & .content {
      padding: 4px;
      flex-grow: 1;
      position:relative;
    }

  }

  &.visible {
    opacity: 1;

    & .modal-window {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>