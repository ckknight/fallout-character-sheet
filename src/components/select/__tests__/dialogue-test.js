/* globals describe it */
import { Rx } from '@cycle/core';
const {onNext, onError, onCompleted} = Rx.ReactiveTest;
import assertObservableDOM from '../../../__tests__/assertObservableDOM';
import mockDOM from '../../../__tests__/mockDOM';
import { expect } from 'chai';

import * as FIXTURES from './fixtures';

import select from '..';
import render from '../render';
import renderError from '../../errorHandler/render';

function asArraylike(array) {
    const arraylike = {};
    arraylike.length = array.length;
    for (let i = 0; i < array.length; ++i) {
        arraylike[i] = array[i];
    }
    return arraylike;
}

describe('select', () => {
    const options = FIXTURES.options;
    const firstOptions = options.slice(0, 2);
    const OPTIONS = {
        100: asArraylike(options),
        400: asArraylike(firstOptions),
        500: asArraylike(options),
    };
    const PROPS = {
        100: {},
        275: {
            title: 'Title!',
        },
    };
    const INPUT_VALUES = {
        100: options[0].value,
        150: options[1].value,
        200: options[2].value,
        220: options[2].value,
        250: options[3].value,
        300: null,
        450: options[2].value,
    };
    const CHANGE_EVENTS = {
        125: {
            target: {
                value: options[2].value,
            },
        },
        350: {
            target: {
                value: options[1].value,
            },
        },
    };
    const OUTPUT_VALUES = {
        100: options[0].value,
        125: options[2].value,
        150: options[1].value,
        200: options[2].value,
        250: options[3].value,
        300: null,
        350: options[1].value,
        450: null,
        500: options[2].value,
    };
    function identity(x) {
        return x;
    }
    function makeExpected(object, callback = identity) {
        return Object.keys(object)
            .map(x => +x)
            .sort()
            .map(time => onNext(time, callback(object[time])));
    }
    function makeHotObservable(scheduler, object) {
        return scheduler.createHotObservable.apply(scheduler, makeExpected(object, identity));
    }

    describe('DOM', () => {
        it('renders a <select>', () => {
            const scheduler = new Rx.TestScheduler();
            const key = 'dummy';
            const value$ = makeHotObservable(scheduler, INPUT_VALUES);
            const props$ = makeHotObservable(scheduler, PROPS);
            const DOM = mockDOM({
                [`.${key}`]: {
                    change: makeHotObservable(scheduler, CHANGE_EVENTS),
                },
            });
            const options$ = makeHotObservable(scheduler, OPTIONS);
            const titledProps = {
                title: 'Title!',
            };
            const expected = makeExpected({
                100: render(key, options, OUTPUT_VALUES[100]),
                125: render(key, options, OUTPUT_VALUES[125]),
                150: render(key, options, OUTPUT_VALUES[150]),
                200: render(key, options, OUTPUT_VALUES[200]),
                250: render(key, options, OUTPUT_VALUES[250]),
                275: render(key, options, OUTPUT_VALUES[250], titledProps),
                300: render(key, options, OUTPUT_VALUES[300], titledProps),
                350: render(key, options, OUTPUT_VALUES[350], titledProps),
                400: render(key, firstOptions, OUTPUT_VALUES[350], titledProps),
                450: render(key, firstOptions, OUTPUT_VALUES[450], titledProps),
                500: render(key, options, OUTPUT_VALUES[500], titledProps),
            }, identity);

            const actual = select(key, {
                DOM,
                value$,
                options$,
                props$,
            });

            const results = scheduler.startWithTiming(() => actual.DOM, 50, 90, 1000);
            assertObservableDOM(results.messages, expected);
        });

        it('handles errors with value$', () => {
            const scheduler = new Rx.TestScheduler();
            const key = 'dummy';
            const value$ = scheduler.createHotObservable(
                onError(100, 'Whoops')
            );
            const props$ = Rx.Observable.never();
            const DOM = mockDOM({});
            const options$ = Rx.Observable.never();
            const expected = [
                onNext(100, renderError(key, 'Whoops')),
                onCompleted(100),
            ];

            const actual = select(key, {
                DOM,
                value$,
                options$,
                props$,
            });

            const results = scheduler.startWithTiming(() => actual.DOM, 50, 90, 1000);
            assertObservableDOM(results.messages, expected);
        });

        it('handles errors with options$', () => {
            const scheduler = new Rx.TestScheduler();
            const key = 'dummy';
            const value$ = Rx.Observable.never();
            const options$ = scheduler.createHotObservable(
                onError(100, 'Whoops')
            );
            const props$ = Rx.Observable.never();
            const DOM = mockDOM({});
            const expected = [
                onNext(100, renderError(key, 'Whoops')),
                onCompleted(100),
            ];

            const actual = select(key, {
                DOM,
                value$,
                options$,
                props$,
            });

            const results = scheduler.startWithTiming(() => actual.DOM, 50, 90, 1000);
            assertObservableDOM(results.messages, expected);
        });

        it('handles errors with props$', () => {
            const scheduler = new Rx.TestScheduler();
            const key = 'dummy';
            const value$ = Rx.Observable.never();
            const options$ = Rx.Observable.never();
            const props$ = scheduler.createHotObservable(
                onError(100, 'Whoops')
            );
            const DOM = mockDOM({});
            const expected = [
                onNext(100, renderError(key, 'Whoops')),
                onCompleted(100),
            ];

            const actual = select(key, {
                DOM,
                value$,
                options$,
                props$,
            });

            const results = scheduler.startWithTiming(() => actual.DOM, 50, 90, 1000);
            assertObservableDOM(results.messages, expected);
        });
    });

    it('returns a value$ observable', () => {
        const scheduler = new Rx.TestScheduler();
        const key = 'dummy';
        const value$ = makeHotObservable(scheduler, INPUT_VALUES);
        const props$ = makeHotObservable(scheduler, PROPS);
        const DOM = mockDOM({
            [`.${key}`]: {
                change: makeHotObservable(scheduler, CHANGE_EVENTS),
            },
        });
        const options$ = makeHotObservable(scheduler, OPTIONS);
        const expected = makeExpected(OUTPUT_VALUES, identity);

        const actual = select(key, {
            DOM,
            value$,
            options$,
        });

        const results = scheduler.startWithTiming(() => actual.value$, 50, 90, 1000);
        expect(results.messages).to.deep.equal(expected);
    });
});
