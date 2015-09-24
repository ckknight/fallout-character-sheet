import When from '../When';
import { LessThanOrEqual, And, Equals, Or, Not, Addition, Subtraction, Multiplication, Max, Min, Floor, Ceiling, Absolute, Exponentiate, Division, Random, Input } from './operations';

const owns = Object.prototype.hasOwnProperty;

function isPlainObject(value) {
    return value != null && value.constructor === Object;
}

const VALID_TYPES = {
    number: true,
    boolean: true,
    string: true,
    any: true,
};

export default function toEquation(value, path, validKeys, type) {
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
    if (isPlainObject(value)) {
        return convertObject(value, path, validKeys, type); // eslint-disable-line no-use-before-define
    }
    if (type === 'boolean' && value == null) {
        return true;
    }
    throw new Error(`Unable to convert '${JSON.stringify(value)}' to an equation (in ${path})`);
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
        if (isPlainObject(value) && ('min' in value || 'max' in value)) {
            // e.g. { "strength": { "min": 4, "max": 7 } }
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

        if (isPlainObject(value)) {
            if (value.$not) {
                if (Object.keys(value).length !== 1) {
                    throw new Error(`Cannot use "$not" with other keys (at ${path})`);
                }
                return Not.merge({
                    value: convertCheck(key, value.$not, path, validKeys), // eslint-disable-line no-use-before-define
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
        $input(spec, path, validKeys) {
            return new Input({
                initial: 'initial' in spec ? toEquation(spec.initial, path, validKeys, 'number') : 0,
                min: 'min' in spec ? toEquation(spec.min, path, validKeys, 'number') : -Infinity,
                max: 'max' in spec ? toEquation(spec.max, path, validKeys, 'number') : Infinity,
                step: 'step' in spec ? toEquation(spec.step, path, validKeys, 'number') : Infinity,
            });
        },
    },
    boolean: {
        $some(operands, path, validKeys) {
            if (!Array.isArray(operands)) {
                throw new Error(`$some expects an array, got '${JSON.stringify(operands)}' (in ${operands})`);
            }
            return operands
                .map((o, index) => toEquation(o, `${path}[${index}]`, validKeys, 'boolean'))
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
        $when(conditions, path, validKeys, type) {
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
        },
    },
};

function convertOperation(key, value, path, validKeys, type) {
    if (!owns.call(operations, type)) {
        throw new Error(`Unknown operation: '${type}' (in ${path})`);
    }
    const typeOperations = operations[type];
    if (owns.call(typeOperations, key)) {
        return typeOperations[key](value, path, validKeys, type);
    }
    if (type !== 'any') { // because we've already checked it
        const anyOperations = operations.any;
        if (owns.call(anyOperations, key)) {
            return anyOperations[key](value, path, validKeys, type);
        }
    }
    throw new Error(`Unknown operation for ${type}: '${key}' (in ${path})`);
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
            }
            if (type === 'boolean') {
                return convertCheck(key, object[key], `${path}.${key}`, validKeys);
            }
            throw new Error(`Unexpected key '${key}' in ${path}`);
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
