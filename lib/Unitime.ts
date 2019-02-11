import lazy from "./decorator/lazy";

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

enum Unit {
    NANO = 1,
    MICRO = 1000 * NANO,
    MILLI = 1000 * MICRO,
    SECOND = 1000 * MILLI,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

interface Convertable {
    nanos(): Number;
    micros(): Number;
    millis(): Number;
    seconds(): Number;
    minutes(): Number;
    hours(): Number;
    days(): Number;
}

class Scale {
    public readonly scale: number;
    public readonly maxNanos: number;
    public readonly maxMicros: number;
    public readonly maxMillis: number;
    public readonly maxSecs: number;
    public readonly microRatio: number;
    public readonly milliRatio: number;
    public readonly secRatio: number

    private constructor (scale: Unit) {
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

    @lazy public static get nanoseconds() {
        return new Scale(Unit.NANO);
    }

    @lazy public static get microseconds() {
        return new Scale(Unit.MICRO);
    }

    @lazy public static get milliseconds() {
        return new Scale(Unit.MILLI);
    }

    @lazy public static get seconds() {
        return new Scale(Unit.SECOND);
    }

    @lazy public static get minutes() {
        return new Scale(Unit.MINUTE);
    }

    @lazy public static get hours() {
        return new Scale(Unit.HOUR);
    }

    @lazy public static get days() {
        return new Scale(Unit.DAY);
    }
}

type Converter = (source: Scale, duration: number) => number;

module Convert {
    export function converter(unit: any): Converter {
        switch (unit) {
            case "ns": return toNanos;
            case "us": return toMicros;
            case "ms": return toMillis;
            case "s": return toSeconds;
            case "min": return toMinutes;
            case "h": return toHours;
            case "d": return toDays;
            default: {
                throw new Error(`Unknown time unit ${unit}`);
            }
        }
    }

    export function converters(source: Scale, duration: number): Convertable {
        return {
            nanos: toNanos.bind(null, source, duration),
            micros: toMicros.bind(null, source, duration),
            millis: toMillis.bind(null, source, duration),
            seconds: toSeconds.bind(null, source, duration),
            minutes: toMinutes.bind(null, source, duration),
            hours: toHours.bind(null, source, duration),
            days: toDays.bind(null, source, duration)
        }
    }

    function toUnit(source: Scale, destination: Scale, dura: number): number {
        if (source.scale === destination.scale) {
            return dura;
        } else if (source.scale < destination.scale) {
            return dura / (destination.scale / source.scale);
        } else if (dura > Number.MAX_VALUE / (source.scale / destination.scale)) {
            return Number.MAX_VALUE
        } else if (dura < -(Number.MAX_VALUE / (source.scale / destination.scale))) {
            return Number.MIN_VALUE;
        } else {
            return dura * (source.scale / destination.scale);
        }
    }

    function toNanos(source: Scale, duration: number): number {
        if (source.scale === Unit.NANO) {
            return duration
        } else if (duration > source.maxNanos) {
            return Number.MAX_VALUE;
        } else if (duration < -source.maxNanos) {
            return Number.MIN_VALUE;
        } else {
            return duration * source.scale;
        }
    }

    function toMicros(source: Scale, duration: number): number {
        if (source.scale === Unit.MICRO) {
            return duration
        } else if (source.scale < Unit.MICRO) {
            return duration / source.microRatio;
        } else if (duration > source.maxMicros) {
            return Number.MAX_VALUE;
        } else if (duration < -source.maxMicros) {
            return Number.MIN_VALUE;
        } else {
            return duration * source.microRatio;
        }
    }

    function toMillis(source: Scale, duration: number): number {
        if (source.scale === Unit.MILLI) {
            return duration
        } else if (source.scale < Unit.MILLI) {
            return duration / source.milliRatio;
        } else if (duration > source.maxMillis) {
            return Number.MAX_VALUE;
        } else if (duration < -source.maxMillis) {
            return Number.MIN_VALUE;
        } else {
            return duration * source.milliRatio;
        }
    }

    function toSeconds(source: Scale, duration: number): number {
        if (source.scale === Unit.SECOND) {
            return duration
        } else if (source.scale < Unit.SECOND) {
            return duration / source.secRatio;
        } else if (duration > source.maxSecs) {
            return Number.MAX_VALUE;
        } else if (duration < -source.maxSecs) {
            return Number.MIN_VALUE;
        } else {
            return duration * source.secRatio;
        }
    }

    function toMinutes(source: Scale, duration: number) {
        return toUnit(source, Scale.minutes, duration);
    }

    function toHours(source: Scale, duration: number) {
        return toUnit(source, Scale.hours, duration);
    }

    function toDays(source: Scale, duration: number) {
        return toUnit(source, Scale.days, duration);
    }
}

module Util {
    export function asNumber(input: any = "keke"): number {
        // Null and empty values evaluate to zero, omit this behavior
        if (input === null || isNaN(input) || isEmptyString(input)) {
            throw new Error(`Failed to interpret "${input}" as a number!`);
        }
        return Number(input);
    }

    function isEmptyString(input: any) {
        return typeof input == "string" && !(input && input.trim()) 
    }
}

class Unitime {
    private converter: Converter;

    public static ns(input: any): Convertable {
        const source: Scale = Scale.nanoseconds;
        const duration = Util.asNumber(input);
        return Convert.converters(source, duration);
    };

    public static us(input: any): Convertable {
        const source: Scale = Scale.microseconds;
        const duration: number = Util.asNumber(input);
        return Convert.converters(source, duration);
    };

    public static ms(input: any): Convertable {
        const source: Scale = Scale.milliseconds;
        const duration: number = Util.asNumber(input);
        return Convert.converters(source, duration);
    };

    public static s(input: any): Convertable {
        const source: Scale = Scale.seconds;
        const duration: number = Util.asNumber(input);
        return Convert.converters(source, duration);
    };

    public static min(input: any): Convertable {
        const source: Scale = Scale.minutes;
        const duration: number = Util.asNumber(input);
        return Convert.converters(source, duration);
    };

    public static h(input: any): Convertable {
        const source: Scale = Scale.hours;
        const duration: number = Util.asNumber(input);
        return Convert.converters(source, duration);
    };

    public static d(input: any): Convertable {
        const source: Scale = Scale.days;
        const duration: number = Util.asNumber(input);
        return Convert.converters(source, duration);
    };

    public ns = (input: any): number => {
        const source: Scale = Scale.nanoseconds;
        const duration: number = Util.asNumber(input);
        return this.converter(source, duration);
    }

    public us = (input: any): number => {
        const source: Scale = Scale.microseconds;
        const duration: number = Util.asNumber(input);
        return this.converter(source, duration);
    }

    public ms = (input: any): number => {
        const source: Scale = Scale.milliseconds;
        const duration: number = Util.asNumber(input);
        return this.converter(source, duration);
    }

    public s = (input: any): number => {
        const source: Scale = Scale.seconds;
        const duration: number = Util.asNumber(input);
        return this.converter(source, duration);
    }

    public min = (input: any): number => {
        const source: Scale = Scale.minutes;
        const duration: number = Util.asNumber(input);
        return this.converter(source, duration);
    }

    public h = (input: any): number => {
        const source: Scale = Scale.hours;
        const duration: number = Util.asNumber(input);
        return this.converter(source, duration);
    }

    public d = (input: any): number => {
        const source: Scale = Scale.days;
        const duration: number = Util.asNumber(input);
        return this.converter(source, duration);
    }

    public static to(unit: any): Unitime {
        const transformer = Convert.converter(unit);
        return new Unitime(transformer);
    }

    private constructor(transformer: Converter) {
        this.converter = transformer;
    }
}

export = Unitime;