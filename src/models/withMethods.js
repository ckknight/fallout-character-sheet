export default function withMethods(Record, methods) {
    class SubRecord extends Record {
    }
    const prototype = SubRecord.prototype;
    Object.keys(methods)
        .forEach(key => {
            Object.defineProperty(prototype, key, Object.getOwnPropertyDescriptor(methods, key));
        });
    return SubRecord;
}
