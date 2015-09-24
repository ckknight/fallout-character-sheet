import Immutable from 'immutable';
import { REPLACE } from './operations';

export default function replace(value, from, to) {
    if (from === to) {
        return value;
    }
    if (value === from) {
        return to;
    }
    if (Immutable.is(from, to)) {
        return value;
    }
    if (Immutable.is(value, from)) {
        return to;
    }
    if (value != null && typeof value[REPLACE] === 'function') {
        return value[REPLACE](element => replace(element, from, to));
    }
    return value;
}
