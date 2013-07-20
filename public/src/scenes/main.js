Crafty.scene('main', function() {
    require([
        'src/entities/water'
  	], function (Water) {	   
        sc['water'] = new Water();
    });
});