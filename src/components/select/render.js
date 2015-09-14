import { h } from '@cycle/dom';

const FALLBACK_KEY = 'SELECT_FALLBACK';

function renderOptions(options, value, fallback) {
    let hasSelected = false;
    const optionsVTree = Array.from(options).map(({value: optionValue, text}) => {
        const selected = value === optionValue;
        hasSelected = hasSelected || selected;
        return h('option', {
            key: optionValue,
            value: optionValue,
            selected,
        }, [text]);
    });
    if (fallback && !hasSelected) {
        optionsVTree.unshift(h('option', {
            key: FALLBACK_KEY,
            selected: true,
        }, [fallback]));
    }
    return optionsVTree;
}

export default function renderSelect(key, options, value, props) {
    return h(
        `select.${key}`,
        Object.assign({
            key,
        }, props, {
            fallback: undefined,
        }),
        renderOptions(options, value, props && props.fallback));
}
