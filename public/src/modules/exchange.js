/* Exchange accepts two sets of storage modules: inputs and outputs. Each input is assigned a proportion
 * value between 0 and 1. The total of all inputs must equal one. This is enforced at configuration by
 * tracking a running total of proportions and limiting each input to a maximum proportion of 1 minus the
 * total, with the final input being forced to equal this value. Outputs are similarly assigned proportion
 * values, but enforced slightly differently. If the end of the output list results in a total less than 1,
 * a waste output is automatically appended to make up the difference.
 *
 * TODO At some future point, waste may be handled as being vented out to a global Environment object.
 *
 * Note that the simplest possible exchange has a single input and a single output, each with a proportion
 * value of 1. This is how a simple transfer is performed between two storage modules. */

var require, Crafty;

require(['src/modules/storage'], function () {
   'use strict';

    var INTERVAL = 100;  // Component constant for exchange calculations, in milliseconds

    Crafty.c('Exchange', {
        init: function () {
            this.requires('Delay');
            this.inputs = [];
            this.outputs = [];
            this.permanent = false;
            this.active = false;
            this.meter = 0;
        },

        exchange: function (config) {
            var i, total, proportion, storage;
            total = 0;
            if (config.inputs) {
                for (i = 0; i < config.inputs.length; i += 1) {
                    if (i !== config.inputs.length - 1) {
                        proportion = config.inputs[i].proportion || 1 / config.inputs.length;
                        proportion = Math.max(1 - total, proportion);
                        total += proportion;
                    } else {
                        proportion = 1 - total;
                    }
                    storage = config.inputs[i].module || config.inputs[i];
                    this.inputs.push({
                        module: storage,
                        proportion: proportion
                    });
                }
            }
            total = 0;
            if (config.outputs) {
                for (i = 0; i < config.outputs.length; i += 1) {
                    proportion = config.outputs[i].proportion || 1 / config.outputs.length;
                    total += proportion;
                    storage = config.outputs[i].module || config.outputs[i];
                    this.outputs.push({
                        module: storage,
                        proportion: proportion
                    });
                }
                if (total < 1) {
                    proportion = 1 - total;
                    this.outputs.push({
                        module: Crafty.e('Storage').storage({
                            type: 'waste',
                            capacity: Infinity
                        }),
                        proportion: proportion
                    });
                }
            }
            this.permanent = config.permanent || this.permanent;
            if (this.permanent) {
                this.activate();
            }
            return this;
        },

        activate: function () {
            var self= this;
            this.delay(self.run, INTERVAL, -1);
        },

        deactivate: function () {
            this.active = false;
        },

        run: function () {
            var i, proportion, storage;
            if (this.active) {
                for (i = 0; i < this.inputs.length; i += 1) {
                    proportion = this.inputs[i].proportion;
                    storage = this.inputs[i].module;
                    storage.remove(proportion * INTERVAL / 1000);
                }
                for (i = 0; i < this.outputs.length; i += 1) {
                    proportion = this.outputs[i].proportion;
                    storage = this.outputs[i].module;
                    storage.add(proportion * INTERVAL / 1000);
                }
            }
        }
    })
});