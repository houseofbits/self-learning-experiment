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
var WaveGenerator = /** @class */ (function (_super) {
    __extends(WaveGenerator, _super);
    function WaveGenerator(lengthMin, lengthMax) {
        if (lengthMax === void 0) { lengthMax = lengthMin; }
        var _this = _super.call(this) || this;
        _this.xPosition = 0;
        _this.xOffset = 0;
        _this.xScale = 30;
        _this.yScale = 1;
        _this.length = 30;
        _this.lengthRange = new Range_1.default(lengthMin, lengthMax);
        return _this;
    }
    WaveGenerator.prototype.generate = function () {
        this.length = this.lengthRange.getRandom();
        var derivative = Math.cos(this.xOffset + (this.xPosition / this.xScale));
        var angle = Math.atan2(derivative, 1) * this.yScale;
        var angleDegrees = (angle * 180) / Math.PI;
        var stepVector = this.createVector(angleDegrees, this.length);
        this.xPosition = this.xPosition + stepVector.x;
        return new GraphNode_1.default(angleDegrees, this.length);
    };
    WaveGenerator.prototype.reset = function () {
        this.xPosition = 0;
    };
    WaveGenerator.prototype.createVector = function (angleDegrees, length) {
        var angleRadians = (angleDegrees * Math.PI) / 180;
        return { x: Math.cos(angleRadians) * length, y: Math.sin(angleRadians) * length };
    };
    return WaveGenerator;
}(BaseGenerator_1.default));
exports.default = WaveGenerator;
;
