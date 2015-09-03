/** @jsx hJSX */
import { Rx } from '@cycle/core';
import { hJSX } from '@cycle/dom'; // eslint-disable-line no-unused-vars
import { RACE_STATS } from './constants';
import localize from './localization';

function renderInput(key, value, props) {
    const type = typeof value === 'number' ? 'number' : 'text';
    return <label key={ key }>
             { localize(key); }:
             <input type={ type } value={ value } className={ key } {...props} />
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
        initialOption = <option key={ '' } selected={ true }>-</option>;
    }
    return <label>
             { localize(key); }:
             <select key={ key } className={ key }>
               { initialOption }
               { options.map(option => <option key={ option } value={ option } selected={ value === option }>{ localize(option) }</option>) }
             </select>
           </label>;
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
        .map(attribute$ => attribute$.map(({key, base, effect, min, max}) => <li key={ key } className={ key }>
                                                                               <span className='name'>{ localize(key); }</span>
                                                                               <span className='effect'>{ effect }</span>
                                                                               <input className='base' type='number' min={ min } max={ max } value={ base } />
                                                                               <span className='min'>{ min }</span> /
                                                                               <span className='max'>{ max }</span>
                                                                             </li>))
        .concat([
            state.primary.count$
                .combineLatest(state.primary.total$, (count, total) => <span>{ count }/{ total }</span>),
        ]);
    return Rx.Observable.combineLatest(...li$s, (...lis) => <ol className="special">
                                                              { lis }
                                                            </ol>);
}

function renderCosmetic(state) {
    const {cosmetic} = state;
    return combineLatest({
        name: renderInput$(cosmetic.name$, 'name'),
        age: renderInput$(cosmetic.age$, 'age'),
        sex: renderInput$(cosmetic.sex$, 'sex'),
        race: renderSelect$(state.race$, 'race', Object.keys(RACE_STATS)),
        weight: renderInput$(cosmetic.weight$, 'weight'),
        eyes: renderInput$(cosmetic.eyes$, 'eyes'),
        hair: renderInput$(cosmetic.hair$, 'hair'),
        appearance: renderInput$(cosmetic.appearance$, 'appearance'),
    }, ({name, age, sex, race, weight, eyes, hair, appearance}) => <div>
                                                                     { name }
                                                                     { age }
                                                                     { sex }
                                                                     { race }
                                                                     { weight }
                                                                     { eyes }
                                                                     { hair }
                                                                     { appearance }
                                                                   </div>);
}

function render$(state) {
    return combineLatest({
        cosmetic: renderCosmetic(state),
        special: renderSpecial$(state),
    // state: state$,
    }, ({cosmetic, special}) => <div>
                                  { cosmetic }
                                  { special }
                                </div>);
}

export default state => render$(state);
