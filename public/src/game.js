var require, window;

(function () {
    'use strict';

    require(['src/crafty'], function (Crafty) {
        window.Crafty = Crafty;
        require(['src/box2d'], function () {
            //start Crafty
            Crafty._PX2M = 25;
            Crafty.init(800, 600);
            Crafty.canvas.init();
            Crafty.box2D.init(0, 0, Crafty._PX2M, true);
            //Crafty.box2D.showDebugInfo();

            //the loading screen - that will be display while assets loaded
            Crafty.scene("loading", function () {

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 25, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Silo Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-silo');
                    });

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 75, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Tugboat Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-tugboat');
                    });

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 125, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Guidance Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-guidance');
                    });

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 175, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Chaser Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-chaser');
                    });

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 225, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Swarm Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-swarm');
                    });

                //when everything is loaded, run the main scene
                require([
                    'src/scenes/test-silo',
                    'src/scenes/test-tugboat',
                    'src/scenes/test-guidance',
                    'src/scenes/test-chaser',
                    'src/scenes/test-swarm'
                ], function () {

                });

            });

            //automatically play the loading scene
            Crafty.scene("loading");
        });
    });
}());