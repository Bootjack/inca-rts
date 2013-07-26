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
    
    //  Intialize Container
    init: function () {
        this.requires('Delay');
        this.type = [];
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
    consider: function (manifest, role) {
        var accept = false;
        if (-1 !== this.type.indexOf(manifest.type) && !this.busy) {
            accept = true;
        }
        return accept;
    },

    // Initiate asynchronous request from another Container
    request: function (source, manifest) {
        var self = this;
        function proxy(amount) {
            self._replenish(amount);
        }
        if (source.consider(manifest, 'source')) {
            source.deplete(manifest.quantity, proxy);
        }
    },
    
    // Initiate asynchronous offer to another Container
    offer: function (target, manifest) {
        var self = this;
        function proxy(amount) {
            target._replenish(amount);
        }
        if (target.consider(manifest, 'target')) {
            this.deplete(manifest.quantity, proxy);
        }
    },
            
    //  Immediately depletes this container by a sanitized amount
    //  Normally only called via request/offer function chain
    //  Consider this method private
    _deplete: function (amount) {
        amount = Math.min(amount, this.quantity);
        this.quantity -= amount;
        this.trigger('update');
        return amount;
    },
    
    //  Schedule a future depletion with a callback for delivery to other Container
    deplete: function (amount, callback) {
        var self = this;
        this.busy = true;
        function receipt() {
            self.busy = false;
        }
        this.delay(
            function () {
                callback(self._deplete(amount), receipt);
            },
            self.duration
        );
    },

    //  Immediately replenish this Container by a sanitized amount
    //  Normally only called via request/offer function chain
    //  Consider this method private
    _replenish: function (amount) {
        var available, surplus;
        available = this.capacity - this.quantity;
        surplus = Math.min(0, amount - available);
        this.quantity += Math.min(amount, available);
        this.trigger('update');	
        return surplus;
    },
    
    //  Schedule future replenishment with callback indicating receipt to other Container
    replenish: function (amount, callback) {
        var self = this;
        this.busy = true;
        this.delay(
            function () {
                self.busy = false;
                self._replenish(amount);
                callback();
            },
            self.duration
        );
    }
});
