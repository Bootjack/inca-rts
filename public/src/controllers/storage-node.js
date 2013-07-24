define(['src/models/storage', 'src/controllers/exchanger'], function (Storage, Exchanger) {
    var ResourceParticle;
    
    ResourceParticle = Spine.Controller.sub();
    ResourceParticle.include(new Exchanger());
    ResourceParticle.include({    
        //  Spine controller methods
        init: function () {
            this.model.bind('update', this.proxy(function () {
                this.render();
            }));
        },

        render: function () {
            this.el.html(this.model.quantity);
            return this;
        },

        //  Exchanger methods
        negotiate: function (manifest) {
            if (!manifest.type || !this.allowed(manifest.type) {
                manifest.type = this.type();
            }
            if (this.quantity() + manifest.quantity > this.capacity()) {
                manifest.quantity = this.capacity() - this.quantity();
            }
            manifest.opinion = 'accept';
            return manifest;
        },
        
        deliver: function (manifest, callback) {
            var self = this;
            Crafty.e('Delay').delay(function () {
                var packet = {
                    quantity: self.deplete(manifest.quantity),
                    type: self.type()
                };
                callback(packet);
            }, this.model.delay);
        },
        
        receive: function (manifest, callback) {
            var self = this;
            Crafty.e('Delay').delay(function () {
                var packet = {
                    quantity: self.replenish(manifest.quantity),
                    type: self.type()
                };
                callback(packet);
            }, this.model.delay);
        },

        //  Game logic methods
        type: function () {
            return this.model.type;
        },

        capacity: function () {
            return this.model.capacity;
        },        

        allowed: function (type) {
            return type === this.model.type;
        },
        
        quantity: function () {
            return this.model.quantity;
        },
        
        deplete: function (amount) {
            return this.model.deplete(amount);
        },
        
        replenish: function (amount) {
            this.model.replenish(amount);
            return this;
        }
    });
    
    return ResourceParticle;
});