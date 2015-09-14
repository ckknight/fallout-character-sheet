import { Rx } from '@cycle/core';
import renderString from './render';

export default function calculateString(key, calculations) {
    return {
        DOM: calculations.get(key)
            .map(value => renderString(key, value)),
        value$: calculations.get(key),
        equation$: Rx.Observable.return(key),
    };
}
