var Crafty, require;

require(['src/components/container'], function () {
    'use strict';

    Crafty.c('Processor', {
        //  Component constants
        States: {
            'Idle': {
                'color': '#a0d500'
            },
            'Busy': {
                'color': '#e0f000'
            }
        },
        
        //  Initialization
        init: function () {
            var self = this;
            this.requires('2D, DOM, Container');
            
            this.state = this.States.Idle;
            this.processDelay = 1500;    
        
            this.bind('update', function () {
                self.render();
            });
    
            this.bind('exchange.ended', self.startProcessing);
        },
    
        //  Configuration
        processor: function (config) {
            var color, self;
            self = this;
            config = config || {};
            if (config.state && this.States.hasOwnProperty(config.state)) {
                this.state = this.States[config.state];
            }
            this.processDelay = config.processDelay || this.processDelay;
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
        },
        
        startProcessing: function () {
            var self = this;
            if (this.quantity > 0) {
                this.busy = true;
                this.state = this.States.Busy;
                this.trigger('update');
                this.delay(self.finishProcessing, self.processDelay);
            }
        },
        
        finishProcessing: function () {
            this.busy = false;
            this.state = this.States.Idle;
            this.render();
        }
    });
});