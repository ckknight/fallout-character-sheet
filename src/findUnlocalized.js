function traverse(value, existing, nonExistant) {
    if (value && value.constructor === Object) {
        Object.keys(value)
            .forEach(key => {
                if (!existing[key] && key.charAt(0) !== '$') {
                    nonExistant[key] = true;
                }
                traverse(value[key], existing, nonExistant);
            });
    } else if (Array.isArray(value)) {
        value.forEach(element => traverse(element, existing, nonExistant));
    }
}

export default function (constants) {
    const enUS = constants.LOCALIZATION['en-US'];
    const missing = Object.entries(constants)
        .filter(([key, value]) => key !== 'LOCALIZATION')
        .map(([key, value]) => value)
        .reduce((nonExistant, value) => {
            traverse(value, enUS, nonExistant);
            return nonExistant;
        }, {});
    return Object.keys(missing).sort();
}
