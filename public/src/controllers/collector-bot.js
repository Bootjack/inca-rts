define(['src/models/collector', 'src/controllers/storage-node'], function (Collector, StorageNode) {
    var CollectorController = StorageNode.sub();
    
    CollectorController.sub({
        //  Controller Methods
        render: function () {
            var status = 'Empty';
            if (this.model.full()) {
                status = 'Full of ' + this.model.quantity + ' ' + this.model.type;
            } else if (this.model.quantity > 0) {
                status = 'Carrying ' + this.model.quantity + ' ' + this.model.type;
            }
            this.el.html(status);
            return this;
        }
    });
    
    return CollectorController;
});