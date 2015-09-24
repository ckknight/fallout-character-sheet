import { Rx } from '@cycle/core';
import renderNumber from './render';

export default function calculateNumber(number) {
    return {
        DOM: Rx.Observable.return(renderNumber(number)),
        value$: Rx.Observable.return(number),
        equation$: Rx.Observable.return(number),
        calculate() {
            return Rx.Observable.return(number);
        },
    };
}
