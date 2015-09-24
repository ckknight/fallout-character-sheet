function memoize(fetcher) {
    const cacheKey = Math.random().toString(36).slice(2);
    return function memoized() {
        let cache = this[cacheKey];
        if (!cache) {
            Object.defineProperty(this, cacheKey, {
                value: (cache = {}),
            });
        }
        const argsKey = Array.prototype.join.call(arguments, ';');
        return cache[argsKey] || (cache[argsKey] = fetcher.apply(this, arguments));
    };
}

export default function withLookup(Record, fetchers) {
    class SubRecord extends Record {
    }
    Object.entries(fetchers).forEach(([key, value]) => {
        Object.defineProperty(SubRecord, key, {
            value: memoize(value),
            enumerable: true,
        });
    });
    return SubRecord;
}
