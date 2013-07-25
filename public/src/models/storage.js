define(function () {
    'use strict';
    
    var Storage = Spine.Model.sub();
    Storage.configure('Storage', 'type', 'delay', 'capacity', 'quantity');
    
    Storage.include({
        type: 'air',
        delay: 1000,
        capacity: 100,
        quantity: 0,
        
        deplete: function (amount) {
            amount = Math.min(amount, this.quantity);
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
    return Storage;
});