/* globals describe it */
import { Rx } from '@cycle/core';
const {onNext} = Rx.ReactiveTest;
import assertObservableDOM from '../../../__tests__/assertObservableDOM';
import mockDOM from '../../../__tests__/mockDOM';
import { expect } from 'chai';

import renderButton from '../../button/render';
import plusMinusButtons from '..';

describe('plusMinusButtons', () => {
    const key = 'dummy';
    const PLUS_TEXTS = {
        100: 'Plus',
        425: '+',
    };
    const MINUS_TEXTS = {
        100: 'Minus',
        450: '-',
    };
    const MIN_VALUES = {
        100: 0,
    };
    const MAX_VALUES = {
        100: 10,
        500: 5,
        550: 10,
    };
    const INPUT_VALUES = {
        100: 0,
        200: 5,
        300: 10,
    };
    const PLUS_CLICKS = {
        150: true,
        275: true,
        325: true,
        375: true,
        400: true,
    };
    const MINUS_CLICKS = {
        125: true,
        175: true,
        250: true,
        350: true,
    };
    const OUTPUT_VALUES = {
        100: 0,
        150: 1,
        175: 0,
        200: 5,
        250: 4,
        275: 5,
        300: 10,
        350: 9,
        375: 10,
        500: 5,
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
        return scheduler.createHotObservable.apply(scheduler, makeExpected(object));
    }

    const plusKey = `${key}-plus`;
    const minusKey = `${key}-minus`;

    it('returns a plusDOM observable', () => {
        const scheduler = new Rx.TestScheduler();
        const DOM = mockDOM({
            [`.${plusKey}`]: {
                click: makeHotObservable(scheduler, PLUS_CLICKS),
            },
            [`.${minusKey}`]: {
                click: makeHotObservable(scheduler, MINUS_CLICKS),
            },
        });
        const min$ = makeHotObservable(scheduler, MIN_VALUES);
        const max$ = makeHotObservable(scheduler, MAX_VALUES);
        const plus$ = makeHotObservable(scheduler, PLUS_TEXTS);
        const minus$ = makeHotObservable(scheduler, MINUS_TEXTS);
        const value$ = makeHotObservable(scheduler, INPUT_VALUES);
        const expected = [
            onNext(100, renderButton(plusKey, {}, PLUS_TEXTS[100])),
            onNext(300, renderButton(plusKey, {
                disabled: true,
            }, PLUS_TEXTS[100])),
            onNext(350, renderButton(plusKey, {}, PLUS_TEXTS[100])),
            onNext(375, renderButton(plusKey, {
                disabled: true,
            }, PLUS_TEXTS[100])),
            onNext(425, renderButton(plusKey, {
                disabled: true,
            }, PLUS_TEXTS[425])),
            onNext(550, renderButton(plusKey, {}, PLUS_TEXTS[425])),
        ];

        const actual = plusMinusButtons(key, {
            DOM,
            value$,
            min$,
            max$,
            plus$,
            minus$,
        });

        const results = scheduler.startWithTiming(() => actual.plusDOM, 50, 90, 1000);
        assertObservableDOM(results.messages, expected);
    });

    it('returns a minusDOM observable', () => {
        const scheduler = new Rx.TestScheduler();
        const DOM = mockDOM({
            [`.${plusKey}`]: {
                click: makeHotObservable(scheduler, PLUS_CLICKS),
            },
            [`.${minusKey}`]: {
                click: makeHotObservable(scheduler, MINUS_CLICKS),
            },
        });
        const min$ = makeHotObservable(scheduler, MIN_VALUES);
        const max$ = makeHotObservable(scheduler, MAX_VALUES);
        const plus$ = makeHotObservable(scheduler, PLUS_TEXTS);
        const minus$ = makeHotObservable(scheduler, MINUS_TEXTS);
        const value$ = makeHotObservable(scheduler, INPUT_VALUES);
        const expected = [
            onNext(100, renderButton(minusKey, {
                disabled: true,
            }, MINUS_TEXTS[100])),
            onNext(150, renderButton(minusKey, {}, MINUS_TEXTS[100])),
            onNext(175, renderButton(minusKey, {
                disabled: true,
            }, MINUS_TEXTS[100])),
            onNext(200, renderButton(minusKey, {}, MINUS_TEXTS[100])),
            onNext(450, renderButton(minusKey, {}, MINUS_TEXTS[450])),
        ];

        const actual = plusMinusButtons(key, {
            DOM,
            value$,
            min$,
            max$,
            plus$,
            minus$,
        });

        const results = scheduler.startWithTiming(() => actual.minusDOM, 50, 90, 1000);
        assertObservableDOM(results.messages, expected);
    });

    it('returns a value$ observable', () => {
        const scheduler = new Rx.TestScheduler();
        const DOM = mockDOM({
            [`.${plusKey}`]: {
                click: makeHotObservable(scheduler, PLUS_CLICKS),
            },
            [`.${minusKey}`]: {
                click: makeHotObservable(scheduler, MINUS_CLICKS),
            },
        });
        const min$ = makeHotObservable(scheduler, MIN_VALUES);
        const max$ = makeHotObservable(scheduler, MAX_VALUES);
        const plus$ = makeHotObservable(scheduler, PLUS_TEXTS);
        const minus$ = makeHotObservable(scheduler, MINUS_TEXTS);
        const value$ = makeHotObservable(scheduler, INPUT_VALUES);
        const expected = makeExpected(OUTPUT_VALUES);

        const actual = plusMinusButtons(key, {
            DOM,
            value$,
            min$,
            max$,
            plus$,
            minus$,
        });

        const results = scheduler.startWithTiming(() => actual.value$, 50, 90, 1000);
        expect(results.messages).to.deep.equal(expected);
    });
});
