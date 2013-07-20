define(['src/components/resource'], function () {
    var Water = function () {
        return Crafty.e('2D, Canvas, Color, Resource')
            .attr({x: 100, y: 100, w: 20, h: 20})
            .color('#4050b0');
    };
    return Water;
});