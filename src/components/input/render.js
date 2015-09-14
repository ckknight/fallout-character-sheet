import { h } from '@cycle/dom';

const typeToCalculateProps = {
    checkbox(key, value, props) {
        return Object.assign({
            key,
            type: 'checkbox',
            value: key,
            checked: value,
        }, props);
    },
    textarea(key, value, props) {
        return Object.assign({
            key,
            value,
        }, props);
    },
    integer(key, value, props) {
        return Object.assign({
            key,
            type: 'number',
            value,
            pattern: '[0-9]*',
        }, props);
    },
    number(key, value, props) {
        return Object.assign({
            key,
            type: 'number',
            value,
            pattern: '[0-9]*(?:\\.[0-9]*)?',
        }, props);
    },
    text(key, value, props, type) {
        return Object.assign({
            key,
            type,
            value,
        }, props);
    },
};

function calculateProps(key, type, value, props) {
    return (typeToCalculateProps[type] || typeToCalculateProps.text)(key, value, props || {}, type);
}

export default function render(key, type, value, props) {
    const tag = type === 'textarea' ? 'textarea' : 'input';
    return h(
        `${tag}.${key}`,
        calculateProps(key, type, value, props));
}
