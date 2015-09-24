import { h } from '@cycle/dom';

const FALLBACK_VALUE = {};
const FALLBACK_KEY = 'SELECT_FALLBACK';

function renderOptions(options, value, fallback) {
    let hasSelected = false;
    const data = Array.from(options)
        .map(({value: optionValue, text}) => {
            const selected = value === optionValue;
            hasSelected = hasSelected || selected;
            return {
                selected,
                optionValue,
                text,
            };
        });
    if (!hasSelected) {
        if (fallback) {
            data.unshift({
                selected: true,
                optionValue: FALLBACK_VALUE,
                text: fallback,
            });
        } else if (data.length) {
            data[0].selected = true;
        }
    }
    return data
        .map(({selected, optionValue, text}) => h('option', {
            key: optionValue === FALLBACK_VALUE ? FALLBACK_KEY : optionValue,
            value: optionValue === FALLBACK_VALUE ? undefined : optionValue,
            selected,
        }, [text]));
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
