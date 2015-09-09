export default function (fn) {
    if (typeof fn !== 'function') {
        throw new TypeError(`Expected ${fn} to be a function`);
    }
    let cache;
    return function () {
        if (fn) {
            cache = fn.apply(this, arguments);
            fn = null;
        }
        return cache;
    };
}
