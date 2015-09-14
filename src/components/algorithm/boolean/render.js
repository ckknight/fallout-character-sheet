import { h } from '@cycle/dom';
import getClassString from './getClassString';

export default function renderBoolean(value, type, props = {}) {
    return h(`span${getClassString(value, type)}`, props, ['' + value]);
}
