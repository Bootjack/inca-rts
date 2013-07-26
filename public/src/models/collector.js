define(function() {
    var Collector = Spine.Model.sub();
    Collector.configure('Collector', 'limit', 'cargo', 'type', 'delay', 'status');
    /*  NOTE Tried to use `capacity` instead of `limit`, but that name appears to be reserved.
     *  The outcome was that the model would have all listed attributes except `capacity`. Changing
     *  to `limit` fixed the issue. */

    Collector.extend({        
        States: [
            'Empty',    // 0
            'Full'      // 1
        ]
    });
    
    Collector.include({
        //  Default values
        limit: 10,
        cargo: 0,
        type: null,
        delay: 1000,
        status: Collector.States.indexOf('Empty'),
        
        /*  NOTE First attempt tried naming the `collect()` method `load()`, which is already
         *  a Spine.Model method called after create. So, consider that method name reserved. Kthx. */
        collect: function (amount, type) {
            var available, surplus;
            //  TODO test that we don't already have a load
            //  TODO test that we can accept this load type
            this.type = type || this.type;
            
            available = this.limit - this.cargo;
            surplus = Math.max(0, amount - available);
            this.cargo += Math.min(available, amount);
            this.status = Collector.States.indexOf('Full');
            this.save();
            
            //  Return any surplus
            return surplus;
        },
        
        unload: function () {
            //  TODO test that we do have a load to unload
            var delivery = this.cargo;
            this.cargo = 0;
            this.status = Collector.States.indexOf('Empty');
            this.save();
            return delivery;
        }
    });
    
    return Collector;
});