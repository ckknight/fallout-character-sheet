import Immutable from 'immutable';

export const RACE_STATS = {
    human: {
        weight: [110, 280],
        height: [1.5, 2.5],
        levelsPerPerk: 3,
        hp: 0,
        primary: {
            total: 40,
            strength: [1, 10],
            perception: [1, 10],
            endurance: [1, 10],
            charisma: [1, 10],
            intelligence: [1, 10],
            agility: [1, 10],
            luck: [1, 10],
        },
        secondary: {
            resistElectricity: 10
        }
    },
    ghoul: {
        weight: [80, 160],
        height: [1.5, 2.5],
        levelsPerPerk: 4,
        hp: -5,
        primary: {
            total: 42,
            strength: [1, 6],
            perception: [4, 14],
            endurance: [1, 10],
            charisma: [1, 9],
            intelligence: [2, 13],
            agility: [1, 8],
            luck: [5, 10],
        },
        secondary: {
            resistRadiation: 40,
            resistPoison: 10,
        },
    },
    alphaMutant: {
        weight: [300, 400],
        height: [2.8, 3],
        levelsPerPerk: 4,
        primary: {
            total: 40,
            strength: [4, 13],
            perception: [1, 10],
            endurance: [3, 12],
            charisma: [1, 8],
            intelligence: [1, 11],
            agility: [1, 8],
            luck: [1, 10],
        },
        secondary: {
            resistRadiation: 10,
            resistPoison: 20,
            resistGas: [0, 35],
        },
    },
    betaMutant: {
        weight: [300, 400],
        height: [2.8, 3],
        levelsPerPerk: 4,
        primary: {
            total: 40,
            strength: [5, 13],
            perception: [1, 10],
            endurance: [4, 12],
            charisma: [1, 8],
            intelligence: [1, 8],
            agility: [1, 8],
            luck: [1, 10],
        },
        secondary: {
            resistRadiation: 10,
            resistPoison: 20,
            resistGas: [0, 35],
        },
    },
};

export const PRIMARY_ATTRIBUTES = [
    'strength',
    'perception',
    'endurance',
    'charisma',
    'intelligence',
    'agility',
    'luck'
];
