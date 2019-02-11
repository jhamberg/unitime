"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var lazy_1 = __importDefault(require("./decorator/lazy"));
/**
 * @name Unitime
 * @summary Utility for handling time units in a concise, human-readable manner
 *
 * This library provides utility methods for converting between different units
 * of time with a human-readable syntax. The idea is reducing the mental load
 * caused by complex time declarations like `24*60*60*1000` or `86400000` which
 * both describe the number of milliseconds in a day. Using this library, the
 * unit above can be simply described as:
 *
 *      d`1`.millis() or d`1` depending on the initialization.
 *
 * The shorter form requires that the library is initialized with the targeted
 * time unit, which in this case would be "ms". Depending on the execution
 * environment, the initialization might look something like this:
 *
 *      const { d, h } = require("Unitime").to("ms");
 *      console.log(d`1`);  // 86400000
 *      console.log(h`12`); // 43200000
 *
 * Both the instanced and static methods can be directly destructured from the
 * library class. Instanced methods return the result right away while static
 * methods provide different options for converting to other time units:
 *
 *      const { d, h } = require("Unitime");
 *      console.log(d`1`.minutes()); // 1440
 *      console.log(h`12`.days());   // 0.5
 *
 * Numeric overflows should never occur unless working with e.g. converting
 * 2e+295 days to nanoseconds. In any case, the library addresses the faint
 * possibility by saturating to either Number.MAX_VALUE or Number.MIN_VALUE
 * depending on the sign. Similarly, when converting from fine to coarser
 * granularity, the results might be truncated.
 *
 * This work was inspired by Doug Lea's public domain TimeUnit class for Java.
 * However, the implementations are drastically different with no future plans
 * for added compatibility. This version does not provide direct utilities
 * related to threading nor implementations of the ChronoUnit standard.
 *
 * @author Jonatan Hamberg <jonatan.hamberg@cs.helsinki.fi>
 */
var Unit;
(function (Unit) {
    Unit[Unit["NANO"] = 1] = "NANO";
    Unit[Unit["MICRO"] = 1000] = "MICRO";
    Unit[Unit["MILLI"] = 1000000] = "MILLI";
    Unit[Unit["SECOND"] = 1000000000] = "SECOND";
    Unit[Unit["MINUTE"] = 60000000000] = "MINUTE";
    Unit[Unit["HOUR"] = 3600000000000] = "HOUR";
    Unit[Unit["DAY"] = 86400000000000] = "DAY";
})(Unit || (Unit = {}));
var Scale = /** @class */ (function () {
    function Scale(scale) {
        this.scale = scale;
        this.maxNanos = Number.MAX_VALUE / scale;
        this.microRatio = (scale >= Unit.MICRO)
            ? (scale / Unit.MICRO)
            : (Unit.MICRO / scale);
        this.maxMicros = Number.MAX_VALUE / this.microRatio;
        this.milliRatio = (scale >= Unit.MILLI)
            ? (scale / Unit.MILLI)
            : (Unit.MILLI / scale);
        this.maxMillis = Number.MAX_VALUE / this.milliRatio;
        this.secRatio = (scale >= Unit.SECOND)
            ? (scale / Unit.SECOND)
            : (Unit.SECOND / scale);
        this.maxSecs = Number.MAX_VALUE / this.secRatio;
    }
    Object.defineProperty(Scale, "nanoseconds", {
        get: function () {
            return new Scale(Unit.NANO);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scale, "microseconds", {
        get: function () {
            return new Scale(Unit.MICRO);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scale, "milliseconds", {
        get: function () {
            return new Scale(Unit.MILLI);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scale, "seconds", {
        get: function () {
            return new Scale(Unit.SECOND);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scale, "minutes", {
        get: function () {
            return new Scale(Unit.MINUTE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scale, "hours", {
        get: function () {
            return new Scale(Unit.HOUR);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scale, "days", {
        get: function () {
            return new Scale(Unit.DAY);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        lazy_1.default
    ], Scale, "nanoseconds", null);
    __decorate([
        lazy_1.default
    ], Scale, "microseconds", null);
    __decorate([
        lazy_1.default
    ], Scale, "milliseconds", null);
    __decorate([
        lazy_1.default
    ], Scale, "seconds", null);
    __decorate([
        lazy_1.default
    ], Scale, "minutes", null);
    __decorate([
        lazy_1.default
    ], Scale, "hours", null);
    __decorate([
        lazy_1.default
    ], Scale, "days", null);
    return Scale;
}());
var Convert;
(function (Convert) {
    function converter(unit) {
        switch (unit) {
            case "ns": return toNanos;
            case "us": return toMicros;
            case "ms": return toMillis;
            case "s": return toSeconds;
            case "min": return toMinutes;
            case "h": return toHours;
            case "d": return toDays;
            default: {
                throw new Error("Unknown time unit " + unit);
            }
        }
    }
    Convert.converter = converter;
    function converters(source, duration) {
        return {
            nanos: toNanos.bind(null, source, duration),
            micros: toMicros.bind(null, source, duration),
            millis: toMillis.bind(null, source, duration),
            seconds: toSeconds.bind(null, source, duration),
            minutes: toMinutes.bind(null, source, duration),
            hours: toHours.bind(null, source, duration),
            days: toDays.bind(null, source, duration)
        };
    }
    Convert.converters = converters;
    function toUnit(source, destination, dura) {
        if (source.scale === destination.scale) {
            return dura;
        }
        else if (source.scale < destination.scale) {
            return dura / (destination.scale / source.scale);
        }
        else if (dura > Number.MAX_VALUE / (source.scale / destination.scale)) {
            return Number.MAX_VALUE;
        }
        else if (dura < -(Number.MAX_VALUE / (source.scale / destination.scale))) {
            return Number.MIN_VALUE;
        }
        else {
            return dura * (source.scale / destination.scale);
        }
    }
    function toNanos(source, duration) {
        if (source.scale === Unit.NANO) {
            return duration;
        }
        else if (duration > source.maxNanos) {
            return Number.MAX_VALUE;
        }
        else if (duration < -source.maxNanos) {
            return Number.MIN_VALUE;
        }
        else {
            return duration * source.scale;
        }
    }
    function toMicros(source, duration) {
        if (source.scale === Unit.MICRO) {
            return duration;
        }
        else if (source.scale < Unit.MICRO) {
            return duration / source.microRatio;
        }
        else if (duration > source.maxMicros) {
            return Number.MAX_VALUE;
        }
        else if (duration < -source.maxMicros) {
            return Number.MIN_VALUE;
        }
        else {
            return duration * source.microRatio;
        }
    }
    function toMillis(source, duration) {
        if (source.scale === Unit.MILLI) {
            return duration;
        }
        else if (source.scale < Unit.MILLI) {
            return duration / source.milliRatio;
        }
        else if (duration > source.maxMillis) {
            return Number.MAX_VALUE;
        }
        else if (duration < -source.maxMillis) {
            return Number.MIN_VALUE;
        }
        else {
            return duration * source.milliRatio;
        }
    }
    function toSeconds(source, duration) {
        if (source.scale === Unit.SECOND) {
            return duration;
        }
        else if (source.scale < Unit.SECOND) {
            return duration / source.secRatio;
        }
        else if (duration > source.maxSecs) {
            return Number.MAX_VALUE;
        }
        else if (duration < -source.maxSecs) {
            return Number.MIN_VALUE;
        }
        else {
            return duration * source.secRatio;
        }
    }
    function toMinutes(source, duration) {
        return toUnit(source, Scale.minutes, duration);
    }
    function toHours(source, duration) {
        return toUnit(source, Scale.hours, duration);
    }
    function toDays(source, duration) {
        return toUnit(source, Scale.days, duration);
    }
})(Convert || (Convert = {}));
var Util;
(function (Util) {
    function asNumber(input) {
        if (input === void 0) { input = "keke"; }
        // Null and empty values evaluate to zero, omit this behavior
        if (input === null || isNaN(input) || isEmptyString(input)) {
            throw new Error("Failed to interpret \"" + input + "\" as a number!");
        }
        return Number(input);
    }
    Util.asNumber = asNumber;
    function isEmptyString(input) {
        return typeof input == "string" && !(input && input.trim());
    }
})(Util || (Util = {}));
var Unitime = /** @class */ (function () {
    function Unitime(transformer) {
        var _this = this;
        this.ns = function (input) {
            var source = Scale.nanoseconds;
            var duration = Util.asNumber(input);
            return _this.converter(source, duration);
        };
        this.us = function (input) {
            var source = Scale.microseconds;
            var duration = Util.asNumber(input);
            return _this.converter(source, duration);
        };
        this.ms = function (input) {
            var source = Scale.milliseconds;
            var duration = Util.asNumber(input);
            return _this.converter(source, duration);
        };
        this.s = function (input) {
            var source = Scale.seconds;
            var duration = Util.asNumber(input);
            return _this.converter(source, duration);
        };
        this.min = function (input) {
            var source = Scale.minutes;
            var duration = Util.asNumber(input);
            return _this.converter(source, duration);
        };
        this.h = function (input) {
            var source = Scale.hours;
            var duration = Util.asNumber(input);
            return _this.converter(source, duration);
        };
        this.d = function (input) {
            var source = Scale.days;
            var duration = Util.asNumber(input);
            return _this.converter(source, duration);
        };
        this.converter = transformer;
    }
    Unitime.ns = function (input) {
        var source = Scale.nanoseconds;
        var duration = Util.asNumber(input);
        return Convert.converters(source, duration);
    };
    ;
    Unitime.us = function (input) {
        var source = Scale.microseconds;
        var duration = Util.asNumber(input);
        return Convert.converters(source, duration);
    };
    ;
    Unitime.ms = function (input) {
        var source = Scale.milliseconds;
        var duration = Util.asNumber(input);
        return Convert.converters(source, duration);
    };
    ;
    Unitime.s = function (input) {
        var source = Scale.seconds;
        var duration = Util.asNumber(input);
        return Convert.converters(source, duration);
    };
    ;
    Unitime.min = function (input) {
        var source = Scale.minutes;
        var duration = Util.asNumber(input);
        return Convert.converters(source, duration);
    };
    ;
    Unitime.h = function (input) {
        var source = Scale.hours;
        var duration = Util.asNumber(input);
        return Convert.converters(source, duration);
    };
    ;
    Unitime.d = function (input) {
        var source = Scale.days;
        var duration = Util.asNumber(input);
        return Convert.converters(source, duration);
    };
    ;
    Unitime.to = function (unit) {
        var transformer = Convert.converter(unit);
        return new Unitime(transformer);
    };
    return Unitime;
}());
module.exports = Unitime;
