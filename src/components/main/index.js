import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import characterSheet from '../characterSheet';

function renderMenuList(items, selectedKey) {
    return Object.entries(items)
        .map(([key, name]) => h('li.pure-menu-item', {
            className: selectedKey === key ? 'pure-menu-selected' : '',
        }, [
            h('a.pure-menu-link', {
                href: '#' + key,
            }, [name]),
        ]));
}

function getRoute$(initialHash, hashchange) {
    return Rx.Observable.concat(
        initialHash
            .map(hash => hash.replace(/^#/, '')),
        hashchange
            .map(ev => {
                const match = ev.newURL.match(/#.*/);
                if (!match) {
                    return '';
                }
                return match[0].substring(1);
            }))
        .distinctUntilChanged()
        .shareReplay(1);
}

export default function main({ DOM, localStorageSource, initialHash, hashchange }) {
    const route$ = getRoute$(initialHash, hashchange);
    const characterView = characterSheet({ DOM, localStorageSource, route$ });
    return {
        DOM: Rx.Observable.combineLatest(
            characterView.DOM,
            route$
                .map(route => renderMenuList({
                    cosmetic: 'Cosmetic',
                    primary: 'Primary',
                    secondary: 'Secondary',
                    skills: 'Skills',
                    perks: 'Perks',
                    traits: 'Traits',
                    health: 'Health',
                }, route)),
            (character, menuList) => h('.layout', [
                h('nav.menu', [
                    h('.pure-menu.pure-menu-horizontal.pure-menu-scrollable', [
                        h('ul.pure-menu-list', menuList),
                    ]),
                ]),
                h('section.content', [character]),
            ])),
        localStorageSink: characterView.localStorageSink,
    };
}
