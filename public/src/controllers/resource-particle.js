define(['src/models/resource', 'src/controllers/exchanger'], function (Resource, Exchanger) {
    var ResourceParticle;
    
    ResourceParticle = Exchanger.sub({    
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
            this.model.deplete(amount);
            return this;
        },
        
        replenish: function (amount) {
            this.model.replenish(amount);
            return this;
        },
        
        deliver: function (manifest, callback) {
            var self = this;
            console.log('actually delivering from parent');
            Crafty.e('Delay').delay(function () {
                callback(self.deplete(manifest.quantity));
            }, 1000);
        },
        
        render: function () {
            this.el.html(this.model.quantity);
            return this;
        }
    });
    
    return ResourceParticle;
});