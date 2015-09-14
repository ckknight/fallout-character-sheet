/* globals describe it */
import { Rx } from '@cycle/core';
const {onNext, onError, onCompleted} = Rx.ReactiveTest;
import assertObservableDOM from '../../../__tests__/assertObservableDOM';
import mockDOM from '../../../__tests__/mockDOM';
import createHotObservable from '../../../__tests__/createHotObservable';
import createExpected from '../../../__tests__/createExpected';
import { expect } from 'chai';

import input from '..';
import render from '../render';
import renderError from '../../errorHandler/render';

describe('input', () => {
    function testInput(type, values, valueKey = 'value', mergeChangeEvents = false) {
        describe('type=' + type, () => {
            const INPUT_VALUES = {
                100: values[0],
                200: values[1],
            };
            const PROPS = {
                100: {},
                150: {
                    title: 'Title!',
                },
            };
            const CHANGE_EVENTS = {
                225: {
                    target: {
                        [valueKey]: values[2],
                    },
                },
            };
            const INPUT_EVENTS = {
                240: {
                    target: {
                        [valueKey]: values[3],
                    },
                },
            };
            const KEYUP_EVENTS = {
                250: {
                    target: {
                        [valueKey]: values[4],
                    },
                },
                270: {
                    target: {
                        [valueKey]: values[5],
                    },
                },
                290: {
                    target: {
                        [valueKey]: values[6],
                    },
                },
            };
            const MERGED_CHANGE_EVENTS = Object.assign({}, CHANGE_EVENTS, INPUT_EVENTS, KEYUP_EVENTS);
            const FOCUS_EVENTS = {
                260: true,
            };
            const BLUR_EVENTS = {
                400: true,
            };
            const OUTPUT_VALUES = {
                100: values[0],
                200: values[1],
                230: values[2],
                245: values[3],
                255: values[4],
                275: values[5],
                295: values[6],
            };
            const key = 'dummy';
            let scheduler;
            let value$;
            let props$;
            let DOM;
            beforeEach(() => {
                scheduler = new Rx.TestScheduler();
                value$ = createHotObservable(scheduler, INPUT_VALUES);
                props$ = createHotObservable(scheduler, PROPS);
                DOM = mockDOM({
                    [`.${key}`]: Object.assign({
                        focus: createHotObservable(scheduler, FOCUS_EVENTS),
                        blur: createHotObservable(scheduler, BLUR_EVENTS),
                    }, !mergeChangeEvents ? {
                        change: createHotObservable(scheduler, CHANGE_EVENTS),
                        input: createHotObservable(scheduler, INPUT_EVENTS),
                        keyup: createHotObservable(scheduler, KEYUP_EVENTS),
                    } : {
                        change: createHotObservable(scheduler, MERGED_CHANGE_EVENTS),
                    }),
                });
            });
            describe('DOM', () => {
                it(type === 'textarea' ? 'renders a <textarea>' : 'renders an <input>', () => {
                    const expected = createExpected({
                        100: render(key, type, OUTPUT_VALUES[100]),
                        150: render(key, type, OUTPUT_VALUES[100], PROPS[150]),
                        200: render(key, type, OUTPUT_VALUES[200], PROPS[150]),
                        230: render(key, type, OUTPUT_VALUES[230], PROPS[150]),
                        245: render(key, type, OUTPUT_VALUES[245], PROPS[150]),
                        255: render(key, type, OUTPUT_VALUES[255], PROPS[150]),
                        400: render(key, type, OUTPUT_VALUES[295], PROPS[150]),
                    });

                    const actual = input(key, type, {
                        DOM,
                        value$,
                        props$,
                        scheduler,
                    });

                    const results = scheduler.startWithTiming(() => actual.DOM, 50, 90, 1000);
                    assertObservableDOM(results.messages, expected);
                });
            });

            it('returns a value$ observable', () => {
                const expected = createExpected(OUTPUT_VALUES);

                const actual = input(key, type, {
                    DOM,
                    value$,
                    props$,
                    scheduler,
                });

                const results = scheduler.startWithTiming(() => actual.value$, 50, 90, 1000);
                expect(results.messages).to.deep.equal(expected);
            });
        });
    }
    ['text', 'textarea'].forEach(type => {
        testInput(type, ['', 'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot']);
    });

    describe('type=number', () => {
        testInput('number', [0, 1, 2.5, 3, 4.5, 5, 6]);
    });

    describe('type=integer', () => {
        testInput('integer', [0, 1, 2, 3, 4, 5, 6]);
    });

    describe('type=checkbox', () => {
        testInput('checkbox', [false, true, false, true, false, true, false], 'checked', true);
    });
});
