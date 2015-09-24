import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import characterMain from '../characterMain';
import '../../rx-start-with-throttled';

function makeNav(items) {
    return Object.entries(items)
        .map(([route, name]) => ({
            route,
            name,
        }));
}

function parseRoute(route) {
    const match = /^(\d+)(\/|$)(.*)/.exec(route);
    if (!match) {
        return null;
    }
    const id = +match[1];
    if (isNaN(id)) {
        return null;
    }
    return id;
}

function trimRoute(id, route) {
    const match = /^(\d+)(\/|$)(.*)/.exec(route);
    if (!match || +match[1] !== id) {
        return null;
    }
    return match[3];
}

export default function characterList({ DOM, value$, route$ }) {
    const newCharacter$ = new Rx.Subject();
    const characterViews$ = value$
        .first()
        .map(characters => characters.map((character, id) => {
            return characterMain({ DOM, value$: Rx.Observable.return(character), route$: route$.map(route => trimRoute(id, route)).distinctUntilChanged() });
        }))
        .map(characterViews => () => characterViews)
        .merge(newCharacter$
            .map(() => characterViews => {
                const id = characterViews.length;
                return characterViews.concat([
                    characterMain({ DOM, value$: Rx.Observable.return({}), route$: route$.map(route => trimRoute(id, route)).distinctUntilChanged() }),
                ]);
            }))
        .scan((acc, modifier) => modifier(acc), [])
        .shareReplay(1);

    const selectedCharacterView$ = characterViews$
        .combineLatest(route$, (characterViews, route) => {
            if (!route || route === 'new') {
                return null;
            }
            const id = parseRoute(route);
            if (id !== null) {
                const view = characterViews[id];
                if (view) {
                    return { id, view };
                }
            }
            return null;
        })
        .distinctUntilChanged()
        .shareReplay(1);

    return {
        DOM: characterViews$.combineLatest(route$.throttle(5),
            (characterViews, route) => {
                if (!route) {
                    const menuItems$ = Rx.Observable.combineLatest(characterViews
                        .map((view, i) => view.description$
                            .map(description => h('li.pure-menu-item', [
                                h('a.pure-menu-link', {
                                    href: `#/${i}`,
                                }, description || `Character #${i}`),
                            ]))));

                    return menuItems$
                        .map(menuItems => h('.pure-menu', [
                            h('span.pure-menu-heading', 'Characters'),
                            h('ul.pure-menu-list', menuItems
                                .concat([
                                    h('li.pure-menu-item', [
                                        h('a.pure-menu-link', {
                                            href: '#/new',
                                        }, 'New character'),
                                    ]),
                                ])),
                        ]))
                        .startWithThrottled(() => null);
                }
                if (route === 'new') {
                    window.location = '#/' + characterViews.length;
                    return Rx.Observable.return(h('div', ['Loading new character']));
                }
                const match = /^(\d+)(\/|$)(.*)/.exec(route);
                if (match) {
                    const id = +match[1];
                    const view = characterViews[id];
                    if (view) {
                        return view.DOM.startWithThrottled(() => null);
                    }
                    if (id === characterViews.length) {
                        newCharacter$.onNext();
                        return Rx.Observable.return(h('div', ['Loading']));
                    }
                }
                return Rx.Observable.return(h('div', ['Character not found']));
            })
            .switchLatest(),
        nav$: selectedCharacterView$
            .flatMapLatest(box => {
                if (!box) {
                    return Rx.Observable.return([]);
                }
                const { id, view } = box;
                return view.name$.combineLatest(view.nav$,
                    (charName, nav) => [{
                        name: charName,
                    }].concat(nav.map(({route, name}) => ({
                        route: `${id}/${route}`,
                        name,
                    }))))
                    .startWithThrottled(() => []);
            })
            .map(nav => makeNav({
                '': 'Characters',
            }).concat(nav)),
        value$: characterViews$
            .flatMapLatest(characterViews => Rx.Observable.combineLatest(
                characterViews.map(view => view.value$))),
    };
}
