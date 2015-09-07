import Immutable from 'immutable';
import Range from './Range';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import { BESTIARY, SECONDARY_STATISTICS, ATTACK_TYPES } from '../constants.json';
import toEquation from './Equation';
import Effect from './Effect';

const attackFields = {
    key: '',
    skill: 0,
    actionPoints: 0,
    damage: 0,
    range: 1,
    meta: '',
    areaOfEffect: false,
    areaOfEffectSize: 0,
    rounds: 1,
};
Object.entries(ATTACK_TYPES)
    .forEach(([key, info]) => {
        attackFields[key] = 0;
    });
const Attack = withNiceToString(withLocalization(Immutable.Record(attackFields, 'Attack')), attackFields);

const VALID_KEYS = {};

Attack.from = function (key, value, path) {
    value = Object.assign({}, value);
    value.damage = toEquation(value.damage, `${path}.damage`, VALID_KEYS, 'number');
    return new Attack({
        key,
    }).mergeDeep(value);
};

export default Attack;
