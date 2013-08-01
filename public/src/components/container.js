Crafty.c('Exchange', {
    exchange: function (config) {
        var self;
        
        this.requires('Delay');
        
        self = this;
        config = config || {};
        
        this.source = config.source;
        this.target = config.target;
        this.manifest = config.manifest;
        this.packet = {};

        if (this.source.consider(this, 'source') && this.target.consider(this, 'target')) {
            this.source.startExchange(this);
            this.target.startExchange(this);
            this.packet.quantity = this.source.deplete(this.manifest.quantity);
            this.delay(
                function () {
                    if (self) {
                        self.target.replenish(self.packet.quantity);
                        self.source.endExchange(self);
                        self.target.endExchange(self);
                        self.destroy();
                    }
                }, 
                this.source.exchangeDelay + this.target.exchangeDelay
            );
        } else {
            this.source.trigger('exchange.rejected');
            this.target.trigger('exchange.rejected');
        }
        return this;
    },
    
    abort: function () {
        this.source.replenish(this.packet.quantity);
        this.source.endExchange(self);
        this.target.endExchange(self);
        this.destroy();
    }
});

Crafty.c('Container', {
    Colors: {
        dirt: '#504000',
        water: '#4050b0'
    },
    
    //  Attribute defaults
    quantity: 0,
    capacity: 1,
    exchangeDelay: 0,
    size: 10,
    busy: false,
    
    //  Intialize Container
    init: function () {
        this.requires('Delay');
        this.types = [];
        this.exchanges = {length: 0};
    },

    //  Configure Container
    container: function (config) {
        if (config.type) this.types.push(config.type);
        this.quantity = config.quantity || this.quantity;
        this.capacity = config.capacity || this.capacity;
        this.exchangeDelay = config.exchangeDelay || this.exchangeDelay;
        this.size = config.size || this.size;
        return this;
    },

    available: function () {
        return this.capacity - this.quantity;
    },
    
    //  Evaluate a manifest and return Boolean representing acceptance of the transaction.
    //  This method will likely be overridden by a more specific controller.
    consider: function (exchange, role) {
        var accept = false;
        if (!this.exchanges.length && !this.busy && -1 !== this.types.indexOf(exchange.manifest.type)) {
            if ('target' === role && this.available() >= exchange.manifest.quantity) {
                accept = true;
            } else if ('source' === role && this.quantity > 0) {
                accept = true;
            }
        }
        return accept;
    },

    startExchange: function (exchange) {
        this.trigger('exchange.started');
        if (!this.exchanges.hasOwnProperty(exchange[0])) {
            this.exchanges[exchange[0]] = exchange;
            this.exchanges.length += 1;
        }
    },
    
    endExchange: function (exchange) {
        this.trigger('exchange.ended');
        if (this.exchanges[exchange[0]]) {
            delete this.exchanges[exchange[0]];
            this.exchanges.length -= 1;
        }
    },

    // Initiate asynchronous request from another Container
    request: function (source, manifest) {
        Crafty.e('Exchange').exchange({
            target: this,
            source: source,
            manifest: manifest
        });
    },
    
    // Initiate asynchronous offer to another Container
    offer: function (target, manifest) {
        Crafty.e('Exchange').exchange({
            target: target,
            source: this,
            manifest: manifest
        });
    },

    //  Immediately replenish this Container by a sanitized amount
    //  Normally only called via request/offer function chain
    //  Consider this method private
    replenish: function (amount) {
        var available, surplus;
        available = this.available();
        surplus = Math.min(0, amount - available);
        this.quantity += Math.min(amount, available);
        this.trigger('update');
        return surplus;
    },

    //  Immediately depletes this container by a sanitized amount
    //  Normally only called via request/offer function chain
    //  Consider this method private
    deplete: function (amount) {
        amount = Math.min(amount, this.quantity);
        this.quantity -= amount;
        this.trigger('update');
        return amount;
    }
});
