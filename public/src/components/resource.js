Crafty.c('Resource', {
    Colors: {
        null: '#000000',
        water: '#4050b0'
    },
    
    type: null,
    quantity: 0,
    capacity: 1,
    duration: 0,
    size: 20,
    
    init: function () {
        this.requires('2D, DOM, Color, Delay')
            .attr({x: 100, y: 100, w: this.size, h: this.size})
            .css({'border': '0 solid #f06040'});
    },

    /*  Some of this rendering stuff is starting to get silly. Best to break it out
     *  into separate components, so each one can render distinctly. */
    resource: function (config) {
        this.type = config.type || this.type;
        this.quantity = config.quantity || this.quantity;
        this.capacity = config.capacity || this.capacity;
        this.duration = config.duration || this.duration;
        this.size = config.size || this.size;
        this.color(this.Colors[this.type] || this.Colors[null]);
        
        this.bind('EnterFrame', function () {
            var border, size 
            size = this.size * Math.max(0.5, this.quantity / this.capacity);
            border = (this.quantity === this.capacity) ? '3px' : '0';
            this.attr({
                w: size,
                h: size
            }).css({
                'border-radius': size + 'px',
                'border-width': border,
                'margin-left': -1 * size/2 + 'px',
                'margin-top': -1 * size/2 + 'px'
            });

        });
        
        return this;
    },
    
    full: function () {
        return this.quantity === this.capacity;
    },
    
    _deplete: function (amount) {
        amount = Math.min(amount, this.quantity);
        this.quantity -= amount;
        return amount;
    },
    
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

    _replenish: function (amount) {
        var available, surplus;
        available = this.capacity - this.quantity;
        surplus = Math.min(0, amount - available);
        this.quantity += Math.min(amount, available);
        return surplus;
    },
    
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
    },

    consider: function (manifest, role) {
        var accept = false;
        if (manifest.type === this.type && !this.busy) {
            accept = true;
        }
        return accept;
    },
    
    // Request something from another controller
    request: function (source, manifest) {
        var self = this;
        function proxy(amount) {
            self._replenish(amount);
        }
        if (source.consider(manifest, 'source')) {
            source.deplete(manifest.quantity, proxy);
        }
    },
    
    // Offer something to another controller
    offer: function (target, manifest) {
        var self = this;
        function proxy(amount) {
            target._replenish(amount);
        }
        if (target.consider(manifest, 'target')) {
            this.deplete(manifest.quantity, proxy);
        }
    }
});
        
