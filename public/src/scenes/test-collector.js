var $, console, Crafty, require;

(function () {
    'use strict';
    
    Crafty.scene('test-collector', function () {
        require([
            'src/models/resource',
            'src/controllers/resource-particle',
            'src/controllers/resource-list',
            
            'src/models/storage',
            'src/controllers/storage-node',
            
            'src/models/collector',
            'src/controllers/collector-bot'
        ], function (
            Resource,
            ResourceParticle,
            ResourceList,
            
            Storage,
            StorageNode,
            
            Collector,
            CollectorBot
        ) {
            var collectorBot, i, quantity, resourceList, x, y;
            
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
                //$('#spine-out').append(resourceParticle.render().el);
                resourceList.add(resourceParticle);
            });
            for (i = 0; i < 10; i += 1) {
                quantity = 90 + Math.floor(Math.random() * 20);
                x = 100 + Math.floor(Math.random() * 600);
                y = 100 + Math.floor(Math.random() * 400);
                Resource.create({
                    type: 'water', 
                    quantity: quantity,
                    capacity: 200,
                    delay: 2000,
                    x: x,
                    y: y
                });
            }
            
            //  Testing scaffold for collectors
            collectorBot = new CollectorBot({
                model: new Collector({
                    type: 'water',
                    capacity: 50
                })
            });
            
            collectorBot.request(resourceList.particles[0], {type: 'water', quantity: 50});
        });
    });
}());