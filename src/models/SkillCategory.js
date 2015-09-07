import Immutable from 'immutable';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import Skill from './Skill';
import { SKILLS } from '../constants.json';

const fields = {
    key: '',
    skills: new Immutable.Map(),
};
export default withNiceToString(withLookup(withLocalization(new Immutable.Record(fields, 'SkillCategory')), {
    get(key) {
        const category = SKILLS[key];
        if (!category) {
            return null;
        }
        return new this({
            key,
        }).mergeDeep({
            skills: Object.keys(category)
                .reduce((acc, skillKey) => {
                    return acc.set(skillKey, Skill.get(skillKey));
                }, new Immutable.Map()),
        });
    },
    all() {
        return new Immutable.Set(Object.keys(SKILLS)
            .map(key => this.get(key)));
    },
}), fields);
