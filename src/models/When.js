import Immutable from 'immutable';

const WhenRecord = new Immutable.Record({
    conditions: new Immutable.Map(),
    otherwise: 0,
});
export default class When extends WhenRecord {
    toString() {
        return 'when(' + this.conditions
            .entrySeq()
            .map(([key, value]) => {
                return key + ' => ' + value;
            })
            .concat([
                'otherwise => ' + this.otherwise,
            ])
            .join('; ')
        + ')';
    }
}
