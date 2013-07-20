Crafty.scene("main", function() {
    require([
        'src/entities/ground',
        'src/entities/creature'
  	], function (Ground, Creature) {	   
		    sc['ground'] = new Ground();
		    sc['box1'] = new Creature();
		    sc['box2'] = new Creature({x: 300});
		    sc['box2'].controls({left: 'A', right: 'D', up: 'W'});
		    sc['box2'].entity.color('404050');
		});
});