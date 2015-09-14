import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import characterSheet from './components/characterSheet';
import { makeLocalStorageSinkDriver, makeLocalStorageSourceDriver } from './drivers';

require('normalize.css');

run(characterSheet, {
    DOM: makeDOMDriver('.character-sheet'),
    localStorageSink: makeLocalStorageSinkDriver('sheet'),
    localStorageSource: makeLocalStorageSourceDriver('sheet'),
});
