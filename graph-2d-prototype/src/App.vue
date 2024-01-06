<script setup lang="ts">
import InputButton from './components/UI/InputButton.vue'
import { onMounted } from 'vue'
import SimpleLabel from './components/UI/SimpleLabel.vue'
import Graph from '@/classes/graph/Graph'
import RandomGenerator from '@/classes/generators/RandomGenerator'
import WaveGenerator from '@/classes/generators/WaveGenerator'
import InterpolatedGenerator from '@/classes/generators/InterpolatedGenerator'

let ctx: CanvasRenderingContext2D | null = null

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

function drawGraph(
    ctx: CanvasRenderingContext2D,
    graph: Graph,
    x: number,
    y: number,
    color: string
): void {
    const points = graph.createPoints()
    const pointSize = 5

    ctx.lineWidth = 2
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y)    
    for (const point of points) {
        ctx.lineTo(x + point.x, y + point.y)        
    }
    ctx.stroke()
    
    ctx.lineWidth = 1
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(x, y, pointSize, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    for (const point of points) {
        ctx.strokeStyle = color        
        ctx.beginPath()
        ctx.arc(x + point.x, y + point.y, pointSize, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}

function generate(): void 
{   
    const randomGenerator = new RandomGenerator(-45,45,30,30);
    const waveGenerator = new WaveGenerator();
    const interpolatedGenerator = new InterpolatedGenerator([
        randomGenerator,
        waveGenerator,
    ]);

    const graphA = new Graph();
    const graphB = new Graph();
    const graphC = new Graph();

    graphA.generate(randomGenerator, 40);
    graphB.generate(waveGenerator, 40);
    graphC.generate(interpolatedGenerator, 40);

    if (ctx) {
        ctx.reset();
        graphA.draw(ctx, 200, 10, 'green');
        graphB.draw(ctx, 300, 10, 'red');   
        graphC.draw(ctx, 500, 10, 'blue');        
    }
}

onMounted(() => {
    ctx = getContext()

    generate();
})
</script>

<template>
    <div>
        <canvas id="container" width="800" height="1200"></canvas>

        <InputButton left="840" top="20" @click="generate">Generate</InputButton>
        <!-- <SimpleLabel title="Label" left="840" top="80">1234<template #suffix>px</template></SimpleLabel> -->
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
./classes/generators/RandomGenerator./classes/generators/WaveGenerator./classes/graph/Graph