"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Graph = /** @class */ (function () {
    function Graph() {
        this.nodes = [];
    }
    Graph.prototype.add = function (node) {
        this.nodes.push(node);
    };
    Graph.prototype.createPoints = function () {
        var result = [];
        var prevX = 0;
        var prevY = 0;
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            var sin = Math.sin(node.angleInDegrees * (Math.PI / 180));
            var cos = Math.cos(node.angleInDegrees * (Math.PI / 180));
            var point = {
                x: prevX + sin * node.length,
                y: prevY + cos * node.length
            };
            result.push(point);
            prevX = point.x;
            prevY = point.y;
        }
        return result;
    };
    Graph.prototype.generate = function (generator, numberOfNodes) {
        this.nodes = [];
        generator.reset();
        for (var index = 0; index < numberOfNodes; index++) {
            this.add(generator.generate());
        }
    };
    Graph.prototype.toArray = function () {
        var result = [];
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            result.push(node.angleInDegrees);
            result.push(node.length);
        }
        return result;
    };
    return Graph;
}());
exports.default = Graph;
