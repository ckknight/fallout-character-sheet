import { h } from '@cycle/dom';
import * as localize from '../../localize';
import combineLatestObject from '../../combineLatestObject';
import When from '../../models/When';
import { BinaryOperation, UnaryOperation } from '../../models/Equation';
import Immutable from 'immutable';

const owns = Object.prototype.hasOwnProperty;

function renderUnary(name, value, operator, operand, equation) {
    return h(`span.${name}.unary`, {
        title: (equation || '').toString() + ' = ' + value,
    }, [
        h(`span.${name}--operator.unary--operator`, [operator]),
        h(`span.${name}--operand.unary--operand`, [operand]),
    ]);
}
function renderBinary(name, value, operator, left, right, equation) {
    // if (operator === '*' && typeof equation.right === 'number' && typeof equation.left !== 'number') {
    //     return renderBinary(name, value, operator, right, left, equation.merge({
    //         left: equation.right,
    //         right: equation.left,
    //     }));
    // }
    return h(`span.${name}.binary`, {
        title: (equation || '').toString() + ' = ' + value,
    }, [
        h(`span.${name}--left.binary--left.${name}--operand.binary--operand`, [left]),
        h(`span.${name}--operator.binary--operator`, [operator === '=' ? 'is' : operator]),
        h(`span.${name}--right.binary--right.${name}--operand.binary--operand`, [right]),
    ]);
}

const operatorToName = {
    '+': 'add',
    '-': 'sub',
    '*': 'mul',
    '/': 'div',
    '=': 'eq',
    '^': 'pow',
    or: 'or',
    and: 'and',
    max: 'max',
    min: 'min',
};
const operationsByOperator = {
    '+': (x, y) => (+x) + (+y),
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
    '=': (x, y) => x === y,
    '^': (x, y) => Math.pow(x, y),
    or: (x, y) => x || y,
    and: (x, y) => x && y,
    max: (x, y) => y > x ? y : x,
    min: (x, y) => y < x ? y : x,
};
const rightIdentity = {
    '+': 0,
    '-': 0,
    '*': 1,
    '/': 1,
    '^': 1,
};
const leftIdentity = {
    '+': 0,
    '*': 1,
};

function calculateBinary(equation, calculations) {
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
        .scan((equation, modifier) => modifier(equation))
        .distinctUntilChanged(undefined, Immutable.is)
        .shareReplay(1);
    return {
        DOM: leftView.DOM.combineLatest(rightView.DOM, value$.startWith('(calculating)'), equation$,
            (left, right, value, equation) => {
                if (operator === '^' && equation.right === 0.5) {
                    return renderUnary(name, value, '√', left, equation);
                }
                if (rightIdentity[operator] === equation.right) {
                    return left;
                }
                if (leftIdentity[operator] === equation.left) {
                    return right;
                }
                return renderBinary(name, value, operator, left, right, equation);
            }),
        value$,
        equation$,
    };
}

const unaryOperatorToName = {
    not: 'not',
    floor: 'floor',
    ceil: 'ceil',
};
const unaryOperationsByOperator = {
    not: x => !x,
    floor: Math.floor,
    ceil: Math.ceil,
};
function calculateUnary(equation, calculations) {
    const operator = equation.type;
    if (!owns.call(unaryOperationsByOperator, operator)) {
        throw new Error(`Unknown operator: '${operator}'`);
    }
    const name = unaryOperatorToName[operator];
    const operation = unaryOperationsByOperator[operator];
    const operandView = calculateAlgorithm(equation.value, calculations);
    const value$ = operandView.value$
        .map(operation)
        .distinctUntilChanged()
        .shareReplay(1);
    const equation$ = operandView.equation$
        .startWith(equation)
        .scan((equation, operand) => equation.set('value', operand))
        .distinctUntilChanged(undefined, Immutable.is)
        .shareReplay(1);
    return {
        DOM: operandView.DOM.combineLatest(value$.startWith('(calculating)'), equation$,
            (operand, value, equation) => renderUnary(name, value, operator, operand, equation)),
        value$,
        equation$,
    };
}

function calculateWhen(equation, calculations) {
    const otherwiseView = calculateAlgorithm(equation.otherwise, calculations);
    const possibilities = equation.conditions
        .toKeyedSeq()
        .map((value, condition) => {
            const operandView = calculateAlgorithm(value, calculations);
            return {
                condition$: calculations.get(condition),
                DOM: operandView.DOM,
                value$: operandView.value$,
                equation$: operandView.equation$,
            };
        })
        .toArray()
        .concat([{
            condition$: Rx.Observable.return(true),
            DOM: otherwiseView.DOM,
            value$: otherwiseView.value$,
            equation$: otherwiseView.equation$,
        }]);

    const result = Rx.Observable.combineLatest(possibilities
        .map(({condition$, DOM, value$, equation$}) => Rx.Observable.combineLatest(
                condition$, DOM, value$, equation$, (condition, vTree, value, equation) => {
                    if (!condition) {
                        return null;
                    }
                    return {
                        vTree,
                        value,
                        equation,
                    };
                })))
        .map(values => values.find(x => x))
        .share();
    return {
        DOM: result.pluck('vTree'),
        value$: result.pluck('value')
            .distinctUntilChanged()
            .shareReplay(1),
        equation$: result.pluck('equation')
            .distinctUntilChanged(undefined, Immutable.is)
            .shareReplay(1),
    };
}

function calculateNumber(number) {
    return {
        DOM: Rx.Observable.return(h('span.number', ['' + number])),
        value$: Rx.Observable.return(number),
        equation$: Rx.Observable.return(number),
    };
}

function calculateBoolean(boolean) {
    return {
        DOM: Rx.Observable.return(h(`span.boolean.boolean-${boolean}`, ['' + boolean])),
        value$: Rx.Observable.return(boolean),
        equation$: Rx.Observable.return(boolean),
    };
}

function calculateString(key, calculations) {
    return {
        DOM: Rx.Observable.return(null)
            .map(() => {
                const name = localize.name(key);
                const abbr = localize.abbr(key);
                const vTree = name === abbr ?
                    h(`span.ref-${key}`, [name]) :
                    h(`abbr.ref-${key}`, {
                        title: name,
                    }, [abbr]);
                return vTree;
            }),
        value$: calculations.get(key),
        equation$: Rx.Observable.return(key),
    };
}

function calculateAlgorithm(equation, calculations) {
    if (typeof equation === 'number') {
        return calculateNumber(equation);
    } else if (typeof equation === 'boolean') {
        return calculateBoolean(equation);
    } else if (typeof equation === 'string') {
        return calculateString(equation, calculations);
    } else if (equation instanceof BinaryOperation) {
        return calculateBinary(equation, calculations);
    } else if (equation instanceof UnaryOperation) {
        return calculateUnary(equation, calculations);
    } else if (equation instanceof When) {
        return calculateWhen(equation, calculations);
    } else {
        throw new Error(`Unknown equation: ${equation}`);
    }
}

export default function ({equation$, calculations}) {
    if (!calculations) {
        throw new TypeError(`Expected calculations to be non-null`);
    }
    const result = equation$
        .map(equation => calculateAlgorithm(equation, calculations))
        .shareReplay(1);
    return {
        DOM: result
            .flatMapLatest(x => x.DOM)
            .distinctUntilChanged()
            .startWith('(calculating)')
            .map(vTree => h('div.algorithm', [vTree])),
        value$: result
            .flatMapLatest(x => x.value$)
            .distinctUntilChanged()
            .share(),
        equation$: result
            .flatMapLatest(x => x.equation$)
            .distinctUntilChanged(undefined, Immutable.is)
            .share(),
    };
}
