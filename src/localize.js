import { LOCALIZATION } from './constants';

const LOCALE = LOCALIZATION['en-US'];

function assertString(key) {
    if (typeof key !== 'string') {
        throw new TypeError(`Expected ${key} to be a string`);
    }
}

function getTranslationGroup(key) {
    if (!key) {
        return '';
    }
    assertString(key);
    const value = LOCALE[key];
    if (!value) {
        throw new Error(`Unknown localization: "${key}"`);
    }
    return value;
}

export function name(key) {
    const translation = getTranslationGroup(key);
    if (typeof translation === 'string') {
        return translation;
    }
    return translation.name;
}

export function plural(key) {
    const translation = getTranslationGroup(key);
    if (typeof translation === 'string') {
        return translation;
    }
    return translation.plural || translation.name;
}

export function abbr(key) {
    const translation = getTranslationGroup(key);
    if (typeof translation === 'string') {
        return translation;
    }
    return translation.abbr || translation.name;
}

export function description(key) {
    const translation = getTranslationGroup(key);
    if (typeof translation === 'string') {
        return '';
    }
    return translation.description || '';
}
