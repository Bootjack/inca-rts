var Crafty, require;

require([
    'src/components/drone',
    'src/components/tugboat'
], function () {
    'use strict';

    Crafty.scene('test-swarm', function () {
        var bodyDef, d, drone, drones, player;

        player = Crafty.e('Tugboat').attr({
            x: 500,
            y: 500
        }).tugboat();

        player.bind('EnterFrame', function () {
            var self = this;
            if (player.isDown(Crafty.keys.UP_ARROW) || player.isDown(Crafty.keys.W)) {
                player.engine.throttle = Math.min(1, player.engine.throttle + 0.05);
            } else if (player.isDown(Crafty.keys.DOWN_ARROW) || player.isDown(Crafty.keys.S)) {
                player.engine.throttle = Math.max(0, player.engine.throttle - 0.05);
            }
            if (player.isDown(Crafty.keys.LEFT_ARROW) || player.isDown(Crafty.keys.A)) {
                player.steering.throttle = Math.max(-1, player.steering.throttle - 0.2);
                player.delay(function () {
                    self.steering.throttle = 0;
                }, 20)
            } else if (player.isDown(Crafty.keys.RIGHT_ARROW) || player.isDown(Crafty.keys.D)) {
                player.steering.throttle = Math.min(1, player.steering.throttle + 0.2);
                player.delay(function () {
                    self.steering.throttle = 0;
                }, 20);
            }
        });

        bodyDef = new Box2D.Dynamics.b2BodyDef;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
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

        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

        drones = [];
        for (d = 0; d < 100; d += 1) {
            drone = Crafty.e('Drone')
                .attr({x: 100 + 30 * Math.floor(d / 10), y: 100 + 30 * (d % 10)})
                .drone().guidance.waypoint(player.body.GetWorldCenter()).activate();
            drones.push(drone);
        }
    });
});