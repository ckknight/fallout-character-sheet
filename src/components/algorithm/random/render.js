import { h } from '@cycle/dom';

export default function renderRandom(min, max, equation) {
    return h(`span.${name}.random`, {
        title: (equation || '').toString(),
    }, [
        h(`span.random--min.random--operand`, {
            key: 'min',
        }, [min]),
        h(`span.random--operator`, {
            key: 'operator',
        }, ['..']),
        h(`span.random--max.random--operand`, {
            key: 'max',
        }, [max]),
    ]);
}
