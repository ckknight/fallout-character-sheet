import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import view from './view';
import intent from './intent';
import model from './model';
import CustomDrivers from './drivers';

function main({DOM, localStorageSource}) {
    const intents = intent(DOM);

    const state = model(intents, localStorageSource);

    const vtree$ = view(state);

    /*
    DOM.select('.name')
        .events('keyup')
        .pluck('target')
        .pluck('value')
        .startWith('')
        .distinctUntilChanged()
        .map(value => (
        <div>
            <label>Name: <input type="text" className="name" value={'' + value} /></label>
            {'' + value}
        </div>
    ))s
    */

    return {
        DOM: vtree$,
        localStorageSink: state.serialize$()
    };
}

run(main, {
    DOM: makeDOMDriver('.character-sheet'),
    localStorageSource: CustomDrivers.makeLocalStorageSourceDriver('sheet'),
    localStorageSink: CustomDrivers.makeLocalStorageSinkDriver('sheet')
});
