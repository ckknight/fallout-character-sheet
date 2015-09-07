import Immutable from 'immutable';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import toEquation from './Equation';
import { PRIMARY_STATISTICS, SECONDARY_STATISTICS, MISCELLANEOUS } from '../constants.json';

const fields = {
    key: '',
    value: 0,
    percent: false,
};

const VALID_KEYS = [].concat(
    Object.keys(PRIMARY_STATISTICS),
    Object.keys(SECONDARY_STATISTICS),
    Object.keys(MISCELLANEOUS)
)
    .reduce((acc, key) => {
        acc[key] = 'number';
        return acc;
    }, {});

export default withNiceToString(withLookup(withLocalization(new Immutable.Record(fields, 'SecondaryStatistic')), {
    get(key) {
        let stats = SECONDARY_STATISTICS[key];
        if (!stats) {
            return null;
        }
        stats = Object.assign({}, stats);
        stats.value = toEquation(stats.value, `SECONDARY_STATISTICS.${key}`, VALID_KEYS, 'number');
        return new this({
            key,
        }).mergeDeep(stats);
    },
    all() {
        return new Immutable.Set(Object.keys(SECONDARY_STATISTICS)
            .map(key => this.get(key)));
    },
}), fields);
