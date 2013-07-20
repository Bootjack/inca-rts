define(['src/entities/entity'], function (Entity) {
    var Ground = Entity.sub({
        init: function () {
            this.entity = Crafty.e("2D, Canvas, Color, Box2D, ground").attr(
                {x: 100, y: 520, w: 600, h: 80}
            ).addComponent('Collision').color('#000000').box2d({
                bodyType: 'static'
            });
        }
    });
    return Ground;
});