var Crafty, require;

require([
    'src/components/drone'
], function () {
    'use strict';

    Crafty.scene('test-collector', function () {
        var bodyDef, drone, siloA, siloB, target, walls;
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

        bodyDef.angularDamping = 0.1;
        bodyDef.linearDamping = 0.05;
        bodyDef.position.Set(20, 17);
        Crafty.e('2D, Canvas, Color, Box2D')
            .attr({h: 80, w: 80})
            .color('rgba(100, 100, 250, 1.0)')
            .box2d({bodyDef: bodyDef, density: 0.1, friction: 0.5, elasticity: 0});

        bodyDef.angularDamping = 0.1;
        bodyDef.linearDamping = 0.05;
        bodyDef.position.Set(20, 3);
        Crafty.e('2D, Canvas, Color, Box2D')
            .attr({h: 80, w: 80})
            .color('rgba(100, 100, 250, 1.0)')
            .box2d({bodyDef: bodyDef, density: 0.1, friction: 0.5, elasticity: 0});

        bodyDef.angularDamping = 0.2;
        bodyDef.linearDamping = 0.1;
        bodyDef.position.Set(20, 10);
        target = Crafty.e('2D, Canvas, Color, Box2D')
            .attr({h: 80, w: 80})
            .color('rgba(100, 100, 250, 1.0)')
            .box2d({bodyDef: bodyDef, density: 0.1, friction: 0.5, elasticity: 0});

        drone.guidance.waypoint(target.body.GetWorldCenter());
    });
});