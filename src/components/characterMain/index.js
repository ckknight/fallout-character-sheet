import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import characterSheet from '../characterSheet';

function makeNav(items) {
    return Object.entries(items)
        .map(([route, name]) => ({
            route,
            name,
        }));
}

export default function characterMain({ DOM, value$, route$ }) {
    const characterView = characterSheet({ DOM, value$, route$ });
    return {
        DOM: characterView.DOM,
        nav$: Rx.Observable.return(makeNav({
            cosmetic: 'Cosmetic',
            primary: 'Primary',
            secondary: 'Secondary',
            miscellaneous: 'Miscellaneous',
            skills: 'Skills',
            perks: 'Perks',
            traits: 'Traits',
            health: 'Health',
        })),
        value$: characterView.value$,
    };
}
