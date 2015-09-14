import { h } from '@cycle/dom';
import getClassString from '../getClassString';

export default function renderUnary(name, value, operator, operand, equation) {
    return h(`span.${name}.unary${getClassString(value)}`, {
        title: (equation || '').toString() + ' = ' + value,
    }, [
        h(`span.${name}--operator.unary--operator`, {
            key: 'operator',
        }, [operator]),
        h(`span.${name}--operand.unary--operand`, {
            key: 'operand',
        }, [operand]),
    ]);
}
