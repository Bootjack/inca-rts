var Crafty, require;

require(['src/components/container'], function () {
    'use strict';
    
    Crafty.c('Resource', {
        init: function () {
            var self = this;
            this.requires('2D, DOM, Container');
            this.bind('update', function () {
                self.render();
            });
        },
    
        resource: function (config) {
            var color, self;
            self = this;
            config = config || {};
            color = '#000000';
            if (this.Colors.hasOwnProperty(this.types[0])) {
                color = this.Colors[this.types[0]];
            }
            this.addComponent('Collision');
            this.attr({
                w: this.size,
                h: this.size
            }).css({
                'background-color': color
            });
            this.render();
            return this;
        },
        
        render: function () {
            var color, fullness;
            color = this.busy ? 'yellow' : this.Colors[this.types[0]];
            fullness = Math.min(1.0, 0.2 + this.quantity / this.capacity);
            this.css({
                'background-color': color,
                'opacity': fullness.toString()
            });
            return this;
        }
    });
});