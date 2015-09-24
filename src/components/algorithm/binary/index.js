import { Rx } from '@cycle/core';
import Immutable from 'immutable';
import { operationsByOperator, operatorToName, leftIdentity, rightIdentity } from './constants';
import renderUnary from '../unary/render';
import renderBinary from './render';

const owns = Object.prototype.hasOwnProperty;

export default function calculateBinary(equation, calculations, calculateAlgorithm) {
    const operator = equation.type;
    if (!owns.call(operationsByOperator, operator)) {
        throw new Error(`Unknown operator: '${operator}'`);
    }
    const name = operatorToName[operator];
    const operation = operationsByOperator[operator];
    const leftView = calculateAlgorithm(equation.left, calculations);
    const rightView = calculateAlgorithm(equation.right, calculations);
    const value$ = leftView.value$.combineLatest(rightView.value$, operation)
        .distinctUntilChanged()
        .shareReplay(1);
    const equation$ = Rx.Observable.merge(
        leftView.equation$
            .map(eq => acc => acc.set('left', eq)),
        rightView.equation$
            .map(eq => acc => acc.set('right', eq)))
        .startWith(equation)
        .scan((eq, modifier) => modifier(eq))
        .distinctUntilChanged(undefined, Immutable.is)
        .shareReplay(1);
    return {
        DOM: leftView.DOM.combineLatest(rightView.DOM, value$.startWith(null), equation$,
            (left, right, value, eq) => {
                if (operator === '^' && equation.right === 0.5) {
                    return renderUnary(name, value, '√', left, eq);
                }
                if (rightIdentity[operator] === eq.right) {
                    return left;
                }
                if (leftIdentity[operator] === eq.left) {
                    return right;
                }
                if (typeof equation.left === 'number' && operator === '<=') {
                    return renderBinary(name, value, '>=', right, left, eq);
                }
                return renderBinary(name, value, operator, left, right, eq);
            }),
        value$,
        equation$,
        calculate() {
            return Rx.Observable.combineLatest(
                leftView.calculate(), rightView.calculate(),
                (left, right) => operationsByOperator[operator](left, right))
                .first();
        },
    };
}
