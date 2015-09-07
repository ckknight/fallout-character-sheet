import Immutable from 'immutable';
import Range from './Range';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import { BESTIARY, SECONDARY_STATISTICS } from '../constants.json';
import toEquation from './Equation';
import Effect from './Effect';
import Attack from './Attack';

function convertAttacks(attacks = {}, path) {
    return Object.entries(attacks)
        .reduce((acc, [key, value]) => {
            acc[key] = Attack.from(key, value, path);
            return acc;
        }, {});
}

const fields = {
    key: '',
    experienceValue: 0,
    attacks: Immutable.Map(),
};
Object.entries(SECONDARY_STATISTICS).sort().forEach(([key, value]) => {
    fields[key] = 0;
});
export default withNiceToString(withLookup(withLocalization(Immutable.Record(fields, 'Beast')), {
    get(key) {
        let stats = BESTIARY[key];
        if (!stats) {
            return null;
        }
        stats = Object.assign({}, stats);
        stats.attacks = convertAttacks(stats.attacks, `BESTIARY.${key}`);
        return new this({
            key,
        }).mergeDeep(stats);
    },
    all() {
        return Immutable.Set(Object.keys(BESTIARY)
            .map(key => this.get(key)));
    },
}), fields);
