import { h } from '@cycle/dom';

function logError(error) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
        if (error && error.stack) {
            console.error(error.stack);
        } else {
            console.error(error);
        }
    }
    /* eslint-enable no-console */
}

export default function render(name, error) {
    logError(error);
    return h('span.error', [`Error with ${name}: ${error}`]);
}
