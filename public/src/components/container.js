var Crafty;

(function () {
    'use strict';
    
    Crafty.c('Exchange', {
        /*  Exchanges are only created internally by Containers. They are abstract enough that they
         *  may be applied to increasingly complex scenarios, but the core functionality is intended
         *  for all units capable of holding any amount of a resource. 
         *  
         *  An exchange always has a source Container, a target Container, and a manifest of what is
         *  being exchanged between the two. The manifest is a simple object and the base requirement
         *  is only that it have both a type and a quantity. */
        
        //  Configure a new exchange
        exchange: function (config) {
            /*  Expects a configuration object defining the target, source, and manifest. If config is
             *  not provided or is incomplete, a dummy object is created to avoid any immediate errors.
             *  However, this dummy config object is expected to fail the consideration tests. */
            var self;
            
            this.requires('Delay');
            
            self = this;
            config = config || {};
            
            this.source = config.source;
            this.target = config.target;
            this.manifest = config.manifest;
    
            /*  The exchange begins immediately if both parties accept the manifest. The source is depleted
             *  immediately, and the Exchange holds the actual deliverables in a packet object until the
             *  timeout expires and it replenishes the target. Note that the packet may differ from the
             *  manifest because deplete returns the actual amount amount obtained from the source. */
            this.packet = {};
    
            //  Every container has a basic consider() method, allowing it to accept or reject a manifest
            if (this.source && this.target && this.source.consider(this, 'source') && this.target.consider(this, 'target')) {
                //  This tells the Containers to add a reference to this exchange into their exchange arrays 
                this.source.startExchange(this);
                this.target.startExchange(this);
                
                //  Perform the depletion and load up the packet for delivery
                this.packet.quantity = this.source.deplete(this.manifest.quantity);
                
                //  Wait for the total delay time, then replenish the target and end the exchange
                this.delay(
                    function () {
                        if (self) {
                            self.target.replenish(self.packet.quantity);
                            
                            //  TODO Handle the surplus value returned from replenish() - could just replenish source?
                            
                            self.source.endExchange(self);
                            self.target.endExchange(self);
                            
                            self.destroy();
                        }
                    },
                    this.source.exchangeDelay + this.target.exchangeDelay
                );
            } else {
                //  If either party rejects the manifest, let them both know and free this from memory
                this.source.trigger('exchange.rejected');
                this.target.trigger('exchange.rejected');
                this.destroy();
            }
            return this;
        },
        
        //  Called by either target or source to cancel an active exchange
        abort: function () {
            this.source.replenish(this.packet.quantity);
            this.source.endExchange(this);
            this.target.endExchange(this);
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
            if (config.type) {
                this.types.push(config.type);
            }
            this.quantity = config.quantity || this.quantity;
            this.capacity = config.capacity || this.capacity;
            this.exchangeDelay = config.exchangeDelay || this.exchangeDelay;
            this.size = config.size || this.size;
            return this;
        },
    
        available: function () {
            return this.capacity - this.quantity;
        },
        
        /*  Evaluate a manifest and return a Boolean representing acceptance of the transaction.
         *  This method will likely be overridden by a more specific one in a sub-component. */
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
    
        /*  Each Container has an exchange object tracking each of its exchanges by id and also
         *  maintaining the current count of exchanges (as length). */
        startExchange: function (exchange) {
            this.trigger('exchange.started');
            //  Ensure that this exchange is not already present on this Container
            if (!this.exchanges.hasOwnProperty(exchange[0])) {
                this.exchanges[exchange[0]] = exchange;
                this.exchanges.length += 1;
            }
        },
        
        //  Remove exchange this from Container and decrement exchanges length before Exchange self-destructs
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
        replenish: function (amount) {
            var available, surplus;
            available = this.available();
            surplus = Math.min(0, amount - available);
            this.quantity += Math.min(amount, available);
            this.trigger('update');
            return surplus;
        },
    
        //  Immediately depletes this container by a sanitized amount
        deplete: function (amount) {
            amount = Math.min(amount, this.quantity);
            this.quantity -= amount;
            this.trigger('update');
            return amount;
        }
    });
}());