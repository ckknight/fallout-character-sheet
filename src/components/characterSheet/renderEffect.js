import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import algorithm from './algorithm';
import renderRef from './renderRef';
import renderError from './renderError';

function renderEffectEquation(key, equation, calculations) {
    return algorithm({
        equation$: Rx.Observable.return(equation),
        calculations,
    }).DOM;
}

export default function renderEffect(effect, calculations) {
    const calculationsWithValue = calculations.with({
        value: Rx.Observable.return('value'),
    });
    return Rx.Observable.combineLatest(effect.toKeyedSeq()
        .filter((value, key) => {
            if (key.charAt(0) === '$') {
                return value;
            }
            return value !== 'value';
        })
        .filter((value, key) => {
            return key.charAt(0) !== '$';
        })
        .map((value, key) => renderEffectEquation(key, value, calculationsWithValue)
                .map(renderedEffect => h(`span.effect-part.effect-part-${key}`, [
                        renderRef(key),
                        ': ',
                        renderedEffect,
                    ])))
        .toArray())
        .startWith([])
        .map(vTrees => h('span.effect', vTrees))
        .catch(renderError.handler('effect'));
}
