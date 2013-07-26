var $, console, Crafty, require;

(function () {
    'use strict';
    
    Crafty.scene('test-storage', function () {
        require([
            'src/models/storage',
            'src/controllers/storage-node'
        ], function (
            Storage,
            StorageNode
        ) {
            var storage1, storage2, storageNodes = []
            Storage.bind('create', function (model) {
                var storageNode = new StorageNode({
                    model: model
                });
                storageNodes.push(storageNode);
                $('#spine-out').append(storageNode.render().el);
            });
            storage1 = Storage.create({
                type: 'water',
                quantity: 10,
                capacity: 20
            });
            storage2 = Storage.create({
                type: 'water',
                quantity: 20,
                capacity: 20
            });
            storageNodes[0].request(storageNodes[1], {type: 'water', quantity: 5});
        });
    });
}());