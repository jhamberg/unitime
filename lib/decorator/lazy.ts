export default function lazy(target: Object, propertyKey: PropertyKey | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    const { configurable, enumerable, get: getter } = descriptor;

    if (!getter) {
        throw new Error("Target of @lazy must be a getter!");
    }

    if (!configurable) {
        throw new Error("Target of @lazy must be configurable!"); 
    }

    descriptor.get = function() {
        const value = getter.call(this);

        const newDescriptor: PropertyDescriptor = {
            configurable,
            enumerable,
            value
        }

        if (Object.getPrototypeOf(target) === Function.prototype) {
            Object.defineProperty(target, propertyKey, newDescriptor)
        } else {
            Object.defineProperty(this, propertyKey, newDescriptor);
        }

        return value;
    }

    return descriptor;
}