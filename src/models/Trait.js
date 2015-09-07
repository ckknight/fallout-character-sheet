import Immutable from 'immutable';
import withLocalization from './withLocalization';
import withLookup from './withLookup';
import withNiceToString from './withNiceToString';
import toEquation from './Equation';
import { TRAITS, RACES } from '../constants.json';
import Effect from './Effect';

const fields = {
    key: '',
    meta: '',
    requirements: true,
    effect: new Effect(),
};

const VALID_KEYS = [].concat()
    .reduce((acc, key) => {
        acc[key] = 'number';
        return acc;
    }, ['race'].concat(Object.keys(RACES))
        .reduce((acc, key) => {
            acc[key] = 'string';
            return acc;
        }, {}));

export default withNiceToString(withLookup(withLocalization(Immutable.Record(fields, 'Trait')), {
    get(key) {
        let trait = TRAITS[key];
        if (!trait) {
            return null;
        }
        trait = Object.assign({}, trait);
        const path = `TRAITS.${key}`;
        const requirements = toEquation(trait.requirements, `${path}.requirements`, VALID_KEYS, 'boolean');
        delete trait.requirements;
        const meta = trait.meta || fields.meta;
        delete trait.meta;
        const effect = Effect.from(trait, path);
        return new this({
            key,
        }).mergeDeep({
            requirements,
            effect,
            meta,
        });
    },
    all() {
        return Immutable.Set(Object.keys(TRAITS)
            .map(key => this.get(key)));
    },
}), fields);
