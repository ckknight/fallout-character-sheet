export default class Character extends Immutable.Record( {
    name: '',
    age: 0,
    sex: '',
    race: '',
    weight: 0,
    eyes: '',
    hair: '',
    appearance: '',
    xp: 0
  }) {
  get level() {
    return Math.floor((Math.sqrt(5) * Math.sqrt(this.xp + 125) - 25) / 50);
  }
}
