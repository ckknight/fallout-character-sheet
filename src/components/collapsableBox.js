import { h } from '@cycle/dom';
import loadingIndicator from './loadingIndicator';
import errorHandler from './errorHandler';
import collapsableHeader from './collapsableHeader';

export default function collapsableBox(key, title, {DOM, value$, collapsedBody$, uncollapsedBody$}) {
    const headerView = collapsableHeader(`${key}-title`, 'h2', title, {
        DOM,
        value$,
    });

    const vTree$ = headerView.value$
        .combineLatest(headerView.DOM, (collapsed, header) => ({
                collapsed,
                header,
        }))
        .flatMapLatest(({collapsed, header}) => (collapsed ? collapsedBody$ : uncollapsedBody$)
                .map(vTrees => h(`section.${key}`, {
                        key,
                        className: collapsed ? 'collapsed' : 'uncollapsed',
                    }, [
                        header,
                        h(`div.${key}-body`, vTrees),
                    ])))
        .startWith([loadingIndicator(key)])
        .catch(errorHandler(key));

    return {
        DOM: vTree$,
        value$: headerView.value$,
    };
}
