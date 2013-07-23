define(function() {
    var Resource = Spine.Model.sub();
    Resource.configure('Resource', 'quantity', 'type');
    
    Resource.include({
        deplete: function (amount) {
            var amount = Math.min(amount, this.quantity);
            this.quantity -= amount;
            this.save();
            return amount;
        },
        
        replenish: function (amount) {
            this.quantity += amount;
            this.save();
            return this;
        }
    });
    
    return Resource;
});