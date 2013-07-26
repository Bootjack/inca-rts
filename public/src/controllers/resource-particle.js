define(['src/models/resource', 'src/controllers/storage-node'], function (Resource, StorageNode) {
    var ResourceParticle = StorageNode.sub();
    
    ResourceParticle.include({
        init: function () {
            this.entity = Crafty.e('2D, Canvas, Circle, Color')
                .attr({x: this.model.x, y: this.model.y, w: this.model.width, h: this.model.height});
            this.model.bind('update', this.proxy(function () {
                this.render();
            }));
        },
        render: function () {
            this.entity.attr({
                x: this.model.x,
                y: this.model.y,
                w: this.model.width * this.model.quantity / this.model.capacity,
                h: this.model.height * this.model.quantity / this.model.capacity
            });
            return this;
        }
    });
    
    return ResourceParticle;
});