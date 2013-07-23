define(['src/models/resource'], function (Resource) {
    var ResourceList = Spine.Controller.sub({
        models: [],
        particles: [],
        add: function (controller) {
            this.particles.push(controller);
            this.models.push(controller.model);
            controller.model.bind('update', this.proxy(function (model) {
                this.render();
            }));
            this.render();
            return this;
        },
        aggregate: function () {
            var total = 0;
            _.each(this.models, function (model) {
                total += model.quantity;
            });
            return total;
        },
        render: function () {
            this.el.html(this.aggregate());
            return this;
        }
    });
    return ResourceList;
});