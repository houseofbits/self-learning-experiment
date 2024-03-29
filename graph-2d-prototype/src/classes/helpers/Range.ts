import _ from 'lodash';
export default class Range {
    from: number;
    to: number;

    constructor(from: number, to: number) {
        this.from = from;
        this.to = to;
    }

    getRandom(): number
    {
        return _.random(this.from, this.to);
    }

    getInterpolated(t: number): number
    {
        return this.from + t * (this.to - this.from);
    }

    getLength(): number
    {
        return Math.abs(this.to - this.from);
    }

    static random(from: number, to: number): number
    {
        return _.random(from, to);
    }

    getIterable(numberOfSteps: number): Array<number> 
    {
        const result = [];
        const length = this.getLength();
        for (let s = 0; s < numberOfSteps; s++) {
            result.push(this.getInterpolated((s * length) / numberOfSteps));
        }

        return result;
    }
};