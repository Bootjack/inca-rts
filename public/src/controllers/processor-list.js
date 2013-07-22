define(['src/models/processor'], function (Processor) {
    var ProcessorList = Spine.Controller.sub({
        models: [],
        add: function (model) {
            this.models.push(model);
            model.bind('update', this.proxy(function (model) {
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
    return ProcessorList;
});
