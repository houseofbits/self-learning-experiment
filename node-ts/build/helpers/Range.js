"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var Range = /** @class */ (function () {
    function Range(from, to) {
        this.from = from;
        this.to = to;
    }
    Range.prototype.getRandom = function () {
        return lodash_1.default.random(this.from, this.to);
    };
    Range.prototype.getInterpolated = function (t) {
        return this.from + t * (this.to - this.from);
    };
    Range.prototype.getLength = function () {
        return Math.abs(this.to - this.from);
    };
    return Range;
}());
exports.default = Range;
;
