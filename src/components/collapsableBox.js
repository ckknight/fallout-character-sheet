import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import renderLoading from './characterSheet/renderLoading';
import renderError from './characterSheet/renderError';
import collapsableHeader from './collapsableHeader';

export default function collapsableBox(key, title, {DOM, value$, collapsedBody$, uncollapsedBody$}) {
    const headerView = collapsableHeader(`${key}-title`, 'h2', title, {
        DOM,
        value$,
    });

    const vTree$ = headerView.value$
        .debounce(5)
        .combineLatest(headerView.DOM, (collapsed, header) => ({
                collapsed,
                header,
        }))
        .flatMapLatest(({collapsed, header}) => (collapsed ? collapsedBody$ : uncollapsedBody$)
                .map(vTrees => h(`section.${key}`, {
                        key,
                        className: collapsed ? 'collapsed' : 'uncollapsed',
                    }, [
                        h(`h2.${key}-title`, [title]),
                        h(`div.${key}-body`, vTrees),
                    ])))
        .startWith([renderLoading(key)])
        .catch(renderError.handler(key));

    return {
        DOM: vTree$,
        value$: headerView.value$,
    };
}
