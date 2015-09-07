import Immutable from 'immutable';

export default function withNiceToString(Class, fields = {}) {
    class SubClass extends Class {
        toString() {
            return (this.name || this._name || 'unnamed') + ' {' + Object.entries(fields)
                .filter(([key]) => key !== 'key')
                .map(([key, value]) => {
                    if (value === this[key] || Immutable.is(value, this[key])) {
                        return '';
                    }
                    return ' ' + key + ': ' + this[key];
                })
                .filter(x => x)
                .join(',') + ' }';
        }
    }
    return SubClass;
}
