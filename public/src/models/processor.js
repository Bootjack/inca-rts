define(function() {
    var Processor = Spine.Model.sub();
    Processor.configure('Processor', 'rate', 'capacity', 'status', 'type');
    // status [ ready, processing, complete ]
    
    Processor.include({
        //~ deplete: function (amount) {
            //~ var amount = Math.min(amount, this.quantity);
            //~ this.quantity -= amount;
            //~ this.save();
            //~ return amount;
        //~ },
        //~ 
        //~ replenish: function (amount) {
            //~ this.quantity += amount;
            //~ this.save();
            //~ return this;
        //~ }
        finishProcessing: function() { 
            this.status = Processor.states.COMPLETE;
            this.save();
        },
        
        startProcessing: function (amount) {
            this.status = Processor.states.PROCESSING;
            this.save();
            // delay for length of rate
            var thisNode = this;
            Crafty.e('Delay').delay( this.proxy(this.finishProcessing), this.rate );
        },
        
        receive: function (amount) {
            if ( this.status != Processor.states.READY ) return amount;
            
            this.startProcessing();
            
            if (amount > this.capacity) {
                return amount - this.capacity
            } else {
                return 0
            }
        }
        
    });
    
    Processor.extend({
        states: {
            READY: 0,
            PROCESSING: 1,
            COMPLETE: 2
        }
    });
    
    return Processor;
});
