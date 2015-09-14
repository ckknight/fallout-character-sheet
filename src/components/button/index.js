import render from './render';
import errorHandler from '../errorHandler';

export default function button(key, {DOM, vTree$, props$}) {
    const click$ = DOM.select(`.${key}`)
        .events('click')
        .map(() => true);

    return {
        DOM: vTree$.combineLatest(props$,
            (vTree, props) => render(key, props, vTree))
            .catch(errorHandler(key)),
        value$: click$,
    };
}
