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
            // clear scene and interface
            sc = []; 
            infc = [];
        
            //when everything is loaded, run the main scene
            require(["src/scenes/main"], function () {     
              if (config.scene != undefined) {
                Crafty.scene(config.scene);
              }
            });
        
        })
                
        //automatically play the loading scene
        Crafty.scene("loading");
    
    });
});
