import Immutable from 'immutable';
import Range from './Range';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import { PERKS, PRIMARY_STATISTICS, SECONDARY_STATISTICS, SKILLS, RACES, MISCELLANEOUS } from '../constants.json';
import Effect from './Effect';
// import Requirements from './Requirements';
import toEquation from './Equation';

Error.stackTraceLimit = 100;

const fields = {
    key: '',
    effect: new Effect(),
    ranks: 1,
    requirements: true,
    meta: '',
};

const VALID_KEYS = [].concat(
    Object.keys(PRIMARY_STATISTICS),
    Object.keys(SECONDARY_STATISTICS),
    Object.keys(SKILLS),
    Object.keys(RACES),
    Object.keys(MISCELLANEOUS),
    ...Object.values(SKILLS)
        .map(skillCategory => Object.keys(skillCategory))
)
    .reduce((acc, key) => {
        acc[key] = 'number';
        return acc;
    }, {
        race: 'string',
    });

export default withNiceToString(withLookup(withLocalization(Immutable.Record(fields, 'Perk')), {
    get(key) {
        let stats = PERKS[key];
        if (!stats) {
            return null;
        }
        stats = Object.assign({}, stats);
        const path = `PERKS.${key}`;
        stats.effect = Effect.from(stats.effect, `${path}.effect`);
        stats.requirements = toEquation(stats.requirements, `${path}.requirements`, VALID_KEYS, 'boolean'); // Requirements.from(stats.requirements, `${path}.requirements`);
        const perk = new this({
            key,
        });
        try {
            return perk.mergeDeep(stats);
        } catch (e) {
            e.message += ` (in ${path})`;
            throw e;
        }
    },
    all() {
        return Immutable.Set(Object.keys(PERKS)
            .map(key => this.get(key)));
    },
}), fields);
