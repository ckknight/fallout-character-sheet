const owns = Object.prototype.hasOwnProperty;
function emptyObjectToNull(obj) {
    for (const key in obj) {
        if (owns.call(obj, key)) {
            return obj;
        }
    }
    return null;
}

function coerceEmptyArray(array) {
    for (let i = array.length; --i >= 0;) {
        if (array[i]) {
            return array.slice(0, i + 1);
        }
    }
    return null;
}

export default function removeEmptyValues(obj) {
    if (Array.isArray(obj)) {
        return coerceEmptyArray(obj.map(removeEmptyValues));
    }
    if (obj && obj.constructor === Object) {
        return emptyObjectToNull(Object.keys(obj)
            .sort()
            .reduce((acc, key) => {
                const value = removeEmptyValues(obj[key]);
                if (value) {
                    acc[key] = value;
                }
                return acc;
            }, {}));
    }
    return obj || null;
}
