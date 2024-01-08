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
var RandomGenerator = /** @class */ (function (_super) {
    __extends(RandomGenerator, _super);
    function RandomGenerator(angleMin, angleMax, lengthMin, lengthMax) {
        var _this = _super.call(this) || this;
        _this.angle = new Range_1.default(angleMin, angleMax);
        _this.length = new Range_1.default(lengthMin, lengthMax);
        return _this;
    }
    RandomGenerator.prototype.generate = function () {
        return new GraphNode_1.default(this.angle.getRandom(), this.length.getRandom());
    };
    RandomGenerator.prototype.reset = function () {
    };
    return RandomGenerator;
}(BaseGenerator_1.default));
exports.default = RandomGenerator;
;
