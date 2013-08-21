var Crafty, require;

require(['src/modules/storage'], function () {
    'use strict';

    Crafty.c('Silo', {
        init: function () {
            this.requires('2D, Canvas, Color')
                .attr({w: 20, h: 20})
                .color('rgba(100, 100, 255, 1.0)');
            this.storage = Crafty.e('Storage').storage({
                material: 'water',
                capacity: 200
            });
            this.bind('EnterFrame', this.render);
            return this;
        },
    
        silo: function (config) {
            config = config || {};
            this.storage.material = config.material || this.storage.material;
            this.storage.quantity = config.quantity || this.storage.quantity;
            this.storage.capacity = config.capacity || this.storage.capacity;
            return this;
        },

        render: function () {
            var alpha = 0.05 + 0.95 * this.storage.quantity / this.storage.capacity;
            this.color('rgba(100, 100, 255, ' + alpha + ')');
            return this;
        }
    });
});