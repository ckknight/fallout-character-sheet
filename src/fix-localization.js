function traverseObject(key, object, localizations) {
    if (object.name) {
        Object.entries(object.name).forEach(([locale, value]) => {
            const localeTranslations = localizations[locale] || (localizations[locale] = {});
            localeTranslations[key] = value;
        });
        delete object.name;
    }
    return Object.entries(object).reduce((acc, [key, value]) => {
        acc[key] = traverse(key, value, localizations);
        return acc;
    }, {});
}

function traverseArray(array, localizations) {
    return array.map((value, index) => traverse(index, value, localizations));
}

function traverse(key, value, localizations) {
    if (value && value.constructor === Object) {
        return traverseObject(key, value, localizations);
    } else if (Array.isArray(value)) {
        return traverseArray(value, localizations);
    } else {
        return value;
    }
}

export default function (constants) {
    const localizations = {};
    const result = traverse("::root", constants, localizations);
    return {
        LOCALIZATIONS: localizations,
        ...result
    };
};
