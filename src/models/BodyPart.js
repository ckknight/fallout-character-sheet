import Immutable from 'immutable';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import { BODY_PARTS, PRIMARY_STATISTICS, SECONDARY_STATISTICS } from '../constants.json';
import toEquation from './Equation';
import Effect from './Effect';

const partFields = {
    key: '',
    crippleEffect: new Effect(),
    crippleHealth: 0,
    targetPenalty: 0,
    damage: 'value',
    meta: '',
};
const SubPart = withNiceToString(withLocalization(new Immutable.Record(partFields, 'BodySubPart')), partFields);

const VALID_KEYS = [].concat(
    Object.keys(PRIMARY_STATISTICS),
    Object.keys(SECONDARY_STATISTICS)
)
    .reduce((acc, key) => {
        acc[key] = true;
        return acc;
    }, {});

const VALID_KEYS_WITH_VALUE = Object.assign({
    value: true,
}, VALID_KEYS);

function fallback(value, otherwise) {
    if (value === undefined) {
        return otherwise;
    }
    return value;
}

function convertParts(object, path) {
    return Object.entries(object)
        .reduce((acc, [key, value]) => {
            const copy = Object.assign({}, value);
            copy.damage = toEquation(fallback(copy.damage, 'value'), `${path}.damage`, VALID_KEYS_WITH_VALUE, 'number');
            copy.crippleHealth = toEquation(copy.crippleHealth, `${path}.crippleHealth`, VALID_KEYS, 'number');
            copy.crippleEffect = Effect.from(copy.crippleEffect || {}, `${path}.crippleEffect`);
            acc[key] = new SubPart({
                key,
            }).mergeDeep(copy);
            return acc;
        }, {});
}

const fields = {
    key: '',
    multiple: null,
    crippleEffect: new Effect(),
    crippleHealth: 0,
    cripplePartCount: 0,
    parts: new Immutable.Map(),
    targetPenalty: 0,
    damage: 'value',
    meta: '',
};

export default withNiceToString(withLookup(withLocalization(new Immutable.Record(fields, 'BodyPart')), {
    get(key) {
        let stats = BODY_PARTS[key];
        if (!stats) {
            return null;
        }
        stats = Object.assign({}, stats);
        const path = `BODY_PARTS.${key}`;
        stats.crippleHealth = toEquation(stats.crippleHealth, `${path}.crippleHealth`, VALID_KEYS, 'number');
        stats.damage = toEquation(fallback(stats.damage, 'value'), `${path}.damage`, VALID_KEYS_WITH_VALUE, 'number');
        stats.parts = convertParts(stats.parts, `${path}.parts`);
        stats.crippleEffect = Effect.from(stats.crippleEffect || {}, `${path}.crippleEffect`);
        stats.multiple = stats.multiple && new Immutable.List(stats.multiple);

        return new this({
            key,
        }).mergeDeep(stats);
    },
    all() {
        return new Immutable.Set(Object.keys(BODY_PARTS)
            .map(key => this.get(key)));
    },
}), fields);
