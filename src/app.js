import { run, Rx } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import main from './components/main';
import { makeLocalStorageSinkDriver, makeLocalStorageSourceDriver } from './drivers';
import './base.scss';

run(main, {
    DOM: makeDOMDriver('.app'),
    localStorageSink: makeLocalStorageSinkDriver('sheet'),
    localStorageSource: makeLocalStorageSourceDriver('sheet'),
    initialHash: () => Rx.Observable.just(window.location.hash),
    hashchange: () => Rx.Observable.fromEvent(window, 'hashchange'),
});
