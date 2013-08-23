var Crafty, require;

require([
    'src/components/tugboat'
], function () {
    'use strict';

    Crafty.scene('test-tugboat', function () {
        var bodyDef, tugboat, siloA, siloB, target, walls;
/*
        siloA = Crafty.e('Silo').attr({
            x: 200,
            y: 200
        }).silo({
            type: 'water',
            quantity: 200,
        }).addComponent('water-storage');

        siloB = Crafty.e('Silo').attr({
            x: 500,
            y: 200
        }).silo({
                type: 'water'
        }).addComponent('water-storage');
*/
        tugboat = Crafty.e('Tugboat').attr({
            x: 50,
            y: 50
        }).tugboat();

        tugboat.bind('EnterFrame', function () {
            var self = this;
            if (tugboat.isDown(Crafty.keys.UP_ARROW) || tugboat.isDown(Crafty.keys.W)) {
                tugboat.engine.throttle = Math.min(1, tugboat.engine.throttle + 0.05);
            } else if (tugboat.isDown(Crafty.keys.DOWN_ARROW) || tugboat.isDown(Crafty.keys.S)) {
                tugboat.engine.throttle = Math.max(0, tugboat.engine.throttle - 0.05);
            }
            if (tugboat.isDown(Crafty.keys.LEFT_ARROW) || tugboat.isDown(Crafty.keys.A)) {
                tugboat.steering.throttle = Math.max(-1, tugboat.steering.throttle - 0.2);
                tugboat.delay(function () {
                    self.steering.throttle = 0;
                }, 20)
            } else if (tugboat.isDown(Crafty.keys.RIGHT_ARROW) || tugboat.isDown(Crafty.keys.D)) {
                tugboat.steering.throttle = Math.min(1, tugboat.steering.throttle + 0.2);
                tugboat.delay(function () {
                    self.steering.throttle = 0;
                }, 20);
            }
        })

        bodyDef = new Box2D.Dynamics.b2BodyDef;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.angularDamping = 1.0;
        bodyDef.linearDamping = 1.0;
        bodyDef.position.Set(1 / Crafty._PX2M, 0 / Crafty._PX2M);
        Crafty.e('2D, Canvas, Color, Box2D')
            .attr({h: 600, w: 10})
            .color('rgba(100, 100, 50, 1.0)')
            .box2d({bodyDef: bodyDef, density: 999, elasticity: 0.2});

        bodyDef.position.Set(790 / Crafty._PX2M, 0 / Crafty._PX2M);
        Crafty.e('2D, Canvas, Color, Box2D')
            .attr({h: 600, w: 10})
            .color('rgba(100, 100, 50, 1.0)')
            .box2d({bodyDef: bodyDef, density: 999, elasticity: 0.2});

        bodyDef.position.Set(10 / Crafty._PX2M, 0 / Crafty._PX2M);
        Crafty.e('2D, Canvas, Color, Box2D')
            .attr({h: 10, w: 780})
            .color('rgba(100, 100, 50, 1.0)')
            .box2d({bodyDef: bodyDef, density: 999, elasticity: 0.2});

        bodyDef.position.Set(10 / Crafty._PX2M, 590 / Crafty._PX2M);
        Crafty.e('2D, Canvas, Color, Box2D')
            .attr({h: 10, w: 780})
            .color('rgba(100, 100, 50, 1.0)')
            .box2d({bodyDef: bodyDef, density: 999, elasticity: 0.2});

        bodyDef.angularDamping = 0.2;
        bodyDef.linearDamping = 0.1;
        bodyDef.position.Set(22, 18);
        target = Crafty.e('2D, Canvas, Color, Box2D')
            .attr({h: 80, w: 80})
            .color('rgba(100, 100, 250, 1.0)')
            .box2d({bodyDef: bodyDef, density: 0.1, friction: 0.5, elasticity: 0});

        tugboat.guidance.waypoint(target.body.GetWorldCenter());
    });
});