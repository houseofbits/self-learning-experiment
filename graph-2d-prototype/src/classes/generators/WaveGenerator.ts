import BaseGenerator from "@/classes/generators/BaseGenerator"
import GraphNode from "@/classes/graph/GraphNode"
import Range from "@/classes/helpers/Range";

export default class WaveGenerator extends BaseGenerator {

    length: number;
    xPosition: number = 0;
    phase: number = 0;
    frequency: number = 30;
    amplitude: number = 1;

    constructor(lengt: number) {
        super();
        this.length = lengt;
    }

    setLength(value: number): WaveGenerator {
        this.length = value;
        return this;
    }

    setFrequency(value: number): WaveGenerator {
        this.frequency = value;
        return this;
    }

    setAmplitude(value: number): WaveGenerator {
        this.amplitude = value;
        return this;
    }
    
    setPhase(value: number): WaveGenerator {
        this.phase = value;
        return this;
    }    

    generate(): GraphNode {
        const derivative = Math.cos(this.phase + (this.xPosition / this.frequency));
        const angle = Math.atan2(derivative, 1) * this.amplitude;
        const angleDegrees = (angle * 180) / Math.PI;

        const stepVector = this.createVector(angleDegrees, this.length);
        this.xPosition = this.xPosition + stepVector.x;

        return new GraphNode(angleDegrees, this.length);
    }

    reset(): void {
        this.xPosition = 0;
    }

    createVector(angleDegrees: number, length: number) {
        const angleRadians = (angleDegrees * Math.PI) / 180;

        return {x: Math.cos(angleRadians) * length, y: Math.sin(angleRadians) * length};
    }
};