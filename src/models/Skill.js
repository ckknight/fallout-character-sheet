import Immutable from 'immutable';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import toEquation from './Equation';
import { SKILLS, PRIMARY_STATISTICS } from '../constants.json';

const fields = {
    key: '',
    value: 0,
    percent: false,
};

const VALID_KEYS = [].concat(
    Object.keys(SKILLS),
    Object.keys(PRIMARY_STATISTICS)
)
    .reduce((acc, key) => {
        acc[key] = 'number';
        return acc;
    }, {});

export default withNiceToString(withLookup(withLocalization(new Immutable.Record(fields, 'Skill')), {
    get(key) {
        return [].concat(...Object.values(SKILLS)
            .map(category => Object.entries(category)))
            .filter(([skillName]) => skillName === key)
            .map(pair => pair[1])
            .map(skill => Object.assign({}, skill))
            .map(skill => {
                skill.value = toEquation(skill.value, `SKILLS.${key}.value`, VALID_KEYS, 'number');
                return new this({
                    key,
                }).mergeDeep(skill);
            })[0] || null;
    },
    all() {
        return new Immutable.Set([].concat(...Object.values(SKILLS)
            .map(category => Object.keys(category)))
            .map(key => this.get(key)));
    },
}), fields);
