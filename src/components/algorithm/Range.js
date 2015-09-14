import Immutable from 'immutable';

const RangeRecord = new Immutable.Record({
    min: 0,
    max: 0,
});
export default class Range extends RangeRecord {
    add(other) {
        if (other instanceof Range) {
            return new Range({
                min: this.min + other.min,
                max: this.max + other.max,
            });
        }
    }
}
