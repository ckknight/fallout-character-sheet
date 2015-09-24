export default function (callback) {
    if (typeof callback !== 'function') {
        throw new TypeError(`Expected ${callback} to be a function`);
    }
    let cache;
    let fn = callback;
    return function remembered() {
        if (fn) {
            cache = fn.apply(this, arguments);
            fn = null;
        }
        return cache;
    };
}
