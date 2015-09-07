import { h } from '@cycle/dom';
import * as localize from '../../localize';

export default function (key, className) {
    const fullClassName = `.ref-${key}` + (className ? '.' + className : '');
    const name = localize.name(key);
    const abbr = localize.abbr(key);
    const vTree = name === abbr ?
        h(`span${fullClassName}`, [name]) :
        h(`abbr${fullClassName}`, {
            title: name,
        }, [abbr]);
    return vTree;
}
