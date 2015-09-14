import { h } from '@cycle/dom';

export default function render(key, props, vTree) {
    const selector = `button.${key}`;

    return h(selector, Object.assign({
        key,
    }, props), Array.isArray(vTree) ? vTree : vTree);
}
