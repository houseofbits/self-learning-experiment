<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: null,
    },
    left: {
        type: [String, Number],
        required: true,
    },
    top: {
        type: [String, Number],
        required: true,
    }
});

const style = computed(() => {
    return {
        left: props.left + 'px',
        top: props.top + 'px',
    };
});

</script>

<template>
    <div class="button" :style="style">{{ title }} <slot /></div>
</template>

<style lang="scss" scoped>
.button {
    font-family: system-ui;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 0;
    padding: 7px 16px;
    min-height: 24px;
    min-width: 36px;
    color: #ffffff;
    background: #00be8f;
    border-radius: 4px;
    font-weight: 500;
    font-size: 16px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset;
    user-select: none;
    
    &:hover {
        background: #009b74;
    }
}
</style>
