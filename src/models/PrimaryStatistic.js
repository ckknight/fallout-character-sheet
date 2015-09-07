import Immutable from 'immutable';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import { PRIMARY_STATISTICS } from '../constants.json';

export default withNiceToString(withLookup(withLocalization(new Immutable.Record({
    key: '',
    order: 0,
}, 'PrimaryStatistic')), {
    get(key) {
        const stats = PRIMARY_STATISTICS[key];
        if (!stats) {
            return null;
        }
        return new this({
            key,
        }).mergeDeep(stats);
    },
    all() {
        return new Immutable.List(Object.keys(PRIMARY_STATISTICS)
            .map(key => this.get(key))
            .sort((x, y) => x.order - y.order));
    },
}));
