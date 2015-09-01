/** @jsx hJSX */
import { Rx } from '@cycle/core';
import { hJSX } from '@cycle/dom'; // eslint-disable-line no-unused-vars
import { RACE_STATS } from './constants';
import localize from './localization';

function renderInput(key, value, props) {
    const type = typeof value === 'number' ? 'number' : 'text';
    return <label key={key}>
      {localize(key)}: <input type={type} value={value} className={key} {...props} />
    </label>;
}

function renderInput$(value$, key, props$) {
    return value$
        .combineLatest(props$ || Rx.Observable.return({}),
            (value, props) => renderInput(key, value, props));
}


function renderSelect(key, value, options) {
    let initialOption = null;
    if (options.indexOf(value) === -1) {
        initialOption = <option key={''} selected={true}>-</option>;
    }
    return <select key={key} className={key}>
        {initialOption}
        {options.map(option => <option key={option} value={option} selected={value === option}>{localize(option)}</option>)}
    </select>;
}

function renderSelect$(value$, key, options) {
    return value$.map(value => renderSelect(key, value, options));
}

function identity(x) {
    return x;
}

function combineLatest(object, callback = identity) {
    const keys = Object.keys(object);
    const observables = keys.map(key => object[key]);
    return Rx.Observable.combineLatest(...observables, function () {
        const result = {};
        const len = keys.length;
        for (let i = 0; i < len; ++i) {
            result[keys[i]] = arguments[i];
        }
        return callback(result);
    });
}

function getPrimaryStatExtremaByRace(race, attribute) {
    return RACE_STATS[race].primary[attribute];
}

function renderSpecial$(state) {
    const li$s = state.primary.list
        .map(attribute$ => ({key, value, min, max}) => <li key={key} className={key}>
            <span className='name'>{localize(key)}</span>
            <button className='dec' disabled={value <= min}>-</button>
            <span className='value'>{value}</span>
            <button className='inc' disabled={value >= max}>+</button>
        </li>)
        .concat([
            state.primary.count$
                .combineLatest(state.primary.total$, (count, total) => <span>{count}/{total}</span>)
        ]);
    return Rx.Observable.combineLatest(...li$s, (...lis) => <ol className="special">
        {lis}
    </ol>);
}

function render$(state) {
    return combineLatest({
        name: renderInput$(state.name$, 'name'),
        age: renderInput$(state.age$, 'age'),
        sex: renderInput$(state.sex$, 'sex'),
        race: renderSelect$(state.race$, 'race', Object.keys(RACE_STATS)),
        // weight: renderInput$(state.weight$, 'weight'),
        special: renderSpecial$(state),
    // state: state$,
    }, ({name, age, sex, race, weight, special, state}) => <div>
        {name}
        {age}
        {sex}
        {race}
        {weight}
        {special}
    </div>);
}

export default state => render$(state);
