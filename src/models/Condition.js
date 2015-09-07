import Immutable from 'immutable';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import { CONDITIONS } from '../constants.json';

const fields = {
    key: '',
};
export default withLookup(withNiceToString(withLocalization(new Immutable.Record(fields, 'Condition')), fields), {
    get(key) {
        const stats = CONDITIONS[key];
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
        return new Immutable.Set(Object.keys(CONDITIONS)
            .map(key => this.get(key)));
    },
});
