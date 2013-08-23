/* A drive consumes a stored resource to create propulsion. */

var Crafty, require;

require(['src/modules/storage', 'src/modules/exchange'], function () {
    'use strict';

    Crafty.c('Drive', {
        init: function() {
            this.requires('Exchange');
            this.throttle = 0;
            this.efficiency = 1;
            this.isAngular = false;

            this.run = function () {
                var i, actual, adjustment, angle, force, point, proportion, quantity, storage, vector;

                adjustment = 1;

                if (this.limit >= 0 && this.meter >= this.limit) {
                    this.deactivate();
                    if (!this.permanent) {
                        this.destroy();
                    }
                }

                if (this.active) {
                    for (i = 0; i < this.inputs.length; i += 1) {
                        proportion = this.inputs[i].proportion;
                        storage = this.inputs[i].module;
                        quantity = proportion * adjustment * this.volume;
                        actual = storage.remove(quantity  * Math.abs(this.throttle));
                        adjustment *= actual / quantity;
                    }

                    quantity = adjustment * this.efficiency * this.volume * this.throttle;
                    this.meter += quantity;

                    angle = this.driven.body.GetAngle();
                    vector = new Crafty.math.Vector2D(Math.cos(angle), Math.sin(angle));
                    vector.scaleToMagnitude(quantity);
                    point = this.driven.body.GetWorldCenter();

                    if (this.isAngular) {
                            this.driven.body.ApplyTorque(quantity);
                    } else {
                        force = new Box2D.Common.Math.b2Vec2(vector.x, vector.y);
                        this.driven.body.ApplyForce(force, point);
                    }
                }

                return this;
            }

            return this;
        },

        drive: function (config) {
            if (!config || !config.driven || !config.driven.has('Box2D')) {
                throw new Error("Crafty.c('Drive') must be given a reference to a Box2D entity as its driven.");
            }
            this.driven = config.driven;
            this.efficiency = config.efficiency || this.efficiency;
            config.permanent = true;
            this.exchange(config);
            this.attr({
                x: this.driven.x + (config.x || 0),
                y: this.driven.y + (config.y || 0)
            });
            if (config.isAngular) {
                this.isAngular = true;
            }
            this.activate();
            return this;
        }
    })
});