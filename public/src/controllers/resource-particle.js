define(['src/models/resource', 'src/controllers/exchanger'], function (Resource, Exchanger) {
    var ResourceParticle;
    
    ResourceParticle = Spine.Controller.sub();
    ResourceParticle.include(new Exchanger());
    ResourceParticle.include({    
        init: function () {
            this.model.bind('update', this.proxy(function () {
                this.render();
            }));
        },
        
        type: function() {
            return this.model.type;
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
        },

        negotiate: function (manifest) {
            manifest.quantity = 5;
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
            }, 1000);
        },
        
        render: function () {
            this.el.html(this.model.quantity);
            return this;
        }
    });
    
    return ResourceParticle;
});