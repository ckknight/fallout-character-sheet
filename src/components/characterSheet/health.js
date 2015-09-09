import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import BodyPart from '../../models/BodyPart';
import algorithm from './algorithm';
import Immutable from 'immutable';
import renderRef from './renderRef';
import Calculations from './Calculations';
import renderLoading from './renderLoading';
import renderError from './renderError';
import renderNumber from './renderNumber';
import * as localize from '../../localize';
import toEquation from '../../models/Equation';
import renderEffect from './renderEffect';

function makeSubBodyPartView(subBodyPart, inputValue$, DOM, calculations) {
    const effectVTree$ = renderEffect(subBodyPart.crippleEffect, calculations);
    const crippleHealthView = algorithm({
        equation$: Rx.Observable.return(subBodyPart.crippleHealth),
        calculations,
    });
    const damageVTree$ = subBodyPart.damage !== 'value' ? algorithm({
        equation$: Rx.Observable.return(subBodyPart.damage),
        calculations: new Calculations({
            value: Rx.Observable.never(),
        }),
    }).DOM : Rx.Observable.return(null);
    return {
        DOM: damageVTree$.combineLatest(crippleHealthView.DOM, effectVTree$, crippleHealthView.value$.startWith(null),
            (damageVTree, crippleHealthVTree, effectVTree, crippleHealth) => {
                return h(`section.sub-body-part.sub-body-part-${subBodyPart.key}`, {
                    key: subBodyPart.key,
                }, [
                    h(`span.sub-body-part-title`, {
                        key: 'title',
                    }, [subBodyPart.name]),
                    damageVTree ? h(`span.sub-body-part-damage`, {
                        key: 'damage',
                    }, [damageVTree]) : null,
                    h(`span.sub-body-part-cripple-health`, {
                        key: 'crippleHealth',
                    }, [crippleHealthVTree, '=', crippleHealth]),
                    h(`span.sub-body-part-cripple-effect`, {
                        key: 'crippleEffect',
                    }, [effectVTree]),
                    h(`span.sub-body-part-target-penalty`, {
                        key: 'targetPenalty',
                    }, [renderNumber(-subBodyPart.targetPenalty)]),
                    subBodyPart.meta ? h(`span.sub-body-part-meta`, {
                        key: 'meta',
                    }, [subBodyPart.meta]) : null,
                ]);
            }),
    };
}

function makeSingleBodyPartView(key, bodyPart, inputValue$, DOM, calculations) {
    const subBodyPartViews = bodyPart.parts.valueSeq()
        .map(subPart => makeSubBodyPartView(subPart, inputValue$.map(x => x[subPart.key] || 0), DOM, calculations))
        .toArray();
    return {
        DOM: Rx.Observable.combineLatest(subBodyPartViews.map(o => o.DOM))
            .startWith([renderLoading(key)])
            .map(vTrees => h(`section.body-part.body-part-${key}`, {
                    key,
                }, [
                    h(`span.body-part-title`, {
                        key: 'title',
                    }, [localize.name(key)]),
                ].concat(vTrees)))
            .catch(renderError.handler(key)),
    };
}

function makeBodyPartView(bodyPart, inputValue$, DOM, calculations) {
    if (!bodyPart.multiple) {
        return makeSingleBodyPartView(bodyPart.key, bodyPart, inputValue$, DOM, calculations);
    }

    const parts = bodyPart.multiple.toArray()
        .map(key => makeSingleBodyPartView(key, bodyPart, inputValue$, DOM, calculations));

    return {
        DOM: Rx.Observable.combineLatest(parts.map(o => o.DOM))
            .startWith([renderLoading(bodyPart.key)])
            .map(vTrees => h(`section.body-part.body-part-${bodyPart.key}`, {
                    key: bodyPart.key,
                }, [
                    h(`span.body-part-title`, {
                        key: 'title',
                    }, [localize.plural(bodyPart.key)]),
                ].concat(vTrees)))
            .catch(renderError.handler(bodyPart.key)),
    };
}

export default function health({DOM, value$: inputValue$, calculations}) {
    const allBodyPartViews = BodyPart.all()
        .toArray()
        .map(bodyPart => makeBodyPartView(bodyPart, inputValue$.map(x => x[bodyPart.key] || {}), DOM, calculations));
    // const value$ = allBodyPartViews
    // const value$ = Rx.Observable.from(allTraitViews)
    //     .flatMap(({key, value$: traitValue$}) => traitValue$
    //             .map(value => o => value ? o.add(key) : o.remove(key)))
    //     .startWith(new Immutable.Set())
    //     .scan((acc, modifier) => modifier(acc))
    //     .distinctUntilChanged()
    //     .map(x => x.toArray().sort())
    //     .shareReplay(1);
    // calculations.set('effects', Rx.Observable.combineLatest(allTraitViews.map(view => view.effect$.startWith(null)))
    //     .map(effects => new Immutable.Set(effects.filter(effect => effect)))
    //     .startWith(new Immutable.Set())
    //     .distinctUntilChanged(undefined, Immutable.is)
    //     .map(effects => effects.toArray())
    //     .shareReplay(1));
    return {
        DOM: Rx.Observable.combineLatest(allBodyPartViews.map(t => t.DOM))
            .startWith([renderLoading('health')])
            .map(vTrees => h('section.health', vTrees))
            .catch(renderError.handler('health')),
        value$: Rx.Observable.return({}),
    };
}
