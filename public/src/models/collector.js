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
            var surplus, thisCollector = this;
            //  TODO test that we don't already have a load
            //  TODO test that we can accept this load type
            this.type = type || this.type;
            
            //  It takes some time to collect a load, so handle that asynchronously
            Crafty.e('Delay').delay(function () {
                thisCollector.cargo = Math.min(thisCollector.limit, amount);
                thisCollector.status = Collector.States.indexOf('Full');
                thisCollector.save();
            }, this.delay);
            
            //  Return any surplus
            surplus = Math.max(0, amount - this.capacity)
            return surplus;
        },
        
        unload: function () {
            //  TODO test that we do have a load to unload
            //  TODO It takes some time to collect a load, so handle this asynchronously   
            this.status = Collector.States.indexOf('Empty');
            this.save();
            return this.cargo;
        }
    });
    
    return Collector;
});