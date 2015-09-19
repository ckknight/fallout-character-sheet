import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import BodyPart from '../../models/BodyPart';
import algorithm from '../algorithm';
import Immutable from 'immutable';
import renderRef from './renderRef';
import Calculations from './Calculations';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import renderNumber from '../algorithm/number/render';
import * as localize from '../../localize';
import renderEffect from './renderEffect';
import Perk from '../../models/Perk';
import collapsableBox from '../collapsableBox';
import future from '../../future';

function getMinimum(equation, key) {
    if (Object(equation) !== equation) {
        return null;
    }

    if (equation._name === 'BinaryOperation') {
        if (equation.type === '<=' && typeof equation.left === 'number' && equation.right === key) {
            return equation.left;
        } else if (equation.type === 'and') {
            const leftResult = getMinimum(equation.left, key);
            if (leftResult !== null) {
                return leftResult;
            }
            return getMinimum(equation.right, key);
        }
    }
    return null;
}

function makePerkView(perk, inputValue$, DOM, calculations) {
    const requirementsView = algorithm({
        equation$: Rx.Observable.return(perk.requirements),
        calculations,
    });
    const effectVTree$ = renderEffect(perk.effect, calculations);
    let choosePerkView;
    if (perk.ranks === 1) {
        choosePerkView = input(`perk-choose-${perk.key}`, 'checkbox', {
            DOM,
            value$: inputValue$
                .map(ranks => !!ranks),
            props$: requirementsView.value$.startWith(true)
                .map(fulfillsRequirements => ({
                        className: 'perk-choose',
                        disabled: !fulfillsRequirements,
                })),
        });
    } else {
        choosePerkView = input(`perk-choose-${perk.key}`, 'integer', {
            DOM,
            value$: inputValue$,
            props$: requirementsView.value$.startWith(true)
                .map(fulfillsRequirements => ({
                        className: 'perk-choose',
                        disabled: !fulfillsRequirements,
                        min: 0,
                        max: perk.ranks,
                })),
        });
    }

    const value$ = choosePerkView.value$
        .map(x => x ? 1 : 0);

    return {
        order: getMinimum(perk.requirements, 'level') || 0,
        perk,
        DOM: Rx.Observable.combineLatest(choosePerkView.DOM, requirementsView.DOM, effectVTree$, requirementsView.value$.startWith(true),
            (choosePerkVTree, requirementsVTree, effectVTree, fulfillsRequirements) => h(`section.perk.perk-${perk.key}`, {
                    key: perk.key,
                    className: fulfillsRequirements ? 'perk-choosable' : 'perk-unchoosable',
                }, [
                    h(`label.perk-label`, {
                        key: 'label',
                    }, [
                        choosePerkVTree,
                        h(`span.perk-title`, {
                            key: 'title',
                        }, [perk.name]),
                    ]),
                    h(`span.perk-requirements`, {
                        key: 'requirements',
                    }, [requirementsVTree]),
                    h(`span.perk-effect`, {
                        key: 'effect',
                    }, [effectVTree]),
                    perk.meta ? h(`span.perk-meta`, {
                        key: 'meta',
                    }, [perk.meta]) : null,
                ]))
            .startWith([loadingIndicator(perk.key)])
            .catch(errorHandler(perk.key)),
        smallDOM: value$.combineLatest(requirementsView.value$.startWith(true),
            (ranksChosen, fulfillsRequirements) => !ranksChosen ? null : h(`section.perk.perk-${perk.key}`, {
                    key: perk.key,
                    className: fulfillsRequirements ? 'perk-choosable' : 'perk-unchoosable',
                }, [h(`span.perk-title`, {
                    key: 'title',
                }, [perk.name, ranksChosen > 1 ? ' (' + ranksChosen + ')' : null])])),
        value$,
    };
}

function perks({DOM, value$: inputValue$, uiState$, calculations}) {
    const allPerkViews = Perk.all()
        .toArray()
        .map(perk => makePerkView(perk, inputValue$.map(x => x[perk.key] || 0), DOM, calculations))
        .sort((x, y) => x.order - y.order);

    const boxView = collapsableBox('perks', localize.name('perks'), {
        DOM,
        value$: uiState$,
        collapsedBody$: Rx.Observable.combineLatest(allPerkViews.map(t => t.smallDOM))
            .map(vTrees => vTrees.filter(x => x)),
        uncollapsedBody$: Rx.Observable.combineLatest(allPerkViews.map(t => t.DOM)),
    });
    return {
        DOM: boxView.DOM,
        value$: Rx.Observable.merge(allPerkViews
            .map(({perk: {key}, value$}) => value$.map(value => o => o.set(key, value))))
            .startWith(Immutable.Map())
            .scan((acc, modifier) => modifier(acc))
            .distinctUntilChanged(undefined, Immutable.is)
            .map(x => x.toJS())
            .shareReplay(1),
        uiState$: boxView.value$,
    };
}

export default future.wrap(perks, 'DOM', 'value$', 'uiState$');
