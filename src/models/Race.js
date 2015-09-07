import Immutable from 'immutable';
import Range from './Range';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import { RACES, PRIMARY_STATISTICS, SECONDARY_STATISTICS } from '../constants.json';

const fields = {
    key: '',
    height: new Range(0.1, 20),
    weight: new Range(25, 500),
    levelsPerPerk: 4,
    primaryTotal: 40,
};
Object.entries(PRIMARY_STATISTICS).sort().forEach(([key, value]) => {
    fields[key] = new Range(1, 10);
});
Object.entries(SECONDARY_STATISTICS).sort().forEach(([key, value]) => {
    fields[key] = 0;
});

export default withNiceToString(withLookup(withLocalization(Immutable.Record(fields, 'Race')), {
    get(key) {
        const stats = RACES[key];
        if (!stats) {
            return null;
        }
        return new this({
            key,
        }).mergeDeep(stats);
    },
    getOrDefault(key) {
        return this.get(key) || new this();
    },
    all() {
        return Immutable.Set(Object.keys(RACES)
            .map(key => this.get(key)));
    },
}), fields);