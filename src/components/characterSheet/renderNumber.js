import { h } from '@cycle/dom';

function getNumberClasses(value, type) {
    if (value === 0) {
        return ['zero', 'nonpositive', 'nonnegative', type];
    } else if (value === 1) {
        return ['one', 'positive', 'nonnegative', type];
    } else if (value === 2) {
        return ['two', 'positive', 'nonnegative', type];
    } else if (value > 0) {
        return ['positive', 'nonnegative', type];
    } else if (value < 0) {
        return ['negative', 'nonpositive', type];
    }
    return ['nan', type];
}

export default function renderNumber(value, type, props = {}) {
    return h(`span.number.number-` + getNumberClasses(value, type).join('.number-'), props, ['' + value]);
}
