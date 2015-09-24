import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import characterMain from '../characterMain';

function makeNav(items) {
    return Object.entries(items)
        .map(([route, name]) => ({
            route,
            name,
        }));
}

export default function characterList({ DOM, value$, route$ }) {
    const characterViews$ = value$
        .map(value => value.characters || [])
        .first()
        .map(characters => characters.map(character => {
            return characterMain({ DOM, value$: Rx.Observable.return(character), route$ });
        }))
        .shareReplay(1);

    return {
        DOM: characterViews$
            .flatMapLatest(characterViews => {
                return route$
                    .map(route => {
                        if (route === 'list') {
                            return h('div', ['List View!']);
                        }
                        const match = /^(\d+)(\/|$)(.*)/.test(route);
                        if (match) {
                            const view = characterViews[+match[1]];
                            if (view) {
                                return view.DOM;
                            }
                        }
                        return h('div', ['Character not found']);
                    });
            }),
        nav$: Rx.Observable.return(makeNav({
            list: 'Characters',
        })),
        value$: characterViews$
            .map(characterViews => Rx.Observable.combineLatest(characterViews.map(view => view.value$))),
    };
}
