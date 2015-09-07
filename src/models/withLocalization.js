import * as localize from '../localize';

export default Record => class extends Record {
    get name() {
        return localize.name(this.key);
    }

    get plural() {
        return localize.plural(this.key);
    }

    get abbr() {
        return localize.abbr(this.key);
    }

    get description() {
        return localize.description(this.key);
    }
};
