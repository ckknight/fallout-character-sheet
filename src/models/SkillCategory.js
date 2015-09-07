import Immutable from 'immutable';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import Skill from './Skill';
import { SKILLS } from '../constants.json';

const fields = {
    key: '',
    skills: Immutable.Map(),
};
export default withNiceToString(withLookup(withLocalization(Immutable.Record(fields, 'SkillCategory')), {
    get(key) {
        let category = SKILLS[key];
        if (!category) {
            return null;
        }
        return new this({
            key,
        }).mergeDeep({
            skills: Object.keys(category)
                .reduce((acc, key) => {
                    acc[key] = Skill.get(key);
                    return acc;
                }, {}),
        });
    },
    all() {
        return Immutable.Set(Object.keys(SKILLS)
            .map(key => this.get(key)));
    },
}), fields);
