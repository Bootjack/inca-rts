var Crafty;

(function () {
    'use strict';
 
    Crafty.c('Migrator', {
        init: function () {
            this.requires('2D');
            this.center = new Crafty.math.Vector2D(this._x + this._w / 2, this._y + this._h / 2);
            this.destination = this.center;
            this.speed = 1;
            return this;
        },

        migratorOnEnterFrame: function () {
            var direction = new Crafty.math.Vector2D(this.destination);
            this.center.x = this._x + this._w / 2;
            this.center.y = this._y + this._h / 2
            if (this.center.distance(this.destination) > this._w / 2) {
                direction.subtract(this.center).normalize().scale(this.speed);
                this.attr({
                    x: this._x + direction.x,
                    y: this._y + direction.y
                });
            } else {
                this.unbind('EnterFrame', this.migratorOnEnterFrame)
                this.trigger('migration.completed');
            }        
        },
        
        migrator: function (config) {
            config = config || {};
            this.center = new Crafty.math.Vector2D(this._x + this._w / 2, this._y + this._h / 2);
            this.destination = this.center;
            this.speed = config.speed || this.speed;
            return this;
        },
            
        migrate: function (vector) {
            this.destination = new Crafty.math.Vector2D(vector);
            this.unbind('EnterFrame', this.migratorOnEnterFrame)
            this.bind('EnterFrame', this.migratorOnEnterFrame);
            return this;
        },
        
        migrateToNearest: function (selector, condition) {
            var distance, i, origin, t, target, vector;
            condition = condition || function () { return true; };
            target = Crafty(selector);
            if (target.length) {
                origin = new Crafty.math.Vector2D(this._x, this._y);
                distance = Infinity;
                for (i = 0; i < target.length; i += 1) {
                    t = Crafty(target[i]);
                    vector = new Crafty.math.Vector2D(t._x + t._w / 2, t._y + t._h / 2);
                    if (condition(t) && vector.distance(this.center) < distance) {
                        distance = vector.distance(this.center);
                        this.target = t;
                        this.migrate(vector);
                    }
                }
            }
        }
    });
}());