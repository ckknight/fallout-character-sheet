import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import characterList from '../characterList';
import removeEmptyValues from '../../utils/removeEmptyValues';
import '../../sampleToRequestAnimationFrame';

// function renderMenuList(items, selectedKey) {
//     return Object.entries(items)
//         .map(([key, name]) => h('li.pure-menu-item', {
//             className: selectedKey === key ? 'pure-menu-selected' : '',
//         }, [
//             h('a.pure-menu-link', {
//                 href: '#' + key,
//             }, [name]),
//         ]));
// }

function getRoute$(initialHash, hashchange) {
    return Rx.Observable.concat(
        initialHash
            .map(hash => hash.replace(/^#\/?/, '')),
        hashchange
            .map(ev => {
                const match = ev.newURL.match(/#\/?(.*)/);
                if (!match) {
                    return '';
                }
                return match[1];
            }))
        .distinctUntilChanged()
        .shareReplay(1);
}

function safeParseJSON(value) {
    try {
        return JSON.parse(value) || {};
    } catch (e) {
        return {};
    }
}

function renderMenuList(items, currentRoute) {
    return items
        .map(({route, name}) => route != null ?
            h('li.pure-menu-item', {
                className: currentRoute === route ? 'pure-menu-selected' : '',
            }, [
                h('a.pure-menu-link', {
                    href: '#/' + route,
                }, [name]),
            ]) :
            h('li.pure-menu-heading', [name]));
}

export default function main({ DOM, localStorageSource, initialHash, hashchange }) {
    const route$ = getRoute$(initialHash, hashchange);
    const deserializedSavedData$ = localStorageSource
        .map(safeParseJSON)
        .shareReplay(1);
    const characterListView = characterList({ DOM, value$: deserializedSavedData$.map(x => x.chars || {}), route$ });
    return {
        DOM: Rx.Observable.combineLatest(
            characterListView.DOM,
            characterListView.nav$,
            route$,
            (vTree, nav, route) => h('.layout', [
                h('nav.menu', [
                    h('.pure-menu.pure-menu-horizontal.pure-menu-scrollable', [
                        h('ul.pure-menu-list', renderMenuList(nav, route)),
                    ]),
                ]),
                h('section.content', [vTree]),
            ]))
            .debounce(5)
            .sampleToRequestAnimationFrame(),
        localStorageSink: localStorageSource.first()
            .concat(characterListView.value$
                .map(chars => ({
                    chars,
                }))
                .throttle(200)
                .map(removeEmptyValues)
                .map(x => x ? JSON.stringify(x) : ''))
            .distinctUntilChanged()
            .skip(1),
    };
}
