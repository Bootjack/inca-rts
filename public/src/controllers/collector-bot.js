define(['src/models/collector', 'src/controllers/storage-node'], function (Collector, StorageNode) {
    var CollectorController = StorageNode.sub();
    
    CollectorController.include({
        init: function () {
            this.entity = Crafty.e('2D, Canvas, Circle, Color')
                .attr({x: this.model.x, y: this.model.y, w: this.model.width, h: this.model.height})
                .color('#b03030');  
            this.model.bind('update', this.proxy(function () {
                this.render();
            }));
        },

        render: function () {
            var size = this.model.size * Math.max(0.5, this.model.quantity / this.model.capacity);
            this.entity.attr({
                x: this.model.x - size / 2,
                y: this.model.y - size / 2,
                w: size,
                h: size
            });
            return this;
        }
    });
    
    return CollectorController;
});