define(function () {
    'use strict';
    
    var Storage = Spine.Model.sub();
    Storage.configure('Storage', 'type',  'quantity', 'capacity', 'delay', 'x', 'y', 'width', 'height');
    
    Storage.include({
        type: null,
        quantity: 0,
        capacity: 1,
        delay: 1000,
        busy: false,
        
        x: 0,
        y: 0,
        size: 20,
        
        full: function () {
            return this.quantity === this.capacity;
        },
        
        deplete: function (amount) {
            amount = Math.min(amount, this.quantity);
            this.quantity -= amount;
            this.save();
            return amount;
        },
        
        replenish: function (amount) {
            var available, surplus;
            available = this.capacity - this.quantity;
            surplus = Math.min(0, amount - available);
            this.quantity += Math.min(amount, available);
            this.save();
            return surplus;
        }
    });
    
    return Storage;
});