Crafty.c('Resource', {
    init: function () {
        this.quantity = 100;
    },
    resource: function (obj) {
        this.quantity = obj.quantity || this.quantity;
    },
    deplete: function (amount) {
        var amount = Math.min(amount, this.quantity);
        this.quantity -= amount;
        return amount;
    }
});