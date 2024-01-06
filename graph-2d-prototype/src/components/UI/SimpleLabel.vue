<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true,
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
    <div class="label" :style="style">
        <strong>
            <slot name="prefix">{{ title }}</slot>:
        </strong>
        <slot />
        <slot name="suffix" />
    </div>
</template>

<style lang="scss" scoped>
.label {
    font-family: system-ui;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: left;
    font-size: 14px;
    column-gap: 4px;
}
</style>
