import BaseGenerator from "@/classes/generators//BaseGenerator";
import FlatGraph from "@/classes/graph/FlatGraph"

export default class FlatWaveGenerator extends BaseGenerator<FlatGraph, number> {
    xPosition: number = 0;
    phase: number = 0;
    frequency: number = 1;
    amplitude: number = 1;

    constructor() {
        super();
    }

    setFrequency(value: number): FlatWaveGenerator {
        this.frequency = value;
        return this;
    }

    setAmplitude(value: number): FlatWaveGenerator {
        this.amplitude = value;
        return this;
    }
    
    setPhase(value: number): FlatWaveGenerator {
        this.phase = value;
        return this;
    }    

    generate(): number {
        const derivative = Math.cos(this.phase + (this.xPosition / this.frequency));
        const angle = Math.atan2(derivative, 1) * this.amplitude;
        const angleDegrees = (angle * 180) / Math.PI;

        this.xPosition = this.xPosition + 1;

        return angleDegrees;
    }

    reset(): void {
        this.xPosition = 0;
    }
};