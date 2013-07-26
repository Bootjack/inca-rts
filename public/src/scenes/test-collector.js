var $, console, Crafty, require;

(function () {
    'use strict';
    
    Crafty.scene('test-collector', function () {
        require([
            'src/components/resource',
        ], function () {
            var collector, i, quantity, x, y;
            
            for (i = 0; i < 10; i += 1) {
                quantity = 90 + Math.floor(Math.random() * 20);
                x = 100 + Math.floor(Math.random() * 600);
                y = 100 + Math.floor(Math.random() * 400);
                Crafty.e('Resource, water-resource').attr({
                    x: x, y: y
                }).resource({
                    type: 'water', 
                    quantity: quantity,
                    capacity: 150,
                    duration: 1000
                });
            }
            
            //  Testing scaffold for collectors
            collector = Crafty.e('Resource').resource({
                type: 'water', 
                capacity: 20,
                duration: 500
            }).color('#b03030');

            collector.request(Crafty(Crafty('water-resource')[0]), {type: 'water', quantity: 50});
        });
    });
}());