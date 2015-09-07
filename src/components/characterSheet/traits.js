import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import Trait from '../../models/Trait';
import algorithm from './algorithm';
import Race from '../../models/Race';
import Immutable from 'immutable';
import renderRef from './renderRef';
import Calculations from './Calculations';
import Effect from '../../models/Effect';
// import { TRAITS, PRIMARY_ATTRIBUTES } from '../../constants.json';
// import localize from '../../localization';


function isTraitChoosable(trait, calculations) {
    return algorithm({
        equation$: Rx.Observable.return(trait.requirements),
        calculations,
    })
        .value$;
}

function makeTraitView(trait, inputValue$, DOM, calculations) {
    const isChoosable$ = isTraitChoosable(trait, calculations);
    const chosenTraitInput = input(trait.key, 'checkbox', {
        DOM,
        value$: inputValue$.map(data => data.indexOf(trait.key) !== -1)
            .merge(isChoosable$
                .flatMap(isChoosable => {
                    if (isChoosable) {
                        return Rx.Observable.of();
                    } else {
                        return Rx.Observable.return(false);
                    }
                })),
        props$: isChoosable$
            .map(enabled => ({
                    disabled: !enabled,
                    className: 'trait-checkbox',
            })),
    });
    const description$ = getTraitDescription(trait, calculations);
    return {
        key: trait.key,
        DOM: chosenTraitInput.DOM.combineLatest(description$,
            (inputVTree, description) => h(`section.trait.trait-${trait.key}`, {
                    key: trait.key,
                }, [
                    h('label.trait-label', {
                        key: 'label',
                    }, [
                        inputVTree,
                        h(`span.trait-name`, {
                            key: 'name',
                        }, [trait.name]),
                    ]),
                    h(`span.trait-description`, {
                        key: 'description',
                    }, description),
                ])),
        value$: chosenTraitInput.value$,
        effect$: chosenTraitInput.value$
            .map(isChosen => {
                if (isChosen) {
                    return trait.effect;
                } else {
                    return null;
                }
            }),
    };
}
//
// function gainLose(name, count) {
//     if (count > 0) {
//         return 'Gain ' + count + ' ' + name;
//     } else if (count < 0) {
//         return 'Lose ' + (-count) + ' ' + name;
//     } else {
//         return '';
//     }
// }
//
// const partKeyToDescriptor = {
//     actionPoints(value) {
//         return gainLose('Action Points', value);
//     },
//     raceWhitelist(value) {
//         return 'Only ' + value.join(', ') + ' can choose this trait';
//     },
//     raceBlacklist(value) {
//         return value.join(', ') + ' cannot choose this trait';
//     },
// };
// PRIMARY_ATTRIBUTES.forEach(attribute => {
//     partKeyToDescriptor[attribute] = (value) => gainLose(attribute, value);
// });
//
// function getTraitDescriptionPart(key, value) {
//     const descriptor = partKeyToDescriptor[key];
//     if (descriptor) {
//         return descriptor(value);
//     } else {
//         return JSON.stringify({
//             [key]: value,
//         });
//     }
// }
//

function renderEffectEquation(key, equation, calculations) {
    return algorithm({
        equation$: Rx.Observable.return(equation),
        calculations: calculations,
    }).DOM;
}

function renderEffect(effect, calculations) {
    return Rx.Observable.combineLatest(effect.toKeyedSeq()
        .filter((value, key) => {
            if (key.charAt(0) === '$') {
                return value;
            } else {
                return value !== 'value';
            }
        })
        .filter((value, key) => {
            return key.charAt(0) !== '$';
        })
        .map((value, key) => {
            return renderEffectEquation(key, value, new Calculations({
                value: Rx.Observable.return('value'),
                level: calculations.get('level'),
            }))
                .map(effect => h('span.effect', [
                        renderRef(key),
                        ': ',
                        effect,
                    ]));
        })
        .toArray());
}

function getTraitDescription(trait, calculations) {
    const requirementsView = algorithm({
        equation$: Rx.Observable.return(trait.requirements),
        calculations,
    });
    return Rx.Observable.combineLatest(renderEffect(trait.effect, calculations).startWith([]), requirementsView.DOM, requirementsView.equation$,
        (effect, requirements, equation) => [
                h('span.trait-effect', effect),
                trait.meta ? h('span.trait-meta', ['Note: ', trait.meta]) : null,
                equation === true ? null : h('span.trait-requirements', [requirements]),
        ]);
}

export default function traits({DOM, value$: inputValue$, calculations}) {
    const allTraitViews = Trait.all()
        .toArray()
        .map(trait => makeTraitView(trait, inputValue$, DOM, calculations));
    const value$ = Rx.Observable.from(allTraitViews)
        .flatMap(({key, value$}) => value$
                .map(value => o => value ? o.add(key) : o.remove(key)))
        .startWith(Immutable.Set())
        .scan((acc, modifier) => modifier(acc))
        .distinctUntilChanged()
        .map(x => x.toArray().sort())
        .share();
    return {
        DOM: Rx.Observable.combineLatest(allTraitViews.map(t => t.DOM))
            .map(vTrees => h('section.traits', vTrees)),
        value$,
        effects$: Rx.Observable.combineLatest(allTraitViews.map(view => view.effect$))
            .map(effects => effects.filter(effect => effect))
            .share(),
    };
}
