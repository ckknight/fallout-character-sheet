import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import { SKILLS, PRIMARY_ATTRIBUTES } from '../../constants.json';
import localize from '../../localization';

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

export default function skills({DOM, value$, attributes$}) {
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
        value$: Rx.Observable.return({}),
    };
}
