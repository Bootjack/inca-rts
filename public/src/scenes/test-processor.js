var Crafty, require;

require([
    'src/components/collector',
    'src/components/resource',
    'src/components/processor'
], function () {
    'use strict';
    
    Crafty.scene('test-processor', function () {
        var collector, distance, e, i, origin, quantity, silo, type, vector, w, water, x, y;
        
        e = Crafty.e('Mouse, Resource').attr({
            x: 300,
            y: 400
        }).container({
            type: 'water',
            quantity: 100,
            capacity: 200,
            exchangeDelay: 1000,
            size: 50
        }).resource().addComponent('water-resource');
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

        //  Create a water storage silo
        silo = Crafty.e('Processor').attr({
            x: 300,
            y: 200
        }).container({
            type: 'water',
            quantity: 0,
            capacity: 50,
            exchangeDelay: 500,
            size : 50
        }).processor({
            processDelay: 5000,
        }).addComponent('water-processor');
        
        Crafty.e('Collector').attr({
            x: 50,
            y: 300
        }).container({
            type: 'water',
            capacity: 10,
            exchangeDelay: 500,
            size : 10
        }).migrator({
            speed: 4
        }).collector().migrateToNearest('water-resource');
        
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