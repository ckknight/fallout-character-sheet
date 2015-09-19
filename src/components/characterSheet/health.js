import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import BodyPart from '../../models/BodyPart';
import algorithm from '../algorithm';
import Immutable from 'immutable';
import Calculations from './Calculations';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import renderNumber from '../algorithm/number/render';
import * as localize from '../../localize';
import renderEffect from './renderEffect';
import plusMinusButtons from '../plusMinusButtons';
import InjectableObservable from 'rx-injectable-observable';
import button from '../button';
import future from '../../future';

const SHOW_EQUATION = false;

function makeSubBodyPartView(key, subBodyPart, inputValue$, DOM, calculations, receiveDamage$, receiveHealing$) {
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
    const value$ = new InjectableObservable();
    const damagedHealthView = plusMinusButtons(`${key}-${subBodyPart.key}-damaged`, {
        DOM,
        value$,
        min$: Rx.Observable.return(0),
        max$: crippleHealthView.value$,
        plus$: Rx.Observable.return('-'),
        minus$: Rx.Observable.return('+'),
    });
    value$.inject(inputValue$
        .map(x => x.damaged || 0)
        .concat(
            Rx.Observable.merge(
                receiveDamage$.map(() => x => x + 1),
                receiveHealing$.map(() => x => Math.max(0, x - 1)))
                .withLatestFrom(damagedHealthView.value$,
                    (modifier, damaged) => modifier(damaged))));
    const crippledView = input(`${key}-${subBodyPart.key}-damaged`, 'checkbox', {
        DOM,
        value$: inputValue$.map(x => x.crippled || false)
            .merge(damagedHealthView.value$.combineLatest(crippleHealthView.value$,
                (damaged, total) => {
                    if (damaged >= total) {
                        return Rx.Observable.return(true);
                    }
                    return Rx.Observable.of();
                })
                .mergeAll()),
    });
    return {
        key: subBodyPart.key,
        DOM: damageVTree$.combineLatest(crippledView.DOM, damagedHealthView.plusDOM, damagedHealthView.minusDOM, damagedHealthView.value$, crippleHealthView.DOM, effectVTree$, crippleHealthView.value$.startWith(null), crippledView.value$.startWith(false),
            (damageVTree, crippledVTree, addDamageVTree, subDamageVTree, currentDamage, crippleHealthVTree, effectVTree, crippleHealth, crippled) => {
                return h(`section.sub-body-part.sub-body-part-${subBodyPart.key}`, {
                    key: subBodyPart.key,
                }, [
                    h(`span.sub-body-part-title`, {
                        key: 'title',
                    }, [subBodyPart.name]),
                    crippledVTree,
                    addDamageVTree,
                    h(`span.sub-body-part-currentHealth`, {
                        key: 'currentHealth',
                    }, [crippleHealth - currentDamage]),
                    '/',
                    h(`span.sub-body-part-totalHealth`, {
                        key: 'totalHealth',
                    }, [crippleHealth]),
                    subDamageVTree,
                    SHOW_EQUATION ? h(`span.sub-body-part-heath-equation`, {
                        key: 'crippleHealth',
                    }, [crippleHealthVTree]) : null,
                    crippled ? h(`p.sub-body-part-cripple-effect`, {
                        key: 'crippleEffect',
                    }, [effectVTree]) : null,
                    crippled && subBodyPart.meta ? h(`p.sub-body-part-meta`, {
                        key: 'meta',
                    }, [subBodyPart.meta]) : null,
                    damageVTree ? h(`span.sub-body-part-damage`, {
                        key: 'damage',
                    }, [damageVTree]) : null,
                    h(`span.sub-body-part-target-penalty`, {
                        key: 'targetPenalty',
                    }, [renderNumber(-subBodyPart.targetPenalty)]),
                ]);
            }),
        value$: damagedHealthView.value$.combineLatest(crippledView.value$,
            (damaged, crippled) => ({
                    damaged,
                    crippled,
            })),
        damageable$: damagedHealthView.value$.combineLatest(crippleHealthView.value$,
            (damaged, totalHealth) => damaged < totalHealth),
        healable$: damagedHealthView.value$
            .map(damaged => damaged > 0),
        effects$: crippledView.value$.startWith(false)
            .distinctUntilChanged()
            .map(crippled => {
                if (!crippled) {
                    return new Immutable.List();
                }
                return Immutable.List.of(subBodyPart.crippleEffect);
            }),
    };
}

function chooseRandomSubBodyPart(parts) {
    return parts[Math.floor(Math.random() * parts.length)];
}

function makeSingleBodyPartView(key, bodyPart, inputValue$, DOM, calculations, index) {
    const effectVTree$ = renderEffect(bodyPart.crippleEffect, calculations);
    const crippleHealthView = algorithm({
        equation$: Rx.Observable.return(bodyPart.crippleHealth),
        calculations,
    });
    const damageVTree$ = bodyPart.damage !== 'value' ? algorithm({
        equation$: Rx.Observable.return(bodyPart.damage),
        calculations: new Calculations({
            value: Rx.Observable.never(),
        }),
    }).DOM : Rx.Observable.return(null);
    const damageableSubBodyParts$ = new InjectableObservable();
    const damageButtonView = button(`${key}-damage`, {
        DOM,
        vTree$: Rx.Observable.return('-'),
        props$: damageableSubBodyParts$
            .map(parts => ({
                    disabled: !parts.length,
            })),
    });
    const healableSubBodyParts$ = new InjectableObservable();
    const healButtonView = button(`${key}-heal`, {
        DOM,
        vTree$: Rx.Observable.return('+'),
        props$: healableSubBodyParts$
            .map(parts => ({
                    disabled: !parts.length,
            })),
    });
    const damageToSubBodyPart$ = damageButtonView.value$.withLatestFrom(damageableSubBodyParts$,
        (_, parts) => chooseRandomSubBodyPart(parts))
        .shareReplay(1);
    const healingToSubBodyPart$ = healButtonView.value$.withLatestFrom(healableSubBodyParts$,
        (_, parts) => chooseRandomSubBodyPart(parts))
        .shareReplay(1);
    const subBodyPartViews = bodyPart.parts.valueSeq()
        .map(subPart => makeSubBodyPartView(key, subPart, inputValue$
                .map(data => {
                    const subPartData = data[subPart.key];
                    if (Array.isArray(subPartData)) {
                        return subPartData[index] || {};
                    }
                    return subPartData || {};
                }), DOM, calculations, damageToSubBodyPart$.filter(x => x === subPart.key), healingToSubBodyPart$.filter(x => x === subPart.key)))
        .toArray();
    damageableSubBodyParts$.inject(Rx.Observable.merge(
        subBodyPartViews
            .map(x => x.damageable$
                    .map(damageable => acc => acc.set(x.key, damageable))))
        .startWith(new Immutable.Map())
        .scan((acc, modifier) => modifier(acc))
        .map(map => map.toKeyedSeq()
                .filter(value => value)
                .map((value, k) => k)
                .toArray()));
    healableSubBodyParts$.inject(Rx.Observable.merge(
        subBodyPartViews
            .map(x => x.healable$
                    .map(healable => acc => acc.set(x.key, healable))))
        .startWith(new Immutable.Map())
        .scan((acc, modifier) => modifier(acc))
        .map(map => map.toKeyedSeq()
                .filter(value => value)
                .map((value, k) => k)
                .toArray()));
    const status$ = Rx.Observable.combineLatest(subBodyPartViews.map(x => x.value$))
        .map(xs => ({
                damaged: xs.map(x => x.damaged).reduce((x, y) => x + y, 0),
                crippled: xs.filter(x => x.crippled).length >= bodyPart.cripplePartCount,
        }))
        .combineLatest(crippleHealthView.value$, ({damaged, crippled} , totalHealth) => ({
                damaged,
                crippled: crippled || damaged >= totalHealth,
        }))
        .startWith({
            damaged: 0,
            crippled: false,
        })
        .distinctUntilChanged()
        .shareReplay(1);

    const effectsWhenCrippled$ = status$
        .pluck('crippled')
        .distinctUntilChanged()
        .map(crippled => {
            if (!crippled) {
                return new Immutable.List();
            }
            return Immutable.List.of(bodyPart.crippleEffect);
        });

    return {
        key,
        DOM: Rx.Observable.combineLatest(
            damageVTree$,
            crippleHealthView.value$,
            crippleHealthView.DOM,
            Rx.Observable.combineLatest(subBodyPartViews.map(o => o.DOM)),
            effectVTree$,
            status$,
            damageButtonView.DOM,
            healButtonView.DOM,
            (damageVTree, health, crippleHealthVTree, vTrees, effectVTree, {damaged, crippled} , damageButton, healButton) => h(`section.body-part.body-part-${key}`, {
                    key,
                }, [
                    h(`span.body-part-title`, {
                        key: 'title',
                    }, [localize.name(key)]),
                    damageButton,
                    h(`span.body-part-health`, {
                        key: 'health',
                    }, [(health - damaged), '/', health]),
                    healButton,
                    SHOW_EQUATION ? h(`span.body-part-health-equation`, {
                        key: 'healthEquation',
                    }, [crippleHealthVTree]) : null,
                    damageVTree && h(`span.body-part-damage`, {
                        key: 'damage',
                    }, [damageVTree]),
                    crippled ? h(`span.body-part-crippled`, {
                        key: 'crippled',
                    }, ['Crippled']) : null,
                    crippled ? h(`p.body-part-cripple-effect`, {
                        key: 'crippleEffect',
                    }, [effectVTree]) : null,
                    crippled && bodyPart.meta ? h(`p.body-part-meta`, {
                        key: 'meta',
                    }, [bodyPart.meta]) : null,
                    h(`span.body-part-target-penalty`, {
                        key: 'targetPenalty',
                    }, [renderNumber(-bodyPart.targetPenalty)]),
                    ...vTrees,
                ]))
            .startWith(loadingIndicator(key))
            .catch(errorHandler(key)),
        value$: Rx.Observable.from(subBodyPartViews)
            .flatMap(({key: subKey, value$}) => value$.map(value => acc => acc.set(subKey, value)))
            .startWith(new Immutable.Map())
            .scan((acc, modifier) => modifier(acc))
            .distinctUntilChanged(undefined, Immutable.is),
        effects$: Rx.Observable.combineLatest(subBodyPartViews.map(view => view.effects$).concat([effectsWhenCrippled$]))
            .map(effectLists => new Immutable.List(effectLists).flatten(true))
            .distinctUntilChanged(undefined, Immutable.is),
    };
}

function indexedMapToList(map) {
    return map.toKeyedSeq()
        .reduce((acc, value, key) => acc.set(key, value), new Immutable.List());
}

function flattenListOfObjects(list) {
    return list
        .reduce((acc, element, index) => {
            return element
                .toKeyedSeq()
                .reduce((acc, value, key) => {
                    if (!acc.get(key)) {
                        acc = acc.set(key, new Immutable.List());
                    }
                    return acc.setIn([key, index], value);
                }, acc);
        }, new Immutable.Map());
}

function makeBodyPartView(bodyPart, inputValue$, DOM, calculations) {
    if (!bodyPart.multiple) {
        return makeSingleBodyPartView(bodyPart.key, bodyPart, inputValue$, DOM, calculations, 0);
    }

    const parts = bodyPart.multiple.toArray()
        .map((key, index) => makeSingleBodyPartView(key, bodyPart, inputValue$, DOM, calculations, index));

    return {
        key: bodyPart.key,
        DOM: Rx.Observable.combineLatest(parts.map(o => o.DOM))
            .startWith([loadingIndicator(bodyPart.key)])
            // .map(vTrees => h(`section.body-part.body-part-${bodyPart.key}`, {
            //         key: bodyPart.key,
            //     }, [
            //         h(`span.body-part-title`, {
            //             key: 'title',
            //         }, [localize.plural(bodyPart.key)]),
            //     ].concat(vTrees)))
            .catch(errorHandler(bodyPart.key)),
        value$: Rx.Observable.from(parts)
            .flatMap(({key, value$} , index) => value$.map(value => acc => acc.set(index, value)))
            .startWith(new Immutable.Map())
            .scan((acc, modifier) => modifier(acc))
            .distinctUntilChanged(undefined, Immutable.is)
            .map(indexedMapToList)
            .map(flattenListOfObjects)
            .shareReplay(1),
        effects$: Rx.Observable.combineLatest(parts.map(p => p.effects$))
            .map(effectLists => new Immutable.List(effectLists).flatten(true))
            .distinctUntilChanged(undefined, Immutable.is),
    };
}

function health({DOM, value$: inputValue$, calculations}) {
    const allBodyPartViews = BodyPart.all()
        .toArray()
        .map(bodyPart => makeBodyPartView(bodyPart, inputValue$, DOM, calculations));
    const totalHealth$ = calculations.get('health');
    const value$ = Rx.Observable.merge(allBodyPartViews.map(view => view.value$))
        .startWith(new Immutable.Map())
        .scan((acc, other) => acc.merge(other))
        .distinctUntilChanged()
        .shareReplay(1);
    const totalDamage$ = value$
        .map(parts => parts.toKeyedSeq()
                .reduce((acc, o) => {
                    if (Immutable.List.isList(o)) {
                        return o.reduce((x, y) => x + y.damaged, acc);
                    }
                    return acc + o.damaged;
                }, 0));

    calculations.set('healthEffects', Rx.Observable.combineLatest(allBodyPartViews.map(view => view.effects$))
        .map(effectLists => new Immutable.List(effectLists).flatten(true))
        .distinctUntilChanged(undefined, Immutable.is)
        .map(effects => effects.toArray())
        .shareReplay(1));
    return {
        DOM: Rx.Observable.combineLatest(
            totalDamage$,
            totalHealth$,
            Rx.Observable.combineLatest(allBodyPartViews.map(t => t.DOM)),
            (damage, totalHealth, bodyPartVTrees) => h('section.health', [
                    h(`span.health-total`, [totalHealth - damage, '/', totalHealth]),
                    h(`div.health-body-parts`, bodyPartVTrees),
                ]))
            .startWith([loadingIndicator('health')])
            .catch(errorHandler('health')),
        value$: value$
            .map(x => x.toJS())
            .shareReplay(1),
    };
}

export default future.wrap(health, 'DOM', 'value$');
