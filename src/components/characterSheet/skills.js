import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import { SKILLS, PRIMARY_ATTRIBUTES } from '../../constants.json';
import localize from '../../localization';

function makeInput(key, type, defaultValue, DOM, value$, props$) {
    return input(key, type, {
        DOM,
        value$: value$.map(value => value[key] || defaultValue),
        props$,
    });
}

function primaryAttribute(attribute, {DOM, value$, racePrimary$}) {
    const raceExtrema$ = racePrimary$
        .map(primary => primary[attribute] || [1, 10])
        .map(([min, max]) => ({
                min,
                max,
        }))
        .share();
    const input = makeInput(attribute, 'number', 5, DOM, value$, raceExtrema$);
    const extremaVTree$ = raceExtrema$
        .map(({min, max}) => h('span', [min, '/', max]));

    return {
        DOM: combineLatestObject({
            input: input.DOM,
            extrema: extremaVTree$,
        })
            .map(({input, extrema}) => h(`div.${attribute}-attribute`, [attribute, input, extrema])),
        value$: input.value$,
    };
}

function toReadableAlgorithm(skill) {
    return [skill.base]
        .concat(PRIMARY_ATTRIBUTES.map(attribute => {
            const multiplier = skill[attribute];
            if (multiplier) {
                if (multiplier === 1) {
                    return localize(attribute);
                } else {
                    return multiplier + '*' + localize(attribute);
                }
            }
        }))
        .filter(x => x)
        .join(' + ');
}

function calculateSkill(attributes, skill) {
    return [skill.base || 0]
        .concat(PRIMARY_ATTRIBUTES.map(attribute => {
            const multiplier = skill[attribute] || 0;
            return attributes[attribute] * multiplier;
        }))
        .reduce((x, y) => x + y, 0);
}

export default function primaryAttributeChart({DOM, value$, attributes$}) {
    // const racePrimary$ = race$
    //     .map(race => RACE_STATS[race || 'human'] || {})
    //     .map(raceStats => raceStats.primary || {})
    //     .share();
    //
    // const attributes = PRIMARY_ATTRIBUTES
    //     .map(attribute => primaryAttribute(attribute, {
    //             DOM,
    //             value$,
    //             racePrimary$,
    //         }));
    //
    // const sum$ = Rx.Observable.combineLatest(attributes.map(a => a.value$))
    //     .map(values => values.reduce((x, y) => x + y, 0));
    //
    // const primaryTotal$ = racePrimary$
    //     .map(primary => primary.total || 40);
    //
    // const summaryVTree$ = Rx.Observable.combineLatest(sum$, primaryTotal$, (sum, primaryTotal) => {
    //     return h('span', {
    //         className: sum === primaryTotal ? 'same-total' : '',
    //     }, [sum, '/', primaryTotal]);
    // });

    return {
        DOM: attributes$
            .map(attributes => {
                return Object.keys(SKILLS)
                    .map(categoryKey => {
                        const category = SKILLS[categoryKey];
                        return h(`section.skill-category.skill-category-${categoryKey}`, [
                            categoryKey,
                        ].concat(Object.keys(category)
                            .map(skillKey => {
                                const skill = category[skillKey];
                                return h(`div.skill.skill-${skillKey}`, [
                                    skillKey,
                                    ' ',
                                    calculateSkill(attributes, skill),
                                    ' ',
                                    toReadableAlgorithm(skill),
                                ]);
                            })));
                    });
            })
            .map(vTrees => h('div.skills', vTrees)),
    };
}
