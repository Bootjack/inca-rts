/* Guidance provides the logic for setting one or more waypoints and calculating the acceleration
 * required to move from the current position and come to a stop at the destination. Guidance may
 * be passed functions to directly control heading, throttle, or both. These will be defined on the
 * containing "machine" object, but will follow a convention of accepting a scalar in N/s or angle
 * in radians for throttle or steering, respectively.
 *
 * TODO Multiple waypoints handled with efficient coast-through course correction instead of hard stops at each */

var Crafty, require;

require([], function () {
    'use strict';

    Crafty.c('Guidance', {
        init: function() {
            this.waypoints = [];
            return this;
        },

        guidance: function (config) {
            if (!config || !config.guided || !config.guided.has('Box2D')) {
                throw new Error("Crafty.c('Guide') must be given a reference to a Box2D entity as its guided.");
            }
            this.guided = config.guided;
            this.bind('EnterFrame', this.guide);
            return this;
        },

        waypoint: function (waypoint) {
            this.waypoints.push(waypoint);
        },

        guide: function () {
            var bearing, correction, course, heading, position, vector;
            bearing = 0;
            heading = this.guided.body.GetAngle();
            position = this.guided.body.GetWorldCenter();
            course = this.guided.body.GetLinearVelocity();
            course = Math.atan2(course.y, course.x);
            if (this.waypoints.length) {
                vector = this.waypoints[0].Copy();
                vector.Subtract(this.guided.body.GetWorldCenter());
                vector = this.guided.body.GetLocalVector(vector);
                bearing = Math.atan2(vector.y, vector.x);
            }
            $('#spine-out').html(
                '<p>bearing: ' + (bearing / Math.PI).toFixed(5) + ' pi radians</p>' +
                '<p>course: ' + ((course % (2 * Math.PI)) / Math.PI).toFixed(5) + ' pi radians</p>' +
                '<p>speed: ' + position.x.toFixed(3) + 'm, ' + position.y.toFixed(3) + 'm</p>'
            );
            return this;
        }
    })
});