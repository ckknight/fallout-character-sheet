import Immutable from 'immutable';

const RangeRecord = new Immutable.Record({
    min: 0,
    max: 0,
});
export default class Range extends RangeRecord {
    constructor(min, max) {
        super({
            min,
            max,
        });
    }

    toString() {
        return `${this.min}..${this.max}`;
    }
}
