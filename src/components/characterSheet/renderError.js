import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';

function logError(error) {
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error(error);
    }
}

function renderError(name, error) {
    logError(error);
    return h('span.error', ['Error with ' + name + ': ' + error]);
}
renderError.handler = name => error => Rx.Observable.return(renderError(name, error));

export default renderError;
