import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import BodyPart from '../../models/BodyPart';
import algorithm from './algorithm';
import Immutable from 'immutable';
import renderRef from './renderRef';
import Calculations from './Calculations';
import renderLoading from './renderLoading';
import renderError from './renderError';
import renderNumber from './renderNumber';
import * as localize from '../../localize';
import renderEffect from './renderEffect';
import Perk from '../../models/Perk';


function makePerkView(perk, inputValue$, DOM, calculations) {
    // key: '',
    // effect: new Effect(),
    // ranks: 1,
    // requirements: true,
    // meta: '',
    const requirementsView = algorithm({
        equation$: Rx.Observable.return(perk.requirements),
        calculations,
    });
    const effectVTree$ = renderEffect(perk.effect, calculations);
    const choosePerkView = input(`perk-choose-${perk.key}`, 'checkbox', {
        DOM,
        value$: inputValue$
            .map(ranks => !!ranks),
        props$: requirementsView.value$.startWith(true)
            .map(fulfillsRequirements => ({
                    className: 'perk-choose',
                    disabled: !fulfillsRequirements,
            })),
    });
    return {
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
            .startWith([renderLoading(perk.key)])
            .catch(renderError.handler(perk.key)),
        value$: choosePerkView.value$
            .map(x => x ? 1 : 0),
    };
}

export default function perks({DOM, value$: inputValue$, calculations}) {
    const allPerkViews = Perk.all()
        .toArray()
        .map(perk => makePerkView(perk, inputValue$.map(x => x[perk.key] || 0), DOM, calculations));
    return {
        DOM: Rx.Observable.combineLatest(allPerkViews.map(t => t.DOM))
            .startWith([renderLoading('perks')])
            .map(vTrees => h('section.perks', [
                    h('h2.perks-title', {
                        key: 'header',
                    }, [localize.name('perks')]),
                ].concat(vTrees)))
            .catch(renderError.handler('perks')),
        value$: Rx.Observable.merge(allPerkViews
            .map(({perk: {key}, value$}) => value$.map(value => o => o.set(key, value))))
            .startWith(Immutable.Map())
            .scan((acc, modifier) => modifier(acc))
            .distinctUntilChanged(undefined, Immutable.is)
            .map(x => x.toJS())
            .shareReplay(1),
    };
}
