import { h } from '@cycle/dom';
import getClassString from './getClassString';

export default function renderNumber(value, type, props = {}) {
    return h(`span${getClassString(value, type)}`, props, ['' + value]);
}
