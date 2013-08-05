var Crafty, require;

require([
    'src/components/collector',
    'src/components/resource',
    'src/components/storage'
], function () {
    'use strict';
    
    Crafty.scene('test-swarm', function () {
        var collector, distance, e, i, origin, quantity, silo, type, vector, w, water, x, y;
        
        //  Create 10 resource puddles with an 80% chance of being water
        for (i = 0; i < 40; i += 1) {
            quantity = 20 + Math.floor(Math.random() * 100);
            x = 100 + Math.floor(Math.random() * 600);
            y = 100 + Math.floor(Math.random() * 400);
            type = (Math.random() > 0.4) ? 'dirt' : 'water';
            e = Crafty.e('Mouse, Resource').attr({
                x: x,
                y: y
            }).container({
                type: type,
                quantity: quantity,
                capacity: 150,
                exchangeDelay: 1000,
                size: 50
            }).resource().addComponent(type + '-resource');
            e.bind(
                'Click',
                (function () {
                    var self = e;
                    return function () {
                        if (self.busy) {
                            self.busy = false;
                        } else {
                            self.busy = true;
                        }
                        self.trigger('update');
                    };
                }())
            );
        }

        //  Create a water storage silo
        silo = Crafty.e('Storage').attr({
            x: 100,
            y: 25
        }).container({
            type: 'water',
            quantity: 0,
            capacity: 200,
            exchangeDelay: 500,
            size : 50
        }).storage().addComponent('water-storage');

        //  Create a water storage silo
        silo = Crafty.e('Storage').attr({
            x: 600,
            y: 25
        }).container({
            type: 'water',
            quantity: 0,
            capacity: 200,
            exchangeDelay: 500,
            size : 50
        }).storage().addComponent('water-storage');
        
        for (i = 0; i < 10; i += 1) {
            x = 100 + Math.floor(Math.random() * 600);
            y = 100 + Math.floor(Math.random() * 400);
            //  Create a water collector
            Crafty.e('Collector').attr({
                x: x,
                y: y
            }).container({
                type: 'water',
                capacity: 5,
                exchangeDelay: 500,
                size : 10
            }).migrator({
                speed: 4
            }).collector({
                fromSelector: 'water-resource',
                toSelector: 'water-storage, water-processor'
            });
        }
        
        //  The collector requests water from one of the resources
        //collector.request(Crafty(Crafty('water-resource')[0]), {type: 'water', quantity: 20});

        /*  This is the strangest Crafty quirk by far: the css() function called in render() 
         *  doesn't update during initialization and configuration. It won't even update in the
         *  test scene if included right here. But 10ms from now, it will work. */
        Crafty.e('Delay').delay(function () {
            Crafty('Resource').each(function () {
                this.render();
            });
        }, 10);
    });
});