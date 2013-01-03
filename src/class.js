!function () {

    function guid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
            function (c) {
                var r = Math.random()*16|0
                  , v = (c == "x") ? r : (r&0x3|0x8);
                return v.toString(16);
            }).toUpperCase();
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

        klass.fn.proxy = klass.proxy;

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