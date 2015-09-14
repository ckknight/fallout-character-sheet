import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import algorithm from '../algorithm';
import renderRef from './renderRef';
import errorHandler from '../errorHandler';
import { replace as equationReplace } from '../../models/Equation';

function renderEffectEquation(key, equation, calculations) {
    return algorithm({
        equation$: Rx.Observable.return(equationReplace(equation, 'value', key)),
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
        .catch(errorHandler('effect'));
}
