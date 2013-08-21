/* Storage enables a capacity to hold a type of material. It sets a material type and capacity.
 * Material may be added or removed from storage. Any storage module will also persist its current quantity,
 * space available, and flags for whether it is empty or full. */

var Crafty, require;

require([], function () {
    'use strict';

    Crafty.c('Storage', {
        // Initialize
        init: function () {
            // Set default properties
            this.material = 'air';
            this.capacity = 1;      // Arbitrary units
            this.quantity = 0;      // Arbitrary units

            this.empty = true;
            this.full = false;

            return this;
        },

        // Configure
        storage: function (config) {
            config = config || {};
            this.material = config.material || this.material;
            this.capacity = config.capacity || this.capacity;
            this.rate = config.rate || this.rate;
            this.delta = config.delta || this.delta;
            this.quantity = config.quantity || this.quantity;
            this.update();
            return this;
        },

        update: function () {
            this.empty = (0 >= this.quantity);
            this.full = (this.quantity >= this.capacity);
            return this;
        },

        available: function () {
            return this.capacity - this.quantity;
        },

        add: function (amount) {
            var available, surplus;
            available = this.available();
            surplus = Math.min(0, amount - available);
            this.quantity += Math.min(amount, available);
            this.update();
            return surplus;
        },

        remove: function (amount) {
            amount = Math.min(amount, this.quantity);
            this.quantity -= amount;
            this.update();
            return amount;
        }
    });
});