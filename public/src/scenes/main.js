Crafty.scene('main', function() {
    require([
        'src/models/resource',
        'src/controllers/resource-particle',
        'src/controllers/resource-list',
        'src/models/processor',
        'src/controllers/processor-node',
        'src/controllers/processor-list'
    ], function (Resource, ResourceParticle, ResourceList, Processor, ProcessorNode, ProcessorList) {
        var resourceList, processorList, water, random, random2;
  	     
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

        processorList = new ProcessorList({
            el: $('#processor-list')
        });
        processorList.render();
        
        Processor.bind('create', function (model) {
            var processorNode = new ProcessorNode({
                el: $('<p>'),
                model: model
            });
            $('#resource-map').append(processorNode.render().el);
            processorList.add(model);
        });
  	     
        for (i = 0; i < 10; i += 1) {
            random = Math.floor(10 - Math.random() * 20);
            Resource.create({quantity: 100 + random, type: 'water'});
        }
        for (i = 0; i < 4; i += 1) {
            random = Math.floor( Math.random * 8 + 3 ); // capacity
            random2 = Math.floor( 10 + Math.random() * random );
            
            Processor.create({capacity: random, rate: random2});
        }
        
        processorList.models[2].startProcessing();
        Crafty.e('Delay').delay(function () {
            console.log(resourceList.models[3].deplete(30));
        }, 1000, 5);
    });
});
