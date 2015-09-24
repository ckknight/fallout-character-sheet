import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import * as localize from '../../localize';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import future from '../../future';

function makeInput(key, type, defaultValue, DOM, value$, props$) {
    return input(key, type, {
        DOM,
        value$: value$.map(value => value[key] || defaultValue).startWith(defaultValue),
        props$: (props$ || Rx.Observable.return({}))
            .map(props => ({
                id: key,
                className: 'pure-u-23-24',
                ...props,
            })),
    });
}

function makeForm(selector, object, calculations) {
    Object.entries(object)
        .map(([key, value]) => ({
            key,
            value$: value.value$,
        }))
        .filter(({value$}) => value$)
        .forEach(({key, value$}) => calculations.set(key, value$));
    return {
        DOM: Rx.Observable.combineLatest(Object.keys(object)
            .map(key => object[key].DOM
                    .startWith(loadingIndicator(key))
                    .map(vTree => h(`div.pure-u-1${key === 'appearance' ? '' : '.pure-u-sm-1-2'}.pure-u-md-1-3`, {
                        key,
                    }, [
                        h(`label`, {
                            htmlFor: key,
                        }, [localize.name(key)]),
                        vTree,
                    ]))
                    .catch(errorHandler(key))))
            .startWith(loadingIndicator('cosmetic'))
            .map(vTrees => h(selector, [
                h('fieldset', [
                    h('.pure-g', vTrees),
                ]),
            ]))
            .catch(errorHandler('cosmetic')),
        value$: combineLatestObject(Object.keys(object)
            .reduce((acc, key) => {
                const value$ = object[key].value$;
                if (value$) {
                    acc[key] = value$;
                }
                return acc;
            }, {}))
            .shareReplay(1),
    };
}

function cosmetic({DOM, value$, raceDOM, calculations}) {
    return makeForm('form.cosmetic.pure-form.pure-form-stacked', {
        name: makeInput('name', 'text', '', DOM, value$),
        age: makeInput('age', 'integer', 20, DOM, value$, Rx.Observable.return({
            min: 0,
            placeholder: 'Age',
        })),
        sex: makeInput('sex', 'text', '', DOM, value$),
        race: {
            DOM: raceDOM,
        },
        weight: makeInput('weight', 'integer', 150, DOM, value$, calculations.get('race')
            .pluck('weight')
            .map(({min, max}) => ({
                    min,
                    max,
                    placeholder: 'Weight',
            }))),
        height: makeInput('height', 'number', 1.8, DOM, value$, calculations.get('race')
            .pluck('height')
            .map(({min, max}) => ({
                    min,
                    max,
                    step: 0.01,
                    placeholder: 'Height',
            }))),
        eyes: makeInput('eyes', 'text', '', DOM, value$),
        hair: makeInput('hair', 'text', '', DOM, value$),
        appearance: makeInput('appearance', 'textarea', '', DOM, value$),
    }, calculations);
}

export default future.wrap(cosmetic, 'DOM', 'value$');
