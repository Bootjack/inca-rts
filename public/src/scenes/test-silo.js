var Crafty, require;

require([
    'src/components/silo',
    'src/modules/exchange'
], function () {
    'use strict';
    
    Crafty.scene('test-silo', function () {
        var siloA, siloB, siloC, siloD;
        siloA = Crafty.e('Silo').attr({
            x: 200,
            y: 200
        }).silo({
            type: 'water',
            quantity: 200,
        }).addComponent('water-storage');

        siloB = Crafty.e('Silo').attr({
            x: 500,
            y: 200
        }).silo({
            type: 'water'
        }).addComponent('water-storage');

        Crafty.e('Exchange').exchange({
            inputs: [siloA.storage],
            outputs: [siloB.storage],
            volume: 1,
            permanent: true
        }).activate();


        siloC = Crafty.e('Silo').attr({
            x: 200,
            y: 400
        }).silo({
                type: 'water',
                quantity: 200,
            }).addComponent('water-storage');

        siloD = Crafty.e('Silo').attr({
            x: 500,
            y: 400
        }).silo({
                type: 'water'
            }).addComponent('water-storage');

        Crafty.e('Exchange').exchange({
            inputs: [siloC.storage],
            outputs: [siloD.storage],
            volume: 4
        }).activate(100);

    });
});