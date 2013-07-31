Crafty.c('Exchange', {
    exchange: function (config) {
        var self = this;
        config = config || {};
        this.source = config.source;
        this.target = config.target;
        this.manifest = config.manifest;

        if (this.source.consider(self, 'source') && this.target.consider(self, 'target')) {
            this.source.busy = true;
            this.target.busy = true;
            function send(exchange) {
                if (exchange[0] === self[0]) {
                    self.target.receive(exchange);
                }
            };
            function receive(exchange) {
                if (exchange[0] === self[0]) {
                    self.source.trigger('exchange.completed', this);
                    self.target.trigger('exchange.completed', this);
                    self.finish();
                }
            };
            this.send = send;
            this.receive = receive;
            this.source.bind('exchange.sent', send);
            this.target.bind('exchange.received', receive);
            this.source.send(this);
        } else {
            this.source.trigger('exchange.aborted', this);
            this.target.trigger('exchange.aborted', this);
            this.finish();
        }
        return this;
    },
    
    finish: function () {
        this.source.unbind('exchange.sent', this.send);
        this.target.unbind('exchange.received', this.receive);
        delete this.source.exchange;
        delete this.target.exchange;
        this.source.busy = false;
        this.target.busy = false;
        this.source.trigger('update');
        this.target.trigger('update');
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
    duration: 0,
    size: 10,
    busy: false,
    
    //  Intialize Container
    init: function () {
        this.requires('Delay');
        this.type = [];
    },
    
    available: function () {
        return this.capacity - this.quantity;
    },

    //  Configure Container
    container: function (config) {
        if (config.type) this.type.push(config.type);
        this.quantity = config.quantity || this.quantity;
        this.capacity = config.capacity || this.capacity;
        this.duration = config.duration || this.duration;
        this.size = config.size || this.size;
        return this;
    },

    //  Evaluate a manifest and return Boolean representing acceptance of the transaction.
    //  This method will likely be overridden by a more specific controller.
    consider: function (exchange, role) {
        var accept = false;
        if (!this.busy && -1 !== this.type.indexOf(exchange.manifest.type)) {
            if ('target' === role && this.available() >= exchange.manifest.quantity) {
                accept = true;
            } else if ('source' === role && this.quantity > 0) {
                accept = true;
            }
        }
        return accept;
    },

    // Initiate asynchronous request from another Container
    request: function (source, manifest) {
        this.exchange = Crafty.e('Exchange').exchange({
            target: this,
            source: source,
            manifest: manifest
        });
    },
    
    // Initiate asynchronous offer to another Container
    offer: function (target, manifest) {
        this.exchange = Crafty.e('Exchange').exchange({
            target: target,
            source: this,
            manifest: manifest
        });
    },
    
    //  Schedule future replenishment with callback indicating receipt to other Container
    receive: function (exchange) {
        var self = this;
        this.trigger('update');
        this.delay(
            function () {
                self._replenish(exchange.manifest.quantity);
                self.trigger('exchange.received', exchange);
            },
            self.duration
        );
    },
    
    //  Schedule a future depletion with a callback for delivery to other Container
    send: function (exchange) {
        var self = this;
        this.trigger('update');
        this.delay(
            function () {
                exchange.manifest.quantity = self._deplete(exchange.manifest.quantity);
                self.trigger('exchange.sent', exchange);
            },
            self.duration
        );
    },

    //  Immediately replenish this Container by a sanitized amount
    //  Normally only called via request/offer function chain
    //  Consider this method private
    _replenish: function (amount) {
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
    _deplete: function (amount) {
        amount = Math.min(amount, this.quantity);
        this.quantity -= amount;
        this.trigger('update');
        return amount;
    }
});
