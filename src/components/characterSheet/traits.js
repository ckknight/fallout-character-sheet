import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import Trait from '../../models/Trait';
import algorithm from './algorithm';
import Race from '../../models/Race';
// import { TRAITS, PRIMARY_ATTRIBUTES } from '../../constants.json';
// import localize from '../../localization';


function isTraitChoosable(trait, calculations) {
    return algorithm({
        equation$: Rx.Observable.return(trait.requirements),
        calculations,
    })
        .value$;
}

function makeTraitView(trait, value$, DOM, calculations) {
    const isChoosable$ = isTraitChoosable(trait, calculations);
    const chosenTraitInput = input(trait.key, 'checkbox', {
        DOM,
        value$: value$.combineLatest(isChoosable$, (data, enabled) => {
            return enabled && data[trait.key] || false;
        }),
        props$: isChoosable$
            .map(enabled => ({
                    disabled: !enabled,
            })),
    });
    return {
        key: trait.key,
        DOM: chosenTraitInput.DOM
            .map(inputVTree => h(`section.trait.trait-${trait.key}`, [
                    inputVTree,
                    trait.key,
                    ' - ',
                    getTraitDescription(trait),
                ])),
        value$: chosenTraitInput.value$,
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
function getTraitDescription(trait) {
    return trait.toString();
    return Object.keys(trait)
        .map(key => getTraitDescriptionPart(key, trait[key]))
        .filter(x => x)
        .join(', ');
}

export default function traits({DOM, value$: inputValue$, calculations}) {
    const allTraitViews = Trait.all()
        .toArray()
        .map(trait => makeTraitView(trait, inputValue$, DOM, calculations));
    const value$ = Rx.Observable.from(allTraitViews)
        .flatMap(traitView => traitView.value$
                .map(value => ({
                        [traitView.key]: !!value,
                })))
        .merge(inputValue$)
        .scan((acc, modifier) => Object.assign({}, acc, modifier), {})
        .share();
    return {
        DOM: Rx.Observable.combineLatest(allTraitViews.map(t => t.DOM))
            .map(vTrees => h('div.traits', vTrees)),
        value$: value$,
    };
}
