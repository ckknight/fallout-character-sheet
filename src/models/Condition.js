import Immutable from 'immutable';
import Range from './Range';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import { CONDITIONS } from '../constants.json';
import toEquation from './Equation';
import Effect from './Effect';

const fields = {
    key: '',
};
export default withLookup(withNiceToString(withLocalization(Immutable.Record(fields, 'Condition')), fields), {
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
        return Immutable.Set(Object.keys(CONDITIONS)
            .map(key => this.get(key)));
    },
});
