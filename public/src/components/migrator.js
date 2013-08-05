var Crafty;

(function () {
    'use strict';
 
    /*  Migrator is an extremely simple wayfinder component. It enables an element to accept coordinates
     *  and animate toward those coordinates every frame. This does not take into account any collisions
     *  or physics, and thus does not reflect any pathfinding logic.
     *
     *  The convenience method migrateToNearest allows the entity logic to specify a Crafty selector and
     *  test function to set its target as the nearest entity matching the selector and passing the test. */
    
    Crafty.c('Migrator', {
        //  Initialization
        init: function () {
            this.requires('2D');
            this.center = new Crafty.math.Vector2D(this._x + this._w / 2, this._y + this._h / 2);
            this.destination = this.center;
            this.speed = 1;
            return this;
        },
        
        //  Configuration
        migrator: function (config) {
            config = config || {};
            this.center = new Crafty.math.Vector2D(this._x + this._w / 2, this._y + this._h / 2);
            this.destination = this.center;
            this.speed = config.speed || this.speed;
            return this;
        },
        
        //  Mindless animation toward the destination at a set speed, stopping on contact with destination point
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
        
        //  Migrate to the specified point
        migrate: function (vector) {
            //  The vector argument can be a Crafty Vector2D or any object {x: x, y: y}
            this.destination = new Crafty.math.Vector2D(vector);
            this.unbind('EnterFrame', this.migratorOnEnterFrame)
            this.bind('EnterFrame', this.migratorOnEnterFrame);
            return this;
        },
        
        //  Convenience method to filter the set of Crafty(selector) for the nearest entity passing the given test function
        migrateToNearest: function (selector, condition) {
            var distance, i, origin, t, target, vector;
            
            //  Default condition test simply returns true for anything
            condition = condition || function () { return true; };
            
            //  Find the entities matching selector, if any
            target = Crafty(selector);
            if (target.length) {
                origin = new Crafty.math.Vector2D(this._x, this._y);
                distance = Infinity;
                
                //  Iterate through the collection testing for the nearest that also passes the condition() test
                for (i = 0; i < target.length; i += 1) {
                    t = Crafty(target[i]);
                    vector = new Crafty.math.Vector2D(t._x + t._w / 2, t._y + t._h / 2);
                    if (condition(t) && vector.distance(this.center) < distance) {
                        distance = vector.distance(this.center);
                        
                        //  Set a reference to the current target for use by other entity logic
                        this.target = t;
                        
                        //  Go to there
                        this.migrate(vector);
                    }
                }
            }
        }
    });
}());