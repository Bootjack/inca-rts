var $, console, Crafty, require;

(function () {
    'use strict';
    
    Crafty.scene('test-collector', function () {
        require([
            'src/components/collector',
            'src/components/container',
            'src/components/migrator',
            'src/components/resource',
            'src/components/storage'
        ], function () {
            var collector, distance, i, origin, quantity, silo, type, vector, w, water, x, y;
            
            //  Create 10 resource puddles with an 80% chance of being water
            for (i = 0; i < 10; i += 1) {
                quantity = 20 + Math.floor(Math.random() * 100);
                x = 100 + Math.floor(Math.random() * 600);
                y = 100 + Math.floor(Math.random() * 400);
                type = (Math.random() > 0.8) ? 'dirt' : 'water';
                Crafty.e('Resource').attr({
                    x: x, y: y
                }).container({
                    type: type, 
                    quantity: quantity,
                    capacity: 150,
                    duration: 1000,
                    size: 50
                }).resource().addComponent(type + '-resource');
            }

            //  Create a water storage silo
            silo = Crafty.e('Storage').attr({
                x: 300,
                y: 25
            }).container({
                type: 'water',
                quantity: 0,
                capacity: 200,
                duration: 500,
                size : 50
            }).storage().addComponent('water-storage');
            
            //  Create a water collector
            Crafty.e('Collector').container({
                type: 'water', 
                capacity: 5,
                duration: 500,
                size : 10
            }).migrator({speed: 4}).collector();

            Crafty.e('Collector').container({
                type: 'water', 
                capacity: 5,
                duration: 500,
                size : 10
            }).migrator({speed: 4}).collector();
            
            //  The collector requests water from one of the resources
            //collector.request(Crafty(Crafty('water-resource')[0]), {type: 'water', quantity: 20});


            /*  This is the strangest Crafty quirk by far: the css() function called in render() 
             *  doesn't update during initialization and configuration. It won't even update in the
             *  test scene if included right here. But 10ms from now, it will work. */
            Crafty.e('Delay').delay(function () {
                Crafty('Resource').each(function () {
                    this.render();
                })
            }, 10);
        });
    });
}());