import { h } from '@cycle/dom';
import * as localize from '../../../localize';

export default function renderString(key, value) {
    const name = localize.name(key);
    const abbr = localize.abbr(key);
    const vTree = h(`span.ref-${key}`, {
        title: `${name} = ${value}`,
    }, [abbr]);
    return vTree;
}
