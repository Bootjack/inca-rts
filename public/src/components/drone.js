var Crafty, require;

require([
    'src/modules/storage',
    'src/modules/drive',
    'src/modules/guide'
], function () {
    'use strict';
    
    Crafty.c('Drone', {
        init: function () {
            this.requires('2D, Canvas, Color, Box2D, Mouse, Keyboard, Delay')
                .attr({w: 20, h: 20})
                .color('rgba(220, 80, 80, 1.0');
            this.storage = Crafty.e('Storage').storage({
                material: 'water',
                capacity: 10
            });
            this.battery = Crafty.e('Storage').storage({
                material: 'electricity',
                capacity: 1000,
                quantity: 1000
            });
            this.engine = Crafty.e('Drive').drive({
                driven: this,
                volume: 1,
                inputs: [this.battery],
                x: -0.5 * this._w
            });
            this.steering = Crafty.e('Drive').drive({
                driven: this,
                isAngular: true,
                volume: 1,
                efficiency: 10,
                inputs: [this.battery]
            });
            this.guidance = Crafty.e('Guidance').guidance({
                guided: this
            });
            this.exhaust = Crafty.e('2D, Canvas, Color')
                .attr({w: 4, h: 4, x: this._x, y: this._y - 2 + this._h / 2})
                .color('rgba(255, 240, 0, 1.0')
            this.attach(this.exhaust);

            this.bind('EnterFrame', function () {
                var self = this;
                if (this.isDown(Crafty.keys.UP_ARROW) || this.isDown(Crafty.keys.W)) {
                    this.engine.throttle = Math.min(1, this.engine.throttle + 0.05);
                } else if (this.isDown(Crafty.keys.DOWN_ARROW) || this.isDown(Crafty.keys.S)) {
                    this.engine.throttle = Math.max(0, this.engine.throttle - 0.05);
                }
                if (this.isDown(Crafty.keys.LEFT_ARROW) || this.isDown(Crafty.keys.A)) {
                    this.steering.throttle = Math.max(-1, this.steering.throttle - 0.1);
                    this.delay(function () {
                        self.steering.throttle = 0;
                    }, 20)
                } else if (this.isDown(Crafty.keys.RIGHT_ARROW) || this.isDown(Crafty.keys.D)) {
                    this.steering.throttle = Math.min(1, this.steering.throttle + 0.1);
                    this.delay(function () {
                        self.steering.throttle = 0;
                    }, 20);
                }
            })
            this.bind('EnterFrame', this.render);
            return this;
        },

        drone: function (config) {
            var bodyDef = new Box2D.Dynamics.b2BodyDef;
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
            bodyDef.position.Set(10, 10);
            bodyDef.angularDamping = 1.0;
            bodyDef.linearDamping = 0.8;
            this.box2d({
                bodyDef: bodyDef,
                density: 0.25,
                friction: 0.8,
                elasticity: 0.1
            });
            return this;
        },

        render: function () {
            var alpha, brightness;
            alpha= 0.75 + 0.25 * this.storage.quantity / this.storage.capacity;
            brightness = 0.05 + 0.95 * this.battery.quantity / this.battery.capacity;
            this.color('rgba('
                + Math.floor(220 * brightness) + ', '
                + Math.floor(80 * brightness) + ', '
                + Math.floor(80 * brightness) + ', '
                + alpha + ')');
            return this;
        },
    });
});