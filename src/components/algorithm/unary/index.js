import Immutable from 'immutable';
import { operatorToName, operationsByOperator } from './constants';
import renderUnary from './render';

const owns = Object.prototype.hasOwnProperty;

export default function calculateUnary(equation, calculations, calculateAlgorithm) {
    const operator = equation.type;
    if (!owns.call(operationsByOperator, operator)) {
        throw new Error(`Unknown operator: '${operator}'`);
    }
    const name = operatorToName[operator] || operator;
    const operation = operationsByOperator[operator];
    const operandView = calculateAlgorithm(equation.value, calculations);
    const value$ = operandView.value$
        .map(operation)
        .distinctUntilChanged()
        .shareReplay(1);
    const equation$ = operandView.equation$
        .startWith(equation)
        .scan((acc, operand) => acc.set('value', operand))
        .distinctUntilChanged(undefined, Immutable.is)
        .shareReplay(1);
    return {
        DOM: operandView.DOM.combineLatest(value$.startWith('(calculating unary)'), equation$,
            (operand, value, eq) => renderUnary(name, value, operator, operand, eq)),
        value$,
        equation$,
        calculate() {
            return operandView.calculate()
                .map(operand => operationsByOperator[operator](operand));
        },
    };
}
