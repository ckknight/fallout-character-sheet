import { h } from '@cycle/dom';
import getClassString from '../getClassString';

const operatorToDisplay = {
    '=': 'is',
    '<=': '≤',
    '>=': '≥',
};

export default function renderBinary(name, value, operator, left, right, equation) {
    return h(`span.${name}.binary${getClassString(value)}`, {
        title: (equation || '').toString() + ' = ' + value,
    }, [
        h(`span.${name}--left.binary--left.${name}--operand.binary--operand`, {
            key: 'left',
        }, [left]),
        h(`span.${name}--operator.binary--operator`, {
            key: 'operator',
        }, [operatorToDisplay[operator] || operator]),
        h(`span.${name}--right.binary--right.${name}--operand.binary--operand`, {
            key: 'right',
        }, [right]),
    ]);
}
