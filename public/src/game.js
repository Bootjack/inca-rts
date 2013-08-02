var require, window;

(function () {
    'use strict';
    
    require.config({
        paths: {
            crafty: 'lib/crafty/crafty-local',
            jquery: 'lib/jquery/jquery',
            modernizr: 'lib/modernizr/modernizr',
            spine: 'lib/spine/lib/spine',
            underscore: 'lib/underscore/underscore'
        }
    });
    
    require(['modernizr', 'jquery', 'spine', 'underscore'], function () {
        require(['crafty', 'src/config'], function (Crafty, config) {
            //start Crafty
            Crafty.init(800, 600);
            Crafty.canvas.init();
            window.Crafty = Crafty;
          
            //the loading screen - that will be display while assets loaded
            Crafty.scene("loading", function () {
    
                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 25, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Collector Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-collector');
                    });
    

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 75, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Swarm Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-swarm');
                    });

                //when everything is loaded, run the main scene
                require([
                    "src/scenes/main",
                    'src/scenes/test-collector',
//                    'src/scenes/test-swarm'
                ], function () {
                    if (config.scene !== undefined) {
                        Crafty.scene(config.scene);
                    }
                });
            
            });
                    
            //automatically play the loading scene
            Crafty.scene("loading");
        
        });
    });
}());