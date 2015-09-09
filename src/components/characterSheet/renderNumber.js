import { h } from '@cycle/dom';

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

function getClassString(value) {
    return '.number.number-' + getNumberClasses(value).join('.number-');
}

function renderNumber(value, type, props = {}) {
    return h(`span.number-${type}${getClassString(value)}`, props, ['' + value]);
}
renderNumber.getClassString = getClassString;
export default renderNumber;
