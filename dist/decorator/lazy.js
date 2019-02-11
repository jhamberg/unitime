"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function lazy(target, propertyKey, descriptor) {
    var configurable = descriptor.configurable, enumerable = descriptor.enumerable, getter = descriptor.get;
    if (!getter) {
        throw new Error("Target of @lazy must be a getter!");
    }
    if (!configurable) {
        throw new Error("Target of @lazy must be configurable!");
    }
    descriptor.get = function () {
        var value = getter.call(this);
        var newDescriptor = {
            configurable: configurable,
            enumerable: enumerable,
            value: value
        };
        if (Object.getPrototypeOf(target) === Function.prototype) {
            Object.defineProperty(target, propertyKey, newDescriptor);
        }
        else {
            Object.defineProperty(this, propertyKey, newDescriptor);
        }
        return value;
    };
    return descriptor;
}
exports.default = lazy;
