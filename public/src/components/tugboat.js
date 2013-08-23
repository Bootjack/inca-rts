var Crafty, require;

require([
    'src/modules/storage',
    'src/modules/drive'
], function () {
    'use strict';
    
    Crafty.c('Tugboat', {
        init: function () {
            this.requires('2D, Canvas, Color, Mouse, Keyboard, Delay')
                .attr({w: 20, h: 20})
                .color('rgba(220, 80, 80, 1.0');
            this.exhaust = Crafty.e('2D, Canvas, Color')
                .attr({w: 4, h: 4, x: this._x, y: this._y - 2 + this._h / 2})
                .color('rgba(255, 240, 0, 1.0')
            this.attach(this.exhaust);
            this.bind('EnterFrame', this.render);
            return this;
        },

        tugboat: function (config) {
            this.requires('Box2D');
            var bodyDef = new Box2D.Dynamics.b2BodyDef;
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
            bodyDef.position.Set(this._x / Crafty._PX2M, this._y / Crafty._PX2M);
            bodyDef.angularDamping = 1.0;
            bodyDef.linearDamping = 0.8;
            this.box2d({
                bodyDef: bodyDef,
                density: 0.25,
                friction: 0.8,
                elasticity: 0.1
            });
            this.storage = Crafty.e('Storage').storage({
                material: 'water',
                capacity: 10
            });
            this.battery = Crafty.e('Storage').storage({
                material: 'electricity',
                capacity: 10000,
                quantity: 10000
            });
            this.engine = Crafty.e('Drive').drive({
                driven: this,
                volume: 5,
                efficiency: 1,
                inputs: [this.battery],
                x: -0.5 * this._w
            });
            this.steering = Crafty.e('Drive').drive({
                driven: this,
                isAngular: true,
                volume: 1,
                efficiency: 2,
                inputs: [this.battery]
            });
            return this;
        },

        render: function () {
            var alpha, brightness, heat;
            alpha= 0.75 + 0.25 * this.storage.quantity / this.storage.capacity;
            brightness = 0.05 + 0.95 * this.battery.quantity / this.battery.capacity;
            this.color('rgba('
                + Math.floor(220 * brightness) + ', '
                + Math.floor(80 * brightness) + ', '
                + Math.floor(80 * brightness) + ', '
                + alpha + ')');

            heat = 0.15 + 0.85 * this.engine.throttle;
            this.exhaust.color('rgba(255, 240, 0, ' + heat + ')');
            return this;
        },
    });
});