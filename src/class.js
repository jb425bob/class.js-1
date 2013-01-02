!function () {

    function ctor() {}

    function Class( parent ) {
        function klass() {
            this.init.apply(this, arguments);
        }

        if ( parent ) {
            ctor.prototype              = parent;
            klass.prototype             = new ctor;
            klass.prototype.constructor = klass;
            klass._super                = parent.prototype;
        }

        klass.prototype.init = function () {};

        // Shortcuts
        klass.fn        = klass.prototype;
        klass.fn.parent = klass;

        klass.include = function (obj) {
            var included = obj.included;
            for (var prop in obj) {
                klass[prop] = obj[prop];
            }
            if (included) included(klass);
        };

        klass.extend = function (obj) {
            var extended = obj.extended;
            for (var prop in obj) {
                klass.fn[prop] = obj[prop];
            }
            if (extended) extended(klass);
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