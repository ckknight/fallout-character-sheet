import Immutable from 'immutable';
import withNiceToString from './withNiceToString';
import { PRIMARY_STATISTICS, SECONDARY_STATISTICS, SKILLS, MISCELLANEOUS } from '../constants.json';
import When from './When';
import toEquation from './Equation';
import equationReplace from './Equation/replace';

const effectFields = {
    $when: null,
    $nearby: null,
};
['poisonTypeA', 'poisonTypeB', 'poisonTypeD', 'rads', 'fire'].concat(
    Object.keys(PRIMARY_STATISTICS),
    Object.keys(SECONDARY_STATISTICS),
    Object.keys(SKILLS),
    ...Object.values(SKILLS)
        .map(skill => Object.keys(skill)),
    Object.keys(MISCELLANEOUS))
    .forEach(key => {
        effectFields[key] = 'value';
    });

const VALID_KEYS = [].concat(
    Object.keys(PRIMARY_STATISTICS),
    Object.keys(SECONDARY_STATISTICS),
    Object.keys(SKILLS),
    ...Object.values(SKILLS)
        .map(skill => Object.keys(skill)),
    Object.keys(MISCELLANEOUS)
)
    .reduce((acc, key) => {
        acc[key] = 'number';
        return acc;
    }, {
        race: 'string',
        value: 'number',
    });

const Effect = withNiceToString(new Immutable.Record(effectFields, 'Effect'), effectFields);

function convertEffectValue(key, value, path) {
    if (key === '$when') {
        return new When().mergeDeep({
            conditions: Object.entries(value)
                .filter(([conditionKey]) => conditionKey !== 'otherwise')
                .reduce((acc, [conditionKey, conditionValue]) => {
                    acc[conditionKey] = Effect.from(conditionValue, `${path}.${conditionKey}`);
                    return acc;
                }, {}),
            otherwise: value.otherwise || new Effect(),
        });
    }
    if (key === '$nearby') {
        return Effect.from(value, path);
    }
    if (!VALID_KEYS[key]) {
        throw new Error(`Unknown key: '${key}' at ${path}`);
    }
    return toEquation(value, path, VALID_KEYS, VALID_KEYS[key]);
}

const effectKeys = Object.keys(effectFields);
Effect.prototype.mergeEffects = function mergeEffects(other) {
    return effectKeys
        .reduce((acc, key) => {
            if (key.charAt(0) === '$') {
                // TODO: do something
                return acc;
            }
            if (other[key] === 'value') {
                return acc;
            }
            return acc.set(key, equationReplace(acc[key], 'value', other[key]));
        }, this);
};
Effect.from = function from(object, path) {
    return new Effect().mergeDeep(Object.entries(object || {})
        .reduce((acc, [key, value]) => {
            acc[key] = convertEffectValue(key, value, `${path}.${key}`);
            return acc;
        }, {}));
};
export default Effect;
