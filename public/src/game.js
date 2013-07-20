require.config({
    paths: {
        crafty: 'bower_components/crafty/crafty-local',
        jquery: 'bower_components/jquery/jquery',
        modernizr: 'bower_components/modernizr/modernizr',
        underscore: 'bower_components/underscore/underscore'      
    }
});

require(['modernizr', 'jquery', 'underscore'], function () {
    require(['crafty', 'src/config'], function (Crafty, config) {

        //start Crafty
        Crafty.init(800, 600);
        Crafty.canvas.init();
      
        //the loading screen - that will be display while assets loaded
        Crafty.scene("loading", function() {
          // clear scene and interface
          sc = []; 
          infc = [];
      
          //when everything is loaded, run the main scene
          require([], function() {     
            if (config.scene != undefined) {
              Crafty.scene(config.scene);
            }
          });
      
        })
        
        require(["src/scenes/main"]);
        
        //automatically play the loading scene
        Crafty.scene("loading");
    
    });
});
