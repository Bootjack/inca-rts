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
            this.requires('Delay');
            this.waypoints = [];
            this.active = false;
            this.proximity = 1;
            this.onTarget = false;
            this.heading = 0;
            this.position = new Box2D.Common.Math.b2Vec2(0, 0);
            this.bearing = new Box2D.Common.Math.b2Vec2(0, 0);
            this.course = new Box2D.Common.Math.b2Vec2(0, 0);;
            this.correction = new Box2D.Common.Math.b2Vec2(0, 0);;
            return this;
        },

        guidance: function (config) {
            if (!config || !config.guided || !config.guided.has('Box2D')) {
                throw new Error("Crafty.c('Guide') must be given a reference to a Box2D entity as its guided.");
            }
            this.guided = config.guided;
            if (config.steer) {
                this.steer = function (throttle) {
                    config.steer.apply(config.guided, [throttle]);
                }
            };
            if (config.thrust) {
                this.thrust = function (throttle) {
                    config.thrust.apply(config.guided, [throttle]);
                }
            };
            this.bind('EnterFrame', this.guide);
            return this;
        },

        waypoint: function (waypoint) {
            this.waypoints.push(waypoint);
            return this;
        },

        activate: function () {
            this.active = true;
            return this;
        },

        deactivate: function () {
            this.active = false;
            this.steer(0);
            this.thrust(0);
            return this;
        },

        guide: function () {
            var direction, momentDirection, steerThrottle, thrustThrottle, steerVariance, throttleVariance;
            this.position = this.guided.body.GetWorldCenter();
            this.course = this.guided.body.GetLinearVelocity();
            this.course = this.guided.body.GetLocalVector(this.course);
            if (this.waypoints.length) {
                this.bearing = this.waypoints[0].Copy();
                this.bearing.Subtract(this.guided.body.GetWorldCenter());
                this.bearing = this.guided.body.GetLocalVector(this.bearing);
                this.correction = this.bearing.Copy();
                this.correction.Subtract(this.course);
            }

            if (this.bearing.Length() > 1) {
                this.onTarget = false;
            }

            if (this.active && !this.onTarget) {

                steerVariance = Math.atan2(this.correction.y, this.correction.x);
                throttleVariance = Math.atan2(this.bearing.y, this.bearing.x);

                //steerThrottle = Math.atan2(this.correction.y, this.correction.x) % (2 * Math.PI) / Math.PI;

                steerThrottle = Math.sin(steerVariance);
                direction = throttleVariance > 0 ? 1 : -1;
                momentDirection = this.guided.body.GetAngularVelocity() > 0 ? 1 : -1;

                if (throttleVariance > 0.5 * Math.PI) {
                    steerThrottle = direction;
                }
                if (momentDirection !== direction) {
                    //steerThrottle = Math.min(2, Math.pow(Math.abs(momentDirection - direction), 2)) * steerThrottle;
                    //this.guided.body.angularDamping = -1 * this.guided.body.GetAngularVelocity();
                    this.guided.body.SetAngularVelocity(this.guided.body.GetAngularVelocity() * 0.25);
                }

                if (this.bearing.Length() < this.proximity) {
                    this.onTarget = true;
                    thrustThrottle = 0;
                } else if (this.bearing.Length() < this.proximity * 2) {
                    thrustThrottle = (this.bearing.Length() - this.proximity) / this.proximity;
                } else {
                    thrustThrottle = 1;
                }
                if (throttleVariance < 0.5 * Math.PI) {
                    thrustThrottle *= Math.cos(steerVariance);
                } else {
                    thrustThrottle = 0;
                }

                if (this.onTarget) {
                    steerThrottle = 0;
                }

                if (this.steer) {
                    this.steer(steerThrottle);
                }
                if (this.thrust) {
                    this.thrust(thrustThrottle);
                }
            }

            return this;
        }
    })
});