import Immutable from 'immutable';
import Range from './Range';
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
const SubPart = withNiceToString(withLocalization(Immutable.Record(partFields, 'BodySubPart')), partFields);

function convertParts(object, path) {
    return Object.entries(object)
        .reduce((acc, [key, value]) => {
            value = Object.assign({}, value);
            value.damage = toEquation(fallback(value.damage, 'value'), `${path}.damage`, VALID_KEYS_WITH_VALUE, 'number');
            value.crippleHealth = toEquation(value.crippleHealth, `${path}.crippleHealth`, VALID_KEYS, 'number');
            value.crippleEffect = Effect.from(value.crippleEffect || {}, `${path}.crippleEffect`);
            acc[key] = new SubPart({
                key,
            }).mergeDeep(value);
            return acc;
        }, {});
}

const fields = {
    key: '',
    multiple: null,
    crippleEffect: new Effect(),
    crippleHealth: 0,
    cripplePartCount: 0,
    meta: '',
    parts: Immutable.Map(),
    targetPenalty: 0,
    damage: 'value',
};

function fallback(value, otherwise) {
    if (value === undefined) {
        return otherwise;
    } else {
        return value;
    }
}

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

export default withNiceToString(withLookup(withLocalization(Immutable.Record(fields, 'BodyPart')), {
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
        return Immutable.Set(Object.keys(BODY_PARTS)
            .map(key => this.get(key)));
    },
}), fields);
