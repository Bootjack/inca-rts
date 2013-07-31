Crafty.c('Collector', {
    States: {
        'Empty': {index: 0, name: 'Empty', color: '#803030'},
        'Busy': {index: 0, name: 'Empty', color: '#f0d000'},
        'Full': {index: 1, name: 'Full', color: '#c03030'}
    },

    init: function () {
        var self = this;
        this.requires('2D, DOM, Color, Container, Migrator')
            .attr({x: 100, y: 100, w: this.size, h: this.size})
            .css({'border': '2px solid #f06040', 'border-radius': this.size + 'px'})
            .addComponent('Collision');
        
        this.state = this.States.Empty;        
        
        this.bind('EnterFrame', function () {
            this.render();
        });        
        
        this.bind('update', function (){
            this.state = (this.quantity === this.capacity) ? this.States.Full : this.States.Empty;
        });
        
        this.bind('exchange.completed', function (exchange) {
            if (this.available()) {
                this.migrateToNearest('water-resource', function (target) {
                    var test = target.quantity > 0;
                    return test;
                });
            } else {
                this.migrateToNearest('water-storage', function (target) {
                    var test = target.available() > 0;
                    return test;
                });
            }
        });

        this.bind('exchange.aborted', function (exchange) {
            this.busy = false;
            console.log(this);
            this.delay(function () {
                this.collectorOnMigrationComplete();
            }, this.duration * 1.1);
        });
        
        this.bind('migration.completed', this.collectorOnMigrationComplete);
        
        /*
        this.onHit(
            'water-resource',
            function (colliders) {
                if (!this.exchange && !this.busy) {
                    this.request(colliders[0].obj, {type: this.type[0], quantity: this.available()})
                }
                this.state = this.States.Busy;
            },
            function () {
                if (this.exchange) this.exchange.finish();
                this.state = (this.quantity === this.capacity) ? this.States.Full : this.States.Empty;
            }
        );
        this.onHit(
            'water-storage',
            function (colliders) {
                if (!this.exchange && !this.busy) {
                    this.offer(colliders[0].obj, {type: this.type[0], quantity: this.quantity})
                    this.state = this.States.Busy;
                }
            },
            function () {
                if (this.exchange) this.exchange.finish();
                this.state = (this.quantity === this.capacity) ? this.States.Full : this.States.Empty;
            }
        );
        */
    },

    collector: function (config) {
        config = config || {};    
        if (this.States.hasOwnProperty(config.state)) this.state = this.States[config.state];
        this.trigger('exchange.completed');
        return this;
    },

    render: function () {
        if (this.busy) this.state = this.States.Busy;
        this.color(this.state.color);
        return this;
    },
    
    collectorOnMigrationComplete: function () {
        console.log('migration complete');
        if (!this.busy) {
            if (this.target.has('Resource')) {
                this.request(this.target, {type: this.type[0], quantity: this.available()})
            } else if (this.target.has('Storage')) {
                this.offer(this.target, {type: this.type[0], quantity: this.quantity})
            }
        }        
    }
});
        
