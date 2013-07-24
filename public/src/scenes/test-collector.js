Crafty.scene('test-collector', function() {
    require([
        'src/models/resource',
        'src/controllers/resource-particle',
        'src/controllers/resource-list',
        
        'src/models/collector',
        'src/controllers/collector-bot'
    ], function (
        Resource, 
        ResourceParticle, 
        ResourceList,
        
        Collector,
        CollectorBot
    ) {
        var resourceList, processorList, water, random, random2, x;

        //  Testing continous asynchronisity (gets really annoying...)
        /*
        x = 0;
        Crafty.e('Delay').delay(function () {
            console.log(x += 1);
        }, 10, 100);
        */
  
        //  Testing scaffold for resources
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
            resourceList.add(resourceParticle);
        });
        for (i = 0; i < 10; i += 1) {
            random = Math.floor(10 - Math.random() * 20);
            Resource.create({quantity: 100 + random, type: 'water'});
        }
        /*
        Crafty.e('Delay').delay(function () {
            resourceList.models[3].deplete(30);
        }, 1000, 5);
        */
        
        //  Testing scaffold for collectors
        var collectorBot;
        Collector.bind('create', function (model) {
            collectorBot = new CollectorBot({
                el: $('<p>'),
                model: model
            });
            $('#resource-map').append(collectorBot.render().el);
        });
        Collector.create();

        collectorBot.request(resourceList.particles[0], {
            type: 'water',
            quantity: 10
        });
    });
});
