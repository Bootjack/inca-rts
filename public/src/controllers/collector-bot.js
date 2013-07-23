define(['src/models/collector', 'src/controllers/exchanger'], function (Collector, Exchanger) {
    var CollectorController;
    
    CollectorController = Exchanger.sub({    
        init: function () {            
            this.model.bind('update', this.proxy(this.render));
        },
        
        collect: function (resourceController) {
            var amount, type;
            amount = resourceController.deplete(this.model.limit);
            console.log(amount);
            type = resourceController.type();
            this.model.collect(amount, type);
            return this;
        },
        
        render: function () {
            var status = Collector.States[this.model.status];
            if (Collector.States.indexOf('Full') === this.model.status) {
                status += ' of ' + this.model.cargo + ' ' + this.model.type;
            }
            this.el.html(status);
            return this;
        }
    });
    
    return CollectorController;
});