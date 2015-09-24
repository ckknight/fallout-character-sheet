import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import Trait from '../../models/Trait';
import algorithm from '../algorithm';
import Immutable from 'immutable';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import renderEffect from './renderEffect';
import collapsableBox from '../collapsableBox';
// import future from '../../future';

function isTraitChoosable(trait, calculations) {
    return algorithm({
        equation$: Rx.Observable.return(trait.requirements),
        calculations,
    })
        .value$
        .debounce(1000)
        .startWith(true);
}

function getTraitDescription(trait, calculations) {
    const requirementsView = algorithm({
        equation$: Rx.Observable.return(trait.requirements),
        calculations,
    });
    return Rx.Observable.combineLatest(renderEffect(trait.effect, calculations), requirementsView.DOM, requirementsView.equation$,
        (effect, requirements, equation) => [
                h('span.trait-effect', [effect]),
                trait.meta ? h('span.trait-meta', ['Note: ', trait.meta]) : null,
                equation === true ? null : h('span.trait-requirements', [requirements]),
        ]);
}

function makeTraitView(trait, inputValue$, DOM, calculations) {
    const isChoosable$ = isTraitChoosable(trait, calculations);
    const chosenTraitInput = input(trait.key, 'checkbox', {
        DOM,
        value$: inputValue$.map(data => data.indexOf(trait.key) !== -1)
            .merge(isChoosable$
                .flatMap(isChoosable => {
                    if (!isChoosable) {
                        return Rx.Observable.return(false);
                    }
                    return Rx.Observable.of();
                })),
        props$: isChoosable$
            .map(enabled => ({
                    disabled: !enabled,
                    className: 'trait-checkbox',
            })),
    });
    const checked$ = chosenTraitInput.value$;
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
                    ...description,
                ]))
            .startWith(loadingIndicator(trait.key))
            .catch(errorHandler(trait.key)),
        smallDOM: checked$
            .map(isChosen => {
                if (!isChosen) {
                    return null;
                }
                return h(`span.trait-name`, {
                    key: trait.key,
                }, [trait.name]);
            }),
        value$: checked$,
        effect$: checked$
            .map(isChosen => {
                if (!isChosen) {
                    return null;
                }
                return trait.effect;
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

export default function traits({DOM, value$: inputValue$, uiState$, calculations}) {
    const allTraitViews = Trait.all()
        .toArray()
        .sort((x, y) => x.name < y.name ? -1 : 1)
        .map(trait => makeTraitView(trait, inputValue$, DOM, calculations));
    const value$ = Rx.Observable.from(allTraitViews)
        .flatMap(({key, value$: traitValue$}) => traitValue$
                .map(value => o => value ? o.add(key) : o.remove(key)))
        .startWith(new Immutable.Set())
        .scan((acc, modifier) => modifier(acc))
        .distinctUntilChanged()
        .map(x => x.toArray().sort())
        .shareReplay(1);
    calculations.set('traitEffects', Rx.Observable.combineLatest(allTraitViews.map(view => view.effect$))
        .map(effects => new Immutable.List(effects.filter(effect => effect)))
        .startWith(new Immutable.List())
        .distinctUntilChanged(undefined, Immutable.is)
        .map(effects => effects.toArray())
        .shareReplay(1));

    const boxView = collapsableBox('traits', 'Traits', {
        DOM,
        value$: uiState$,
        collapsedBody$: Rx.Observable.combineLatest(allTraitViews.map(t => t.smallDOM))
            .map(vTrees => vTrees.filter(x => x)),
        uncollapsedBody$: Rx.Observable.combineLatest(allTraitViews.map(t => t.DOM)),
    });

    return {
        DOM: boxView.DOM,
        value$,
        uiState$: boxView.value$,
    };
}

// export default future.wrap(traits, 'DOM', 'value$', 'uiState$');
