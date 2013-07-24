define(function() {
    var Resource = Spine.Model.sub();
    Resource.configure('Resource', 'quantity');
    
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
        },
        
        sprite: function() {
            var random = Math.floor( Math.random()*80 );
            var x = Crafty.e('2D, Canvas, Color, Resource')
            .attr({x: random, y: 100, w: 20, h: 20})
            .color('#4050b0');
            return x;
        }

    });
    
    return Resource;
});
