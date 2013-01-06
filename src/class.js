!function () {

    var BackboneEvents;

    if (typeof require !== "undefined") {
        BackboneEvents = require("../jam/backbone-events/backbone-events");
    } else if (typeof window.BackboneEvents !== "undefined") {
        BackboneEvents = window.BackboneEvents;
    } else {
        throw new Error("backbone-events needs to be installed");
    }

    function guid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
            function (c) {
                var r = Math.random()*16|0
                  , v = (c == "x") ? r : (r&0x3|0x8);
                return v.toString(16);
            }).toUpperCase();
    }

    function extend(target, src) {
        for (var propName in src) {
            if (src.hasOwnProperty(propName)) {
                target[propName] = src[propName];
            }
        }
        return target;
    }

    function ctor() {}

    function Class( parent ) {
        function klass() {
            this.cid = guid();
            this.init.apply(this, arguments);
        }

        if ( parent ) {
            ctor.prototype              = parent.prototype;
            klass.prototype             = new ctor;
            klass.prototype.constructor = klass;
            klass._super                = parent.prototype;
        }

        klass.prototype.init = function () {};

        // Shortcuts
        klass.fn        = klass.prototype;
        klass.fn.parent = klass;

        klass.extend = function (obj) {
            var included = obj.included;
            for (var prop in obj) {
                klass[prop] = obj[prop];
            }
            if (included) included(klass);
        };

        klass.include = function (obj) {
            var extended = obj.extended;
            for (var prop in obj) {
                klass.fn[prop] = obj[prop];
            }
            if (extended) extended(klass);
        };

        klass.create = function (protoProps, staticProps) {
            var Klass = new Class(klass);
            if (protoProps)  Klass.include(protoProps);
            if (staticProps) Klass.extend(staticProps);
            return Klass;
        };

        klass.proxy = function (func) {
            var self = this;
            return function() {
                return func.apply(self, arguments);
            };
        };

        // Prototype Properties and Methods
        klass.fn.proxy = klass.proxy;

        extend(klass.fn, BackboneEvents);
        extend(klass.fn, {
            has: function (key) {
                return (typeof this[key] !== "undefined");
            },

            get: function (input) {
                return this.has(input) ? this[input] : null;
            },

            set: function (objOrKey, value, silent) {
                if (typeof objOrKey === "object") {
                    for (var key in objOrKey) {
                        this._setAttribute(key, objOrKey[key]);
                    }
                } else {
                    this._setAttribute(objOrKey, value, silent || false);
                }

                return this;
            },

            _setAttribute: function(key, value, silent) {
                silent || (silent = false);

                var itemExists = this.has(key);
                var oldValue   = this[key];

                if (value === oldValue) return;

                this[key] = value;

                if (silent) return;

                this.trigger("change", key);
                this.trigger("change:" + key, value);

                var mutateData = {
                    "key"      : key,
                    "newValue" : value,
                    "oldValue" : oldValue || null
                };

                this.trigger("mutate", mutateData);
                this.trigger("mutate:" + key, mutateData);

                var specificEvent = itemExists ? "update" : "create";

                this.trigger(specificEvent, key);
                this.trigger(specificEvent + ":" + key, value);
            }
        });

        return klass;
    }


    if (typeof exports != "undefined") {
        if (typeof module != "undefined" && module.exports) {
            module.exports = Class;
        }
        exports.Class = Class;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return Class;
        });
    } else {
        window.Class = Class;
    }
}();