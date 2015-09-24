import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import SkillCategory from '../../models/SkillCategory';
import algorithm from '../algorithm';
import { BinaryOperation } from '../../models/Equation/operations';
import Immutable from 'immutable';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import * as localize from '../../localize';
import collapsableBox from '../collapsableBox';
// import future from '../../future';

function makeSkillView(skill, categoryKey, {DOM, inputTags$, inputIncrease$, calculations, effecter}) {
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
    const increaseView = input(`skill-increase-${skill.key}`, 'integer', {
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
    const taggedEquation$ = tagEquation$.combineLatest(increaseView.value$,
        (eq, value) => new BinaryOperation({
                type: '+',
                left: eq,
                right: value,
            }));

    const equation$ = effecter(effecter(effecter(taggedEquation$, skill.key), categoryKey), 'skills');

    const algorithmView = algorithm({
        equation$,
        calculations,
    });
    calculations.set(skill.key, algorithmView.value$.startWith(0));
    return {
        skill,
        DOM: Rx.Observable.combineLatest(
            algorithmView.DOM,
            algorithmView.value$.startWith(null),
            increaseView.DOM,
            tagInput.DOM,
            tagInput.value$.startWith(false),
            (algorithmDOM, algorithmValue, increase, tag, tagValue) => h(`div.skill.skill-${skill.key}`, {
                    className: tagValue ? 'skill-tagged' : 'skill-untagged',
                    key: skill.key,
                }, [
                    h(`label.skill-label.pure-checkbox`, {
                        key: 'tag',
                    }, [
                        tag,
                        h(`span.skill-name`, {
                            key: 'name',
                        }, [skill.name]),
                    ]),
                    h(`span.skill-value`, {
                        key: 'value',
                    }, [algorithmValue != null ? algorithmValue + '' : null]),
                    increase,
                    algorithmDOM,
                ]))
            .startWith(loadingIndicator(skill.key))
            .catch(errorHandler(skill.key)),
        smallDOM: Rx.Observable.combineLatest(
            algorithmView.value$.startWith(null),
            tagInput.value$.startWith(false),
            (algorithmValue, tagValue) => h(`div.skill.skill-${skill.key}`, {
                    className: tagValue ? 'skill-tagged' : 'skill-untagged',
                    key: skill.key,
                }, [
                    h(`span.skill-name`, {
                        key: 'name',
                    }, [skill.name]),
                    h(`span.skill-value`, {
                        key: 'value',
                    }, [algorithmValue != null ? algorithmValue + '' : null]),
                ]))
            .startWith(loadingIndicator(skill.key))
            .catch(errorHandler(skill.key)),
        tagged$: tagInput.value$,
        increase$: increaseView.value$,
    };
}

function makeSkillCategoryView(category, dependencies) {
    dependencies.calculations.set(category.key, Rx.Observable.return(0));
    const skillViews = category.skills.valueSeq()
        .map(skill => makeSkillView(skill, category.key, dependencies))
        .toArray();
    return {
        DOM: Rx.Observable.combineLatest(skillViews.map(o => o.DOM))
            .startWith([loadingIndicator(category.key)])
            .map(skillVTrees => h(`section.skill-category.skill-category-${category.key}`, {
                    key: category.key,
                }, h('.skill-category-body', [
                    h(`h3.skill-category-title`, {
                        key: 'title',
                    }, [category.name]),
                ].concat(skillVTrees))))
            .catch(errorHandler(category.key)),
        smallDOM: Rx.Observable.combineLatest(skillViews.map(o => o.smallDOM))
            .startWith([loadingIndicator(category.key)])
            .map(skillVTrees => h(`section.skill-category.skill-category-${category.key}`, {
                    key: category.key,
                }, skillVTrees))
            .catch(errorHandler(category.key)),
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

export default function skills({DOM, value$: inputValue$, uiState$, calculations, effecter}) {
    const inputTags$ = inputValue$
        .map(value => value.tag || [])
        .shareReplay(1);
    const inputIncrease$ = inputValue$
        .map(value => value.increase || {})
        .shareReplay(1);
    const skillCategoryViews = SkillCategory.all()
        .map(category => makeSkillCategoryView(category, {
                DOM,
                inputTags$,
                inputIncrease$,
                calculations,
                effecter,
            }))
        .toArray();

    const collapsedBody$ = Rx.Observable.combineLatest(skillCategoryViews.map(o => o.smallDOM));

    const uncollapsedBody$ = Rx.Observable.combineLatest(skillCategoryViews.map(o => o.DOM));

    const boxView = collapsableBox('skills', localize.name('skills'), {
        DOM,
        value$: uiState$,
        collapsedBody$,
        uncollapsedBody$,
    });

    return {
        DOM: boxView.DOM,
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
        uiState$: boxView.value$,
    };
}

// export default future.wrap(skills, 'DOM', 'value$', 'uiState$');
