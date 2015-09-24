import { h } from '@cycle/dom';
import When from '../../models/When';
import { BinaryOperation, UnaryOperation, Random } from '../../models/Equation/operations';
import Immutable from 'immutable';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import calculateNumber from './number';
import calculateBoolean from './boolean';
import calculateString from './string';
import calculateBinary from './binary';
import calculateUnary from './unary';
import calculateWhen from './when';
import calculateRandom from './random';
// import calculateInput from './input';
import '../../rx-start-with-throttled';

function calculateAlgorithm(equation, calculations) {
    if (typeof equation === 'number') {
        return calculateNumber(equation);
    } else if (typeof equation === 'boolean') {
        return calculateBoolean(equation);
    } else if (typeof equation === 'string') {
        return calculateString(equation, calculations);
    } else if (equation instanceof BinaryOperation) {
        return calculateBinary(equation, calculations, calculateAlgorithm);
    } else if (equation instanceof UnaryOperation) {
        return calculateUnary(equation, calculations, calculateAlgorithm);
    } else if (equation instanceof When) {
        return calculateWhen(equation, calculations, calculateAlgorithm);
    } else if (equation instanceof Random) {
        return calculateRandom(equation, calculations, calculateAlgorithm);
    }
    throw new TypeError(`Unknown equation: ${equation}`);
}

export default function algorithm({equation$, calculations}) {
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
            .startWithThrottled(() => loadingIndicator('algorithm'))
            .catch(errorHandler('algorithm'))
            .map(vTree => h('div.algorithm', [vTree])),
        value$: result
            .flatMapLatest(x => x.value$)
            .distinctUntilChanged()
            .shareReplay(1),
        equation$: result
            .flatMapLatest(x => x.equation$)
            .distinctUntilChanged(undefined, Immutable.is)
            .shareReplay(1),
        calculate() {
            return result
                .flatMapLatest(x => x.calculate())
                .first();
        },
    };
}
