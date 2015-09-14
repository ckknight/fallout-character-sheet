import getBooleanClassString from './number/getClassString';
import getNumberClassString from './number/getClassString';

export default function getClassString(value) {
    if (typeof value === 'number') {
        return getNumberClassString(value);
    }
    if (typeof value === 'boolean') {
        return getBooleanClassString(value);
    }
    return '';
}
