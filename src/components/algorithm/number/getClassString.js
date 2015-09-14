function getNumberClasses(value) {
    if (value === 0) {
        return ['zero', 'nonpositive', 'nonnegative'];
    } else if (value === 1) {
        return ['one', 'positive', 'nonnegative'];
    } else if (value === 2) {
        return ['two', 'positive', 'nonnegative'];
    } else if (value > 0) {
        return ['positive', 'nonnegative'];
    } else if (value < 0) {
        return ['negative', 'nonpositive'];
    }
    return ['nan'];
}

export default function getClassString(value, type) {
    return '.number.number-' + getNumberClasses(value).join('.number-') + (type ? '.number-' + type : '');
}
