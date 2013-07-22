define(['src/models/processor'], function (Processor) {
    var ProcessorNode;
    
    ProcessorNode = Spine.Controller.sub({    
        init: function () {
            
            /*  This is probably overkill. For simplicity, we can just define these
             *  properties and let the instantiation parameters override them.
            var defaults = {
                quantity: 100,
                type: 'water'
            };
            _.each(defaults, function (value, key) {
                 this[key] = this[key] || value;
            });
            */
            
            this.model.bind('update', this.proxy(function () {
                this.render();
            }));
        
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
        
        render: function () {
            this.el.html(this.model.status);
            return this;
        }
    });
    
    return ProcessorNode;
});
