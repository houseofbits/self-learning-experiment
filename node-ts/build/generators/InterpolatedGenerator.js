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
var InterpolatedGenerator = /** @class */ (function (_super) {
    __extends(InterpolatedGenerator, _super);
    function InterpolatedGenerator(generatorA, generatorB, value) {
        var _this = _super.call(this) || this;
        _this.generatorA = generatorA;
        _this.generatorB = generatorB;
        _this.value = value;
        return _this;
    }
    InterpolatedGenerator.prototype.generate = function () {
        var nodeA = this.generatorA.generate();
        var nodeB = this.generatorB.generate();
        return new GraphNode_1.default(this.lerp(nodeA.angleInDegrees, nodeB.angleInDegrees, this.value), this.lerp(nodeA.length, nodeB.length, this.value));
    };
    InterpolatedGenerator.prototype.reset = function () {
        this.generatorA.reset();
        this.generatorB.reset();
    };
    InterpolatedGenerator.prototype.lerp = function (a, b, t) {
        return a + t * (b - a);
    };
    return InterpolatedGenerator;
}(BaseGenerator_1.default));
exports.default = InterpolatedGenerator;
