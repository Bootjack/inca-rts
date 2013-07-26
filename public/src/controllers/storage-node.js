define(['src/models/storage'], function (Storage) {
    'use strict';

    var StorageNode = Spine.Controller.sub();
    StorageNode.include({
        //  Spine controller methods
        init: function () {
            this.model.bind('update', this.proxy(function () {
                this.render();
            }));
        },

        render: function () {
            var status = this.model.ready ? 'Ready: ' : 'Busy: ';
            status += this.model.quantity;
            this.el.html(status);
            return this;
        },

        consider: function (manifest, role) {
            var accept = false;
            if (manifest.type === this.model.type && !this.model.busy) {
                accept = true;
            }
            return accept;
        },

        deplete: function (amount, callback) {
            var model = this.model;
            model.busy = true;
            model.save();
            function receipt() {
                console.log('receipt received');
                model.busy = false;
                model.save();
            }
            Crafty.e('Delay').delay(
                function () {
                    callback(model.deplete(amount), receipt);
                },
                model.delay
            );
        },

        replenish: function (amount, callback) {
            var model = this.model;
            model.busy = true;
            model.save();
            Crafty.e('Delay').delay(
                function () {
                    console.log('package received');
                    model.busy = false;
                    model.replenish(amount);
                    callback();
                },
                model.delay
            );
        },
        
        // Request something from another controller
        request: function (source, manifest) {
            var model = this.model;
            if (source.consider(manifest, 'source')) {
                source.deplete(manifest.quantity, this.proxy(this.replenish));
            }
        },
        
        // Offer something to another controller
        offer: function (target, manifest) {
            var model = this.model;
            if (target.consider(manifest, 'target')) {
                this.deplete(manifest.quantity, target.proxy(target.replenish));
            }
        },
    });
    
    return StorageNode;
});