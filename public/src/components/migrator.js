Crafty.c('Migrator', {
    init: function () {
        var self = this;
        this.requires('2D');
        this.center = new Crafty.math.Vector2D(this._x + this._w / 2, this._y + this._h / 2);
        this.destination = this.center;
        this.speed = 1;
        this.bind('EnterFrame', function () {
            self.update();
        });
        return this;
    },
    
    update: function () {
        var direction = new Crafty.math.Vector2D(this.destination);
        this.center.x = this._x + this._w / 2;
        this.center.y = this._y + this._h / 2;
        if (this.center.distance(this.destination) > this._w / 2) {
            direction.subtract(this.center).normalize().scale(this.speed);
            this.attr({
                x: this._x + direction.x,
                y: this._y + direction.y
            });
        } else {
            this.trigger('migration.completed');
            this.destination = this.center;
            this.unbind('EnterFrame');
        }
        return this;
    },
    
    migrator: function (config) {
        config = config || {};
        this.speed = config.speed || this.speed;
        this.update();
        return this;
    },
        
    migrate: function (vector) {
        this.destination = new Crafty.math.Vector2D(vector);
        this.update();
        return this;
    },
    
    migrateToNearest: function (selector, condition) {
        var distance, i, t, target, vector;
        condition = condition || function () { return true; };
        target = Crafty(selector);
        if (target.length) {
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