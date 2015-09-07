import Immutable from 'immutable';
import withNiceToString from './withNiceToString';
import { BODY_PARTS, PRIMARY_STATISTICS, SECONDARY_STATISTICS, SKILLS, MISCELLANEOUS } from '../constants.json';
import toEquation from './Equation';

const { Not, Or, Equals, LessThanOrEqual, GreaterThanOrEqual } = toEquation;

const owns = Object.prototype.hasOwnProperty;
const operations = {
    $not(value, path) {
        return Not.merge({
            value: toRequirementEquation(value, path),
        });
    },
};
function performOperation(key, value, path) {
    if (!owns.call(operations, key)) {
        throw new Error(`Unknown operation: '${key}' (at ${path})`);
    }
    return operations[key](value, path);
}

function createRange(object, path) {
    if (object.min) {
        LessThanOrEqual.merge({
            left: object.min,
            right:
        })
        if (object.max) {

        }
    } else if (object.max) {

    } else {
        throw new Error(`Cannot create a range from ${JSON.stringify(object)}`);
    }
}

function toRequirementEquation(key, value, path) {
    if (value && value.constructor === Object) {
        if (value.min || value.max) {
            return createRange(key, value, path);
        }
        const keys = Object.keys(value);
        if (keys.length !== 1) {
            throw new Error(`Expected object to only have one key, got ${keys.length} (at ${path})`);
        }
        return performOperation(key, keys[0], value[keys[0]], path);
    } else if (Array.isArray(value)) {
        return value
            .map(right => Equals.merge({
                    left: 'value',
                    right,
                }))
            .reduce((left, right) => Or.merge({
                    left,
                    right,
                }));
    } else {
        return value;
    }
}

const fields = {
    race: null,
    $some: Immutable.List(),
};

[].concat(
    Object.keys(PRIMARY_STATISTICS),
    Object.keys(SECONDARY_STATISTICS),
    Object.keys(SKILLS),
    ...Object.values(SKILLS)
        .map(skill => Object.keys(skill)),
    Object.keys(MISCELLANEOUS))
    .forEach(key => {
        fields[key] = 'value';
    });
const Requirements = withNiceToString(Immutable.Record(fields, 'Requirements'), fields);
Requirements.from = function (object, path) {
    return new Requirements().mergeDeep(Object.entries(object || {})
        .reduce((acc, [key, value]) => {
            acc[key] = toRequirementEquation(key, value, `${path}.${key}`);
            return acc;
        }, {}));
};
export default Requirements;
