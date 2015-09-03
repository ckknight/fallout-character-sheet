import Immutable from 'immutable';

const CharacterRecord = new Immutable.Record({
    name: '',
    age: 0,
    sex: '',
    race: '',
    weight: 0,
    eyes: '',
    hair: '',
    appearance: '',
    xp: 0,

    strength: 1,
    perception: 1,
    endurance: 1,
    charisma: 1,
    intelligence: 1,
    agility: 1,
    luck: 1,
});

export default class Character extends CharacterRecord {
    get level() {
        return Math.floor((Math.sqrt(5) * Math.sqrt(this.xp + 125) - 25) / 50);
    }
}
