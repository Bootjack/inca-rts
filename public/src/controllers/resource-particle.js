define(['src/models/resource', 'src/controllers/storage-node'], function (Resource, StorageNode) {
    var ResourceParticle = StorageNode.sub();
    
    ResourceParticle.include({
        init: function () {
            this.entity = Crafty.e('2D, Canvas, Circle, Color')
                .attr({x: this.model.x, y: this.model.y, w: this.model.width, h: this.model.height})
                .color('#3030b0');
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
    
    return ResourceParticle;
});