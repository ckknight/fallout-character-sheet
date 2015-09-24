import { h } from '@cycle/dom';

function renderRandomWithMin1(min, max, equation) {
    return h(`span.${name}.random.random-${equation.min}-${equation.max}.random-1d${equation.max}`, {
        title: (equation || '').toString(),
    }, [
        h(`span.random--min.random--operand`, {
            key: 'min',
        }, [min]),
        h(`span.random--operator`, {
            key: 'operator',
        }, ['d']),
        h(`span.random--max.random--operand`, {
            key: 'max',
        }, [max]),
    ]);
}

export default function renderRandom(min, max, equation) {
    if (equation.min === 1) {
        return renderRandomWithMin1(min, max, equation);
    }
    return h(`span.${name}.random.random-${equation.min}-${equation.max}`, {
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
