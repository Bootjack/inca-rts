var Crafty, require;

require([
    'src/components/drone'
], function () {
    'use strict';

    Crafty.scene('test-guidance', function () {
        var bodyDef, drone, siloA, siloB, target, tugboat, walls;
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
        drone = Crafty.e('Drone').attr({
            x: 50,
            y: 50
        }).drone();

        drone.bind('EnterFrame', function () {
            var self = this;
            if (drone.isDown(Crafty.keys.UP_ARROW) || drone.isDown(Crafty.keys.W)) {
                drone.engine.throttle = Math.min(1, drone.engine.throttle + 0.05);
            } else if (drone.isDown(Crafty.keys.DOWN_ARROW) || drone.isDown(Crafty.keys.S)) {
                drone.engine.throttle = Math.max(0, drone.engine.throttle - 0.05);
            }
            if (drone.isDown(Crafty.keys.LEFT_ARROW) || drone.isDown(Crafty.keys.A)) {
                drone.steering.throttle = Math.max(-1, drone.steering.throttle - 0.2);
                drone.delay(function () {
                    self.steering.throttle = 0;
                }, 20)
            } else if (drone.isDown(Crafty.keys.RIGHT_ARROW) || drone.isDown(Crafty.keys.D)) {
                drone.steering.throttle = Math.min(1, drone.steering.throttle + 0.2);
                drone.delay(function () {
                    self.steering.throttle = 0;
                }, 20);
            }
        });
        drone.bind('KeyDown', function (e) {
            if (e.keyCode === Crafty.keys.SPACE) {
                if (drone.guidance.active) {
                    drone.guidance.deactivate();
                } else {
                    drone.guidance.activate();
                }
            }
        });

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

        drone.guidance.waypoint(target.body.GetWorldCenter().Copy()).activate();
    });
});