import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import { TRAITS, PRIMARY_ATTRIBUTES } from '../../constants.json';
import localize from '../../localization';


function isTraitChoosable(trait, race$) {
    if (trait.raceWhitelist) {
        return race$
            .map(race => trait.raceWhitelist.indexOf(race) !== -1);
    }
    if (trait.raceBlacklist) {
        return race$
            .map(race => trait.raceBlacklist.indexOf(race) === -1);
    }
    return Rx.Observable.return(true);
}

function makeTrait(traitKey, value$, DOM, race$) {
    const trait = TRAITS[traitKey];
    const chosenTraitInput = input(traitKey, 'checkbox', {
        DOM,
        value$: value$.map(data => {
            return data[traitKey] || false;
        }),
        props$: isTraitChoosable(trait, race$)
            .map(enabled => ({
                    disabled: !enabled,
            })),
    });
    return {
        traitKey,
        DOM: h(`section.trait.trait-${traitKey}`, [
            chosenTraitInput.DOM,
            traitKey,
            ' - ',
            getTraitDescription(trait),
        ]),
        value$: chosenTraitInput.value$,
    };
}

function gainLose(name, count) {
    if (count > 0) {
        return 'Gain ' + count + ' ' + name;
    } else if (count < 0) {
        return 'Lose ' + (-count) + ' ' + name;
    } else {
        return '';
    }
}

const partKeyToDescriptor = {
    actionPoints(value) {
        return gainLose('Action Points', value);
    },
    raceWhitelist(value) {
        return 'Only ' + value.join(', ') + ' can choose this trait';
    },
    raceBlacklist(value) {
        return value.join(', ') + ' cannot choose this trait';
    },
};
PRIMARY_ATTRIBUTES.forEach(attribute => {
    partKeyToDescriptor[attribute] = (value) => gainLose(attribute, value);
});

function getTraitDescriptionPart(key, value) {
    const descriptor = partKeyToDescriptor[key];
    if (descriptor) {
        return descriptor(value);
    } else {
        return JSON.stringify({
            [key]: value,
        });
    }
}

function getTraitDescription(trait) {
    return Object.keys(trait)
        .map(key => getTraitDescriptionPart(key, trait[key]))
        .filter(x => x)
        .join(', ');
}

export default function traits({DOM, value$: inputValue$, race$}) {
    const defaultedRace$ = race$.startWith('');
    const allTraits = Object.keys(TRAITS)
        .map(traitKey => makeTrait(traitKey, inputValue$, DOM, defaultedRace$));
    const value$ = Rx.Observable.from(allTraits)
        .flatMap(t => t.value$
                .map(value => ({
                        [t.traitKey]: !!value,
                })))
        .merge(inputValue$)
        .scan((acc, modifier) => Object.assign({}, acc, modifier), {});
    return {
        DOM: Rx.Observable.return(null)
            .map(() => {
                return allTraits.map(t => t.DOM);
            })
            .map(vTrees => h('div.traits', vTrees)),
        value$: value$,
    };
}
