import { Rx } from '@cycle/core';
import renderBoolean from './render';

export default function calculateBoolean(value, type) {
    return {
        DOM: Rx.Observable.return(renderBoolean(value, type)),
        value$: Rx.Observable.return(value),
        equation$: Rx.Observable.return(value),
    };
}
