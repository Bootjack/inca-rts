var Crafty, require;

require(['src/components/container'], function () {
    'use strict';

    Crafty.c('Processor', {
        States: {
            'Idle': {
                'color': '#a0d500'
            },
            'Busy': {
                'color': '#e0f000'
            }
        },
        
        init: function () {
            var self = this;
            this.requires('2D, DOM, Container');
            
            this.state = this.States.Idle;
            this.processDelay = 1500;    
        
            this.bind('update', function () {
                self.render();
            });
    
            this.bind('exchange.ended', function () {
                console.log('exchange completed');
                if (self.quantity > 0) {
                    this.busy = true;
                    self.state = self.States.Busy;
                    self.trigger('update');
                    self.delay(function () {
                        self.busy = false;
                        self.state = self.States.Idle;
                        self.render();
                    }, self.processDelay);
                }
            })
        },
    
        processor: function (config) {
            var color, self;
            self = this;
            config = config || {};
            if (config.state && this.States.hasOwnProperty(config.state)) {
                this.state = this.States[config.state];
            }
            this.attr({
                w: this.size,
                h: this.size
            }).css({
                'background-color': this.state.color,
                'border': '2px solid black',
                'border-radius': '2px'
            });
                        
            this.render();
            return this;
        },
        
        render: function () {
            this.css({
                'background-color': this.state.color
            })
            return this;
        }
    });
});