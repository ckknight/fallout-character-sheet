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
        return typeToCalculateProps.number(key, value, Object.assign({
            step: 1,
        }, props));
    },
    number(key, value, props) {
        const isInteger = props.step && Math.floor(props.step) === props.step;
        const resultProps = Object.assign({
            key,
            type: 'number',
            value,
            pattern: isInteger ? '[0-9]*' : '[0-9]*(?:\\.[0-9]*)?',
        }, props);
        if (resultProps.max === Infinity) {
            resultProps.max = undefined;
        }
        if (resultProps.min === -Infinity) {
            resultProps.min = undefined;
        }
        return resultProps;
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
