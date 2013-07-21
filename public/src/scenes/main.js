Crafty.scene('main', function() {
    require([
        'src/models/resource',
        'src/controllers/resource-particle',
        'src/controllers/resource-list'
    ], function (Resource, ResourceParticle, ResourceList) {
        var resourceList, water, random;
  	     
  	    resourceList = new ResourceList({
  	        el: $('#resource-list')
  	    });
  	    resourceList.render();
  	     
        Resource.bind('create', function (model) {
            var resourceParticle = new ResourceParticle({
                el: $('<p>'),
                model: model
            });
            $('#resource-map').append(resourceParticle.render().el);
            resourceList.add(model);
        });

        for (i = 0; i < 10; i += 1) {
            random = Math.floor(10 - Math.random() * 20);
            Resource.create({quantity: 100 + random, type: 'water'});
        }
        
        Crafty.e('Delay').delay(function () {
            console.log(resourceList.models[3].deplete(30));
        }, 1000, 5);
    });
});