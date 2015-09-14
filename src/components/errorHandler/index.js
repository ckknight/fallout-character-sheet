import { Rx } from '@cycle/core';
import render from './render';

export default function errorHandler(name) {
    return function onError(error) {
        return Rx.Observable.return(render(name, error));
    };
}
