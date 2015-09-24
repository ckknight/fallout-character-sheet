import Immutable from 'immutable';

export const REPLACE = typeof Symbol === 'function' && Symbol('@@equationReplace') || '@@equationReplace';

const UnaryOperationRecord = new Immutable.Record({
    type: '',
    value: 0,
}, 'UnaryOperation');
export class UnaryOperation extends UnaryOperationRecord {
    toString() {
        return `${this.type}(${this.value})`;
    }

    [REPLACE](fn) {
        return this.set('value', fn(this.value));
    }
}

const BinaryOperationRecord = new Immutable.Record({
    type: '',
    left: 0,
    right: 0,
}, 'BinaryOperation');
export class BinaryOperation extends BinaryOperationRecord {
    toString() {
        return `(${this.left} ${this.type} ${this.right})`;
    }

    [REPLACE](fn) {
        return this.merge({
            left: fn(this.left),
            right: fn(this.right),
        });
    }
}

const bin = new BinaryOperation();
export const Addition = bin.set('type', '+');
export const Subtraction = bin.set('type', '-');
export const Multiplication = bin.set('type', '*');
export const Division = bin.set('type', '/');
export const Exponentiate = bin.set('type', '^');
export const Max = bin.set('type', 'max');
export const Min = bin.set('type', 'min');
export const Or = bin.set('type', 'or');
export const And = bin.set('type', 'and');
export const Equals = bin.set('type', '=');
export const LessThanOrEqual = bin.set('type', '<=');

const un = new UnaryOperation();
export const Floor = un.set('type', 'floor');
export const Ceiling = un.set('type', 'ceil');
export const Absolute = un.set('type', 'abs');
export const Not = un.set('type', 'not');

const RandomRecord = new Immutable.Record({
    min: 1,
    max: 1,
});
export class Random extends RandomRecord {
    toString() {
        return `rand(${this.min}, ${this.max})`;
    }

    [REPLACE](fn) {
        return this.merge({
            min: fn(this.min),
            max: fn(this.max),
        });
    }
}

const InputRecord = new Immutable.Record({
    initial: 0,
    min: -Infinity,
    max: Infinity,
    step: 1,
});
export class Input extends InputRecord {
    toString() {
        return `input(${this.initial}, ${this.min}, ${this.max}, ${this.step})`;
    }

    [REPLACE](fn) {
        return this.merge({
            initial: fn(this.initial),
            min: fn(this.min),
            max: fn(this.max),
            step: fn(this.step),
        });
    }
}
