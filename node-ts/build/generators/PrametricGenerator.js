"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseGenerator_1 = __importDefault(require("./BaseGenerator"));
var GraphNode_1 = __importDefault(require("../graph/GraphNode"));
var Range_1 = __importDefault(require("../helpers/Range"));
var WaveGenerator_1 = __importDefault(require("./WaveGenerator"));
var RandomGenerator_1 = __importDefault(require("./RandomGenerator"));
var ParametricGenerator = /** @class */ (function (_super) {
    __extends(ParametricGenerator, _super);
    function ParametricGenerator() {
        var _this = _super.call(this) || this;
        _this.noiseValue = 0;
        _this.iterations = [];
        _this.currentIteration = 0;
        _this.stepSize = 0.1;
        _this.waveGenerator = new WaveGenerator_1.default(30);
        _this.randomGenerator = new RandomGenerator_1.default(-45, 45, 30, 30);
        _this.xOffset = new Range_1.default(0, 50);
        _this.xScale = new Range_1.default(20, 50);
        _this.yScale = new Range_1.default(0.8, 1.6);
        _this.noise = new Range_1.default(0, 0.5);
        return _this;
    }
    ParametricGenerator.prototype.beginIteration = function (stepSize) {
        this.currentIteration = 0;
        this.stepSize = stepSize;
        this.iterations = [];
        for (var a = 0; a <= 1.0; a += this.stepSize) {
            for (var b = 0; b <= 1.0; b += this.stepSize) {
                for (var c = 0; c <= 1.0; c += this.stepSize) {
                    for (var d = 0; d <= 1.0; d += this.stepSize) {
                        this.iterations.push([a, b, c, d]);
                    }
                }
            }
        }
    };
    ParametricGenerator.prototype.getIterationCount = function () {
        return this.iterations.length;
    };
    ParametricGenerator.prototype.iterate = function () {
        this.waveGenerator.yScale = this.yScale.getInterpolated(this.iterations[this.currentIteration][0]);
        this.waveGenerator.xScale = this.xScale.getInterpolated(this.iterations[this.currentIteration][1]);
        this.waveGenerator.xOffset = this.xOffset.getInterpolated(this.iterations[this.currentIteration][2]);
        this.noiseValue = this.noise.getInterpolated(this.iterations[this.currentIteration][3]);
        this.currentIteration++;
        return this.currentIteration < this.iterations.length;
    };
    ParametricGenerator.prototype.calculateFitnessValueForCurrentIteration = function () {
        var noiseFactor = this.noiseValue / this.noise.getLength();
        var yScaleFactor = Math.abs(this.waveGenerator.yScale - 1.0) / this.yScale.getLength();
        var xScaleFactor = Math.abs(this.waveGenerator.xScale - 30.0) / this.xScale.getLength();
        var value = 1.0 - ((noiseFactor + yScaleFactor + xScaleFactor) / 3.0);
        return parseFloat(value.toFixed(2));
    };
    ParametricGenerator.prototype.generate = function () {
        var nodeA = this.waveGenerator.generate();
        var nodeB = this.randomGenerator.generate();
        return new GraphNode_1.default(this.lerp(nodeA.angleInDegrees, nodeB.angleInDegrees, this.noiseValue), this.lerp(nodeA.length, nodeB.length, this.noiseValue));
    };
    ParametricGenerator.prototype.reset = function () {
        this.waveGenerator.reset();
        this.randomGenerator.reset();
    };
    ParametricGenerator.prototype.lerp = function (a, b, t) {
        return a + t * (b - a);
    };
    return ParametricGenerator;
}(BaseGenerator_1.default));
exports.default = ParametricGenerator;
;
