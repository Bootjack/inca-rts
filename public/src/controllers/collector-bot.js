define(['src/models/collector', 'src/controllers/exchanger'], function (Collector, Exchanger) {
    var CollectorController;
    
    CollectorController = Exchanger.sub({   
        //  Core Controller Methods
        init: function () {            
            this.model.bind('update', this.proxy(this.render));
        },

        render: function () {
            console.log('rendering collector');
            var status = Collector.States[this.model.status];
            if (Collector.States.indexOf('Full') === this.model.status) {
                status += ' of ' + this.model.cargo + ' ' + this.model.type;
            }
            this.el.html(status);
            return this;
        },
        
        //  Exchanger Methods
        receive: function (packet) {
            this.collect(packet);
        },
        
        //  Game Logic Methods
        collect: function (packet, callback) {
            //  It takes some time to collect a load, so handle that asynchronously
            Crafty.e('Delay').delay(this.proxy(function () {
                this.model.collect(packet.quantity, packet.type);
                if ('function' === typeof(callback)) callback();
            }), this.model.delay);
            return this;
        }
    });
    
    return CollectorController;
});