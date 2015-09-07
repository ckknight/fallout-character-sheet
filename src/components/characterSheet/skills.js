import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import SkillCategory from '../../models/SkillCategory';
import algorithm from './algorithm';
import { BinaryOperation } from '../../models/Equation';
import Immutable from 'immutable';

function makeSkillView(skill, {DOM, inputTags$, inputIncrease$, calculations}) {
    const tagInput = input(`skill-tag-${skill.key}`, 'checkbox', {
        DOM,
        value$: inputTags$
            .map(tag => tag.indexOf(skill.key) !== -1),
        props$: Rx.Observable.return({
            className: 'skill-tag',
        }),
    });
    const tagEquation$ = tagInput.value$
        .map(isTagged => new BinaryOperation({
                type: '+',
                left: skill.value,
                right: isTagged ? 15 : 0,
            }));
    const increaseView = input(`skill-increase-${skill.key}`, 'number', {
        DOM,
        value$: inputIncrease$
            .map(increase => increase[skill.key] || 0)
            .startWith(0),
        props$: Rx.Observable.return({
            min: 0,
            max: 999,
            className: 'skill-increase',
        }),
    });
    const equation$ = tagEquation$.combineLatest(increaseView.value$,
        (eq, value) => new BinaryOperation({
                type: '+',
                left: eq,
                right: value,
            }));

    const algorithmView = algorithm({
        equation$,
        calculations,
    });
    return {
        skill,
        DOM: Rx.Observable.combineLatest(
            algorithmView.DOM,
            algorithmView.value$,
            increaseView.DOM,
            tagInput.DOM,
            tagInput.value$,
            (algorithmDOM, algorithmValue, increase, tag, tagValue) => h(`div.skill.skill-${skill.key}`, {
                    className: tagValue ? 'skill-tagged' : 'skill-untagged',
                    key: skill.key,
                }, [
                    tag,
                    h(`span.skill-name`, {
                        key: 'name',
                    }, [skill.name]),
                    h(`span.skill-value`, {
                        key: 'value',
                    }, [algorithmValue + '']),
                    increase,
                    algorithmDOM,
                ])),
        tagged$: tagInput.value$,
        increase$: increaseView.value$,
    };
}

function makeSkillCategoryView(category, dependencies) {
    const skillViews = category.skills.valueSeq()
        .map(skill => makeSkillView(skill, dependencies))
        .toArray();
    return {
        DOM: Rx.Observable.combineLatest(skillViews.map(o => o.DOM))
            .startWith([])
            .map(skillVTrees => h(`section.skill-category.skill-category-${category.key}`, {
                    key: category.key,
                }, [
                    h(`span.skill-category-title`, {
                        key: 'title',
                    }, [category.name]),
                ].concat(skillVTrees))),
        tagged$: Rx.Observable.from(skillViews)
            .flatMap(({tagged$, skill: {key}}) => tagged$
                    .map(value => o => o.set(key, value)))
            .startWith(new Immutable.Map())
            .scan((acc, modifier) => modifier(acc)),
        increase$: Rx.Observable.from(skillViews)
            .flatMap(({increase$, skill: {key}}) => increase$
                    .map(value => o => o.set(key, value)))
            .startWith(new Immutable.Map())
            .scan((acc, modifier) => modifier(acc)),
    };
}

export default function skills({DOM, value$: inputValue$, calculations}) {
    const inputTags$ = inputValue$
        .map(value => value.tag || [])
        .share();
    const inputIncrease$ = inputValue$
        .map(value => value.increase || {})
        .share();
    const skillCategoryViews = SkillCategory.all()
        .map(category => makeSkillCategoryView(category, {
                DOM,
                inputTags$,
                inputIncrease$,
                calculations,
            }))
        .toArray();
    return {
        DOM: Rx.Observable.combineLatest(skillCategoryViews.map(o => o.DOM))
            .map(vTrees => h('section.skills', {
                    key: 'skills',
                }, vTrees)),
        value$: Rx.Observable.from(skillCategoryViews)
            .flatMap(({tagged$, increase$}) => Rx.Observable.merge(
                    tagged$
                        .map(tagged => o => ({
                                    tag: o.tag.merge(tagged),
                                    increase: o.increase,
                            })),
                    increase$
                        .map(increase => o => ({
                                    tag: o.tag,
                                    increase: o.increase.merge(increase),
                            }))))
            .startWith({
                tag: new Immutable.Map(),
                increase: new Immutable.Map(),
            })
            .scan((acc, modifier) => modifier(acc))
            .distinctUntilChanged(null, (x, y) => Immutable.is(x.tag, y.tag) && Immutable.is(x.increase, y.increase))
            .map(({tag, increase}) => ({
                    tag: tag.toKeyedSeq()
                        .filter(value => value)
                        .map((value, key) => key)
                        .sort()
                        .toArray(),
                    increase: increase.toJS(),
            })),
    };
}
