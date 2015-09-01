const LOCALIZATIONS = {
    name: 'Name',
    age: 'Age',
    race: 'Race',
    sex: 'Sex',
    weight: 'Weight',
    height: 'Height',

    human: 'Human',
    ghoul: 'Ghoul',
    alphaMutant: 'Mutant (Alpha)',
    betaMutant: 'Mutant (Beta)',

    strength: 'STR',
    perception: 'PER',
    endurance: 'END',
    charisma: 'CHA',
    intelligence: 'INT',
    agility: 'AGI',
    luck: 'LCK',
};

function localize(key) {
    if (typeof key !== 'string') {
        throw new TypeError(`${key} must be a string`);
    }
    const result = LOCALIZATIONS[key];
    if (!result) {
        throw new Error(`Unknown localization: ${key}`);
    }
    return result;
}

export default localize;
