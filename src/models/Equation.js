import Immutable from 'immutable';
import When from './When';

const owns = Object.prototype.hasOwnProperty;

const UnaryOperationRecord = Immutable.Record({
    type: '',
    value: 0,
}, 'UnaryOperation');
class UnaryOperation extends UnaryOperationRecord {
    toString() {
        return `${this.type}(${this.value})`;
    }
}
const BinaryOperationRecord = Immutable.Record({
    type: '',
    left: 0,
    right: 0,
}, 'BinaryOperation');

class BinaryOperation extends BinaryOperationRecord {
    toString() {
        return `(${this.left} ${this.type} ${this.right})`;
    }
}

const Addition = new BinaryOperation({
    type: '+',
});
const Subtraction = new BinaryOperation({
    type: '-',
});
const Multiplication = new BinaryOperation({
    type: '*',
});
const Division = new BinaryOperation({
    type: '/',
});
const Exponentiate = new BinaryOperation({
    type: '^',
});
const Max = new BinaryOperation({
    type: 'max',
});
const Min = new BinaryOperation({
    type: 'min',
});
const Or = new BinaryOperation({
    type: 'or',
});
const And = new BinaryOperation({
    type: 'and',
});
const Equals = new BinaryOperation({
    type: '=',
});
const Floor = new UnaryOperation({
    type: 'floor',
});
const Ceiling = new UnaryOperation({
    type: 'ceil',
});
const Absolute = new UnaryOperation({
    type: 'abs',
});
const Not = new UnaryOperation({
    type: 'not',
});
const LessThanOrEqual = new BinaryOperation({
    type: '<=',
});

const RandomRecord = new Immutable.Record({
    min: 1,
    max: 1,
});
class Random extends RandomRecord {
    toString() {
        return `rand(${this.min}, ${this.max})`;
    }
}

function $when(conditions, path, validKeys, type) {
    if (!conditions || conditions.constructor !== Object) {
        throw new Error(`$when expects an object, got '${JSON.stringify(conditions)}' (in ${path})`);
    }

    return Object.entries(conditions)
        .filter(([key]) => key !== 'otherwise')
        .reduce((acc, [key, value]) => {
            return acc.setIn(['conditions', key], toEquation(value, `${path}.${key}`, validKeys, type));
        }, new When({
            otherwise: toEquation(conditions.otherwise || 0, `${path}.otherwise`, validKeys, type),
        }));
}

const operations = {
    number: {
        $inc(operand, path, validKeys) {
            return this.$add([operand, 1], path, validKeys);
        },
        $dec(operand, path, validKeys) {
            return this.$sub([operand, 1], path, validKeys);
        },
        $add(operands, path, validKeys) {
            if (!Array.isArray(operands)) {
                throw new Error(`$add expects an array, got '${JSON.stringify(operands)}' (in ${path})`);
            }
            return operands
                .map((o, index) => toEquation(o, `${path}[${index}]`, validKeys, 'number'))
                .reduce((left, right) => Addition.merge({
                        left,
                        right,
                    }));
        },
        $sub(operands, path, validKeys) {
            if (!Array.isArray(operands)) {
                throw new Error(`$sub expects an array, got '${JSON.stringify(operands)}' (in ${path})`);
            }
            return operands
                .map((o, index) => toEquation(o, `${path}[${index}]`, validKeys, 'number'))
                .reduce((left, right) => Subtraction.merge({
                        left,
                        right,
                    }));
        },
        $double(operand, path, validKeys) {
            return this.$mul([2, operand], path, validKeys);
        },
        $mul(operands, path, validKeys) {
            if (!Array.isArray(operands)) {
                throw new Error(`$mul expects an array, got '${JSON.stringify(operands)}' (in ${path})`);
            }
            return operands
                .map((o, index) => toEquation(o, `${path}[${index}]`, validKeys, 'number'))
                .reduce((left, right) => Multiplication.merge({
                        left,
                        right,
                    }));
        },
        $max(operands, path, validKeys) {
            if (!Array.isArray(operands)) {
                throw new Error(`$max expects an array, got '${JSON.stringify(operands)}' (in ${path})`);
            }
            return operands
                .map((o, index) => toEquation(o, `${path}[${index}]`, validKeys, 'number'))
                .reduce((left, right) => Max.merge({
                        left,
                        right,
                    }));
        },
        $min(operands, path, validKeys) {
            if (!Array.isArray(operands)) {
                throw new Error(`$min expects an array, got '${JSON.stringify(operands)}' (in ${path})`);
            }
            return operands
                .map((o, index) => toEquation(o, `${path}[${index}]`, validKeys, 'number'))
                .reduce((left, right) => Min.merge({
                        left,
                        right,
                    }));
        },
        $floor(operand, path, validKeys) {
            return Floor.set('value', toEquation(operand, path, validKeys, 'number'));
        },
        $ceil(operand, path, validKeys) {
            return Ceiling.set('value', toEquation(operand, path, validKeys, 'number'));
        },
        $abs(operand, path, validKeys) {
            return Absolute.set('value', toEquation(operand, path, validKeys, 'number'));
        },
        $half(operand, path, validKeys) {
            return this.$div([operand, 2], path, validKeys);
        },
        $sqrt(operand, path, validKeys) {
            return this.$pow([operand, 0.5], path, validKeys);
        },
        $pow(operands, path, validKeys) {
            if (!Array.isArray(operands)) {
                throw new Error(`$pow expects an array, got '${JSON.stringify(operands)}' (in ${path})`);
            }
            return operands
                .map((o, index) => toEquation(o, `${path}[${index}]`, validKeys, 'number'))
                .reduceRight((right, left) => Exponentiate.merge({
                        left,
                        right,
                    }));
        },
        $div(operands, path, validKeys) {
            if (!Array.isArray(operands)) {
                throw new Error(`$div expects an array, got '${JSON.stringify(operands)}' (in ${path})`);
            }
            return operands
                .map((o, index) => toEquation(o, `${path}[${index}]`, validKeys, 'number'))
                .reduce((left, right) => Division.merge({
                        left,
                        right,
                    }));
        },
        $rand(range, path, validKeys) {
            if (Array.isArray(range)) {
                if (range.length !== 2) {
                    throw new Error(`$rand expects an array of length 2, got '${range.length}' (in ${path})`);
                }
                return new Random({
                    min: toEquation(range[0], `${path}[0]`, validKeys, 'number'),
                    max: toEquation(range[1], `${path}[1]`, validKeys, 'number'),
                });
            }

            return new Random({
                min: 1,
                max: toEquation(range, path, validKeys, 'number'),
            });
        },
    },
    boolean: {
        $some(operands, path, validKeys) {
            if (!Array.isArray(operands)) {
                throw new Error(`$some expects an array, got '${JSON.stringify(operands)}' (in ${operands})`);
            }
            return operands
                .map((o, index) => toEquation(o, `${path}[index]`, validKeys, 'boolean'))
                .reduce((left, right) => Or.merge({
                        left,
                        right,
                    }));
        },
    },
    string: {
        // $not(values, path, validKeys) {
        //     if (!Array.isArray(values)) {
        //         values = [values];
        //     }
        //     return values
        //         .map(value => Not.merge({
        //             value: Equals.merge({
        //                 left: left,
        //                 right:
        //             })
        //         })
        // }
    },
    any: {
        $when,
    },
};

function convertOperation(key, value, path, validKeys, type) {
    if (!owns.call(operations, type)) {
        throw new Error(`Unknown operation: '${type}' (in ${path})`);
    }
    const typeOperations = operations[type];
    const anyOperations = operations.any;
    if (!owns.call(typeOperations, key) && !owns.call(anyOperations, key)) {
        throw new Error(`Unknown operation for ${type}: '${key}' (in ${path})`);
    }
    if (typeOperations[key]) {
        return typeOperations[key](value, path, validKeys, type);
    } else {
        return anyOperations[key](value, path, validKeys, type);
    }
}

function convertRange(key, range, path, validKeys) {
    const ranges = [
        range.min != null ? LessThanOrEqual.merge({
            left: toEquation(range.min, `${path}.min`, validKeys, 'number'),
            right: key,
        }) : null,
        range.max != null ? LessThanOrEqual.merge({
            left: key,
            right: toEquation(range.max, `${path}.max`, validKeys, 'number'),
        }) : null,
    ].filter(x => x);

    if (ranges.length !== Object.keys(range).length) {
        throw new Error(`Cannot have more than "min" and "max" on a range (at ${path})`);
    }

    return ranges
        .reduce((left, right) => And.merge({
                left,
                right,
            }));
}

const convertCheckByType = {
    number(key, value, path, validKeys) {
        if (value && value.constructor === Object && ('min' in value || 'max' in value)) {
            // { "strength": { "min": 4, "max": 7 } }
            return convertRange(key, value, path, validKeys);
        }

        return LessThanOrEqual.merge({
            left: toEquation(value, path, validKeys, 'number'),
            right: key,
        });
    },
    string(key, value, path, validKeys) {
        if (typeof value === 'string') {
            return Equals.merge({
                left: key,
                right: value,
            });
        }

        if (Array.isArray(value)) {
            return value
                .map((element, index) => Equals.merge({
                        left: key,
                        right: toEquation(element, `${path}[${index}]`, validKeys, 'string'),
                    }))
                .reduce((left, right) => Or.merge({
                        left,
                        right,
                    }));
        }

        if (value != null && value.constructor === Object) {
            if (value.$not) {
                if (Object.keys(value).length !== 1) {
                    throw new Error(`Cannot use "$not" with other keys (at ${path})`);
                }
                return Not.merge({
                    value: convertCheck(key, value.$not, path, validKeys),
                });
            }
            return Equals.merge({
                left: key,
                right: toEquation(value, path, validKeys, 'string'),
            });
        }
        throw new Error(`Unable to convert ${JSON.stringify(value)} at ${path}`);
    },
};

function convertCheck(key, value, path, validKeys) {
    if (!owns.call(validKeys, key)) {
        throw new Error(`Unknown key: '${key}' (at ${path})`);
    }

    const type = validKeys[key];
    return convertCheckByType[type](key, value, path, validKeys);
}

function convertObject(object, path, validKeys, type) {
    const keys = Object.keys(object);
    const len = keys.length;
    if (!len) {
        throw new Error(`Expected an object with at least one property (in ${path})`);
    }
    const conversions = keys
        .map(key => {
            if (key.charAt(0) === '$') {
                return convertOperation(key, object[key], `${path}.${key}`, validKeys, type);
            } else if (type === 'boolean') {
                return convertCheck(key, object[key], `${path}.${key}`, validKeys);
            } else {
                throw new Error(`Unexpected key '${key}' in ${path}`);
            }
        });
    if (conversions.length === 1) {
        return conversions[0];
    }
    if (type !== 'boolean') {
        throw new Error(`Expected object to only have one property (in ${path})`);
    }
    return conversions
        .reduce((left, right) => And.merge({
                left,
                right,
            }));
}

const VALID_TYPES = {
    number: true,
    boolean: true,
    string: true,
    any: true,
};

function toEquation(value, path, validKeys, type) {
    if (typeof path !== 'string') {
        throw new TypeError(`Expected ${path} to be a string`);
    }
    if (validKeys == null) {
        throw new TypeError('Expected validKeys to be an object');
    }
    const valueType = typeof value;
    if (valueType === 'string') {
        if (!owns.call(validKeys, value)) {
            throw new Error(`Unknown value '${value}' at ${path}`);
        }
        return value;
    }
    if (VALID_TYPES[valueType]) {
        if (typeof value !== type) {
            throw new TypeError(`Expected ${value} to be a ${type}, got ${typeof value} (at ${path})`);
        }
        return value;
    }
    if (!VALID_TYPES[type]) {
        throw new Error(`Unknown type: '${type}'`);
    }
    if (value && value.constructor === Object) {
        return convertObject(value, path, validKeys, type);
    }
    if (type === 'boolean' && value == null) {
        return true;
    }
    throw new Error(`Unable to convert '${JSON.stringify(value)}' to an equation (in ${path})`);
}

function simplify(equation) {
    if (Object(equation) !== equation) {
        return equation;
    }
    if (typeof equation.simplify === 'function') {
        return equation.simplify();
    }
    return equation;
}

export default function exports(value, path, validKeys, type) {
    return simplify(toEquation(value, path, validKeys, type));
}
exports.Not = Not;
exports.Or = Or;
exports.Equals = Equals;
exports.LessThanOrEqual = LessThanOrEqual;
exports.BinaryOperation = BinaryOperation;
exports.UnaryOperation = UnaryOperation;

function replace(value, from, to) {
    if (value === from || Immutable.is(value, from)) {
        return to;
    } else if (value instanceof BinaryOperation) {
        return value.merge({
            left: replace(value.left, from, to),
            right: replace(value.right, from, to),
        });
    } else if (value instanceof UnaryOperation) {
        return value.set('value', replace(value.value, from, to));
    } else {
        return value;
    }
}
exports.replace = replace;
